// Sample data for the demo. Amounts are in Turkish lira and formatted by the components.
import type { IconName } from "@leeward/react";

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  icon: IconName;
  date: Date;
  amount: number;
  direction: "incoming" | "outgoing";
  status?: "completed" | "pending" | "declined";
  reference: string;
}

const day = (d: number, h: number, m: number) => new Date(2026, 10, d, h, m);

export const transactions: Transaction[] = [
  { id: "t1", merchant: "Coffee Lab", category: "Eating out", icon: "coffee", date: day(16, 9, 12), amount: 85, direction: "outgoing", status: "pending", reference: "LW-2026-11-16-0012" },
  { id: "t2", merchant: "Salary, Atlas Studio", category: "Income", icon: "building", date: day(15, 8, 0), amount: 62500, direction: "incoming", reference: "LW-2026-11-15-0003" },
  { id: "t3", merchant: "Migros", category: "Groceries", icon: "cart", date: day(14, 18, 40), amount: 1240.5, direction: "outgoing", reference: "LW-2026-11-14-0087" },
  { id: "t4", merchant: "Deniz Yılmaz", category: "Transfer", icon: "send", date: day(13, 21, 5), amount: 750, direction: "incoming", reference: "LW-2026-11-13-0140" },
  { id: "t5", merchant: "İstanbulkart", category: "Transport", icon: "transport", date: day(13, 7, 55), amount: 300, direction: "outgoing", reference: "LW-2026-11-13-0021" },
  { id: "t6", merchant: "Spotify", category: "Subscriptions", icon: "receipt", date: day(12, 0, 3), amount: 99.99, direction: "outgoing", status: "declined", reference: "LW-2026-11-12-0001" },
];

export interface Recipient {
  name: string;
  bank: string;
  iban: string;
  favorite?: boolean;
}

export const recipients: Recipient[] = [
  { name: "Deniz Yılmaz", bank: "Leeward", iban: "TR33 0006 1005 1978 6457 8413 26", favorite: true },
  { name: "Ece Kaya", bank: "Ziraat Bankası", iban: "TR12 0001 0012 3456 7890 1234 56" },
  { name: "Mert Aydın", bank: "Türkiye İş Bankası", iban: "TR64 0006 4000 0011 2345 6789 01" },
  { name: "Selin Demir", bank: "Leeward", iban: "TR27 0006 1005 1978 1111 2222 33" },
];

export const accounts = {
  everyday: { name: "Everyday", type: "Current account", iban: "TR33 0006 1005 1978 6457 8413 26", balance: 24580.35 },
  savings: { name: "Savings", type: "Savings account", iban: "TR90 0006 1005 1978 9876 5432 10", balance: 120000 },
};

export const spending: Record<string, { name: string; amount: number; icon: IconName }[]> = {
  week: [
    { name: "Groceries", amount: 1240.5, icon: "cart" },
    { name: "Transport", amount: 300, icon: "transport" },
    { name: "Eating out", amount: 85, icon: "restaurant" },
  ],
  month: [
    { name: "Groceries", amount: 4200, icon: "cart" },
    { name: "Bills", amount: 3100, icon: "bill" },
    { name: "Eating out", amount: 1850, icon: "restaurant" },
    { name: "Transport", amount: 960, icon: "transport" },
  ],
  year: [
    { name: "Rent", amount: 180000, icon: "house" },
    { name: "Groceries", amount: 46800, icon: "cart" },
    { name: "Bills", amount: 35200, icon: "bill" },
    { name: "Travel", amount: 22400, icon: "airplane" },
    { name: "Eating out", amount: 19600, icon: "restaurant" },
  ],
};

/** The only code that passes the verification step in this demo. */
export const DEMO_CODE = "123456";
