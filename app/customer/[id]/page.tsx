"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import CustomerForm from "../new/page";

export default function EditCustomerPage() {
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [customerData, setCustomerData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      const { data, error } = await supabase
        .from("customers2")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setCustomerData(data);
      setLoading(false);
    };

    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-1 pt-14 flex items-center justify-center px-4 w-full">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm font-medium">Loading customer...</p>
          </div>
        </main>
      </div>
    );
  }

  if (notFound || !customerData) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-1 pt-14 flex flex-col items-center justify-center gap-2 px-4 w-full text-center">
          <p className="text-gray-700 font-medium">Customer not found</p>
          <Link href="/customer" className="text-blue-600 text-sm hover:underline">
            Back to customer list
          </Link>
        </main>
      </div>
    );
  }

  return (
    <CustomerForm
      mode="edit"
      customerId={id}
      initialCustomer={customerData}
    />
  );
}