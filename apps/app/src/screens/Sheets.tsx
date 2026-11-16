import { AmountInput, Button, IconButton, Select, Sheet, Stack, SummaryList, Text, TextField, useToast } from "@leeward/react";
import { useState } from "react";
import { CARD, USER } from "../data.ts";
import { copy, newId, useStore } from "../store.tsx";
import { money } from "./shared.tsx";

interface SheetState {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Top up the Everyday account from a linked card. Arrives at once, no fee. */
export function AddMoneySheet({ open, onOpenChange }: SheetState) {
  const { dispatch } = useStore();
  const toast = useToast();
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState<string>();
  const submit = () => {
    if (amount === null || amount < 10) return setError("Add at least TRY 10.00.");
    if (amount > 20000) return setError("You can add up to TRY 20,000.00 at a time from a card.");
    dispatch({ type: "addMoney", amount, id: newId() });
    toast.show({ title: `${money(amount)} added`, description: "It is in your Everyday account now.", tone: "success" });
    setAmount(null);
    onOpenChange(false);
  };
  return (
    <Sheet
      title="Add money"
      description="From a card you linked. It arrives at once, with no fee."
      open={open}
      onOpenChange={onOpenChange}
      footer={<Button fullWidth size="lg" onClick={submit}>Add money</Button>}
    >
      <Stack gap="md">
        <Select label="From" value="card" options={[{ value: "card", label: CARD.topUpCard }]} />
        <AmountInput
          label="Amount"
          currency="TRY"
          locale="en-US"
          value={amount}
          onValueChange={(value) => {
            setAmount(value);
            setError(undefined);
          }}
          hint="Between TRY 10.00 and TRY 20,000.00"
          {...(error ? { error } : {})}
        />
      </Stack>
    </Sheet>
  );
}

/** Share the details people need to pay you: name and IBAN, or a payment link. */
export function RequestSheet({ open, onOpenChange, title = "Request money" }: SheetState & { title?: string }) {
  const { state } = useStore();
  const toast = useToast();
  const iban = state.accounts.everyday.iban;
  const link = "leeward.example/pay/kemal";
  const copied = (what: string, value: string) => void copy(value).then(() => toast.show({ title: `${what} copied` }));
  return (
    <Sheet
      title={title}
      description="Share your details. People with any Turkish bank can pay you."
      open={open}
      onOpenChange={onOpenChange}
      footer={<Button fullWidth size="lg" iconStart="share" onClick={() => copied("Payment link", `https://${link}`)}>Share payment link</Button>}
    >
      <SummaryList
        items={[
          { label: "Name", value: USER.name },
          { label: "IBAN", value: <Stack direction="horizontal" gap="2xs" align="center"><Text variant="code">{iban}</Text><IconButton icon="copy" label="Copy IBAN" size="xs" variant="ghost" onClick={() => copied("IBAN", iban)} /></Stack> },
          { label: "Payment link", value: <Stack direction="horizontal" gap="2xs" align="center"><Text variant="code">{link}</Text><IconButton icon="copy" label="Copy payment link" size="xs" variant="ghost" onClick={() => copied("Payment link", `https://${link}`)} /></Stack> },
        ]}
      />
    </Sheet>
  );
}

/** Move money from Everyday into a savings goal. */
export function GoalSheet({ goal, onOpenChange }: { goal: string | null; onOpenChange: (open: boolean) => void }) {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const target = state.goals.find((g) => g.id === goal);
  const [amount, setAmount] = useState<number | null>(null);
  const [error, setError] = useState<string>();
  const available = state.accounts.everyday.balance;
  const submit = () => {
    if (!target) return;
    if (amount === null || amount <= 0) return setError("Enter how much you want to move.");
    if (amount > available) return setError(`You have ${money(available)} in Everyday.`);
    dispatch({ type: "toGoal", goal: target.id, amount, id: newId() });
    toast.show({ title: `${money(amount)} moved to ${target.name}`, tone: "success" });
    setAmount(null);
    onOpenChange(false);
  };
  return (
    <Sheet title={target ? `Add to ${target.name}` : "Add to goal"} description="Moves money from your Everyday account." open={goal !== null} onOpenChange={onOpenChange} footer={<Button fullWidth size="lg" onClick={submit}>Move money</Button>}>
      <Stack gap="md">
        <AmountInput
          label="Amount"
          currency="TRY"
          locale="en-US"
          value={amount}
          onValueChange={(value) => {
            setAmount(value);
            setError(undefined);
          }}
          hint={`Available in Everyday: ${money(available)}`}
          {...(error ? { error } : {})}
        />
        {target && target.saved < target.target && (
          <Button variant="outline" size="sm" onClick={() => setAmount(Math.min(target.target - target.saved, available))}>
            {`Fill the goal: ${money(target.target - target.saved)}`}
          </Button>
        )}
      </Stack>
    </Sheet>
  );
}

/** A short note on a transaction, shown only to you. */
export function NoteSheet({ id, initial, open, onOpenChange }: SheetState & { id: string; initial: string }) {
  const { dispatch } = useStore();
  const [note, setNote] = useState(initial);
  return (
    <Sheet
      title="Note"
      description="Only you can see it."
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <Button
          fullWidth
          size="lg"
          onClick={() => {
            dispatch({ type: "note", id, note: note.trim() });
            onOpenChange(false);
          }}
        >
          Save note
        </Button>
      }
    >
      <TextField label="Note" value={note} maxLength={64} onChange={(e) => setNote(e.target.value)} hint={`${note.length} of 64 characters`} />
    </Sheet>
  );
}
