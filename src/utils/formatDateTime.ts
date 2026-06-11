import { format, isValid } from "date-fns";

export const DATETIME_FORMAT_DMY = "dd/MM/yyyy, h:mm a";

/** Parse FastAPI naive UTC datetimes and format in the viewer's local timezone. */
function parseApiDateTime(value: string): Date {
  const trimmed = value.trim();
  if (!trimmed) return new Date(NaN);

  if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(trimmed)) {
    return new Date(trimmed);
  }

  const normalized = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
  const base = normalized.split(".")[0] ?? normalized;
  return new Date(`${base}Z`);
}

export function formatDateTimeDMY(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? parseApiDateTime(value) : value;
  if (!isValid(d)) return "—";
  return format(d, DATETIME_FORMAT_DMY);
}
