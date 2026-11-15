# Changelog

All four packages (`@leeward/react`, `@leeward/tokens`, `@leeward/lint`, `@leeward/mcp-server`) share one version.

## 0.3.0

### Added

- **20 components:** DatePicker and Calendar, Combobox, SearchField, NumberInput, Slider, FileUpload, Fieldset, CheckboxGroup, Breadcrumbs, Pagination, NavigationBar, PageHeader, SkipLink, Table, Popover, Banner, AvatarGroup, Indicator, Image and Stack. Each has docs, stories with interaction tests, unit tests, component tokens and English and Turkish copy.
- DropdownMenu: labelled `groups`, one-level submenus (`items`) and `shortcut` hints.
- Tabs: an `icon` per tab. Sheet: `side="start"`. Link: `iconStart` and `iconEnd`. TextField: `endAction` for an interactive control at the end of the field.
- Icons: `iconMeta` with a category, search keywords and reserved meanings for every icon; the icon gallery is searchable.
- Column grid tokens (`--lw-grid-columns-*`, `-gutter-*`, `-margin-*`) for phone, tablet and desktop.
- Guides for foundations, writing and terminology, internationalization, and an accessibility statement.
- Repository: contributing guide, code of conduct, security policy, roadmap, versioning and browser support policy, issue templates.

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
