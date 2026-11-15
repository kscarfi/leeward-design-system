import { useState, type ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { Checkbox } from "../Checkbox/Checkbox.tsx";
import { FieldError, FieldHint, useFieldIds } from "../Field/Field.tsx";
import styles from "./CheckboxGroup.module.css";

export interface CheckboxOption {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  /** The question the group answers, read as the group's name. */
  label: string;
  options: CheckboxOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  hint?: ReactNode;
  /** Error for the whole group, for example "Choose at least one account". */
  error?: ReactNode;
  /** Adds a parent checkbox that selects every option; it shows the mixed state when some are selected. */
  selectAllLabel?: string;
  orientation?: "vertical" | "horizontal";
  className?: string;
}

/** Several independent choices under one question. A fieldset with a legend, so screen readers announce the question. */
export function CheckboxGroup({ label, options, value, defaultValue = [], onValueChange, hint, error, selectAllLabel, orientation = "vertical", className }: CheckboxGroupProps) {
  const ids = useFieldIds({ hint, error });
  const [inner, setInner] = useState<string[]>(defaultValue);
  const selected = value ?? inner;
  const set = (next: string[]) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  const enabled = options.filter((o) => !o.disabled).map((o) => o.value);
  const all = enabled.length > 0 && enabled.every((v) => selected.includes(v));
  const some = enabled.some((v) => selected.includes(v));
  return (
    <fieldset className={cx(styles.root, className)} aria-describedby={ids.describedBy}>
      <legend className={styles.legend}>{label}</legend>
      <FieldHint id={ids.hint}>{hint}</FieldHint>
      {selectAllLabel && (
        <Checkbox
          label={selectAllLabel}
          checked={all ? true : some ? "indeterminate" : false}
          onCheckedChange={() => set(all ? selected.filter((v) => !enabled.includes(v)) : [...new Set([...selected, ...enabled])])}
        />
      )}
      <div className={cx(styles.options, styles[orientation], selectAllLabel && styles.nested)}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            {...(option.hint ? { hint: option.hint } : {})}
            disabled={option.disabled ?? false}
            checked={selected.includes(option.value)}
            onCheckedChange={(checked) => set(checked === true ? [...selected, option.value] : selected.filter((v) => v !== option.value))}
          />
        ))}
      </div>
      <FieldError id={ids.error}>{error}</FieldError>
    </fieldset>
  );
}
