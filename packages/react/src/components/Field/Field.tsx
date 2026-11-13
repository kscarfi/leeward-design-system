// Internal building blocks shared by every form control: label, hint and error wiring.
import { useId, type ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import styles from "./Field.module.css";

export interface FieldIds {
  control: string;
  hint: string | undefined;
  error: string | undefined;
  describedBy: string | undefined;
}

export function useFieldIds({ id, hint, error }: { id?: string | undefined; hint?: ReactNode; error?: ReactNode }): FieldIds {
  const auto = useId();
  const control = id ?? `lw${auto}`;
  const hintId = hint ? `${control}-hint` : undefined;
  const errorId = error ? `${control}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  return { control, hint: hintId, error: errorId, describedBy };
}

export function FieldLabel({ htmlFor, id, children, optional }: { htmlFor?: string; id?: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} id={id} className={styles.label}>
      {children}
      {optional && <span className={styles.optional}> (optional)</span>}
    </label>
  );
}

export function FieldHint({ id, children }: { id: string | undefined; children: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className={styles.hint}>
      {children}
    </p>
  );
}

/** Errors always pair an icon with text. Color is never the only signal. */
export function FieldError({ id, children }: { id: string | undefined; children: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className={styles.error}>
      <Icon name="alert-circle" size="sm" className={styles.errorIcon} />
      <span>{children}</span>
    </p>
  );
}

export function FieldRoot({ children, className }: { children: ReactNode; className?: string | undefined }) {
  return <div className={cx(styles.root, className)}>{children}</div>;
}
