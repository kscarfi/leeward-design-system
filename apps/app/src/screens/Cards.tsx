import { Banner, Card, Heading, Icon, List, ListItem, PageHeader, PaymentCard, Stack, Switch, useToast } from "@leeward/react";
import { useState } from "react";
import { go } from "../router.ts";

export function Cards() {
  const toast = useToast();
  const [frozen, setFrozen] = useState(false);
  const [online, setOnline] = useState(true);
  const [contactless, setContactless] = useState(true);
  const later = (what: string) => toast.show({ title: `${what} is not part of this demo` });

  return (
    <Stack gap="lg">
      <PageHeader title="Cards" onBack={() => go("home")} backLabel="Back to home" />
      <PaymentCard name="Everyday debit" last4="4821" expiry="08/28" holder="Ece Kaya" type="Debit" frozen={frozen} locale="en-US" />
      {frozen && <Banner tone="info">Your card is frozen. Payments and cash withdrawals are declined until you unfreeze it.</Banner>}

      <Card padding="md">
        <Stack gap="md">
          <Switch
            label="Freeze card"
            hint="Stops every payment right away. Unfreeze any time."
            checked={frozen}
            onCheckedChange={(on) => {
              setFrozen(on);
              toast.show({ title: on ? "Card frozen" : "Card unfrozen", tone: on ? "neutral" : "success" });
            }}
          />
          <Switch label="Online payments" checked={online} onCheckedChange={setOnline} disabled={frozen} />
          <Switch label="Contactless payments" checked={contactless} onCheckedChange={setContactless} disabled={frozen} />
        </Stack>
      </Card>

      <Stack as="section" gap="sm" aria-labelledby="manage">
        <Heading level={2} size="h4" id="manage">Manage</Heading>
        <Card padding="none">
          <List>
            <ListItem title="Show PIN" description="After Face ID" leading={<Icon name="password" />} onClick={() => later("Showing the PIN")} chevron />
            <ListItem title="Spending limits" description="TRY 15,000 a day" leading={<Icon name="tuning" />} onClick={() => later("Spending limits")} chevron />
            <ListItem title="Replace card" description="Lost, stolen or damaged" leading={<Icon name="card-transfer" />} onClick={() => later("Replacing a card")} chevron />
          </List>
        </Card>
      </Stack>
    </Stack>
  );
}
