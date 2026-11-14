# @leeward/react

React components and banking patterns of the [Leeward Design System](https://github.com/kscarfi/leeward-design-system), designed by Kemal Salih Carfi. Accessible by default (WCAG 2.2 AA), themed by [`@leeward/tokens`](https://www.npmjs.com/package/@leeward/tokens), multi-brand, light and dark.

```bash
npm install @leeward/react react react-dom
```

## Setup

Load the fonts and styles once at the root, pick a brand and a mode, and add the two providers:

```tsx
import "@leeward/react/fonts.css";
import "@leeward/react/styles.css";
import { Button, ToastProvider, TooltipProvider } from "@leeward/react";

export function App() {
  return (
    <div data-brand="leeward" data-theme="light">
      <TooltipProvider>
        <ToastProvider>
          <Button>Send money</Button>
        </ToastProvider>
      </TooltipProvider>
    </div>
  );
}
```

`styles.css` includes the tokens, base styles and every component's CSS. `fonts.css` loads Plus Jakarta Sans and IBM Plex Mono from Google Fonts; self-host them if you prefer.

## What is inside

- **32 components**: Accordion, Alert, Avatar, Badge, Button, Card, Checkbox, Chip, Dialog, Divider, DropdownMenu, EmptyState, Heading, Icon, IconButton, Link, ListItem, ProgressBar, RadioGroup, SegmentedControl, Select, Sheet, Skeleton, Spinner, Stepper, Switch, Tabs, Text, TextField, Textarea, Toast and Tooltip.
- **7 banking patterns**: AmountDisplay, AmountInput, BalanceHeader, QuickActions, TransactionRow, AccountCard, OTPInput.
- **Icons**: 142 Solar icons in linear, bold and duotone.
- One control scale: a Button, TextField, Select and SegmentedControl of the same size are exactly the same height.

Every component has docs with do and don't rules, accessibility notes and examples. Agents can read the full rules in [AGENTS.md](https://github.com/kscarfi/leeward-design-system/blob/main/AGENTS.md) or through [`@leeward/mcp-server`](https://www.npmjs.com/package/@leeward/mcp-server).

## Requirements

React 19. Ships as an ES module with TypeScript types. Marked `"use client"` for frameworks with server components.

## License

MIT. Icons: Solar Icons Set by 480 Design, CC BY 4.0. Fonts: SIL Open Font License.
