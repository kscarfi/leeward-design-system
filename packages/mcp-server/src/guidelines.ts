// Design rules for people and agents. Single source for DESIGN.md and the MCP get_guidelines tool.

export interface Guideline {
  title: string;
  summary: string;
  rules: string[];
  /** Short correct example, when one helps. */
  example?: string;
}

export const guidelines: Record<string, Guideline> = {
  workflow: {
    title: "Agent workflow",
    summary: "How an agent should build a Leeward screen. The full guide is AGENTS.md in the repository root.",
    rules: [
      "Read DESIGN.md once, and AGENTS.md for the decision table, layout, banking and copy rules.",
      "For each screen: search_components for every need, get_component for each pick, then write code with only @leeward/react components and var(--lw-*) semantic tokens.",
      "Start from a recipe in docs/recipes when one is close: HomeScreen, TransferFlow, TransactionDetails, SettingsScreen, ScreenStates.",
      "Build the loading, empty and error states with every data view.",
      "Run validate_ui on the result and fix every issue before finishing.",
      "Check it in leeward and business, light and dark, at 360 and 1280 px.",
    ],
  },
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
      "Never reference primitive names such as --lw-color-indigo-600 or --lw-space-4. They are not emitted and lint rejects them.",
      "Spacing: --lw-space-3xs (2px), 2xs (4), xs-tight (6), xs (8), sm-tight (10), sm (12), md (16), md-loose (20), lg (24), xl (32), 2xl (48), 3xl (64), 4xl (80).",
      "Radius: --lw-radius-control for inputs and buttons, --lw-radius-card for cards, --lw-radius-dialog for dialogs and sheets, --lw-radius-pill for chips and badges. Brands scale these.",
      "If a token is missing, propose one. Do not hardcode.",
    ],
    example: ".panel { padding: var(--lw-space-lg); background: var(--lw-fill-surface-raised); border-radius: var(--lw-radius-card); box-shadow: var(--lw-elevation-200); }",
  },
  color: {
    title: "Color",
    summary: "Ink for text, Iris for actions, Teal for money in, Coral for decoration only.",
    rules: [
      "Text: --lw-text-default, -secondary, -tertiary. All pass AA on every surface in both themes.",
      "Surfaces: --lw-fill-surface-canvas behind everything, then --lw-fill-surface-default, -raised for cards and -overlay for dialogs and menus. In dark mode each step up is lighter.",
      "Roles: primary, secondary, neutral, info, success, warning, attention, danger. Each has fill (default, emphasis, strong, subtle, subtler, subtlest, weak, on-default), text, icon and border tokens, for example --lw-fill-primary-default with --lw-fill-primary-on-default. Use the Button component rather than styling buttons.",
      "Danger red is for real errors and irreversible actions only.",
      "The accent (--lw-fill-accent-default) is decorative: never text, never the only signal of state, under about 10% of a screen.",
      "State is never carried by color alone. Pair it with an icon and words.",
    ],
  },
  typography: {
    title: "Typography",
    summary: "Plus Jakarta Sans for display and text, IBM Plex Mono for codes. Type roles, not raw sizes.",
    rules: [
      "Use Heading (level is required) and Text components, or --lw-type-<role>-* tokens.",
      "Roles: display lg/md, title xl to xs, subtitle lg/md/sm, heading h1 to h6, body lg/md/sm, label lg/md/sm/xs, caption, badge, button lg/md/sm/xs, amount xl/lg/md/sm, code. Display, title and amount xl/lg are fluid between 360 and 1280 px.",
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
      "Mobile screens: max width about 440px, side padding --lw-space-md. Dialog turns into a bottom sheet under 640 px.",
      "Control heights: --lw-size-control-xs 32, sm 36, md 44 (default), lg 48, xl 56. On touch screens every target keeps a 44 px hit area.",
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
      "Durations: --lw-motion-duration-instant (100ms), fast (150), base (200), slow (300), slower (400).",
      "Easing: --lw-motion-easing-standard, -enter for elements arriving, -exit for leaving.",
      "No looping animation except loading indicators.",
    ],
  },
  "dark-mode": {
    title: "Themes and dark mode",
    summary: "Brands and modes swap semantic tokens. Components never change.",
    rules: [
      "Set data-brand (leeward, business or a generated partner) and data-theme (light, dark or auto) on a container. Brands and modes can sit side by side.",
      "A brand chooses a ramp per role, a roundness and a density. pnpm theme:generate builds a partner brand from one color and refuses it if any pair misses AA.",
      "Never write theme-specific CSS in components. If something looks wrong in dark, the token mapping changes.",
      "Dark surfaces get lighter as they rise: canvas, default, raised, overlay.",
    ],
  },
};

export const topics = Object.keys(guidelines);
