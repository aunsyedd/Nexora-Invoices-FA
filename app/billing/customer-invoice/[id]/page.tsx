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
        .from("invoices")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !invoice) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data: lines } = await supabase
        .from("invoice_line_items")
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
      <NewInvoicePage mode="create" initialInvoice={null} initialLineItems={[]} />
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-1 pt-14 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Loading invoice...</p>
        </main>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-1 pt-14 flex flex-col items-center justify-center gap-2">
          <p className="text-gray-700 font-medium">Invoice not found</p>
          <Link href="/billing/customer-invoice" className="text-blue-600 text-sm hover:underline">
            Back to invoice list
          </Link>
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
