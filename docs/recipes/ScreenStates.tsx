// Recipe: the three states every data screen needs: loading, empty and error. Type-checked in CI.
import type { ReactNode } from "react";
import { Alert, Button, Card, EmptyState, Skeleton } from "@leeward/react";

export function ActivityLoading() {
  return (
    <Card padding="md" role="status" aria-busy="true" aria-label="Loading transactions">
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "var(--lw-space-sm)" }}>
          <Skeleton shape="circle" />
          <div style={{ flex: 1 }}>
            <Skeleton lines={2} />
          </div>
        </div>
      ))}
    </Card>
  );
}

export function ActivityEmpty() {
  return <EmptyState icon="wallet-money" title="No payments yet" description="Your payments and transfers show up here as soon as you make them." action={<Button iconStart="send">Send money</Button>} />;
}

export function ActivityError({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert tone="danger" title="We could not load your activity" live="alert" actions={<Button size="sm" variant="outline" iconStart="refresh" onClick={onRetry}>Try again</Button>}>
      Your money is safe. Check your connection and try again.
    </Alert>
  );
}

/** Pick the state first, then render the list itself as children. */
export function Activity({ state, onRetry, children }: { state: "loading" | "empty" | "error" | "ready"; onRetry: () => void; children: ReactNode }) {
  if (state === "loading") return <ActivityLoading />;
  if (state === "empty") return <ActivityEmpty />;
  if (state === "error") return <ActivityError onRetry={onRetry} />;
  return <>{children}</>;
}
