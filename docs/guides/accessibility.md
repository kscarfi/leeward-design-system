# Accessibility statement

Leeward aims for WCAG 2.2 level AA in every brand and mode. This page says what is checked, how, and what is not checked yet.

## What is checked on every change

| Check | How |
|---|---|
| Color contrast | A script checks 334 required color pairs per brand and mode against WCAG 2.2 AA; the build fails if one misses. |
| Automated accessibility rules | Every story runs axe (WCAG 2.0, 2.1 and 2.2, A and AA rules) in six brand and mode combinations, in a real browser. |
| Keyboard and names | Interaction tests use roles and accessible names (`getByRole("button", { name: "Send" })`), so a control without a name or role fails. |
| Reflow | Every story is checked for horizontal scrolling at 360 px. |
| Hit areas | A story measures control heights; every control keeps a 44 px hit area. |
| Generated code | `validate_ui` flags missing labels, icon-only money actions and red amounts in code an agent writes. |

## Built into the components

- Every interactive element is reachable by keyboard and shows a visible focus ring from the focus tokens; focus rings also show in forced colors mode.
- Dialogs and sheets trap focus and return it on close; menus, selects and tabs follow the WAI-ARIA patterns (through Radix primitives).
- Amounts are read in words with their direction ("Money out: 85,00 Turkish liras"), masked IBANs as their last four digits.
- State is never shown with color alone.
- Motion respects reduced motion settings.
- Text sizes are in rem and follow the browser font size.

## Not checked yet

Automated tools find only part of real problems. These have not been done and are on the [roadmap](../../ROADMAP.md):

- Manual testing with screen readers (VoiceOver on iOS and macOS, TalkBack, NVDA, JAWS).
- Testing with people who use assistive technology.
- A full manual audit against every WCAG 2.2 success criterion.
- Right-to-left layouts.

## Report a problem

Open an issue with the accessibility label on [GitHub](https://github.com/kscarfi/leeward-design-system/issues/new/choose). Include the component, brand, mode, browser and assistive technology you used.
