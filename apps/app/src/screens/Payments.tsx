import { Alert, AmountDisplay, AmountInput, Button, Card, DatePicker, EmptyState, Heading, List, OTPInput, PageHeader, RadioGroup, RecipientRow, SearchField, Select, Stack, Stepper, SummaryList, Text, formatAmount, formatDate } from "@leeward/react";
import { useState } from "react";
import { DEMO_CODE, accounts, recipients, type Recipient } from "../data.ts";
import { go } from "../router.ts";

const STEPS = ["Recipient", "Amount", "Review", "Confirm"];
const FROM = { everyday: accounts.everyday, savings: accounts.savings };
type From = keyof typeof FROM;

const tomorrow = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  return d;
};

export function Payments() {
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState("");
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [from, setFrom] = useState<From>("everyday");
  const [amount, setAmount] = useState<number | null>(null);
  const [amountError, setAmountError] = useState<string>();
  const [when, setWhen] = useState<"now" | "later">("now");
  const [date, setDate] = useState<Date | null>(null);
  const [dateError, setDateError] = useState<string>();
  const [codeError, setCodeError] = useState<string>();
  const [sent, setSent] = useState(false);

  const available = FROM[from].balance;
  // Transfers between Leeward accounts are free; other banks cost a flat fee.
  const fee = recipient && recipient.bank !== "Leeward" ? 4.5 : 0;
  const instant = recipient?.bank === "Leeward";
  const arrives = when === "later" && date ? `On ${formatDate(date, "en-US", "long")}` : instant ? "In a few seconds" : "Within one working day";
  const matches = recipients.filter((r) => `${r.name} ${r.bank}`.toLocaleLowerCase("tr-TR").includes(query.toLocaleLowerCase("tr-TR")));

  const back = () => (step === 0 ? go("home") : setStep(step - 1));
  // The button is never disabled: people press it and see what to fix.
  const next = () => {
    if (step === 1) {
      if (amount === null || amount <= 0) return setAmountError("Enter how much you want to send.");
      if (amount + fee > available) return setAmountError(`That is more than you have. You can send up to ${formatAmount(Math.max(available - fee, 0), { currency: "TRY", locale: "en-US" })}.`);
      if (when === "later" && !date) return setDateError("Choose the day it should arrive.");
    }
    setStep(step + 1);
  };

  if (sent && recipient && amount !== null) {
    return (
      <Stack gap="lg">
        <PageHeader title={when === "later" ? "Transfer scheduled" : "Money sent"} />
        <EmptyState
          icon="check-circle"
          title={`${formatAmount(amount, { currency: "TRY", locale: "en-US" })} ${when === "later" ? "is scheduled" : "is on its way"}`}
          description={`${recipient.name} gets it ${arrives.charAt(0).toLowerCase()}${arrives.slice(1)}.`}
          action={<Button onClick={() => go("home")}>Back to home</Button>}
          headingLevel={2}
        />
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <PageHeader title="Send money" onBack={back} backLabel={step === 0 ? "Back to home" : "Previous step"} />
      <Stepper steps={STEPS} current={step} variant="compact" label="Transfer progress" />

      {step === 0 && (
        <Stack gap="md">
          <SearchField label="Who are you paying?" placeholder="Name or bank" value={query} onValueChange={setQuery} />
          <Card padding="none">
            <List aria-label="Saved recipients">
              {matches.map((r) => (
                <RecipientRow
                  key={r.iban}
                  {...r}
                  locale="en-US"
                  onClick={() => {
                    setRecipient(r);
                    setStep(1);
                  }}
                />
              ))}
            </List>
          </Card>
          {matches.length === 0 && <Text tone="secondary">No saved recipient matches "{query}". Check the spelling or search by bank.</Text>}
        </Stack>
      )}

      {step === 1 && recipient && (
        <Stack gap="md">
          <Text>
            To <Text as="strong" variant="label-md">{recipient.name}</Text>, {recipient.bank}
          </Text>
          <Select
            label="Pay from"
            value={from}
            onValueChange={(value) => {
              setFrom(value as From);
              setAmountError(undefined);
            }}
            options={(Object.keys(FROM) as From[]).map((key) => ({ value: key, label: `${FROM[key].name}, ${formatAmount(FROM[key].balance, { currency: "TRY", locale: "en-US" })}` }))}
          />
          <AmountInput
            label="Amount"
            currency="TRY"
            locale="en-US"
            value={amount}
            onValueChange={(value) => {
              setAmount(value);
              setAmountError(undefined);
            }}
            hint={`Available: ${formatAmount(available, { currency: "TRY", locale: "en-US" })}`}
            {...(amountError ? { error: amountError } : {})}
          />
          <RadioGroup
            label="When should it arrive?"
            value={when}
            onValueChange={(value) => setWhen(value as "now" | "later")}
            options={[
              { value: "now", label: "Now", description: instant ? "Arrives in seconds" : "Arrives within one working day" },
              { value: "later", label: "On a date", description: "Schedule it for a later day" },
            ]}
          />
          {when === "later" && (
            <DatePicker
              label="Arrival date"
              locale="en-US"
              min={tomorrow()}
              value={date}
              onValueChange={(value) => {
                setDate(value);
                setDateError(undefined);
              }}
              {...(dateError ? { error: dateError } : {})}
            />
          )}
        </Stack>
      )}

      {step === 2 && recipient && amount !== null && (
        <Stack gap="md">
          <Heading level={2} size="h4">Check the details</Heading>
          <Card padding="md">
            <SummaryList
              items={[
                { label: "To", value: recipient.name, hint: recipient.bank },
                { label: "From", value: FROM[from].name },
                { label: "Amount", value: <AmountDisplay value={amount} currency="TRY" locale="en-US" size="sm" /> },
                { label: "Fee", value: <AmountDisplay value={fee} currency="TRY" locale="en-US" size="sm" />, hint: fee === 0 ? "Free between Leeward accounts" : "Flat fee for other banks" },
                { label: "Arrives", value: arrives },
              ]}
              total={{ label: "Leaves your account", value: <AmountDisplay value={amount + fee} currency="TRY" locale="en-US" direction="outgoing" size="md" /> }}
            />
          </Card>
          {instant && when === "now" && <Alert tone="info" title="Free and instant">Transfers between Leeward accounts arrive in seconds.</Alert>}
        </Stack>
      )}

      {step === 3 && (
        <Stack gap="md">
          <OTPInput
            label="Verification code"
            hint={`We sent a code to •••• 4821. In this demo, use ${DEMO_CODE}.`}
            autoFocus
            locale="en-US"
            {...(codeError ? { error: codeError } : {})}
            onValueChange={() => setCodeError(undefined)}
            onComplete={(code) => {
              if (code !== DEMO_CODE) return setCodeError("This code does not match. Check the SMS and try again.");
              setSent(true);
            }}
          />
        </Stack>
      )}

      {(step === 1 || step === 2) && (
        <Button size="xl" fullWidth onClick={next}>
          {step === 2 ? "Send money" : "Continue"}
        </Button>
      )}
    </Stack>
  );
}
