import { Card, EmptyState, Icon, List, ListItem, PageHeader, Stack, formatDate } from "@leeward/react";
import { useEffect } from "react";
import { go } from "../router.ts";
import { useStore } from "../store.tsx";

export function Notifications() {
  const { state, dispatch } = useStore();
  // Opening the inbox marks everything read, so the count on the bell clears.
  const unread = new Set(state.notices.filter((n) => !n.read).map((n) => n.id));
  useEffect(() => {
    dispatch({ type: "read" });
  }, [dispatch]);

  return (
    <Stack gap="lg">
      <PageHeader title="Notifications" onBack={() => go("home")} backLabel="Back to home" />
      {state.notices.length === 0 ? (
        <EmptyState icon="bell" title="No notifications" description="We tell you here about payments and your account." headingLevel={2} />
      ) : (
        <Card padding="none">
          <List aria-label="Notifications">
            {state.notices.map((n) => (
              <ListItem
                key={n.id}
                leading={<Icon name={n.icon} />}
                title={unread.has(n.id) ? `New: ${n.title}` : n.title}
                description={`${n.body} ${formatDate(n.date, "en-US", "short")}.`}
                {...(n.id === "n1" ? { onClick: () => go("cards"), chevron: true } : {})}
              />
            ))}
          </List>
        </Card>
      )}
    </Stack>
  );
}
