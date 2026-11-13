// Built-in copy for screen reader text and default labels. Short, second person, no jargon.
import type { Locale } from "./format.ts";

const en = {
  moneyIn: "Money in",
  moneyOut: "Money out",
  pending: "Pending",
  declined: "Declined",
  balanceHidden: "Balance hidden",
  showBalance: "Show balance",
  hideBalance: "Hide balance",
  loading: "Loading",
  close: "Close",
  dismiss: "Dismiss",
  error: "Error",
  remove: "Remove",
  ibanEnding: "IBAN ending in",
  otpDigits: (n: number) => `${n}-digit code`,
};

const tr: typeof en = {
  moneyIn: "Para girişi",
  moneyOut: "Para çıkışı",
  pending: "Bekliyor",
  declined: "Reddedildi",
  balanceHidden: "Bakiye gizli",
  showBalance: "Bakiyeyi göster",
  hideBalance: "Bakiyeyi gizle",
  loading: "Yükleniyor",
  close: "Kapat",
  dismiss: "Kapat",
  error: "Hata",
  remove: "Kaldır",
  ibanEnding: "Son dört hanesi",
  otpDigits: (n: number) => `${n} haneli kod`,
};

export type Messages = typeof en;
export function messages(locale: Locale = "en-US"): Messages {
  return locale === "tr-TR" ? tr : en;
}
