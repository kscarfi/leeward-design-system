// Locale-aware money and date formatting. Honest numbers: the sign is always explicit
// and comes from the direction, never from color.

export type Locale = "tr-TR" | "en-US";

const HOME_CURRENCY: Record<Locale, string> = { "tr-TR": "TRY", "en-US": "USD" };

/** U+2212 MINUS SIGN, the typographic minus, same width as the plus sign. */
export const MINUS = "−";

export interface FormatAmountOptions {
  currency: string;
  locale?: Locale;
  /** "auto" follows the value's sign. "always" shows + for positive values. "never" hides the sign. */
  sign?: "auto" | "always" | "never";
  minimumFractionDigits?: number;
}

/**
 * tr-TR with TRY gives "₺1.250,00". en-US with TRY gives "TRY 1,250.00".
 * The symbol is used only for the locale's home currency, so foreign amounts are never ambiguous.
 */
export function formatAmount(value: number, { currency, locale = "en-US", sign = "auto", minimumFractionDigits = 2 }: FormatAmountOptions): string {
  const display = HOME_CURRENCY[locale] === currency ? "symbol" : "code";
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: display,
    minimumFractionDigits,
    maximumFractionDigits: Math.max(minimumFractionDigits, 2),
    signDisplay: "never",
  })
    .format(Math.abs(value))
    .replace(/ /g, display === "code" ? " " : " ");
  if (sign === "never" || value === 0) return formatted;
  if (value < 0) return `${MINUS}${formatted}`;
  return sign === "always" ? `+${formatted}` : formatted;
}

/** Spoken form for screen readers, for example "1,250.00 Turkish liras". */
export function spokenAmount(value: number, currency: string, locale: Locale = "en-US"): string {
  const number = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Math.abs(value));
  const name = new Intl.DisplayNames([locale], { type: "currency" }).of(currency) ?? currency;
  return `${number} ${name}`;
}

export function formatDate(date: Date, locale: Locale = "en-US", style: "short" | "long" = "short"): string {
  return new Intl.DateTimeFormat(locale, style === "short" ? { day: "numeric", month: "short" } : { day: "numeric", month: "long", year: "numeric" }).format(date);
}

/** Group an IBAN in blocks of four and mask all but the last four digits. */
export function maskIban(iban: string, visible = 4): string {
  const compact = iban.replace(/\s+/g, "").toUpperCase();
  const country = compact.slice(0, 2);
  const tail = compact.slice(-visible);
  const masked = country + "•".repeat(Math.max(compact.length - 2 - visible, 0)) + tail;
  return masked.replace(/(.{4})/g, "$1 ").trim();
}

export function formatIban(iban: string): string {
  return iban.replace(/\s+/g, "").toUpperCase().replace(/(.{4})/g, "$1 ").trim();
}
