-- Run once in Supabase Dashboard → SQL Editor.
-- Points line items at invoices2 (not legacy invoices).

ALTER TABLE invoice_line_items2
  DROP CONSTRAINT IF EXISTS invoice_line_items2_invoice_id_fkey;

ALTER TABLE invoice_line_items2
  ADD CONSTRAINT invoice_line_items2_invoice_id_fkey
  FOREIGN KEY (invoice_id) REFERENCES invoices2(id) ON DELETE CASCADE;
