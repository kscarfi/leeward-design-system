import { useState, type ReactNode } from "react";
import { formatAmount, type Locale } from "../../utils/format.ts";
import { TextField } from "../../components/TextField/TextField.tsx";

export interface AmountInputProps {
  label: string;
  /** Amount in major units (lira, not kuruş). null when empty. */
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  currency: string;
  locale?: Locale;
  /** Maximum allowed, for example the available balance. Going over shows an error. */
  max?: number;
  min?: number;
  hint?: ReactNode;
  /** Overrides the built-in error. */
  error?: ReactNode;
  name?: string;
  id?: string;
  className?: string;
}

const symbols: Record<string, string> = { TRY: "₺", USD: "$", EUR: "€", GBP: "£" };

/** Parse "1.250,50" (tr-TR) or "1,250.50" (en-US) into 1250.5. Returns null for empty or invalid input. */
export function parseAmount(raw: string, locale: Locale = "en-US"): number | null {
  const decimal = locale === "tr-TR" ? "," : ".";
  const cleaned = raw.replace(/\s/g, "").replace(new RegExp(`[^0-9${decimal === "," ? "," : "."}]`, "g"), "");
  if (!cleaned) return null;
  const normalized = decimal === "," ? cleaned.replace(/,/g, ".") : cleaned;
  const [whole, ...rest] = normalized.split(".");
  const value = Number(`${whole}${rest.length ? `.${rest.join("").slice(0, 2)}` : ""}`);
  return Number.isFinite(value) ? value : null;
}

/** Money entry: decimal keypad on phones, locale grouping on blur, and a clear limit error. */
export function AmountInput({ label, value, defaultValue = null, onValueChange, currency, locale = "en-US", max, min = 0, hint, error, name, id, className }: AmountInputProps) {
  const [internal, setInternal] = useState<number | null>(defaultValue);
  const amount = value === undefined ? internal : value;
  const format = (n: number | null) => (n === null ? "" : formatAmount(n, { currency, locale, sign: "never" }).replace(/[^\d.,]/g, ""));
  const [text, setText] = useState(format(amount));
  const [focused, setFocused] = useState(false);

  const over = amount !== null && max !== undefined && amount > max;
  const under = amount !== null && amount < min;
  const builtIn = over
    ? `This is more than you have. You can send up to ${formatAmount(max!, { currency, locale })}.`
    : under
      ? `The minimum is ${formatAmount(min, { currency, locale })}.`
      : undefined;

  return (
    <TextField
      label={label}
      {...(id ? { id } : {})}
      {...(name ? { name } : {})}
      {...(className ? { className } : {})}
      inputMode="decimal"
      autoComplete="off"
      numeric
      size="lg"
      prefix={symbols[currency] ?? currency}
      placeholder={locale === "tr-TR" ? "0,00" : "0.00"}
      hint={hint}
      error={error ?? builtIn}
      value={focused ? text : format(amount)}
      onFocus={() => {
        setFocused(true);
        setText(amount === null ? "" : String(amount).replace(".", locale === "tr-TR" ? "," : "."));
      }}
      onBlur={() => setFocused(false)}
      onChange={(event) => {
        setText(event.target.value);
        const next = parseAmount(event.target.value, locale);
        if (value === undefined) setInternal(next);
        onValueChange?.(next);
      }}
    />
  );
}
