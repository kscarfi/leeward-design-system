import { AmountDisplay, Avatar, Badge, Button, Card, EmptyState, PageHeader, Stack, SummaryList, Text, formatDate, useToast } from "@leeward/react";
import { transactions } from "../data.ts";
import { go } from "../router.ts";

const STATUS = {
  completed: { label: "Completed", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  declined: { label: "Declined", tone: "danger" },
} as const;

export function Activity({ id }: { id: string }) {
  const toast = useToast();
  const t = transactions.find((item) => item.id === id);
  const back = () => go("home");

  if (!t) {
    return (
      <Stack gap="lg">
        <PageHeader title="Transaction" onBack={back} />
        <EmptyState icon="receipt" title="We could not find this transaction" description="It may have been removed. Go back to see your recent activity." action={<Button onClick={back}>Back to home</Button>} />
      </Stack>
    );
  }

  const status = STATUS[t.status ?? "completed"];
  return (
    <Stack gap="lg">
      <PageHeader title="Transaction" onBack={back} />
      <Stack align="center" gap="sm">
        <Avatar name={t.merchant} icon={t.icon} size="xl" decorative />
        <Text variant="label-lg">{t.merchant}</Text>
        <AmountDisplay value={t.amount} currency="TRY" locale="en-US" direction={t.direction} size="xl" />
        <Badge tone={status.tone}>{status.label}</Badge>
      </Stack>
      <Card padding="md">
        <SummaryList
          items={[
            { label: "Date", value: formatDate(t.date, "en-US", "long") },
            { label: "Category", value: t.category },
            { label: t.direction === "incoming" ? "To" : "From", value: "Everyday account" },
            { label: "Reference", value: <Text variant="code">{t.reference}</Text> },
          ]}
        />
      </Card>
      <Stack gap="sm">
        <Button variant="outline" iconStart="download" fullWidth onClick={() => toast.show({ title: "Receipt saved", description: `${t.reference}.pdf is in your downloads.`, tone: "success" })}>
          Download receipt
        </Button>
        <Button variant="ghost" iconStart="alert-circle" fullWidth onClick={() => toast.show({ title: "We got your report", description: "We will reply in the app within one working day." })}>
          Report a problem
        </Button>
      </Stack>
    </Stack>
  );
}
