import { AccountCard, BalanceHeader, Button, Card, Chip, Heading, IconButton, Indicator, List, QuickActions, Stack, Text, TransactionRow, useToast } from "@leeward/react";
import { useState } from "react";
import { accounts, transactions } from "../data.ts";
import { go } from "../router.ts";

type Filter = "all" | "incoming" | "outgoing";

export function Home() {
  const toast = useToast();
  const [filter, setFilter] = useState<Filter>("all");
  const shown = transactions.filter((t) => filter === "all" || t.direction === filter);
  const notInDemo = (what: string) => toast.show({ title: `${what} is not part of this demo`, description: "Try Send, Cards or Savings." });

  return (
    <Stack gap="lg">
      <Stack as="header" direction="horizontal" justify="between" align="center">
        <Stack gap="3xs">
          <Text variant="body-sm" tone="secondary">Good morning</Text>
          <Heading level={1} size="title-xs">Ece Kaya</Heading>
        </Stack>
        <Indicator dot tone="danger" label="New notifications">
          <IconButton icon="bell" label="Notifications" variant="outline" onClick={() => notInDemo("Notifications")} />
        </Indicator>
      </Stack>

      <BalanceHeader label="Total balance" balance={accounts.everyday.balance + accounts.savings.balance} currency="TRY" locale="en-US" meta="Updated just now" />

      <QuickActions
        label="Quick actions"
        actions={[
          { label: "Send", icon: "send", onClick: () => go("payments") },
          { label: "Request", icon: "hand-money", onClick: () => notInDemo("Requesting money") },
          { label: "Top up", icon: "wallet-money", onClick: () => notInDemo("Top up") },
          { label: "Pay bills", icon: "bill", onClick: () => notInDemo("Paying bills") },
        ]}
      />

      <AccountCard
        headingLevel={2}
        name={accounts.everyday.name}
        type={accounts.everyday.type}
        iban={accounts.everyday.iban}
        balance={accounts.everyday.balance}
        currency="TRY"
        locale="en-US"
        actions={[
          { label: "Send", icon: "send", onClick: () => go("payments") },
          { label: "Card", icon: "card", onClick: () => go("cards") },
        ]}
      />

      <Stack as="section" gap="sm" aria-labelledby="activity">
        <Stack direction="horizontal" justify="between" align="center">
          <Heading level={2} size="h4" id="activity">Recent activity</Heading>
          <Button variant="ghost" size="sm" onClick={() => go("savings")}>Spending</Button>
        </Stack>
        <Stack direction="horizontal" gap="xs" wrap role="group" aria-label="Filter activity">
          <Chip selected={filter === "all"} onSelectedChange={() => setFilter("all")}>All</Chip>
          <Chip selected={filter === "incoming"} onSelectedChange={() => setFilter("incoming")}>Money in</Chip>
          <Chip selected={filter === "outgoing"} onSelectedChange={() => setFilter("outgoing")}>Money out</Chip>
        </Stack>
        <Card padding="none">
          <List aria-label="Transactions">
            {shown.map((t) => (
              <TransactionRow
                key={t.id}
                merchant={t.merchant}
                category={t.category}
                icon={t.icon}
                date={t.date}
                amount={t.amount}
                direction={t.direction}
                {...(t.status ? { status: t.status } : {})}
                currency="TRY"
                locale="en-US"
                onClick={() => go(`activity/${t.id}`)}
              />
            ))}
          </List>
        </Card>
      </Stack>
    </Stack>
  );
}
