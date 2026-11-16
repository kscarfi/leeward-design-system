// Sample data for the demo. The person is the designer of the system; everyone else is made up.
import type { IconName } from "@leeward/react";

export const USER = { name: "Kemal Salih Carfi", first: "Kemal", email: "kemal@leeward.example", phone: "•••• 4821" };

export type AccountId = "everyday" | "savings";

export interface Account {
  id: AccountId;
  name: string;
  type: string;
  iban: string;
  balance: number;
}

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  icon: IconName;
  date: Date;
  amount: number;
  direction: "incoming" | "outgoing";
  status?: "completed" | "pending" | "declined";
  account: AccountId;
  /** Last four digits when paid by card. */
  card?: string;
  /** Set for transfers: the other bank, and when it arrives. */
  transfer?: { bank: string; iban: string; arrives: string; description?: string };
  reference: string;
  note?: string;
}

export interface Recipient {
  name: string;
  bank: string;
  iban: string;
  favorite?: boolean;
}

export interface Upcoming {
  id: string;
  name: string;
  icon: IconName;
  date: Date;
  amount: number;
  kind: "Scheduled transfer" | "Direct debit" | "Card subscription";
}

export interface Goal {
  id: string;
  name: string;
  icon: IconName;
  saved: number;
  target: number;
  targetDate?: Date;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  icon: IconName;
  date: Date;
  read: boolean;
}

const at = (d: number, h: number, m: number) => new Date(2026, 10, d, h, m);

export const initialAccounts: Record<AccountId, Account> = {
  everyday: { id: "everyday", name: "Everyday", type: "Current account", iban: "TR72 0006 1000 5197 8645 7841 32", balance: 24580.35 },
  savings: { id: "savings", name: "Savings", type: "Savings account, 38% a year", iban: "TR40 0006 1000 5197 8987 6543 21", balance: 120000 },
};

export const initialTransactions: Transaction[] = [
  { id: "t1", merchant: "Coffee Lab", category: "Eating out", icon: "coffee", date: at(16, 9, 12), amount: 85, direction: "outgoing", status: "pending", account: "everyday", card: "4821", reference: "LW-2026-11-16-0012" },
  { id: "t2", merchant: "Atlas Studio", category: "Salary", icon: "building", date: at(15, 8, 0), amount: 62500, direction: "incoming", account: "everyday", transfer: { bank: "Garanti BBVA", iban: "TR05 0006 2000 0123 4000 0629 50", arrives: "Arrived", description: "November salary" }, reference: "LW-2026-11-15-0003" },
  { id: "t3", merchant: "Migros", category: "Groceries", icon: "cart", date: at(14, 18, 40), amount: 1240.5, direction: "outgoing", account: "everyday", card: "4821", reference: "LW-2026-11-14-0087" },
  { id: "t4", merchant: "Deniz Yılmaz", category: "Transfer", icon: "send", date: at(13, 21, 5), amount: 750, direction: "incoming", account: "everyday", transfer: { bank: "Leeward", iban: "TR69 0006 1000 5197 8111 1222 23", arrives: "Arrived", description: "Dinner" }, reference: "LW-2026-11-13-0140" },
  { id: "t5", merchant: "İstanbulkart", category: "Transport", icon: "transport", date: at(13, 7, 55), amount: 300, direction: "outgoing", account: "everyday", card: "4821", reference: "LW-2026-11-13-0021" },
  { id: "t6", merchant: "Spotify", category: "Subscriptions", icon: "receipt", date: at(12, 0, 3), amount: 99.99, direction: "outgoing", status: "declined", account: "everyday", card: "4821", reference: "LW-2026-11-12-0001" },
  { id: "t7", merchant: "Migros", category: "Groceries", icon: "cart", date: at(9, 17, 20), amount: 865.2, direction: "outgoing", account: "everyday", card: "4821", reference: "LW-2026-11-09-0056" },
  { id: "t8", merchant: "Interest", category: "Savings", icon: "percent", date: at(1, 0, 5), amount: 3780, direction: "incoming", account: "savings", reference: "LW-2026-11-01-0001" },
];

export const initialRecipients: Recipient[] = [
  { name: "Deniz Yılmaz", bank: "Leeward", iban: "TR69 0006 1000 5197 8111 1222 23", favorite: true },
  { name: "Zeynep Arslan", bank: "Ziraat Bankası", iban: "TR21 0001 0000 1234 5678 9012 34" },
  { name: "Mert Aydın", bank: "Türkiye İş Bankası", iban: "TR29 0006 4000 0011 2345 6789 01" },
  { name: "Selin Demir", bank: "Leeward", iban: "TR67 0006 1000 5197 8222 2333 34" },
];

export const initialUpcoming: Upcoming[] = [
  { id: "u1", name: "Rent, Selin Demir", icon: "house", date: new Date(2026, 10, 20), amount: 15000, kind: "Scheduled transfer" },
  { id: "u2", name: "Türk Telekom", icon: "wifi", date: new Date(2026, 10, 24), amount: 449.9, kind: "Direct debit" },
  { id: "u3", name: "Spotify", icon: "receipt", date: new Date(2026, 10, 28), amount: 99.99, kind: "Card subscription" },
];

export const initialGoals: Goal[] = [
  { id: "g1", name: "Holiday fund", icon: "airplane", saved: 18500, target: 30000, targetDate: new Date(2027, 5, 1) },
  { id: "g2", name: "New laptop", icon: "laptop", saved: 42000, target: 42000 },
];

export const initialNotices: Notice[] = [
  { id: "n1", title: "Card payment declined", body: "Spotify tried to take TRY 99.99. Your card limit for online payments was reached. Raise it in Cards.", icon: "card", date: at(12, 0, 3), read: false },
  { id: "n2", title: "Salary received", body: "TRY 62,500.00 from Atlas Studio is in your Everyday account.", icon: "wallet-money", date: at(15, 8, 0), read: false },
  { id: "n3", title: "Your November statement is ready", body: "Download it from Profile, Statements.", icon: "document", date: at(1, 9, 0), read: true },
];

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
/** Fee for transfers to other banks (FAST). Transfers between Leeward accounts are free. */
export const OTHER_BANK_FEE = 4.5;
/** Largest single transfer without a branch visit. */
export const TRANSFER_LIMIT = 50000;
export const CARD = { last4: "4821", number: "5355 7720 1984 4821", expiry: "08/28", cvv: "319", topUpCard: "Visa •••• 1290" };
