import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccountCard, BalanceHeader, Button, Card, Chip, Heading, List, TransactionRow } from "@leeward/react";

const meta = { title: "Screens/Home", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj;

const tx = [
  { merchant: "Salary, Acme Studio", category: "Income", amount: 52000, direction: "incoming" as const, icon: "bank" as const, date: new Date("2026-11-12") },
  { merchant: "Coffee Lab", category: "Eating out", amount: 85, direction: "outgoing" as const, icon: "coffee" as const, date: new Date("2026-11-12") },
  { merchant: "City Transit", category: "Transport", amount: 42.5, direction: "outgoing" as const, icon: "transport" as const, date: new Date("2026-11-11"), status: "pending" as const },
  { merchant: "Deniz Yılmaz", category: "Transfer", amount: 250, direction: "incoming" as const, date: new Date("2026-11-10") },
  { merchant: "Power Co", category: "Bills", amount: 640.2, direction: "outgoing" as const, icon: "bolt" as const, date: new Date("2026-11-09") },
];

export const Home: Story = {
  render: () => (
    <main style={{ maxWidth: "440px", margin: "0 auto", padding: "var(--lw-space-lg) var(--lw-space-md)", display: "grid", gap: "var(--lw-space-lg)" }}>
      <Heading level={1} size="sm">Good morning, Ece</Heading>
      <BalanceHeader
        label="Total balance"
        balance={144580.35}
        currency="TRY"
        locale="tr-TR"
        meta="Updated just now"
        actions={
          <>
            <Button iconStart="arrow-up-right">Send</Button>
            <Button variant="secondary" iconStart="arrow-down-left">Request</Button>
          </>
        }
      />
      <AccountCard headingLevel={2} name="Everyday" type="Current account" iban="TR33 0006 1005 1978 6457 8413 26" balance={24580.35} currency="TRY" locale="tr-TR" actions={[{ label: "Add money", icon: "plus", onClick: () => {} }, { label: "Details", onClick: () => {} }]} />
      <section aria-labelledby="activity" style={{ display: "grid", gap: "var(--lw-space-sm)" }}>
        <Heading level={2} size="xs" id="activity">Recent activity</Heading>
        <div role="group" aria-label="Filter activity" style={{ display: "flex", gap: "var(--lw-space-xs)" }}>
          <Chip selected>All</Chip>
          <Chip>Money in</Chip>
          <Chip>Money out</Chip>
        </div>
        <Card padding="none">
          <List>
            {tx.map((t) => (
              <TransactionRow key={t.merchant} {...t} currency="TRY" locale="tr-TR" onClick={() => {}} />
            ))}
          </List>
        </Card>
      </section>
    </main>
  ),
};
