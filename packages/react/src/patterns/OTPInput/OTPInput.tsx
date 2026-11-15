import { useRef, useState, type ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { FieldError, FieldHint, FieldLabel, useFieldIds } from "../../components/Field/Field.tsx";
import styles from "./OTPInput.module.css";

export interface OTPInputProps {
  label: string;
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** @deprecated Use `onValueChange`. Kept until 2.0. */
  onChange?: (value: string) => void;
  /** Called once when every digit is filled. */
  onComplete?: (value: string) => void;
  hint?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  autoFocus?: boolean;
  locale?: Locale;
  name?: string;
  id?: string;
  className?: string;
}

/**
 * One real input drawn as separate boxes. One field means paste, SMS autofill
 * (autocomplete="one-time-code"), password managers and screen readers all work
 * without custom focus juggling.
 */
export function OTPInput({ label, length = 6, value, defaultValue = "", onValueChange, onChange, onComplete, hint, error, disabled, autoFocus, locale = "en-US", name, id, className }: OTPInputProps) {
  const ids = useFieldIds({ id, hint, error });
  const inputRef = useRef<HTMLInputElement>(null);
  const [internal, setInternal] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const code = (value ?? internal).replace(/\D/g, "").slice(0, length);
  const m = messages(locale);

  const update = (raw: string) => {
    const next = raw.replace(/\D/g, "").slice(0, length);
    if (value === undefined) setInternal(next);
    (onValueChange ?? onChange)?.(next);
    if (next.length === length && code.length !== length) onComplete?.(next);
  };

  const activeIndex = Math.min(code.length, length - 1);
  return (
    <div className={cx(styles.root, className)}>
      <FieldLabel htmlFor={ids.control}>{label}</FieldLabel>
      <FieldHint id={ids.hint}>{hint}</FieldHint>
      <div className={styles.boxes} onClick={() => inputRef.current?.focus()}>
        <input
          ref={inputRef}
          id={ids.control}
          name={name}
          className={styles.input}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern={`\\d{${length}}`}
          // No maxLength: it would cut "482 913" pasted from an SMS before the spaces are stripped.
          value={code}
          disabled={disabled}
          autoFocus={autoFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={ids.describedBy}
          aria-roledescription={m.otpDigits(length)}
          onChange={(event) => update(event.target.value)}
          onFocus={(event) => {
            setFocused(true);
            const end = event.target.value.length;
            event.target.setSelectionRange(end, end);
          }}
          onBlur={() => setFocused(false)}
        />
        {Array.from({ length }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className={cx(styles.box, error && styles.invalid, disabled && styles.disabled, focused && index === activeIndex && styles.active)}
          >
            {code[index] ?? ""}
            {focused && index === activeIndex && code.length < length && <span className={styles.caret} />}
          </span>
        ))}
      </div>
      <FieldError id={ids.error}>{error}</FieldError>
    </div>
  );
}
