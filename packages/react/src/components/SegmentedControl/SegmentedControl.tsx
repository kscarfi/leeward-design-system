import { ToggleGroup } from "radix-ui";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import styles from "./SegmentedControl.module.css";

export interface SegmentOption {
  value: string;
  label: string;
  icon?: IconName;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  /** Accessible name for the group, for example "Period". */
  label: string;
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: "sm" | "md";
  fullWidth?: boolean;
  className?: string;
}

/** Pick one view or filter from 2 to 5 short options, such as Week, Month, Year. Arrow keys move between options. */
export function SegmentedControl({ label, options, value, defaultValue, onValueChange, size = "md", fullWidth, className }: SegmentedControlProps) {
  return (
    <ToggleGroup.Root
      type="single"
      aria-label={label}
      {...(value !== undefined ? { value } : {})}
      defaultValue={defaultValue ?? options[0]?.value ?? ""}
      // A segmented control always has one selection, so ignore attempts to clear it.
      onValueChange={(next) => next && onValueChange?.(next)}
      className={cx(styles.root, styles[size], fullWidth && styles.fullWidth, className)}
    >
      {options.map((o) => (
        <ToggleGroup.Item key={o.value} value={o.value} disabled={o.disabled ?? false} className={styles.item}>
          {o.icon && <Icon name={o.icon} size="sm" />}
          {o.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
