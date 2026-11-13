## What changed

<!-- One or two sentences. Say what the user or developer gets, not what the code does. -->

## Why

<!-- Link the issue or ADR if there is one. -->

## Accessibility checklist

- [ ] Every interactive element is reachable and operable by keyboard
- [ ] Every interactive element has a visible focus state
- [ ] Every interactive element has an accessible name
- [ ] Meaning is never carried by color alone (icon and text go with it)
- [ ] Text and UI contrast meet WCAG 2.2 AA in light and dark themes
- [ ] Touch targets are at least 44 by 44 px
- [ ] Motion respects `prefers-reduced-motion`
- [ ] axe reports zero violations on the affected stories

## Design system checklist

- [ ] No raw hex, rgb or hsl values in components
- [ ] No spacing values off the 4px scale
- [ ] Components use semantic or component tokens only, never primitives
- [ ] Amounts use tabular figures and locale formatting
- [ ] Copy is short, uses "you", and has no em dashes
- [ ] `Name.docs.md` and stories updated for any API change
- [ ] ADR added in `docs/decisions/` if someone might later ask "why?"
- [ ] `docs/build-log.md` updated
