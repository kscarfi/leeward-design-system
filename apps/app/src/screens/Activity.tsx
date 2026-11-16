import { AmountDisplay, Avatar, Badge, Button, Card, Dialog, EmptyState, Heading, Icon, List, ListItem, PageHeader, RadioGroup, Stack, SummaryList, Text, formatDate, useToast } from "@leeward/react";
import { useState } from "react";
import { go } from "../router.ts";
import { useStore } from "../store.tsx";
import { NoteSheet } from "./Sheets.tsx";
import { money } from "./shared.tsx";

const STATUS = {
  completed: { label: "Completed", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  declined: { label: "Declined", tone: "danger" },
} as const;

const time = (d: Date) => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(d);

export function Activity({ id }: { id: string }) {
  const { state } = useStore();
  const toast = useToast();
  const [note, setNote] = useState(false);
  const [report, setReport] = useState(false);
  const [reason, setReason] = useState("unknown");
  const t = state.transactions.find((item) => item.id === id);

  if (!t) {
    return (
      <Stack gap="lg">
        <PageHeader title="Transaction" onBack={() => go("transactions")} backLabel="Back to activity" />
        <EmptyState icon="receipt" title="We could not find this transaction" description="Go back to see your activity." action={<Button onClick={() => go("transactions")}>See all activity</Button>} headingLevel={2} />
      </Stack>
    );
  }

  const status = STATUS[t.status ?? "completed"];
  const same = state.transactions.filter((x) => x.merchant === t.merchant && x.direction === t.direction && x.status !== "declined");
  const total = same.reduce((sum, x) => sum + x.amount, 0);
  const account = state.accounts[t.account];

  return (
    <Stack gap="lg">
      <PageHeader title="Transaction" onBack={() => history.back()} />
      <Stack align="center" gap="xs">
        <Avatar name={t.merchant} icon={t.icon} size="xl" decorative />
        <Heading level={2} size="h4">{t.merchant}</Heading>
        <AmountDisplay value={t.amount} currency="TRY" locale="en-US" direction={t.direction} size="xl" />
        <Text variant="body-sm" tone="secondary">{`${formatDate(t.date, "en-US", "long")}, ${time(t.date)}`}</Text>
        <Badge tone={status.tone}>{status.label}</Badge>
      </Stack>

      {t.status === "declined" && (
        <Card padding="md">
          <Text>Your card limit for online payments was reached, so no money left your account. You can raise the limit in Cards.</Text>
        </Card>
      )}

      {t.transfer && t.direction === "outgoing" && (
        <Card padding="none">
          <List aria-label="Transfer progress">
            <ListItem leading={<Icon name="check-circle" />} title="Sent" description={`${formatDate(t.date, "en-US", "long")}, ${time(t.date)}`} />
            <ListItem leading={<Icon name={t.status === "pending" ? "clock" : "check-circle"} />} title={t.status === "pending" ? "On its way" : "Arrived"} description={t.transfer.arrives} />
          </List>
        </Card>
      )}

      <Card padding="md">
        <SummaryList
          items={[
            { label: "Category", value: t.category },
            { label: t.direction === "incoming" ? "To" : "From", value: account.name },
            ...(t.card ? [{ label: "Card", value: `Debit •••• ${t.card}` }] : []),
            ...(t.transfer ? [{ label: t.direction === "incoming" ? "Sender's bank" : "Their bank", value: t.transfer.bank, hint: t.transfer.iban }] : []),
            ...(t.transfer?.description ? [{ label: "Description", value: t.transfer.description }] : []),
            { label: "Reference", value: <Text variant="code">{t.reference}</Text> },
          ]}
        />
      </Card>

      {same.length > 1 && <Text tone="secondary">{`${t.direction === "incoming" ? "From" : "At"} ${t.merchant}: ${money(total)} in ${same.length} payments this month.`}</Text>}

      <Card padding="none">
        <List>
          <ListItem leading={<Icon name="edit" />} title={t.note ? "Note" : "Add a note"} description={t.note || "Only you can see it"} onClick={() => setNote(true)} chevron />
          <ListItem leading={<Icon name="download" />} title="Receipt" description="PDF with the bank's stamp" onClick={() => toast.show({ title: "Receipt saved", description: `${t.reference}.pdf is in your downloads.`, tone: "success" })} chevron />
          <ListItem leading={<Icon name="help" />} title="Something wrong?" description="Report a problem with this payment" onClick={() => setReport(true)} chevron />
        </List>
      </Card>

      <NoteSheet key={t.note ?? ""} id={t.id} initial={t.note ?? ""} open={note} onOpenChange={setNote} />
      <Dialog
        title="Report a problem"
        description="We reply in the app within one working day."
        open={report}
        onOpenChange={setReport}
        actions={
          <Button
            onClick={() => {
              setReport(false);
              toast.show({ title: "We got your report", description: "We will reply in Notifications.", tone: "success" });
            }}
          >
            Send report
          </Button>
        }
      >
        <RadioGroup
          label="What happened?"
          value={reason}
          onValueChange={setReason}
          options={[
            { value: "unknown", label: "I do not recognise this payment" },
            { value: "twice", label: "I was charged twice" },
            { value: "refund", label: "I am waiting for a refund" },
          ]}
        />
      </Dialog>
    </Stack>
  );
}
