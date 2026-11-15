import { Popover as RadixPopover } from "radix-ui";
import { useState, type ReactNode } from "react";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Calendar } from "../Calendar/Calendar.tsx";
import { IconButton } from "../IconButton/IconButton.tsx";
import { TextField } from "../TextField/TextField.tsx";
import styles from "./DatePicker.module.css";

export interface DatePickerProps {
  label: string;
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  /** Return true for dates people cannot pick, for example weekends for a transfer date. */
  isDateDisabled?: (date: Date) => boolean;
  hint?: ReactNode;
  /** Your own error. Typed dates that cannot be read get a built-in message. */
  error?: ReactNode;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  name?: string;
  id?: string;
  locale?: Locale;
  className?: string;
}

/** "12.11.2026" in Turkish, "11/12/2026" in English. */
export function formatDateInput(date: Date, locale: Locale): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return locale === "tr-TR" ? `${dd}.${mm}.${date.getFullYear()}` : `${mm}/${dd}/${date.getFullYear()}`;
}

/** Reads a typed date in the locale's order. Returns null when it is not a real date. */
export function parseDateInput(text: string, locale: Locale): Date | null {
  const parts = text.trim().split(/[./\-\s]+/).map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isInteger(n))) return null;
  const [a, b, year] = parts as [number, number, number];
  const [d, m] = locale === "tr-TR" ? [a, b] : [b, a];
  const date = new Date(year, m - 1, d);
  return date.getFullYear() === year && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
}

/** One date, typed or picked from a calendar, such as when a scheduled transfer should go out. */
export function DatePicker({ label, value, defaultValue = null, onValueChange, min, max, isDateDisabled, hint, error, size = "md", disabled, name, id, locale = "en-US", className }: DatePickerProps) {
  const m = messages(locale);
  const [inner, setInner] = useState<Date | null>(defaultValue);
  const current = value === undefined ? inner : value;
  const [draft, setDraft] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const allowed = (d: Date) => !((min && d < new Date(min.getFullYear(), min.getMonth(), min.getDate())) || (max && d > max) || isDateDisabled?.(d));
  const set = (next: Date | null) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  const shownError = error ?? problem ?? undefined;
  return (
    <RadixPopover.Root open={open} onOpenChange={setOpen}>
      <RadixPopover.Anchor asChild>
        <div className={className}>
          <TextField
            label={label}
            {...(id ? { id } : {})}
            {...(name ? { name } : {})}
            hint={hint ?? m.dateFormat}
            {...(shownError ? { error: shownError } : {})}
            size={size}
            disabled={disabled ?? false}
            numeric
            inputMode="numeric"
            placeholder={m.dateFormat}
            autoComplete="off"
            value={draft ?? (current ? formatDateInput(current, locale) : "")}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => {
              if (draft === null) return;
              if (draft.trim() === "") {
                setProblem(null);
                set(null);
              } else {
                const parsed = parseDateInput(draft, locale);
                if (!parsed) setProblem(m.invalidDate);
                else if (!allowed(parsed)) setProblem(m.dateOutOfRange);
                else {
                  setProblem(null);
                  set(parsed);
                }
              }
              setDraft(null);
            }}
            endAction={
              <RadixPopover.Trigger asChild>
                <IconButton icon="calendar" size="xs" label={m.chooseDate} disabled={disabled ?? false} />
              </RadixPopover.Trigger>
            }
          />
        </div>
      </RadixPopover.Anchor>
      <RadixPopover.Portal>
        <RadixPopover.Content align="start" sideOffset={6} collisionPadding={12} className={styles.popover} aria-label={m.chooseDate}>
          <Calendar
            value={current}
            {...(min ? { min } : {})}
            {...(max ? { max } : {})}
            {...(isDateDisabled ? { isDateDisabled } : {})}
            locale={locale}
            onValueChange={(d) => {
              setProblem(null);
              setDraft(null);
              set(d);
              setOpen(false);
            }}
          />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}
