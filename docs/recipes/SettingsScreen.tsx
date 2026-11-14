// Recipe: settings. Grouped lists, switches for instant settings, links to sub-pages. Type-checked in CI.
import { Card, Heading, Icon, List, ListItem, Switch } from "@leeward/react";

export function SettingsScreen() {
  return (
    <main style={{ maxWidth: "var(--lw-size-content-sm)", margin: "0 auto", padding: "var(--lw-space-lg) var(--lw-space-md)", display: "grid", gap: "var(--lw-space-lg)" }}>
      <Heading level={1} size="title-xs">Settings</Heading>
      <section aria-labelledby="security" style={{ display: "grid", gap: "var(--lw-space-sm)" }}>
        <Heading level={2} size="h5" id="security">Security</Heading>
        <Card padding="none">
          <List>
            <ListItem title="Passcode" description="Last changed 3 months ago" leading={<Icon name="password" />} href="/settings/passcode" chevron />
            <ListItem title="Face ID" leading={<Icon name="face-id" />} trailing={<Switch label="Use Face ID to sign in" defaultChecked />} />
          </List>
        </Card>
      </section>
      <section aria-labelledby="cards" style={{ display: "grid", gap: "var(--lw-space-sm)" }}>
        <Heading level={2} size="h5" id="cards">Cards</Heading>
        <Card padding="md">
          <Switch label="Online card payments" hint="Turn off to block payments on websites and apps" defaultChecked />
          <Switch label="Contactless payments" defaultChecked />
        </Card>
      </section>
    </main>
  );
}
