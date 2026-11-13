import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "../../utils/cx.ts";
import { FieldError, FieldHint, FieldLabel, FieldRoot, useFieldIds } from "../Field/Field.tsx";
import styles from "./TextField.module.css";

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  /** Visible label. Required: placeholders are not labels. */
  label: string;
  hint?: ReactNode;
  /** Error message. Setting it marks the field invalid and links the message to the input. */
  error?: ReactNode;
  /** Short text or symbol before the value, for example "₺". */
  prefix?: ReactNode;
  suffix?: ReactNode;
  optional?: boolean;
  /** Use tabular figures, for amounts and codes. */
  numeric?: boolean;
  /** sm 36 px, md 44 px (default, touch friendly), lg 48 px. */
  size?: "sm" | "md" | "lg";
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

export function TextField({ label, hint, error, prefix, suffix, optional, numeric, size = "md", id, className, disabled, ref, ...rest }: TextFieldProps) {
  const ids = useFieldIds({ id, hint, error });
  return (
    <FieldRoot className={className}>
      <FieldLabel htmlFor={ids.control} optional={optional ?? false}>
        {label}
      </FieldLabel>
      <FieldHint id={ids.hint}>{hint}</FieldHint>
      <div className={cx(styles.control, styles[size], error && styles.invalid, disabled && styles.disabled)}>
        {prefix && (
          <span className={styles.affix} aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          id={ids.control}
          className={cx(styles.input, numeric && styles.numeric)}
          aria-invalid={error ? true : undefined}
          aria-describedby={ids.describedBy}
          disabled={disabled}
          required={!optional && rest.required}
          {...rest}
        />
        {suffix && (
          <span className={styles.affix} aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>
      <FieldError id={ids.error}>{error}</FieldError>
    </FieldRoot>
  );
}
