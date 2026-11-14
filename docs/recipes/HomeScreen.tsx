// Recipe: home screen. Balance, quick actions, accounts and recent activity.
// Every value comes from Leeward components and tokens. This file is type-checked in CI.
import { AccountCard, BalanceHeader, Card, Chip, Heading, IconButton, List, QuickActions, TransactionRow } from "@leeward/react";
import { useState } from "react";

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  date: Date;
  amount: number;
  direction: "incoming" | "outgoing";
  status?: "completed" | "pending" | "declined";
}

export function HomeScreen({ transactions, onOpen }: { transactions: Transaction[]; onOpen: (id: string) => void }) {
  const [filter, setFilter] = useState<"all" | "incoming" | "outgoing">("all");
  const shown = transactions.filter((t) => filter === "all" || t.direction === filter);

  return (
    <main style={{ maxWidth: "var(--lw-size-content-sm)", margin: "0 auto", padding: "var(--lw-space-lg) var(--lw-space-md)", display: "grid", gap: "var(--lw-space-lg)" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--lw-space-sm)" }}>
        <Heading level={1} size="title-xs">Good morning, Ece</Heading>
        <IconButton icon="bell" label="Notifications" />
      </header>

      <BalanceHeader label="Total balance" balance={144580.35} currency="TRY" locale="tr-TR" meta="Updated just now" />

      <QuickActions
        label="Quick actions"
        actions={[
          { label: "Send", icon: "send", href: "/transfer" },
          { label: "Request", icon: "hand-money", href: "/request" },
          { label: "Top up", icon: "wallet-money", href: "/top-up" },
          { label: "Pay bills", icon: "bill", href: "/bills" },
        ]}
      />

      <AccountCard
        headingLevel={2}
        name="Everyday"
        type="Current account"
        iban="TR33 0006 1005 1978 6457 8413 26"
        balance={24580.35}
        currency="TRY"
        locale="tr-TR"
        actions={[{ label: "Add money", icon: "plus", onClick: () => {} }, { label: "Details", onClick: () => {} }]}
      />

      <section aria-labelledby="activity" style={{ display: "grid", gap: "var(--lw-space-sm)" }}>
        <Heading level={2} size="h4" id="activity">Recent activity</Heading>
        <div role="group" aria-label="Filter activity" style={{ display: "flex", gap: "var(--lw-space-xs)", flexWrap: "wrap" }}>
          <Chip selected={filter === "all"} onSelectedChange={() => setFilter("all")}>All</Chip>
          <Chip selected={filter === "incoming"} onSelectedChange={() => setFilter("incoming")}>Money in</Chip>
          <Chip selected={filter === "outgoing"} onSelectedChange={() => setFilter("outgoing")}>Money out</Chip>
        </div>
        <Card padding="none">
          <List>
            {shown.map((t) => (
              <TransactionRow key={t.id} {...t} currency="TRY" locale="tr-TR" onClick={() => onOpen(t.id)} />
            ))}
          </List>
        </Card>
      </section>
    </main>
  );
}
