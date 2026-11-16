import { formatAmount, type TransactionRowProps } from "@leeward/react";
import type { Transaction } from "../data.ts";

/** The TransactionRow props for one of the app's transactions. */
export function txRowProps(t: Transaction): Omit<TransactionRowProps, "onClick"> {
  return {
    merchant: t.merchant,
    category: t.category,
    icon: t.icon,
    date: t.date,
    amount: t.amount,
    direction: t.direction,
    ...(t.status ? { status: t.status } : {}),
    currency: "TRY",
    locale: "en-US",
  };
}

/** "Today", "Yesterday" or "12 November", for grouping activity by day. */
export function dayLabel(date: Date, now = new Date()): string {
  const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((day(now) - day(date)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long" }).format(date);
}

/** Amounts inside sentences, formatted by the system. */
export const money = (value: number) => formatAmount(value, { currency: "TRY", locale: "en-US" });
