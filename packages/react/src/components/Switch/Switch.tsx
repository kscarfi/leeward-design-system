import { Switch as RadixSwitch } from "radix-ui";
import type { ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { FieldHint, useFieldIds } from "../Field/Field.tsx";
import styles from "./Switch.module.css";

export interface SwitchProps {
  /** Describe the setting, not the state: "Card payments online", not "On". */
  label: ReactNode;
  hint?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

/** For settings that apply immediately. Use Checkbox inside forms that need a submit. */
export function Switch({ label, hint, id, className, ...root }: SwitchProps) {
  const ids = useFieldIds({ id, hint });
  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.text}>
        <label htmlFor={ids.control} className={styles.label}>
          {label}
        </label>
        <FieldHint id={ids.hint}>{hint}</FieldHint>
      </div>
      <RadixSwitch.Root id={ids.control} aria-describedby={ids.describedBy} className={styles.track} {...root}>
        <RadixSwitch.Thumb className={styles.thumb} />
      </RadixSwitch.Root>
    </div>
  );
}
