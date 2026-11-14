// Recipe: money transfer. Recipient, amount, review with fee, one-time code, success.
// One primary action per step, full width at the bottom on phones. Type-checked in CI.
import { Alert, AmountDisplay, AmountInput, Button, Card, Heading, IconButton, OTPInput, RadioGroup, Stepper, Text, TextField, useToast } from "@leeward/react";
import { useState } from "react";

const STEPS = ["Recipient", "Amount", "Review", "Confirm"];
const AVAILABLE = 24580.35;
const FEE = 0;

export function TransferFlow({ onDone }: { onDone: () => void }) {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [codeError, setCodeError] = useState<string | undefined>();
  const [recipientError, setRecipientError] = useState<string | undefined>();
  const [amountError, setAmountError] = useState<string | undefined>();

  // The button is never disabled: people press it and see what to fix (DESIGN.md, Forms).
  const next = () => {
    if (step === 0 && recipient.trim().length < 2) return setRecipientError("Enter the name of the person you are paying.");
    if (step === 1 && (amount === null || amount <= 0)) return setAmountError("Enter how much you want to send.");
    if (step === 1 && amount !== null && amount > AVAILABLE) return;
    setStep(step + 1);
  };

  return (
    <main style={{ maxWidth: "var(--lw-size-content-sm)", margin: "0 auto", padding: "var(--lw-space-lg) var(--lw-space-md)", display: "grid", gap: "var(--lw-space-lg)" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "var(--lw-space-xs)" }}>
        {step > 0 && <IconButton icon="arrow-left" label="Back" onClick={() => setStep(step - 1)} />}
        <Heading level={1} size="title-xs">Send money</Heading>
      </header>
      <Stepper steps={STEPS} current={step} variant="compact" label="Transfer progress" />

      {step === 0 && (
        <TextField
          label="Recipient name"
          autoComplete="name"
          value={recipient}
          onChange={(e) => {
            setRecipient(e.target.value);
            setRecipientError(undefined);
          }}
          hint="As it appears on their account"
          {...(recipientError ? { error: recipientError } : {})}
        />
      )}

      {step === 1 && (
        <>
          <AmountInput
            label="Amount"
            currency="TRY"
            locale="tr-TR"
            max={AVAILABLE}
            value={amount}
            onValueChange={(value) => {
              setAmount(value);
              setAmountError(undefined);
            }}
            hint="Available: ₺24.580,35"
            {...(amountError ? { error: amountError } : {})}
          />
          <RadioGroup label="When should it arrive?" defaultValue="now" options={[{ value: "now", label: "Now", description: "Free, arrives in seconds" }, { value: "date", label: "On a date" }]} />
        </>
      )}

      {step === 2 && amount !== null && (
        <Card variant="outlined" padding="lg" as="section" aria-labelledby="review">
          <Heading level={2} size="h4" id="review">Check the details</Heading>
          <dl style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--lw-space-sm)", margin: 0 }}>
            <Text as="dt" tone="secondary">To</Text>
            <Text as="dd" variant="label-md" style={{ margin: 0 }}>{recipient}</Text>
            <Text as="dt" tone="secondary">Amount</Text>
            <dd style={{ margin: 0 }}><AmountDisplay value={amount} currency="TRY" locale="tr-TR" size="sm" /></dd>
            <Text as="dt" tone="secondary">Fee</Text>
            <dd style={{ margin: 0 }}><AmountDisplay value={FEE} currency="TRY" locale="tr-TR" size="sm" /></dd>
            <Text as="dt" variant="label-md">Leaves your account</Text>
            <dd style={{ margin: 0 }}><AmountDisplay value={amount + FEE} currency="TRY" locale="tr-TR" direction="outgoing" size="md" /></dd>
          </dl>
          <Alert tone="info" title="Transfers to Leeward accounts are free">The money arrives in seconds.</Alert>
        </Card>
      )}

      {step === 3 && (
        <OTPInput
          label="Verification code"
          hint="We sent a code to •••• 4821"
          autoFocus
          {...(codeError ? { error: codeError } : {})}
          onComplete={(code) => {
            if (code !== "123456") {
              setCodeError("This code does not match. Check the SMS and try again.");
              return;
            }
            setSending(true);
            toast.show({ title: "Money sent", description: `${recipient} gets it in a few seconds.`, tone: "success" });
            onDone();
          }}
        />
      )}

      {step < 3 && (
        <Button size="xl" fullWidth loading={sending} onClick={next}>
          {step === 2 && amount !== null ? "Send money" : "Continue"}
        </Button>
      )}
    </main>
  );
}
