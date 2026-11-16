import { AmountDisplay, Card, Heading, PageHeader, SavingsGoal, SegmentedControl, SpendingBreakdown, Stack, Text } from "@leeward/react";
import { useState } from "react";
import { spending } from "../data.ts";
import { useStore } from "../store.tsx";
import { GoalSheet } from "./Sheets.tsx";

const PERIODS = { week: "Spending this week", month: "Spending in November", year: "Spending in 2026" } as const;
type Period = keyof typeof PERIODS;

export function Savings() {
  const { state } = useStore();
  const [period, setPeriod] = useState<Period>("month");
  const [goal, setGoal] = useState<string | null>(null);
  const { savings } = state.accounts;

  return (
    <Stack gap="lg">
      <PageHeader title="Savings" />
      <Card padding="md">
        <Stack gap="2xs">
          <Text variant="label-md">{savings.name}</Text>
          <AmountDisplay value={savings.balance} currency="TRY" locale="en-US" size="lg" />
          <Text variant="body-sm" tone="secondary">{`${savings.type}. Interest is paid on the 1st of each month.`}</Text>
        </Stack>
      </Card>

      <Stack as="section" gap="sm" aria-labelledby="goals">
        <Heading level={2} size="h4" id="goals">Goals</Heading>
        {state.goals.map((g) => (
          <SavingsGoal
            key={g.id}
            name={g.name}
            icon={g.icon}
            saved={g.saved}
            target={g.target}
            currency="TRY"
            locale="en-US"
            {...(g.targetDate ? { targetDate: g.targetDate } : {})}
            {...(g.saved < g.target ? { onAddMoney: () => setGoal(g.id) } : {})}
            headingLevel={3}
          />
        ))}
      </Stack>

      <Stack as="section" gap="sm" aria-labelledby="spending">
        <Heading level={2} size="h4" id="spending">Spending</Heading>
        <SegmentedControl
          label="Period"
          fullWidth
          value={period}
          onValueChange={(value) => setPeriod(value as Period)}
          options={[
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
            { value: "year", label: "Year" },
          ]}
        />
        <SpendingBreakdown title={PERIODS[period]} categories={spending[period]!} currency="TRY" locale="en-US" headingLevel={3} />
      </Stack>

      <GoalSheet goal={goal} onOpenChange={(open) => !open && setGoal(null)} />
    </Stack>
  );
}
