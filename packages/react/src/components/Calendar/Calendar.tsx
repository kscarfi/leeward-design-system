import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Button } from "../Button/Button.tsx";
import { IconButton } from "../IconButton/IconButton.tsx";
import styles from "./Calendar.module.css";

export interface CalendarProps {
  value?: Date | null;
  onValueChange?: (date: Date) => void;
  /** Earliest date people can pick. */
  min?: Date;
  /** Latest date people can pick. */
  max?: Date;
  /** Return true for dates people cannot pick, for example bank holidays. */
  isDateDisabled?: (date: Date) => boolean;
  /** Month shown first. Defaults to the selected date, or today. */
  defaultMonth?: Date;
  /** Shows a "Today" shortcut under the grid. */
  showToday?: boolean;
  locale?: Locale;
  className?: string;
}

const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date | null | undefined, b: Date | null | undefined) => Boolean(a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
};

/** A month grid for picking one date. Follows the WAI-ARIA date picker grid pattern. */
export function Calendar({ value, onValueChange, min, max, isDateDisabled, defaultMonth, showToday = true, locale = "en-US", className }: CalendarProps) {
  const m = messages(locale);
  const today = day(new Date());
  const [focused, setFocused] = useState<Date>(day(value ?? defaultMonth ?? today));
  const grid = useRef<HTMLTableElement>(null);
  // Monday first in Turkey, Sunday first in the United States.
  const weekStart = locale === "tr-TR" ? 1 : 0;
  const disabled = (d: Date) => (min ? d < day(min) : false) || (max ? d > day(max) : false) || (isDateDisabled?.(d) ?? false);

  const weeks = useMemo(() => {
    const first = new Date(focused.getFullYear(), focused.getMonth(), 1);
    const start = addDays(first, -((first.getDay() - weekStart + 7) % 7));
    const rows: Date[][] = [];
    for (let w = 0; w < 6; w++) rows.push(Array.from({ length: 7 }, (_, i) => addDays(start, w * 7 + i)));
    // Drop a trailing week that belongs entirely to the next month.
    return rows.filter((row, i) => i < 5 || row[0]!.getMonth() === focused.getMonth());
  }, [focused, weekStart]);

  const weekdays = weeks[0]!.map((d) => ({
    short: new Intl.DateTimeFormat(locale, { weekday: "short" }).format(d),
    long: new Intl.DateTimeFormat(locale, { weekday: "long" }).format(d),
  }));
  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(focused);

  const move = (next: Date) => {
    setFocused(next);
    // Focus the new day after render.
    requestAnimationFrame(() => grid.current?.querySelector<HTMLButtonElement>('button[tabindex="0"]')?.focus());
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -((focused.getDay() - weekStart + 7) % 7)),
      End: () => addDays(focused, 6 - ((focused.getDay() - weekStart + 7) % 7)),
      PageUp: () => addMonths(focused, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, event.shiftKey ? 12 : 1),
    };
    const next = keys[event.key];
    if (next) {
      event.preventDefault();
      move(next());
    }
  };
  const select = (d: Date) => {
    if (disabled(d)) return;
    setFocused(d);
    onValueChange?.(d);
  };

  return (
    <div className={cx(styles.calendar, className)}>
      <div className={styles.header}>
        <IconButton icon="chevron-left" size="sm" label={m.previousMonth} onClick={() => setFocused(addMonths(focused, -1))} />
        <p className={styles.month} aria-live="polite">
          {monthLabel}
        </p>
        <IconButton icon="chevron-right" size="sm" label={m.nextMonth} onClick={() => setFocused(addMonths(focused, 1))} />
      </div>
      <table ref={grid} role="grid" aria-label={monthLabel} className={styles.grid}>
        <thead>
          <tr>
            {weekdays.map((w) => (
              <th key={w.long} scope="col" abbr={w.long} className={styles.weekday}>
                {w.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0]!.toISOString()}>
              {week.map((d) => {
                const outside = d.getMonth() !== focused.getMonth();
                const isSelected = sameDay(d, value);
                const isToday = sameDay(d, today);
                const off = disabled(d);
                return (
                  <td key={d.toISOString()} role="gridcell" aria-selected={isSelected} className={styles.cell}>
                    <button
                      type="button"
                      tabIndex={sameDay(d, focused) ? 0 : -1}
                      aria-label={new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d)}
                      aria-current={isToday ? "date" : undefined}
                      aria-disabled={off || undefined}
                      className={cx(styles.day, outside && styles.outside, isSelected && styles.selected, isToday && styles.today, off && styles.disabled)}
                      onClick={() => select(d)}
                      onKeyDown={onKeyDown}
                    >
                      {d.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {showToday && !disabled(today) && (
        <div className={styles.footer}>
          <Button variant="ghost" size="xs" shape="pill" onClick={() => select(today)}>
            {m.today}
          </Button>
        </div>
      )}
    </div>
  );
}
