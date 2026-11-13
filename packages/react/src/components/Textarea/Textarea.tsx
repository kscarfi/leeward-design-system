import { useState, type ReactNode, type Ref, type TextareaHTMLAttributes } from "react";
import { cx } from "../../utils/cx.ts";
import { FieldError, FieldHint, FieldLabel, FieldRoot, useFieldIds } from "../Field/Field.tsx";
import styles from "./Textarea.module.css";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: ReactNode;
  error?: ReactNode;
  optional?: boolean;
  /** Shows "12 of 140" and announces it politely as people type. */
  showCount?: boolean;
  className?: string;
  ref?: Ref<HTMLTextAreaElement>;
}

/** Multi-line text, for payment notes and messages. Grows with its content. */
export function Textarea({ label, hint, error, optional, showCount, maxLength, id, className, rows = 3, onChange, value, defaultValue, ref, ...rest }: TextareaProps) {
  const ids = useFieldIds({ id, hint, error });
  const [count, setCount] = useState(String(value ?? defaultValue ?? "").length);
  return (
    <FieldRoot className={className}>
      <FieldLabel htmlFor={ids.control} optional={optional ?? false}>
        {label}
      </FieldLabel>
      <FieldHint id={ids.hint}>{hint}</FieldHint>
      <textarea
        ref={ref}
        id={ids.control}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={ids.describedBy}
        className={cx(styles.textarea, error && styles.invalid)}
        {...(value !== undefined ? { value } : {})}
        {...(defaultValue !== undefined ? { defaultValue } : {})}
        onChange={(event) => {
          setCount(event.target.value.length);
          onChange?.(event);
        }}
        {...rest}
      />
      {showCount && maxLength && (
        <p className={styles.count} aria-live="polite">
          {count} of {maxLength}
        </p>
      )}
      <FieldError id={ids.error}>{error}</FieldError>
    </FieldRoot>
  );
}
