import { Avatar, Button, Card, Heading, Icon, List, ListItem, PageHeader, Select, Stack, Switch, Text, useToast } from "@leeward/react";
import { useState } from "react";
import { USER } from "../data.ts";
import { go } from "../router.ts";

const MONTHS = ["October 2026", "September 2026", "August 2026"];

export function Profile() {
  const toast = useToast();
  const [faceId, setFaceId] = useState(true);
  const [push, setPush] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [month, setMonth] = useState(MONTHS[0]!);

  return (
    <Stack gap="lg">
      <PageHeader title="Profile" onBack={() => go("home")} backLabel="Back to home" />
      <Stack align="center" gap="xs">
        <Avatar name={USER.name} size="xl" decorative />
        <Heading level={2} size="h4">{USER.name}</Heading>
        <Text variant="body-sm" tone="secondary">{USER.email}</Text>
      </Stack>

      <Stack as="section" gap="sm" aria-labelledby="security">
        <Heading level={2} size="h4" id="security">Security</Heading>
        <Card padding="md">
          <Stack gap="md">
            <Switch label="Log in with Face ID" checked={faceId} onCheckedChange={setFaceId} />
            <Switch label="Notifications for every payment" checked={push} onCheckedChange={setPush} />
            <Switch label="News and offers" hint="We never share your details." checked={marketing} onCheckedChange={setMarketing} />
          </Stack>
        </Card>
        <Card padding="none">
          <List>
            <ListItem leading={<Icon name="password" />} title="Change passcode" onClick={() => toast.show({ title: "Passcode changed", tone: "success" })} chevron />
            <ListItem leading={<Icon name="smartphone" />} title="Devices" description="This iPhone, last used now" onClick={() => toast.show({ title: "You are logged in on 1 device" })} chevron />
          </List>
        </Card>
      </Stack>

      <Stack as="section" gap="sm" aria-labelledby="statements">
        <Heading level={2} size="h4" id="statements">Statements</Heading>
        <Card padding="md">
          <Stack gap="md">
            <Select label="Month" value={month} onValueChange={setMonth} options={MONTHS.map((m) => ({ value: m, label: m }))} />
            <Button variant="outline" iconStart="download" fullWidth onClick={() => toast.show({ title: "Statement saved", description: `Everyday account, ${month}.pdf`, tone: "success" })}>
              Download PDF
            </Button>
          </Stack>
        </Card>
      </Stack>

      <Card padding="none">
        <List>
          <ListItem leading={<Icon name="chat" />} title="Help" description="Chat with us, every day 08:00 to 22:00" onClick={() => toast.show({ title: "An agent will reply in a few minutes" })} chevron />
          <ListItem leading={<Icon name="document" />} title="Legal" description="Agreements, fees and privacy" onClick={() => toast.show({ title: "Opened in your browser" })} chevron />
        </List>
      </Card>
      <Button variant="ghost" iconStart="logout" fullWidth onClick={() => toast.show({ title: "You are logged out", description: "Log in with Face ID or your passcode." })}>
        Log out
      </Button>
    </Stack>
  );
}
