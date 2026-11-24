const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** The only way prices are shown. Amounts come from the backend as-is. */
export function formatPrice(amount: number) {
  return priceFormatter.format(amount);
}

/** Formats an ISO date in the venue's time zone so server and browser render the same text. */
export function formatDateTime(
  iso: string,
  timeZone: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" },
) {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone }).format(new Date(iso));
}

export function formatDate(iso: string, timeZone: string) {
  return formatDateTime(iso, timeZone, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export function formatTime(iso: string, timeZone: string) {
  return formatDateTime(iso, timeZone, { hour: "numeric", minute: "2-digit", timeZoneName: "short" });
}

const numberFormatter = new Intl.NumberFormat("en-US");

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

const compactPriceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Short price for chart labels, e.g. $161.8K. */
export function formatPriceCompact(amount: number) {
  return compactPriceFormatter.format(amount);
}

/** The current calendar year, for ranges like a date-of-birth picker. */
export const currentYear = () => new Date().getFullYear();
