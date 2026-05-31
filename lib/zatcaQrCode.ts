import { toIsoTimestamp as parseInvoiceDateToIso } from "@/lib/invoiceDateUtils";

export class ZatcaQRCodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ZatcaQRCodeError";
  }
}

const ZATCA_TAGS = {
  SELLER_NAME: 1,
  VAT_NUMBER: 2,
  TIMESTAMP: 3,
  TOTAL_WITH_VAT: 4,
  VAT_TOTAL: 5,
} as const;

function requireField(value: string, fieldName: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new ZatcaQRCodeError(`${fieldName} is required for ZATCA QR code generation.`);
  }
  return trimmed;
}

function formatZatcaAmount(value: string): string {
  const num = parseFloat(value);
  if (Number.isNaN(num)) {
    throw new ZatcaQRCodeError(`Invalid amount value: "${value}"`);
  }
  return num.toFixed(2);
}

function toIsoTimestamp(invoiceDate: string): string {
  try {
    return parseInvoiceDateToIso(invoiceDate);
  } catch {
    throw new ZatcaQRCodeError(
      `Invalid invoice date for ZATCA QR code: "${invoiceDate}"`
    );
  }
}

function encodeTLV(tag: number, value: string): Uint8Array {
  const valueBytes = new TextEncoder().encode(value);

  if (valueBytes.length > 255) {
    throw new ZatcaQRCodeError(
      `TLV value for tag ${tag} exceeds 255 bytes.`
    );
  }

  const tlv = new Uint8Array(2 + valueBytes.length);
  tlv[0] = tag;
  tlv[1] = valueBytes.length;
  tlv.set(valueBytes, 2);
  return tlv;
}

function concatTLV(chunks: Uint8Array[]): Uint8Array {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Generates a ZATCA Phase 1 compliant QR payload using TLV encoding and Base64.
 * Tag 4 (totalAmount) must be the invoice total including VAT.
 */
export function generateZatcaQRCode(
  sellerName: string,
  vatNumber: string,
  invoiceDate: string,
  totalAmount: string,
  vatAmount: string
): string {
  const seller = requireField(sellerName, "Seller Name");
  const vat = requireField(vatNumber, "VAT Registration Number");
  const timestamp = toIsoTimestamp(requireField(invoiceDate, "Invoice Date & Time"));
  const totalWithVat = formatZatcaAmount(totalAmount);
  const vatTotal = formatZatcaAmount(vatAmount);

  const tlvBytes = concatTLV([
    encodeTLV(ZATCA_TAGS.SELLER_NAME, seller),
    encodeTLV(ZATCA_TAGS.VAT_NUMBER, vat),
    encodeTLV(ZATCA_TAGS.TIMESTAMP, timestamp),
    encodeTLV(ZATCA_TAGS.TOTAL_WITH_VAT, totalWithVat),
    encodeTLV(ZATCA_TAGS.VAT_TOTAL, vatTotal),
  ]);

  return uint8ArrayToBase64(tlvBytes);
}
