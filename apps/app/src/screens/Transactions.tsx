import { AmountDisplay, Card, Chip, EmptyState, Heading, List, PageHeader, SearchField, Stack, Text, TransactionRow } from "@leeward/react";
import { useState } from "react";
import { go } from "../router.ts";
import { useStore } from "../store.tsx";
import { dayLabel, txRowProps } from "./shared.tsx";

const FILTERS = { all: "All", incoming: "Money in", outgoing: "Money out", pending: "Pending" } as const;
type Filter = keyof typeof FILTERS;

export function Transactions() {
  const { state } = useStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const q = query.toLocaleLowerCase("tr-TR").trim();
  const shown = state.transactions.filter(
    (t) =>
      (filter === "all" || (filter === "pending" ? t.status === "pending" : t.direction === filter)) &&
      (!q || `${t.merchant} ${t.category} ${t.note ?? ""}`.toLocaleLowerCase("tr-TR").includes(q)),
  );
  // Declined payments never left the account, so they do not count.
  const month = state.transactions.filter((t) => t.date.getMonth() === 10 && t.status !== "declined");
  const moneyIn = month.filter((t) => t.direction === "incoming").reduce((sum, t) => sum + t.amount, 0);
  const moneyOut = month.filter((t) => t.direction === "outgoing").reduce((sum, t) => sum + t.amount, 0);
  const groups = shown.reduce<Record<string, typeof shown>>((acc, t) => ((acc[dayLabel(t.date)] ??= []).push(t), acc), {});

  return (
    <Stack gap="lg">
      <PageHeader title="Activity" onBack={() => go("home")} backLabel="Back to home" />
      <Card padding="md">
        <Stack direction="horizontal" justify="between" gap="md">
          <Stack gap="3xs">
            <Text variant="caption" tone="secondary">In this November</Text>
            <AmountDisplay value={moneyIn} currency="TRY" locale="en-US" direction="incoming" size="md" />
          </Stack>
          <Stack gap="3xs" align="end">
            <Text variant="caption" tone="secondary">Out this November</Text>
            <AmountDisplay value={moneyOut} currency="TRY" locale="en-US" direction="outgoing" size="md" />
          </Stack>
        </Stack>
      </Card>
      <SearchField label="Search activity" placeholder="Merchant, category or note" value={query} onValueChange={setQuery} />
      <Stack direction="horizontal" gap="xs" wrap role="group" aria-label="Filter activity">
        {(Object.keys(FILTERS) as Filter[]).map((key) => (
          <Chip key={key} selected={filter === key} onSelectedChange={() => setFilter(key)}>{FILTERS[key]}</Chip>
        ))}
      </Stack>
      {shown.length === 0 ? (
        <EmptyState icon="search" title="Nothing matches" description="Try another word, or clear the filter." headingLevel={2} />
      ) : (
        Object.entries(groups).map(([day, items]) => (
          <Stack key={day} as="section" gap="xs" aria-label={day}>
            <Heading level={2} size="h6" tone="muted">{day}</Heading>
            <Card padding="none">
              <List>
                {items.map((t) => (
                  <TransactionRow key={t.id} {...txRowProps(t)} onClick={() => go(`activity/${t.id}`)} />
                ))}
              </List>
            </Card>
          </Stack>
        ))
      )}
    </Stack>
  );
}
