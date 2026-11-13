import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccountCard, Alert, AmountInput, BalanceHeader, Button, Card, Chip, Heading, IconButton, List, OTPInput, QuickActions, SegmentedControl, Stepper, TextField, TransactionRow } from "@leeward/react";
import { useState } from "react";

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
      />
      <QuickActions label="Quick actions" actions={[{ label: "Send", icon: "send", onClick: () => {} }, { label: "Request", icon: "hand-money", onClick: () => {} }, { label: "Top up", icon: "wallet-money", onClick: () => {} }, { label: "Pay bills", icon: "bill", onClick: () => {}, badge: 2 }]} />
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

function TransferFlow() {
  const [step, setStep] = useState(1);
  return (
    <main style={{ maxWidth: "440px", margin: "0 auto", padding: "var(--lw-space-lg) var(--lw-space-md)", display: "grid", gap: "var(--lw-space-lg)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--lw-space-xs)" }}>
        <IconButton icon="arrow-left" label="Back" onClick={() => setStep((s) => Math.max(0, s - 1))} />
        <Heading level={1} size="h3">Send money</Heading>
      </div>
      <Stepper steps={["Recipient", "Amount", "Review", "Confirm"]} current={step} variant="compact" />
      {step <= 1 && (
        <>
          <TextField label="Recipient" defaultValue="Deniz Yılmaz" hint="TR33 0006 1005 1978 6457 8413 26" />
          <AmountInput label="Amount" currency="TRY" locale="tr-TR" max={24580.35} hint="Available: ₺24.580,35" defaultValue={250} />
          <SegmentedControl label="When" options={[{ value: "now", label: "Now" }, { value: "later", label: "Later" }]} fullWidth />
          <Button fullWidth size="xl" onClick={() => setStep(2)}>Review</Button>
        </>
      )}
      {step === 2 && (
        <>
          <Alert tone="info" title="The fee is ₺0,00">Transfers to Leeward accounts are free and arrive in seconds.</Alert>
          <Button fullWidth size="xl" onClick={() => setStep(3)}>Send ₺250,00</Button>
        </>
      )}
      {step === 3 && <OTPInput label="Verification code" hint="We sent a code to •••• 4821" />}
    </main>
  );
}

export const Transfer: Story = { render: () => <TransferFlow /> };
