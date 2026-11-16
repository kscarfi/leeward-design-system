import { Banner, Button, Card, Dialog, Heading, IconButton, List, PageHeader, PaymentCard, Slider, Stack, SummaryList, Switch, Text, TransactionRow, formatAmount, useToast } from "@leeward/react";
import { useState } from "react";
import { CARD, USER } from "../data.ts";
import { go } from "../router.ts";
import { copy, useStore } from "../store.tsx";
import { money, txRowProps } from "./shared.tsx";

export function Cards() {
  const { state, dispatch } = useStore();
  const toast = useToast();
  const { card } = state;
  const [details, setDetails] = useState(false);
  const [lost, setLost] = useState(false);
  const [limit, setLimit] = useState(card.dailyLimit);
  const payments = state.transactions.filter((t) => t.card === CARD.last4).slice(0, 3);
  const copied = (what: string, value: string) => void copy(value).then(() => toast.show({ title: `${what} copied` }));
  const freeze = (on: boolean) => {
    dispatch({ type: "card", patch: { frozen: on } });
    toast.show({ title: on ? "Card frozen" : "Card unfrozen", description: on ? "Payments and withdrawals are declined." : "You can pay with it again.", tone: on ? "neutral" : "success" });
  };

  return (
    <Stack gap="lg">
      <PageHeader title="Cards" />
      <PaymentCard name="Everyday debit" last4={CARD.last4} expiry={CARD.expiry} holder={USER.name} type="Debit" frozen={card.frozen} locale="en-US" />
      {card.frozen && <Banner tone="info">Your card is frozen. Payments and cash withdrawals are declined until you unfreeze it.</Banner>}

      <Stack direction="horizontal" gap="sm">
        <Button variant="secondary" iconStart={details ? "eye-off" : "eye"} fullWidth onClick={() => setDetails(!details)} aria-expanded={details}>
          {details ? "Hide details" : "Show details"}
        </Button>
        <Button variant="secondary" iconStart={card.frozen ? "unlock" : "lock"} fullWidth onClick={() => freeze(!card.frozen)}>
          {card.frozen ? "Unfreeze" : "Freeze"}
        </Button>
      </Stack>

      {details && (
        <Card padding="md">
          <SummaryList
            items={[
              { label: "Card number", value: <Stack direction="horizontal" gap="2xs" align="center"><Text variant="code">{CARD.number}</Text><IconButton icon="copy" label="Copy card number" size="xs" variant="ghost" onClick={() => copied("Card number", CARD.number)} /></Stack> },
              { label: "Expires", value: <Text variant="code">{CARD.expiry}</Text> },
              { label: "Security code", value: <Text variant="code">{CARD.cvv}</Text>, hint: "Never share it, not even with us" },
            ]}
          />
        </Card>
      )}

      <Stack as="section" gap="sm" aria-labelledby="settings">
        <Heading level={2} size="h4" id="settings">Settings</Heading>
        <Card padding="md">
          <Stack gap="md">
            <Switch label="Online payments" checked={card.online} onCheckedChange={(on) => dispatch({ type: "card", patch: { online: on } })} disabled={card.frozen} />
            <Switch label="Contactless payments" checked={card.contactless} onCheckedChange={(on) => dispatch({ type: "card", patch: { contactless: on } })} disabled={card.frozen} />
            <Switch label="Cash withdrawals" checked={card.atm} onCheckedChange={(on) => dispatch({ type: "card", patch: { atm: on } })} disabled={card.frozen} />
            <Slider
              label="Daily spending limit"
              min={1000}
              max={50000}
              step={1000}
              value={limit}
              onValueChange={setLimit}
              onValueCommit={(value) => {
                dispatch({ type: "card", patch: { dailyLimit: value } });
                toast.show({ title: "Limit updated", description: `${money(value)} a day, from now on.` });
              }}
              formatValue={(value) => formatAmount(value, { currency: "TRY", locale: "en-US", minimumFractionDigits: 0 })}
              showLimits
            />
          </Stack>
        </Card>
      </Stack>

      <Stack as="section" gap="sm" aria-labelledby="card-payments">
        <Stack direction="horizontal" justify="between" align="center">
          <Heading level={2} size="h4" id="card-payments">Card payments</Heading>
          <Button variant="ghost" size="sm" iconEnd="chevron-right" onClick={() => go("transactions")}>See all</Button>
        </Stack>
        <Card padding="none">
          <List aria-labelledby="card-payments">
            {payments.map((t) => (
              <TransactionRow key={t.id} {...txRowProps(t)} onClick={() => go(`activity/${t.id}`)} />
            ))}
          </List>
        </Card>
      </Stack>

      <Button variant="danger" fullWidth iconStart="shield-warning" onClick={() => setLost(true)}>Report lost or stolen</Button>
      <Dialog
        title="Report your card lost or stolen?"
        description="We cancel this card for good and send a new one to your address in 3 to 5 working days. Your PIN stays the same."
        open={lost}
        onOpenChange={setLost}
        actions={
          <>
            <Button variant="ghost" onClick={() => setLost(false)}>Keep my card</Button>
            <Button
              variant="danger"
              onClick={() => {
                dispatch({ type: "card", patch: { frozen: true } });
                setLost(false);
                toast.show({ title: "Card cancelled", description: "Your new card is on its way.", tone: "success" });
              }}
            >
              Cancel card
            </Button>
          </>
        }
      />
    </Stack>
  );
}
