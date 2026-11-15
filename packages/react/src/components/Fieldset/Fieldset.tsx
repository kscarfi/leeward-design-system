import type { ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { FieldError, FieldHint, useFieldIds } from "../Field/Field.tsx";
import styles from "./Fieldset.module.css";

export interface FieldsetProps {
  /** Names the group, for example "Recipient" or "Card address". Read before each field inside. */
  legend: string;
  hint?: ReactNode;
  /** Error that belongs to the group, not to one field, for example "Enter either an IBAN or a phone number". */
  error?: ReactNode;
  /** Hide the legend visually but keep it for screen readers, when a heading above already says the same. */
  hideLegend?: boolean;
  children: ReactNode;
  className?: string;
}

/** Groups related fields under one name, so screen readers announce the group with each field. */
export function Fieldset({ legend, hint, error, hideLegend, children, className }: FieldsetProps) {
  const ids = useFieldIds({ hint, error });
  return (
    <fieldset className={cx(styles.root, className)} aria-describedby={ids.describedBy}>
      <legend className={cx(styles.legend, hideLegend && styles.hidden)}>{legend}</legend>
      <FieldHint id={ids.hint}>{hint}</FieldHint>
      <div className={styles.fields}>{children}</div>
      <FieldError id={ids.error}>{error}</FieldError>
    </fieldset>
  );
}
