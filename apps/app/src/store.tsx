// One place for the app's money, so every screen agrees: a transfer lowers the balance and shows up in
// activity, a frozen card is frozen everywhere, and money moved to a goal leaves the Everyday account.
import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import {
  CARD,
  initialAccounts,
  initialGoals,
  initialNotices,
  initialRecipients,
  initialTransactions,
  initialUpcoming,
  type AccountId,
  type Recipient,
  type Transaction,
} from "./data.ts";

export interface CardSettings {
  frozen: boolean;
  online: boolean;
  contactless: boolean;
  atm: boolean;
  dailyLimit: number;
}

const initial = {
  accounts: initialAccounts,
  transactions: initialTransactions,
  recipients: initialRecipients,
  upcoming: initialUpcoming,
  goals: initialGoals,
  notices: initialNotices,
  card: { frozen: false, online: true, contactless: true, atm: true, dailyLimit: 15000 } as CardSettings,
};
export type State = typeof initial;

export interface Transfer {
  to: Recipient;
  from: AccountId;
  amount: number;
  fee: number;
  /** null sends now. */
  date: Date | null;
  description: string;
  save: boolean;
}

type Action =
  | { type: "send"; transfer: Transfer; id: string }
  | { type: "addMoney"; amount: number; id: string }
  | { type: "toGoal"; goal: string; amount: number; id: string }
  | { type: "card"; patch: Partial<CardSettings> }
  | { type: "note"; id: string; note: string }
  | { type: "read" };

const reference = (id: string) => `LW-2026-11-16-${id.slice(-4).toUpperCase()}`;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "send": {
      const { to, from, amount, fee, date, description, save } = action.transfer;
      const recipients = save && !state.recipients.some((r) => r.iban === to.iban) ? [...state.recipients, to] : state.recipients;
      // A scheduled transfer waits in Upcoming and takes the money on the day.
      if (date) {
        return { ...state, recipients, upcoming: [...state.upcoming, { id: action.id, name: to.name, icon: "send" as const, date, amount: amount + fee, kind: "Scheduled transfer" as const }].sort((a, b) => a.date.getTime() - b.date.getTime()) };
      }
      const instant = to.bank === "Leeward";
      const tx: Transaction = {
        id: action.id,
        merchant: to.name,
        category: "Transfer",
        icon: "send",
        date: new Date(),
        amount: amount + fee,
        direction: "outgoing",
        status: instant ? "completed" : "pending",
        account: from,
        transfer: { bank: to.bank, iban: to.iban, arrives: instant ? "Arrived in seconds" : "Within one working day", ...(description ? { description } : {}) },
        reference: reference(action.id),
      };
      const account = state.accounts[from];
      return { ...state, recipients, transactions: [tx, ...state.transactions], accounts: { ...state.accounts, [from]: { ...account, balance: account.balance - amount - fee } } };
    }
    case "addMoney": {
      const tx: Transaction = { id: action.id, merchant: "Top up", category: `From ${CARD.topUpCard}`, icon: "plus", date: new Date(), amount: action.amount, direction: "incoming", account: "everyday", reference: reference(action.id) };
      const everyday = state.accounts.everyday;
      return { ...state, transactions: [tx, ...state.transactions], accounts: { ...state.accounts, everyday: { ...everyday, balance: everyday.balance + action.amount } } };
    }
    case "toGoal": {
      const goal = state.goals.find((g) => g.id === action.goal);
      if (!goal) return state;
      const tx: Transaction = { id: action.id, merchant: goal.name, category: "Moved to a goal", icon: "piggy-bank", date: new Date(), amount: action.amount, direction: "outgoing", account: "everyday", reference: reference(action.id) };
      const everyday = state.accounts.everyday;
      return {
        ...state,
        goals: state.goals.map((g) => (g.id === goal.id ? { ...g, saved: g.saved + action.amount } : g)),
        transactions: [tx, ...state.transactions],
        accounts: { ...state.accounts, everyday: { ...everyday, balance: everyday.balance - action.amount } },
      };
    }
    case "card":
      return { ...state, card: { ...state.card, ...action.patch } };
    case "note":
      return { ...state, transactions: state.transactions.map((t) => (t.id === action.id ? { ...t, note: action.note } : t)) };
    case "read":
      return { ...state, notices: state.notices.map((n) => ({ ...n, read: true })) };
  }
}

const Store = createContext<{ state: State; dispatch: (action: Action) => void } | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Store.Provider value={value}>{children}</Store.Provider>;
}

export function useStore() {
  const store = useContext(Store);
  if (!store) throw new Error("useStore must be used inside <StoreProvider>.");
  return store;
}

let next = 100;
export const newId = () => `x${next++}`;

/** Copies text and says so; the clipboard can be unavailable inside a frame, so it never throws. */
export async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text.replace(/\s/g, ""));
    return true;
  } catch {
    return false;
  }
}

/** TR IBANs: TR, 2 check digits, 22 digits; the check digits must pass the mod 97 test. */
export function checkIban(raw: string): { iban: string; bank?: string; error?: string } {
  const compact = raw.replace(/\s/g, "").toUpperCase();
  if (!compact) return { iban: "", error: "Enter the recipient's IBAN." };
  if (!/^TR\d{24}$/.test(compact)) return { iban: compact, error: "A Turkish IBAN starts with TR and has 26 characters." };
  const rearranged = compact.slice(4) + compact.slice(0, 4);
  const digits = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let rest = 0;
  for (const d of digits) rest = (rest * 10 + Number(d)) % 97;
  if (rest !== 1) return { iban: compact, error: "This IBAN is not valid. Check each digit." };
  const banks: Record<string, string> = { "00061": "Leeward", "00010": "Ziraat Bankası", "00064": "Türkiye İş Bankası", "00062": "Garanti BBVA", "00046": "Akbank", "00067": "Yapı Kredi" };
  const pretty = compact.replace(/(.{4})/g, "$1 ").trim();
  return { iban: pretty, bank: banks[compact.slice(4, 9)] ?? "Another bank" };
}
