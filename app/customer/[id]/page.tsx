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
      <div className="flex min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-1 pt-14 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Loading customer...</p>
        </main>
      </div>
    );
  }

  if (notFound || !customerData) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-1 pt-14 flex flex-col items-center justify-center gap-2">
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
