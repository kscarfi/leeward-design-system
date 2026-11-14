# EmptyState

Shown when a list or search has nothing to show yet.

## When to use

- Empty lists, no search results, first-time screens.

## When not to use

- Errors: use Alert.

## Content guidelines

- Title says what is missing: "No payments yet".
- Description says what people can do next.

## Do

- Offer one clear action when there is one.

## Don't

- Do not blame people for an empty state.

## Accessibility

- A real heading at the level you choose. The illustration is decorative.

## Example

```tsx
import { Button, EmptyState } from "@leeward/react";

export function NoPayments() {
  return <EmptyState icon="wallet-money" title="No payments yet" description="Your payments show up here." action={<Button iconStart="send">Send money</Button>} />;
}
```
