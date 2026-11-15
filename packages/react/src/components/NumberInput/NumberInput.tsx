import { useState, type ReactNode } from "react";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { IconButton } from "../IconButton/IconButton.tsx";
import { TextField } from "../TextField/TextField.tsx";
import styles from "./NumberInput.module.css";

export interface NumberInputProps {
  label: string;
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: ReactNode;
  error?: ReactNode;
  /** Unit after the number, for example "months". Shown and read with the value. */
  unit?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  name?: string;
  id?: string;
  locale?: Locale;
  className?: string;
}

const clamp = (n: number, min?: number, max?: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));

/**
 * A whole number with minus and plus buttons, such as a loan term in months. For money, use AmountInput.
 * Follows the spinbutton pattern: arrow keys step, Home and End jump to the limits.
 */
export function NumberInput({ label, value, defaultValue = null, onValueChange, min, max, step = 1, hint, error, unit, size = "md", disabled, name, id, locale = "en-US", className }: NumberInputProps) {
  const m = messages(locale);
  const [inner, setInner] = useState<number | null>(defaultValue);
  const current = value === undefined ? inner : value;
  const [draft, setDraft] = useState<string | null>(null);
  const set = (next: number | null) => {
    const v = next === null ? null : clamp(next, min, max);
    if (value === undefined) setInner(v);
    onValueChange?.(v);
  };
  const bump = (delta: number) => set((current ?? min ?? 0) + delta);
  return (
    <TextField
      label={label}
      {...(id ? { id } : {})}
      {...(name ? { name } : {})}
      {...(hint ? { hint } : {})}
      {...(error ? { error } : {})}
      {...(className ? { className } : {})}
      size={size}
      disabled={disabled ?? false}
      numeric
      inputMode="numeric"
      role="spinbutton"
      aria-valuenow={current ?? undefined}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={current === null ? undefined : unit ? `${current} ${unit}` : String(current)}
      value={draft ?? (current === null ? "" : String(current))}
      onChange={(event) => setDraft(event.target.value.replace(/[^\d-]/g, ""))}
      onBlur={() => {
        if (draft !== null) set(draft === "" || draft === "-" ? null : Number(draft));
        setDraft(null);
      }}
      onKeyDown={(event) => {
        const keys: Record<string, () => void> = {
          ArrowUp: () => bump(step),
          ArrowDown: () => bump(-step),
          PageUp: () => bump(step * 10),
          PageDown: () => bump(-step * 10),
          Home: () => min !== undefined && set(min),
          End: () => max !== undefined && set(max),
        };
        const action = keys[event.key];
        if (action) {
          event.preventDefault();
          setDraft(null);
          action();
        }
      }}
      {...(unit ? { suffix: unit } : {})}
      endAction={
        <span className={styles.buttons}>
          <IconButton icon="minus" size="xs" label={m.decrease} tabIndex={-1} disabled={disabled || (min !== undefined && (current ?? min) <= min)} onClick={() => bump(-step)} />
          <IconButton icon="plus" size="xs" label={m.increase} tabIndex={-1} disabled={disabled || (max !== undefined && (current ?? -Infinity) >= max)} onClick={() => bump(step)} />
        </span>
      }
    />
  );
}
