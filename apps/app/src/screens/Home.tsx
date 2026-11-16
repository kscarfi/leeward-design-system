import { AccountCard, AmountDisplay, Avatar, BalanceHeader, Button, Card, Heading, IconButton, Indicator, List, ListItem, QuickActions, SegmentedControl, Stack, Text, TransactionRow, formatDate, useToast } from "@leeward/react";
import { useState } from "react";
import { USER, type AccountId } from "../data.ts";
import { go } from "../router.ts";
import { copy, useStore } from "../store.tsx";
import { AddMoneySheet, RequestSheet } from "./Sheets.tsx";
import { txRowProps } from "./shared.tsx";

type View = "all" | AccountId;

export function Home() {
  const { state } = useStore();
  const toast = useToast();
  const [view, setView] = useState<View>("all");
  const [sheet, setSheet] = useState<"add" | "request" | null>(null);
  const unread = state.notices.filter((n) => !n.read).length;
  const { everyday, savings } = state.accounts;
  const balance = view === "all" ? everyday.balance + savings.balance : state.accounts[view].balance;
  const recent = state.transactions.filter((t) => view === "all" || t.account === view).slice(0, 4);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <Stack gap="lg">
      <Stack as="header" direction="horizontal" justify="between" align="center">
        <Stack direction="horizontal" gap="sm" align="center">
          <Avatar name={USER.name} size="md" decorative />
          <Stack gap="none">
            <Text variant="body-sm" tone="secondary">{greeting}</Text>
            <Heading level={1} size="title-xs">{USER.first}</Heading>
          </Stack>
        </Stack>
        <Stack direction="horizontal" gap="xs">
          <Indicator count={unread} label={`${unread} unread`}>
            <IconButton icon="bell" label="Notifications" variant="outline" onClick={() => go("notifications")} />
          </Indicator>
          <IconButton icon="user" label="Profile and settings" variant="outline" onClick={() => go("profile")} />
        </Stack>
      </Stack>

      <Stack gap="sm">
        <SegmentedControl
          label="Show balance for"
          size="sm"
          fullWidth
          value={view}
          onValueChange={(value) => setView(value as View)}
          options={[
            { value: "all", label: "All accounts" },
            { value: "everyday", label: everyday.name },
            { value: "savings", label: savings.name },
          ]}
        />
        <BalanceHeader label={view === "all" ? "Total balance" : `${state.accounts[view].name} balance`} balance={balance} currency="TRY" locale="en-US" meta="Updated just now" />
      </Stack>

      <QuickActions
        label="Quick actions"
        actions={[
          { label: "Top up", icon: "plus", onClick: () => setSheet("add") },
          { label: "Send", icon: "send", onClick: () => go("send") },
          { label: "Request", icon: "hand-money", onClick: () => setSheet("request") },
          { label: "Cards", icon: "card", onClick: () => go("cards") },
        ]}
      />

      {view !== "savings" && (
        <AccountCard
          headingLevel={2}
          name={everyday.name}
          type={everyday.type}
          iban={everyday.iban}
          balance={everyday.balance}
          currency="TRY"
          locale="en-US"
          actions={[
            { label: "Send", icon: "send", onClick: () => go("send") },
            { label: "Copy IBAN", icon: "copy", onClick: () => void copy(everyday.iban).then(() => toast.show({ title: "IBAN copied", description: everyday.iban })) },
          ]}
        />
      )}

      <Stack as="section" gap="sm" aria-labelledby="upcoming">
        <Heading level={2} size="h4" id="upcoming">Upcoming</Heading>
        <Card padding="none">
          <List aria-labelledby="upcoming">
            {state.upcoming.slice(0, 3).map((u) => (
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

      <Stack as="section" gap="sm" aria-labelledby="activity">
        <Stack direction="horizontal" justify="between" align="center">
          <Heading level={2} size="h4" id="activity">Recent activity</Heading>
          <Button variant="ghost" size="sm" iconEnd="chevron-right" onClick={() => go("transactions")}>See all</Button>
        </Stack>
        <Card padding="none">
          <List aria-labelledby="activity">
            {recent.map((t) => (
              <TransactionRow key={t.id} {...txRowProps(t)} onClick={() => go(`activity/${t.id}`)} />
            ))}
          </List>
        </Card>
      </Stack>

      {view !== "everyday" && (
        <Card padding="none">
          <List>
            <ListItem leading={<Avatar name="Savings" icon="piggy-bank" size="sm" decorative />} title={savings.name} description={savings.type} trailing={<AmountDisplay value={savings.balance} currency="TRY" locale="en-US" size="sm" />} href="#/savings" chevron />
          </List>
        </Card>
      )}

      <AddMoneySheet open={sheet === "add"} onOpenChange={(open) => setSheet(open ? "add" : null)} />
      <RequestSheet open={sheet === "request"} onOpenChange={(open) => setSheet(open ? "request" : null)} />
    </Stack>
  );
}
