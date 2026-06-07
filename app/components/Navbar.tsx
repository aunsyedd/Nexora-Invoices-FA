"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Home, Users, FileText, ChevronDown, Menu, X } from "lucide-react";
import Footer from "./Footer";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar whenever the route changes (mobile UX)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  const navigate = (path: string) => {
    router.push(path);
    setSidebarOpen(false);
  };

  const isCustomerRoute = pathname?.startsWith("/customer");
  const isBillingRoute = pathname?.startsWith("/billing");
  const isInvoiceRoute = pathname?.startsWith("/billing/customer-invoice");

  const isCustomerNewActive = pathname === "/customer/new";
  const isCustomerListActive =
    pathname === "/customer" ||
    pathname === "/customer/" ||
    (isCustomerRoute &&
      pathname !== "/customer/new" &&
      /^\/customer\/\d+$/.test(pathname ?? ""));

  const isInvoiceNewActive = pathname === "/billing/customer-invoice/new";
  const isInvoiceListActive =
    pathname === "/billing/customer-invoice" ||
    pathname === "/billing/customer-invoice/" ||
    (isInvoiceRoute &&
      pathname !== "/billing/customer-invoice/new" &&
      !pathname.endsWith("/new"));

  const navItemClass = (active: boolean) =>
    `pl-9 py-2 text-sm font-medium border-l-2 border-blue-600 cursor-pointer transition-colors ${
      active
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 bg-gray-50 hover:bg-gray-100"
    }`;

  const navGroupClass = (active: boolean) =>
    `flex items-center justify-between p-2 rounded transition-colors ${
      active ? "bg-blue-600 text-white" : "text-blue-700 hover:bg-blue-50"
    }`;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-white border-r border-gray-200 shrink-0 h-screen flex flex-col shadow-sm
          fixed top-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          md:sticky md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Close button (mobile only) */}
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-3 right-3 p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="p-4 flex items-center gap-3 border-b hover:bg-gray-50 transition-colors text-left"
        >
          <Image
            src="/logofaisal.jpg"
            alt="Faisal Abdullah Muhammed Ramadan Est. Logo"
            width={36}
            height={36}
            className="rounded object-cover shrink-0"
          />
          <div className="flex flex-col leading-tight pr-6">
            <span className="text-xs font-medium text-gray-500">
              Nexora Invoicing Software
            </span>
            <span className="text-sm font-semibold text-gray-800">
              Faisal Abdullah Muhammed Ramadan Est.
            </span>
          </div>
        </button>

        <div className="p-3 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            <div className={navGroupClass(isCustomerRoute)}>
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span className="text-sm font-medium">Third Party</span>
              </div>
              <ChevronDown size={14} />
            </div>

            <div className="flex flex-col">
              <div
                role="button"
                tabIndex={0}
                onClick={() => navigate("/customer/new")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/customer/new")}
                className={navItemClass(isCustomerNewActive)}
              >
                New Customer
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => navigate("/customer")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/customer")}
                className={navItemClass(isCustomerListActive)}
              >
                Customer List
              </div>
            </div>

            <div className={`${navGroupClass(isInvoiceRoute)} mt-2`}>
              <div className="flex items-center gap-2">
                <FileText size={18} />
                <span className="text-sm font-medium">Customer Invoices</span>
              </div>
              <ChevronDown size={14} />
            </div>

            <div className="flex flex-col">
              <div
                role="button"
                tabIndex={0}
                onClick={() => navigate("/billing/customer-invoice/new")}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate("/billing/customer-invoice/new")
                }
                className={navItemClass(isInvoiceNewActive)}
              >
                New Invoice
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => navigate("/billing/customer-invoice")}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate("/billing/customer-invoice")
                }
                className={navItemClass(isInvoiceListActive)}
              >
                Invoice List
              </div>
            </div>
          </nav>
        </div>

        <Footer />
      </aside>

      {/* Top header */}
      <div className="fixed top-0 left-0 right-0 md:left-64 z-30">
        <header className="bg-white px-3 sm:px-4 border-b border-gray-200 flex items-center justify-between shadow-sm h-14">
          <div className="flex items-center gap-2">
            {/* Hamburger (mobile only) */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-blue-600 hover:bg-gray-100 rounded transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="p-2 text-blue-600 hover:bg-gray-100 rounded transition-colors"
              aria-label="Dashboard"
            >
              <Home size={18} />
            </button>

            <button
              type="button"
              onClick={() => router.push("/billing")}
              className={`px-2.5 sm:px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                isBillingRoute
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 border border-blue-600 hover:bg-blue-50"
              }`}
            >
              Billing
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm text-gray-600 hidden sm:inline">Admin</span>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-1 bg-blue-600 text-white px-2.5 sm:px-3 py-1.5 rounded text-xs sm:text-sm font-medium">
                Syed
                <ChevronDown size={14} />
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-2.5 sm:px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}