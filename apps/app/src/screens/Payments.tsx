import { AmountDisplay, Avatar, Button, Card, Heading, List, ListItem, PageHeader, RecipientRow, Stack, formatDate } from "@leeward/react";
import { go } from "../router.ts";
import { useStore } from "../store.tsx";

/** Payments home: start a transfer, pay someone you know, and see what goes out next. */
export function Payments() {
  const { state } = useStore();
  return (
    <Stack gap="lg">
      <PageHeader title="Payments" />
      <Button size="xl" fullWidth iconStart="send" onClick={() => go("send")}>Send money</Button>

      <Stack as="section" gap="sm" aria-labelledby="people">
        <Heading level={2} size="h4" id="people">Pay again</Heading>
        <Card padding="none">
          <List aria-labelledby="people">
            {state.recipients.map((r, i) => (
              <RecipientRow key={r.iban} {...r} locale="en-US" onClick={() => go(`send/${i}`)} />
            ))}
          </List>
        </Card>
      </Stack>

      <Stack as="section" gap="sm" aria-labelledby="scheduled">
        <Heading level={2} size="h4" id="scheduled">Scheduled and direct debits</Heading>
        <Card padding="none">
          <List aria-labelledby="scheduled">
            {state.upcoming.map((u) => (
              <ListItem
                key={u.id}
                leading={<Avatar name={u.name} icon={u.icon} size="sm" decorative />}
                title={u.name}
                description={`${formatDate(u.date, "en-US", "short")}, ${u.kind.toLowerCase()}`}
                trailing={<AmountDisplay value={u.amount} currency="TRY" locale="en-US" direction="outgoing" size="sm" />}
              />
            ))}
          </List>
        </Card>
      </Stack>
    </Stack>
  );
}
