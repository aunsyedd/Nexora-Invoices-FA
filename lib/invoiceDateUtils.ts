/**
 * Parses invoice date strings from multiple formats used in the app and database.
 */
export function parseInvoiceDate(value: string): Date | null {
  const trimmed = value?.trim().replace(/\s+/g, " ");
  if (!trimmed) return null;

  // datetime-local: 2026-05-30T22:49 or 2026-05-30T22:49:00
  const isoLocal = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/
  );
  if (isoLocal) {
    const [, y, m, d, h, min, sec] = isoLocal;
    const parsed = new Date(
      Number(y),
      Number(m) - 1,
      Number(d),
      Number(h),
      Number(min),
      sec ? Number(sec) : 0
    );
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  // DD-MM-YYYY HH:MM AM/PM  e.g. 30-05-2026 10:49 PM
  const dmy12h = trimmed.match(
    /^(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i
  );
  if (dmy12h) {
    const [, day, month, year, hourStr, minute, period] = dmy12h;
    let hour = Number(hourStr);
    const upper = period.toUpperCase();
    if (upper === "PM" && hour !== 12) hour += 12;
    if (upper === "AM" && hour === 12) hour = 0;

    const parsed = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      hour,
      Number(minute),
      0
    );
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  // DD-MM-YYYY HH:MM (24h)  e.g. 30-05-2026 22:49
  const dmy24h = trimmed.match(
    /^(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/
  );
  if (dmy24h) {
    const [, day, month, year, hour, minute, sec] = dmy24h;
    const parsed = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      sec ? Number(sec) : 0
    );
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  // DD-MM-YYYY date only
  const dmy = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (dmy) {
    const [, day, month, year] = dmy;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  // Fallback for ISO / PostgreSQL timestamps
  const fallback = new Date(trimmed);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

export function toDateTimeLocalValue(value: string): string {
  const parsed = parseInvoiceDate(value);
  if (!parsed) return value;

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`;
}

export function toIsoTimestamp(value: string): string {
  const parsed = parseInvoiceDate(value);
  if (!parsed) {
    throw new Error(`Invalid invoice date: "${value}"`);
  }
  return parsed.toISOString();
}
