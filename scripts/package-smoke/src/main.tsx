import "@leeward/react/fonts.css";
import "@leeward/react/styles.css";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AccountCard, Alert, AmountDisplay, AmountInput, BalanceHeader, Button, type ButtonShape, Card, Dialog, DialogClose,
  Heading, List, QuickActions, SegmentedControl, Select, Switch, Text, TextField, ToastProvider, TooltipProvider, TransactionRow, useToast,
} from "@leeward/react";
import { tokens, type TokenName } from "@leeward/tokens";

const name: TokenName = "fill.primary.default";
const shape: ButtonShape = "pill";

function Screen() {
  const toast = useToast();
  const [amount, setAmount] = useState<number | null>(250);
  const [period, setPeriod] = useState("week");
  return (
    <main style={{ display: "grid", gap: "var(--lw-space-lg)", padding: "var(--lw-space-lg)", maxWidth: "720px", margin: "0 auto" }}>
      <Heading level={1} size="title-md">Consumer test</Heading>
      <Text tone="secondary" data-testid="token">{tokens.leeward.light[name].value}</Text>
      <BalanceHeader label="Total balance" balance={144580.35} currency="TRY" locale="tr-TR" actions={<Button iconStart="arrow-up-right" shape={shape}>Send</Button>} />
      <QuickActions label="Quick actions" actions={[{ label: "Send", icon: "send", onClick: () => {} }, { label: "Request", icon: "download", onClick: () => {} }]} />
      <AccountCard headingLevel={2} name="Everyday" type="Current account" iban="TR33 0006 1005 1978 6457 8413 26" balance={24580.35} currency="TRY" locale="tr-TR" />
      <Card padding="none">
        <List>
          <TransactionRow merchant="Salary" category="Income" date={new Date("2026-11-12")} amount={52000} direction="incoming" currency="TRY" locale="tr-TR" icon="bank" />
          <TransactionRow merchant="Coffee Lab" category="Eating out" date={new Date("2026-11-12")} amount={85} direction="outgoing" currency="TRY" locale="tr-TR" icon="coffee" />
        </List>
      </Card>
      <Alert tone="info" title="Transfers to other banks take up to one working day" />
      <div style={{ display: "flex", gap: "var(--lw-space-sm)", alignItems: "flex-end", flexWrap: "wrap" }} data-testid="row">
        <Button size="sm">Send</Button>
        <div style={{ width: "160px" }}><TextField size="sm" label="Name" placeholder="Deniz" /></div>
        <div style={{ width: "160px" }}><Select size="sm" label="Account" options={[{ value: "a", label: "Everyday" }]} /></div>
        <SegmentedControl size="sm" label="Period" value={period} onValueChange={setPeriod} options={[{ value: "week", label: "Week" }, { value: "month", label: "Month" }]} />
      </div>
      <AmountInput label="Amount" value={amount} onValueChange={setAmount} currency="TRY" locale="tr-TR" />
      <AmountDisplay value={250} currency="TRY" locale="tr-TR" />
      <Switch label="Online card payments" defaultChecked />
      <div style={{ display: "flex", gap: "var(--lw-space-sm)" }}>
        <Button variant="secondary" onClick={() => toast.show({ title: "Money sent", tone: "success" })}>Show toast</Button>
        <Dialog trigger={<Button variant="outline">Open dialog</Button>} title="Freeze your card?" description="You can unfreeze it any time." actions={<DialogClose asChild><Button>Freeze card</Button></DialogClose>} />
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div data-brand="leeward" data-theme="light">
      <TooltipProvider>
        <ToastProvider>
          <Screen />
        </ToastProvider>
      </TooltipProvider>
    </div>
  </StrictMode>,
);
