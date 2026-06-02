import { supabase } from "@/lib/supabaseClient";

/** invoice_line_items2.invoice_id FK references `invoices`, not `invoices2`. */
export async function syncInvoiceParentRow(
  id: number,
  payload: Record<string, unknown>
) {
  return supabase.from("invoices").upsert({ ...payload, id }, { onConflict: "id" });
}
