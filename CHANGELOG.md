# Changelog

All four packages (`@leeward/react`, `@leeward/tokens`, `@leeward/lint`, `@leeward/mcp-server`) share one version.

## Unreleased

### Fixed

- OTPInput: `onComplete` runs again when a new full code replaces a wrong one, for example a code pasted over a mistyped one. Before, it ran only the first time the field filled.
- SegmentedControl: no vertical scrollbar where scrollbars are always visible (Windows, or macOS with that setting).

### Added

- A [demo app](https://kscarfi.github.io/leeward-design-system/app/) built only from the system, tested with axe in every brand and mode.

## 1.0.0

The first stable version. From here on, the public API follows semantic versioning strictly: anything that removes or renames a component, prop or token, or changes a default, waits for 2.0. See [docs/versioning.md](docs/versioning.md).

### Added

- OTPInput: `onValueChange`, the same name every other input uses.
- BalanceHeader: `masked`, `defaultMasked` and `onMaskedChange`, the same word AccountCard and AmountDisplay use.
- `components.manifest.json` marks deprecated props with `deprecated` and what to use instead, so agents and the MCP server can avoid them.
- Live Storybook at [kscarfi.github.io/leeward-design-system](https://kscarfi.github.io/leeward-design-system/), published on every push to main.
- The [Figma file](https://www.figma.com/community/file/1703881089318257135/leeward-design-system) on Figma Community, with the same components, variants and props as the code.

### Deprecated

These keep working in every 1.x version and are removed in 2.0:

- OTPInput `onChange`: use `onValueChange`.
- BalanceHeader `hidden`, `defaultHidden` and `onHiddenChange`: use `masked`, `defaultMasked` and `onMaskedChange`. `hidden` also clashed with the HTML attribute of the same name.

### Changed

- Text and Heading docs explain that `tone="primary"` means the main text color on Text and the brand color on Heading. The names stay as they are in 1.x.

## 0.3.0

### Added

- **20 components:** DatePicker and Calendar, Combobox, SearchField, NumberInput, Slider, FileUpload, Fieldset, CheckboxGroup, Breadcrumbs, Pagination, NavigationBar, PageHeader, SkipLink, Table, Popover, Banner, AvatarGroup, Indicator, Image and Stack. Each has docs, stories with interaction tests, unit tests, component tokens and English and Turkish copy.
- DropdownMenu: labelled `groups`, one-level submenus (`items`) and `shortcut` hints.
- Tabs: an `icon` per tab. Sheet: `side="start"`. Link: `iconStart` and `iconEnd`. TextField: `endAction` for an interactive control at the end of the field.
- Icons: `iconMeta` with a category, search keywords and reserved meanings for every icon; the icon gallery is searchable.
- Column grid tokens (`--lw-grid-columns-*`, `-gutter-*`, `-margin-*`) for phone, tablet and desktop.
- Guides for foundations, writing and terminology, internationalization, and an accessibility statement.
- Repository: contributing guide, code of conduct, security policy, roadmap, versioning and browser support policy, issue templates.
- IconButton: `shape="rounded"` for a rounded square next to the default pill, with `--lw-icon-button-radius-<size>` tokens.
- Indicator: `anchor` (`circle` or `rectangle`), `placement` (`top` or `bottom`) and a `success` tone, for presence dots on avatars.

### Changed

- Overlays (Combobox, DatePicker, DropdownMenu, Popover, Select) share one surface style. Select's list now uses elevation 500 like the others.
- Alert and Banner share one set of tone styles. NavigationBar counts use Indicator, Pagination arrows use IconButton, and the Calendar's Today button uses Button.
- Stepper decides whether to show every step name from its own width instead of the screen width.

## 0.2.0

### Added

- **Pill shape** for TextField, Select and SegmentedControl (`shape="pill"`), matching the pill Button. Same heights as the rounded shape; new tokens `--lw-input-radius-pill`, `--lw-input-padding-x-pill-<size>` and `--lw-segmented-radius-pill`.
- **Five banking patterns:** SummaryList (transfer review and receipts), RecipientRow (saved recipients), PaymentCard (card artwork with a frozen state), SavingsGoal and SpendingBreakdown. Each has docs, stories with interaction tests and unit tests, and works in every brand and mode.
- Component tokens for the new patterns: `summary-list`, `payment-card` and `spending`.
- `exports` in `components.manifest.json`: every JSX name the package exports.

### Changed

- Icon paths are rounded to one decimal: about 11 KB less gzipped, with no visible difference at icon sizes.

### Fixed

- Brand rules no longer reach into an element that sets its own `data-brand`, so the closest brand always wins (for example a partner preview inside a Business page).

## 0.1.0

First release: tokens for Leeward and Leeward Business in light and dark, 32 components, 7 banking patterns, 142 icons, lint rules and the MCP server.
