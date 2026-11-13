// Design rules for people and agents. Single source for DESIGN.md and the MCP get_guidelines tool.

export interface Guideline {
  title: string;
  summary: string;
  rules: string[];
  /** Short correct example, when one helps. */
  example?: string;
}

export const guidelines: Record<string, Guideline> = {
  principles: {
    title: "Principles",
    summary: "Four brand principles that every screen follows.",
    rules: [
      "Clear over clever: labels describe outcomes. No icon-only actions for moving money.",
      "Honest numbers: amounts, fees and rates are never hidden or styled down. Fees use the same text size as the amount they belong to.",
      "Calm confidence: restrained motion, generous spacing, red only for real errors.",
      "Accessible by default: WCAG 2.2 AA minimum, APCA reported, 44px touch targets.",
    ],
  },
  tokens: {
    title: "Tokens",
    summary: "Style only with semantic CSS variables. Primitives do not exist in CSS.",
    rules: [
      "Use var(--lw-*) semantic tokens for every color, space, radius, size, type and motion value.",
      "Never write hex, rgb, hsl or oklch values in components or screens.",
      "Never reference primitive names such as --lw-color-iris-600 or --lw-space-4. They are not emitted and lint rejects them.",
      "Spacing: --lw-space-3xs (2px), 2xs (4), xs (8), sm (12), md (16), lg (24), xl (32), 2xl (48), 3xl (64).",
      "Radius: --lw-radius-control for inputs and buttons, --lw-radius-card for cards and dialogs, --lw-radius-pill for chips and badges.",
      "If a token is missing, propose one. Do not hardcode.",
    ],
    example: ".panel { padding: var(--lw-space-lg); background: var(--lw-color-surface-raised); border-radius: var(--lw-radius-card); box-shadow: var(--lw-shadow-1); }",
  },
  color: {
    title: "Color",
    summary: "Ink for text, Iris for actions, Teal for money in, Coral for decoration only.",
    rules: [
      "Text: --lw-color-text-primary, -secondary, -tertiary. All pass AA on every surface in both themes.",
      "Surfaces: --lw-color-bg-canvas behind everything, -surface-default, -surface-raised for cards, -surface-overlay for dialogs.",
      "Actions use --lw-color-action-* tokens. Use the Button component rather than styling buttons.",
      "Danger red is for real errors and irreversible actions only.",
      "Coral (--lw-color-accent-decorative) is decorative: never text, never the only signal of state, under about 10% of a screen.",
      "State is never carried by color alone. Pair it with an icon and words.",
    ],
  },
  typography: {
    title: "Typography",
    summary: "Inter with optical sizing. Type roles, not raw sizes.",
    rules: [
      "Use Heading (level is required) and Text components, or --lw-type-<role>-* tokens.",
      "Roles: display lg/md, heading xl/lg/md/sm/xs, body md/sm, label md/sm, caption, amount lg/md/sm.",
      "Minimum visible text size is 12px (caption).",
      "Every number in an amount, balance or table column uses tabular figures.",
      "One h1 per screen. Do not skip heading levels.",
    ],
  },
  amounts: {
    title: "Amounts and money",
    summary: "Always use AmountDisplay. Direction by sign, never by red.",
    rules: [
      "Render every amount with <AmountDisplay> or formatAmount(). Never format money by hand.",
      "Incoming: plus sign and teal. Outgoing: typographic minus and ink. Outgoing is never red.",
      "Pending money shows a clock icon and the word Pending.",
      "tr-TR with TRY shows ₺1.250,00. en-US with TRY shows TRY 1,250.00.",
      "Show fees next to the amount, at the same text size.",
      "Balances can be hidden. Use BalanceHeader, which includes the toggle.",
      "IBANs are masked on cards (maskIban) and grouped in fours when shown in full (formatIban).",
    ],
    example: '<AmountDisplay value={250} currency="TRY" locale="tr-TR" direction="outgoing" />',
  },
  forms: {
    title: "Forms",
    summary: "Visible labels, hints before, errors after, never placeholders as labels.",
    rules: [
      "Every input has a visible label: TextField, Select, Checkbox, RadioGroup, Switch and OTPInput all require one.",
      "Use hint for format help before typing. Use error for what went wrong and how to fix it.",
      "Amount fields: <TextField label=\"Amount\" prefix=\"₺\" inputMode=\"decimal\" numeric />.",
      "One-time codes: <OTPInput>. Never split a code into several inputs.",
      "Use Switch only for settings that apply immediately. Use Checkbox inside forms.",
      "Do not disable the submit button to hide errors.",
    ],
  },
  errors: {
    title: "Errors and feedback",
    summary: "Say what happened and what to do. Calm, specific, never blaming.",
    rules: [
      "Write: what happened, then what to do. \"This IBAN is too short. Check it and try again.\"",
      "Field errors go next to the field (error prop). Not in a toast.",
      "Toasts confirm completed actions. Danger toasts stay until dismissed.",
      "Use Badge tones for status: neutral, info, success, warning, danger. They include an icon.",
      "When nothing left the account, say so: \"Nothing left your account.\"",
    ],
  },
  layout: {
    title: "Layout",
    summary: "Mobile first, 4px grid, one primary action per screen.",
    rules: [
      "Spacing comes from --lw-space-* only. Stack sections with --lw-space-lg, related items with --lw-space-sm.",
      "Mobile screens: max width about 440px, side padding --lw-space-md.",
      "One primary Button per screen or section. Put the final action full width at the bottom on mobile.",
      "Touch targets are at least 44 by 44px. Components already guarantee this.",
      "Use Card for grouping, List with ListItem or TransactionRow for rows.",
    ],
  },
  copy: {
    title: "Copy",
    summary: "Short, direct, second person. No jargon, no em dashes.",
    rules: [
      "Use \"you\". Say what happens: \"Your money arrives in seconds\", not \"Transfer request is being processed\".",
      "Never use em dashes. Use commas, colons or periods.",
      "No hype words: revolutionary, seamless, magic.",
      "Button labels are verbs with an outcome: \"Send ₺250\", \"Freeze card\".",
      "Dialog titles are questions: \"Freeze your card?\".",
    ],
  },
  accessibility: {
    title: "Accessibility",
    summary: "WCAG 2.2 AA is the floor. The components do most of the work if you use them.",
    rules: [
      "Every interactive element is reachable by keyboard, has a visible focus ring and an accessible name.",
      "IconButton requires label. Icon is hidden unless it has a label.",
      "Never use color alone to carry meaning.",
      "Use semantic elements: headings in order, lists for rows, buttons for actions, links for navigation.",
      "Respect prefers-reduced-motion. The global styles already shorten animations.",
      "Mark loading regions with role=\"status\" and aria-busy while Skeletons show.",
    ],
  },
  motion: {
    title: "Motion",
    summary: "Short and calm. Motion explains, it does not decorate.",
    rules: [
      "Durations: --lw-motion-duration-instant (100ms), fast (150), base (200), slow (300).",
      "Easing: --lw-motion-easing-standard, -enter for elements arriving, -exit for leaving.",
      "No looping animation except loading indicators.",
    ],
  },
  "dark-mode": {
    title: "Themes and dark mode",
    summary: "Themes swap semantic tokens. Components never change.",
    rules: [
      "Set data-theme=\"light\", \"dark\" or \"auto\" on a container. Two themes can sit side by side.",
      "Never write theme-specific CSS in components. If something looks wrong in dark, the token mapping changes.",
      "Dark surfaces get lighter as they rise: canvas, default, raised, overlay.",
    ],
  },
};

export const topics = Object.keys(guidelines);
