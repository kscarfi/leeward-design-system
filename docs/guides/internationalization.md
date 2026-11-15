# Internationalization

Leeward ships in Turkish (`tr-TR`) and English (`en-US`). Every component that shows text, numbers or dates takes a `locale` prop.

## Money

- Format every amount with `formatAmount()` or AmountDisplay. Never build amount strings by hand.
- The currency symbol is shown only for the locale's home currency: `₺1.250,00` in Turkish, `TRY 1,250.00` in English. Foreign amounts always show the code, so they are never ambiguous.
- The minus sign is the typographic minus (U+2212), and the sign always comes from the direction, never from color.
- Amounts use tabular figures so digits line up in lists.

## Dates and numbers

- Use `formatDate()`: short dates read "12 Kas" or "Nov 12"; long dates "12 Kasım 2026" or "November 12, 2026".
- Percentages follow the locale: "%25" in Turkish, "25%" in English. Built-in copy handles this.
- Do not hard-code month or day names.

## Text

- Built-in copy (screen reader text, default labels) lives in `packages/react/src/utils/messages.ts`. Add every new string in both languages.
- Turkish text is often 20 to 30 percent longer than English. Components wrap or truncate with an ellipsis; never set fixed widths on labels.
- Mind Turkish casing: `İ/i` and `I/ı` are different letters. Do not upper-case Turkish text with CSS; badges use their own case rules.
- Plus Jakarta Sans and IBM Plex Mono cover Turkish letters and the lira sign.

## Direction

- Layouts use logical properties (`padding-inline`, `margin-inline-start`, `inset-inline`), so they are ready for right-to-left languages.
- Right-to-left is not tested yet. Arabic or Hebrew support would need icon mirroring for direction icons and a review of every story in `dir="rtl"`.
