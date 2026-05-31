import { parseInvoiceDate } from "@/lib/invoiceDateUtils";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatProformaDate(value: string): string {
  if (!value) return "";
  const d = parseInvoiceDate(value);
  if (!d) return value;
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatProformaNumber(value: string | number): string {
  const num = typeof value === "number" ? value : parseFloat(String(value));
  if (Number.isNaN(num)) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Retention is calculated on line subtotal minus discount (invoice "Total Amount"). */
export function calcRetentionAmount(
  lineSubtotal: number,
  discount: number,
  retentionPercentage: string
): number {
  const pct = parseFloat(retentionPercentage) || 0;
  if (pct <= 0) return 0;
  const totalAfterDiscount = Math.max(0, lineSubtotal - discount);
  return (totalAfterDiscount * pct) / 100;
}

/** e.g. CI-13-WTMC-26, CI-14-WTMC-26 */
export function formatCustomerInvoiceNumber(
  sequence: number,
  refDate: Date = new Date()
): string {
  const yy = String(refDate.getFullYear()).slice(-2);
  return `CI-${sequence}-WTMC-${yy}`;
}

export function capitalizeUnit(unit: string): string {
  if (!unit) return "";
  return unit.charAt(0).toUpperCase() + unit.slice(1).toLowerCase();
}

const PAYMENT_TERMS_LABELS: Record<string, string> = {
  due_on_receipt: "Due Upon Receipt",
  "100_advance": "100% Advance",
  "15_days": "After 15 Days",
  "30_days": "After 30 Days",
  "45_days": "After 45 Days",
  "60_days": "After 60 Days",
  "90_days": "After 90 Days",
};

export function getPaymentTermsLabel(terms: string): string {
  return PAYMENT_TERMS_LABELS[terms] || terms;
}

export function getDueDate(invoiceDate: string, paymentTerms: string): string {
  if (!invoiceDate) return "";
  const d = parseInvoiceDate(invoiceDate);
  if (!d) return "";

  const daysMap: Record<string, number> = {
    due_on_receipt: 0,
    "100_advance": 0,
    "15_days": 15,
    "30_days": 30,
    "45_days": 45,
    "60_days": 60,
    "90_days": 90,
  };

  const days = daysMap[paymentTerms] ?? 0;
  d.setDate(d.getDate() + days);
  return formatProformaDate(d.toISOString());
}

export function calcLineTax(amount: string, vat: string): number {
  const base = parseFloat(amount) || 0;
  return base * (vat === "VAT 15%" ? 0.15 : 0);
}
