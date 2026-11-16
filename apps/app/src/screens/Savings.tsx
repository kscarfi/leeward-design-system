import { Heading, PageHeader, SavingsGoal, SegmentedControl, SpendingBreakdown, Stack, useToast } from "@leeward/react";
import { useState } from "react";
import { spending } from "../data.ts";
import { go } from "../router.ts";

const PERIODS = { week: "this week", month: "November", year: "2026" } as const;
type Period = keyof typeof PERIODS;

export function Savings() {
  const toast = useToast();
  const [period, setPeriod] = useState<Period>("month");
  const addMoney = (goal: string) => toast.show({ title: `Add money to ${goal}`, description: "Moving money between your accounts is not part of this demo." });

  return (
    <Stack gap="lg">
      <PageHeader title="Savings and spending" onBack={() => go("home")} backLabel="Back to home" />

      <Stack as="section" gap="sm" aria-labelledby="goals">
        <Heading level={2} size="h4" id="goals">Goals</Heading>
        <SavingsGoal name="Holiday fund" icon="airplane" saved={18500} target={30000} currency="TRY" locale="en-US" targetDate={new Date(2027, 5, 1)} onAddMoney={() => addMoney("Holiday fund")} headingLevel={3} />
        <SavingsGoal name="New laptop" icon="laptop" saved={42000} target={42000} currency="TRY" locale="en-US" onAddMoney={() => addMoney("New laptop")} headingLevel={3} />
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
        <SpendingBreakdown title={`Spending ${PERIODS[period] === "this week" ? "this week" : `in ${PERIODS[period]}`}`} categories={spending[period]!} currency="TRY" locale="en-US" headingLevel={3} />
      </Stack>
    </Stack>
  );
}
