import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import styles from "./Chip.module.css";

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** Filter chips toggle. The state is exposed with aria-pressed and shown with a check mark. */
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  icon?: IconName;
  /** sm 36 px (default), md 44 px. Matches Button and TextField of the same size. */
  size?: "sm" | "md";
  children: ReactNode;
}

export function Chip({ selected = false, onSelectedChange, icon, size = "sm", className, children, onClick, type = "button", ...rest }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cx(styles.chip, size === "md" && styles.md, selected && styles.selected, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onSelectedChange?.(!selected);
      }}
      {...rest}
    >
      {selected ? <Icon name="check" size="sm" /> : icon && <Icon name={icon} size="sm" />}
      {children}
    </button>
  );
}
