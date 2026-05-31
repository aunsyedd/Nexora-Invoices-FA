"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

interface Card {
  title: string;
  count: number;
  color: string;
  link: string;
}

export default function Dashboard() {
  const [cards, setCards] = useState<Card[]>([
    { title: "Customers", count: 0, color: "bg-blue-600", link: "/customer" },
    { title: "Invoices", count: 0, color: "bg-indigo-600", link: "/billing/customer-invoice" },
  ]);
  const router = useRouter();

  useEffect(() => {
    const fetchCounts = async () => {
      const [{ count: customerCount }, { count: invoiceCount }] = await Promise.all([
        supabase.from("customers").select("*", { count: "exact", head: true }),
        supabase.from("invoices").select("*", { count: "exact", head: true }),
      ]);

      setCards([
        {
          title: "Customers",
          count: customerCount || 0,
          color: "bg-blue-600",
          link: "/customer",
        },
        {
          title: "Invoices",
          count: invoiceCount || 0,
          color: "bg-indigo-600",
          link: "/billing/customer-invoice",
        },
      ]);
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
    <main className="flex-1 pt-14 overflow-y-auto">
        <div className="w-full p-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Dashboard
            </h1>

            <nav className="text-xs text-blue-600">
              Home / <span className="text-gray-500">Dashboard</span>
            </nav>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
              <div
                key={idx}
                className={`${card.color} text-white rounded shadow-md overflow-hidden flex flex-col transition-transform hover:scale-[1.02]`}
              >
                <div className="p-6">
                  <h2 className="text-lg font-medium opacity-90">
                    {card.title}
                  </h2>

                  <p className="text-4xl font-bold mt-2">
                    {card.count}
                  </p>
                </div>
                <button
                  onClick={() => router.push(card.link)}
                  className="bg-black/10 hover:bg-black/20 py-2 text-sm transition-colors text-center w-full"
                >
                  View Details →
                </button>
              </div>
            ))}
          </div>

          {/* Overview Section */}
          <div className="mt-8 bg-white p-6 rounded border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              System Overview
            </h3>

            <p className="text-gray-600 text-sm">
              Welcome back. All systems are operational.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}