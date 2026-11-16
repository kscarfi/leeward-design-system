import { Alert, AmountDisplay, AmountInput, Button, Card, DatePicker, EmptyState, Heading, Icon, List, ListItem, OTPInput, PageHeader, RadioGroup, RecipientRow, SearchField, Select, Stack, Stepper, SummaryList, Switch, Text, TextField, formatDate } from "@leeward/react";
import { useState } from "react";
import { DEMO_CODE, OTHER_BANK_FEE, TRANSFER_LIMIT, USER, type AccountId, type Recipient } from "../data.ts";
import { go } from "../router.ts";
import { checkIban, newId, useStore } from "../store.tsx";
import { money } from "./shared.tsx";

const STEPS = ["Recipient", "Amount", "Review", "Confirm"];

const without = <T extends object>(obj: T, key: keyof T): T => {
  const copy = { ...obj };
  delete copy[key];
  return copy;
};

const tomorrow = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  return d;
};

/** Send money: pick or add a recipient, set the amount, review every number, confirm with a code. */
export function Send({ to }: { to?: number }) {
  const { state, dispatch } = useStore();
  const [step, setStep] = useState(to === undefined ? 0 : 1);
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIban, setNewIban] = useState("");
  const [newErrors, setNewErrors] = useState<{ name?: string; iban?: string }>({});
  const [recipient, setRecipient] = useState<Recipient | null>(to === undefined ? null : (state.recipients[to] ?? null));
  const [isNew, setIsNew] = useState(false);
  const [save, setSave] = useState(true);
  const [from, setFrom] = useState<AccountId>("everyday");
  const [amount, setAmount] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [when, setWhen] = useState<"now" | "later">("now");
  const [date, setDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<{ amount?: string; date?: string; code?: string }>({});
  const [sentId, setSentId] = useState<string | null>(null);

  const available = state.accounts[from].balance;
  const instant = recipient?.bank === "Leeward";
  const fee = recipient && !instant ? OTHER_BANK_FEE : 0;
  const arrives = when === "later" && date ? `On ${formatDate(date, "en-US", "long")}` : instant ? "In a few seconds" : "Within one working day";
  const q = query.toLocaleLowerCase("tr-TR").trim();
  const matches = state.recipients.filter((r) => !q || `${r.name} ${r.bank} ${r.iban}`.toLocaleLowerCase("tr-TR").includes(q));

  const back = () => {
    if (adding) return setAdding(false);
    if (step === 0) return history.back();
    setErrors({});
    setStep(step - 1);
  };

  const choose = (r: Recipient, fresh = false) => {
    setRecipient(r);
    setIsNew(fresh);
    setAdding(false);
    setStep(1);
  };

  const addRecipient = () => {
    const name = newName.trim().length < 3 ? "Enter their full name, as it is on their account." : undefined;
    const checked = checkIban(newIban);
    setNewErrors({ ...(name ? { name } : {}), ...(checked.error ? { iban: checked.error } : {}) });
    if (name || checked.error) return;
    choose({ name: newName.trim(), iban: checked.iban, bank: checked.bank ?? "Another bank" }, true);
  };

  // The button is never disabled: people press it and see what to fix.
  const next = () => {
    if (step === 1) {
      const e: typeof errors = {};
      if (amount === null || amount <= 0) e.amount = "Enter how much you want to send.";
      else if (amount > TRANSFER_LIMIT) e.amount = `You can send up to ${money(TRANSFER_LIMIT)} at a time.`;
      else if (when === "now" && amount + fee > available) e.amount = `That is more than you have. With the fee, you can send up to ${money(Math.max(available - fee, 0))}.`;
      if (when === "later" && !date) e.date = "Choose the day it should arrive.";
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    setStep(step + 1);
  };

  if (sentId && recipient && amount !== null) {
    return (
      <Stack gap="lg">
        <PageHeader title={when === "later" ? "Transfer scheduled" : "Transfer sent"} />
        <EmptyState
          icon="check-circle"
          title={when === "later" ? `${money(amount)} is scheduled` : `${money(amount)} is on its way`}
          description={`${recipient.name} gets it ${arrives.charAt(0).toLowerCase()}${arrives.slice(1)}.`}
          headingLevel={2}
        />
        <Card padding="none">
          <List aria-label="Transfer progress">
            <ListItem leading={<Icon name="check-circle" />} title={when === "later" ? "Scheduled" : "Sent"} description="Today" />
            <ListItem leading={<Icon name={instant && when === "now" ? "check-circle" : "clock"} />} title={instant && when === "now" ? "Arrived" : "Arrives"} description={arrives} />
          </List>
        </Card>
        <Stack gap="sm">
          {when === "now" && <Button fullWidth size="lg" variant="outline" iconStart="receipt" onClick={() => go(`activity/${sentId}`)}>See the receipt</Button>}
          <Button fullWidth size="lg" onClick={() => go("home")}>Done</Button>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <PageHeader title={adding ? "New recipient" : "Send money"} onBack={back} backLabel={step === 0 && !adding ? "Back" : "Previous step"} />
      {!adding && <Stepper steps={STEPS} current={step} variant="compact" label="Transfer progress" />}

      {step === 0 && !adding && (
        <Stack gap="md">
          <SearchField label="Who are you paying?" placeholder="Name, bank or IBAN" value={query} onValueChange={setQuery} />
          <Card padding="none">
            <List>
              <ListItem leading={<Icon name="user-plus" />} title="New recipient" description="Any Turkish bank, by IBAN" onClick={() => setAdding(true)} chevron />
            </List>
          </Card>
          <Heading level={2} size="h6" tone="muted">Saved recipients</Heading>
          {matches.length > 0 ? (
            <Card padding="none">
              <List aria-label="Saved recipients">
                {matches.map((r) => (
                  <RecipientRow key={r.iban} {...r} locale="en-US" onClick={() => choose(r)} />
                ))}
              </List>
            </Card>
          ) : (
            <Text tone="secondary">{`No saved recipient matches "${query}". Add them as a new recipient.`}</Text>
          )}
        </Stack>
      )}

      {step === 0 && adding && (
        <Stack gap="md">
          <TextField label="Full name" autoComplete="name" value={newName} onChange={(e) => setNewName(e.target.value)} hint="As it is on their bank account" {...(newErrors.name ? { error: newErrors.name } : {})} />
          <TextField label="IBAN" numeric autoComplete="off" placeholder="TR00 0000 0000 0000 0000 0000 00" value={newIban} onChange={(e) => setNewIban(e.target.value.toUpperCase())} hint="26 characters, starting with TR" {...(newErrors.iban ? { error: newErrors.iban } : {})} />
          <Alert tone="info" title="We check the name with their bank">If the name does not match the IBAN, the money comes back to you.</Alert>
          <Button size="xl" fullWidth onClick={addRecipient}>Continue</Button>
        </Stack>
      )}

      {step === 1 && recipient && (
        <Stack gap="md">
          <Card padding="none">
            <List>
              <RecipientRow name={recipient.name} bank={recipient.bank} iban={recipient.iban} locale="en-US" onClick={() => setStep(0)} />
            </List>
          </Card>
          <Select
            label="Pay from"
            value={from}
            onValueChange={(value) => {
              setFrom(value as AccountId);
              setErrors({});
            }}
            options={(["everyday", "savings"] as const).map((id) => ({ value: id, label: `${state.accounts[id].name}, ${money(state.accounts[id].balance)}` }))}
          />
          <AmountInput
            label="Amount"
            currency="TRY"
            locale="en-US"
            value={amount}
            onValueChange={(value) => {
              setAmount(value);
              setErrors((e) => without(e, "amount"));
            }}
            hint={fee ? `Fee ${money(fee)} for other banks. Available: ${money(available)}` : `No fee to Leeward accounts. Available: ${money(available)}`}
            {...(errors.amount ? { error: errors.amount } : {})}
          />
          <TextField label="Description" optional maxLength={140} value={description} onChange={(e) => setDescription(e.target.value)} hint="They see it on their statement, for example Rent for November" />
          <RadioGroup
            label="When should it arrive?"
            value={when}
            onValueChange={(value) => setWhen(value as "now" | "later")}
            options={[
              { value: "now", label: "Now", description: instant ? "Arrives in seconds" : "Arrives within one working day" },
              { value: "later", label: "On a date", description: "We send it on the morning of that day" },
            ]}
          />
          {when === "later" && (
            <DatePicker
              label="Date"
              locale="en-US"
              min={tomorrow()}
              value={date}
              onValueChange={(value) => {
                setDate(value);
                setErrors((e) => without(e, "date"));
              }}
              {...(errors.date ? { error: errors.date } : {})}
            />
          )}
          <Button size="xl" fullWidth onClick={next}>Continue</Button>
        </Stack>
      )}

      {step === 2 && recipient && amount !== null && (
        <Stack gap="md">
          <Heading level={2} size="h4">Check the details</Heading>
          <Card padding="md">
            <SummaryList
              items={[
                { label: "To", value: recipient.name, hint: `${recipient.bank}, ${recipient.iban}` },
                { label: "From", value: state.accounts[from].name },
                { label: "They get", value: <AmountDisplay value={amount} currency="TRY" locale="en-US" size="sm" /> },
                { label: "Fee", value: <AmountDisplay value={fee} currency="TRY" locale="en-US" size="sm" />, hint: fee === 0 ? "Free between Leeward accounts" : "FAST transfer to another bank" },
                { label: "Arrives", value: arrives },
                ...(description.trim() ? [{ label: "Description", value: description.trim() }] : []),
              ]}
              total={{ label: "You pay", value: <AmountDisplay value={amount + fee} currency="TRY" locale="en-US" direction="outgoing" size="md" /> }}
            />
          </Card>
          {isNew && <Switch label="Save to recipients" hint="So you can pay them again in two taps." checked={save} onCheckedChange={setSave} />}
          <Text variant="body-sm" tone="secondary">{when === "now" ? "Once you confirm, you cannot cancel a transfer that has left your account." : "You can cancel a scheduled transfer until the day before."}</Text>
          <Button size="xl" fullWidth onClick={next}>{when === "later" ? "Schedule transfer" : `Send ${money(amount)}`}</Button>
        </Stack>
      )}

      {step === 3 && recipient && amount !== null && (
        <OTPInput
          label="Verification code"
          hint={`We sent a code to ${USER.phone}. In this demo, use ${DEMO_CODE}.`}
          autoFocus
          {...(errors.code ? { error: errors.code } : {})}
          onValueChange={() => setErrors({})}
          onComplete={(code) => {
            if (code !== DEMO_CODE) return setErrors({ code: "This code does not match. Check the SMS and try again." });
            const id = newId();
            dispatch({ type: "send", id, transfer: { to: recipient, from, amount, fee, date: when === "later" ? date : null, description: description.trim(), save: isNew && save } });
            setSentId(id);
          }}
        />
      )}
    </Stack>
  );
}
