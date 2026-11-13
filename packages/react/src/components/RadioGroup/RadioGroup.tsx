import { RadioGroup as RadixRadioGroup } from "radix-ui";
import { useId, type ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { FieldError, FieldHint, useFieldIds } from "../Field/Field.tsx";
import styles from "./RadioGroup.module.css";

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Group label, read as the question. */
  label: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  hint?: ReactNode;
  error?: ReactNode;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

export function RadioGroup({ label, options, hint, error, orientation = "vertical", id, className, ...root }: RadioGroupProps) {
  const ids = useFieldIds({ id, hint, error });
  const labelId = `${ids.control}-label`;
  const base = useId();
  return (
    <div className={cx(styles.root, className)}>
      <span id={labelId} className={styles.legend}>
        {label}
      </span>
      <FieldHint id={ids.hint}>{hint}</FieldHint>
      <RadixRadioGroup.Root
        id={ids.control}
        aria-labelledby={labelId}
        aria-describedby={ids.describedBy}
        aria-invalid={error ? true : undefined}
        orientation={orientation}
        className={cx(styles.options, styles[orientation])}
        {...root}
      >
        {options.map((option) => {
          const itemId = `${base}-${option.value}`;
          const descriptionId = option.description ? `${itemId}-description` : undefined;
          return (
            <div key={option.value} className={styles.option}>
              <RadixRadioGroup.Item
                id={itemId}
                value={option.value}
                disabled={option.disabled ?? false}
                aria-describedby={descriptionId}
                className={cx(styles.radio, error && styles.invalid)}
              >
                <RadixRadioGroup.Indicator className={styles.dot} />
              </RadixRadioGroup.Item>
              <div className={styles.text}>
                <label htmlFor={itemId} className={styles.label}>
                  {option.label}
                </label>
                {option.description && (
                  <span id={descriptionId} className={styles.description}>
                    {option.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </RadixRadioGroup.Root>
      <FieldError id={ids.error}>{error}</FieldError>
    </div>
  );
}
