import { AmountDisplay, Avatar, BalanceHeader, Button, Card, Heading, IconButton, Indicator, List, ListItem, Stack, Text, TransactionRow, formatDate } from "@leeward/react";
import { useState } from "react";
import { USER } from "../data.ts";
import { go } from "../router.ts";
import { useStore } from "../store.tsx";
import { AddMoneySheet, RequestSheet } from "./Sheets.tsx";
import { txRowProps } from "./shared.tsx";

/** Home, with Wise as the benchmark: one big number, three clear actions, then accounts and activity with room to breathe. */
export function Home() {
  const { state } = useStore();
  const [sheet, setSheet] = useState<"add" | "request" | "details" | null>(null);
  const unread = state.notices.filter((n) => !n.read).length;
  const { everyday, savings } = state.accounts;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <Stack gap="xl">
      <Stack as="header" direction="horizontal" justify="between" align="center">
        <Stack direction="horizontal" gap="sm" align="center">
          <Avatar name={USER.name} size="md" decorative />
          <Stack gap="none">
            <Text variant="body-sm" tone="secondary">{greeting}</Text>
            <Heading level={1} size="h4">{USER.first}</Heading>
          </Stack>
        </Stack>
        <Stack direction="horizontal" gap="xs">
          <Indicator count={unread} label={`${unread} unread`}>
            <IconButton icon="bell" label="Notifications" variant="secondary" onClick={() => go("notifications")} />
          </Indicator>
          <IconButton icon="settings" label="Profile and settings" variant="secondary" onClick={() => go("profile")} />
        </Stack>
      </Stack>

      <Stack gap="md">
        <BalanceHeader label="Total balance" balance={everyday.balance + savings.balance} currency="TRY" locale="en-US" meta="Everyday and Savings together" />
        <Stack direction="horizontal" gap="xs">
          <Button shape="pill" fullWidth onClick={() => go("send")}>Send</Button>
          <Button shape="pill" variant="secondary" fullWidth onClick={() => setSheet("add")}>Top up</Button>
          <Button shape="pill" variant="secondary" fullWidth onClick={() => setSheet("request")}>Request</Button>
        </Stack>
      </Stack>

      <Stack as="section" gap="sm" aria-labelledby="accounts">
        <Heading level={2} size="h5" id="accounts">Accounts</Heading>
        <Card padding="none">
          <List aria-labelledby="accounts">
            <ListItem
              leading={<Avatar name={everyday.name} icon="bank" size="md" decorative />}
              title={everyday.name}
              description={`•• ${everyday.iban.slice(-5).replace(" ", "")}`}
              trailing={<AmountDisplay value={everyday.balance} currency="TRY" locale="en-US" size="sm" />}
              onClick={() => setSheet("details")}
            />
            <ListItem
              leading={<Avatar name={savings.name} icon="piggy-bank" size="md" decorative />}
              title={savings.name}
              description="38% a year"
              trailing={<AmountDisplay value={savings.balance} currency="TRY" locale="en-US" size="sm" />}
              href="#/savings"
            />
          </List>
        </Card>
      </Stack>

      <Stack as="section" gap="sm" aria-labelledby="activity">
        <Stack direction="horizontal" justify="between" align="center">
          <Heading level={2} size="h5" id="activity">Transactions</Heading>
          <Button variant="ghost" size="sm" onClick={() => go("transactions")}>See all</Button>
        </Stack>
        <Card padding="none">
          <List aria-labelledby="activity">
            {state.transactions.slice(0, 4).map((t) => (
              <TransactionRow key={t.id} {...txRowProps(t)} onClick={() => go(`activity/${t.id}`)} />
            ))}
          </List>
        </Card>
      </Stack>

      <Stack as="section" gap="sm" aria-labelledby="upcoming">
        <Stack direction="horizontal" justify="between" align="center">
          <Heading level={2} size="h5" id="upcoming">Coming up</Heading>
          <Button variant="ghost" size="sm" onClick={() => go("payments")}>Manage</Button>
        </Stack>
        <Card padding="none">
          <List aria-labelledby="upcoming">
            {state.upcoming.slice(0, 2).map((u) => (
              <ListItem
                key={u.id}
                leading={<Avatar name={u.name} icon={u.icon} size="md" decorative />}
                title={u.name}
                description={`${formatDate(u.date, "en-US", "short")}, ${u.kind.toLowerCase()}`}
                trailing={<AmountDisplay value={u.amount} currency="TRY" locale="en-US" direction="outgoing" size="sm" />}
              />
            ))}
          </List>
        </Card>
      </Stack>

      <AddMoneySheet open={sheet === "add"} onOpenChange={(open) => setSheet(open ? "add" : null)} />
      <RequestSheet open={sheet === "request" || sheet === "details"} title={sheet === "details" ? "Everyday account details" : "Request money"} onOpenChange={(open) => !open && setSheet(null)} />
    </Stack>
  );
}
