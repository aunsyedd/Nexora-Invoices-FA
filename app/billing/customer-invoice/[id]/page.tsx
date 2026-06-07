"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "../../../components/Navbar";
import Link from "next/link";
import NewInvoicePage from "../new/page";

export default function InvoicePage() {
  const params = useParams();
  const id = params.id as string;

  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [notFound, setNotFound] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [lineItems, setLineItems] = useState<any[]>([]);

  useEffect(() => {
    if (isNew || !id) return;

    const fetchInvoice = async () => {
      const { data: invoice, error } = await supabase
        .from("invoices2")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !invoice) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data: lines } = await supabase
        .from("invoice_line_items2")
        .select("*")
        .eq("invoice_id", id);

      setInvoiceData(invoice);
      setLineItems(lines || []);
      setLoading(false);
    };

    fetchInvoice();
  }, [id, isNew]);

  if (isNew) {
    return (
      <NewInvoicePage
        mode="create"
        initialInvoice={null}
        initialLineItems={[]}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-1 pt-14 sm:pt-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm sm:text-base text-center">
              Loading invoice...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-1 pt-14 sm:pt-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-3 text-center">
          <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8 max-w-md w-full flex flex-col items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 sm:w-12 sm:h-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-800 font-semibold text-base sm:text-lg">
              Invoice not found
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              The invoice you are looking for does not exist or may have been
              removed.
            </p>
            <Link
              href="/billing/customer-invoice"
              className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to invoice list
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <NewInvoicePage
      mode="edit"
      initialInvoice={invoiceData}
      initialLineItems={lineItems}
    />
  );
}