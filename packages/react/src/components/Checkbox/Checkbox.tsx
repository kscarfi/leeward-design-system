import { Checkbox as RadixCheckbox } from "radix-ui";
import type { ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { FieldError, FieldHint, useFieldIds } from "../Field/Field.tsx";
import { Icon } from "../Icon/Icon.tsx";
import styles from "./Checkbox.module.css";

export interface CheckboxProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  checked?: boolean | "indeterminate";
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean | "indeterminate") => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  id?: string;
  className?: string;
}

export function Checkbox({ label, hint, error, id, className, ...root }: CheckboxProps) {
  const ids = useFieldIds({ id, hint, error });
  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.row}>
        <RadixCheckbox.Root
          id={ids.control}
          className={cx(styles.box, error && styles.invalid)}
          aria-describedby={ids.describedBy}
          aria-invalid={error ? true : undefined}
          {...root}
        >
          <RadixCheckbox.Indicator className={styles.indicator} forceMount>
            {root.checked === "indeterminate" ? <Icon name="minus" size="sm" /> : <Icon name="check" size="sm" />}
          </RadixCheckbox.Indicator>
        </RadixCheckbox.Root>
        <label htmlFor={ids.control} className={styles.label}>
          {label}
        </label>
      </div>
      {(hint || error) && (
        <div className={styles.messages}>
          <FieldHint id={ids.hint}>{hint}</FieldHint>
          <FieldError id={ids.error}>{error}</FieldError>
        </div>
      )}
    </div>
  );
}
