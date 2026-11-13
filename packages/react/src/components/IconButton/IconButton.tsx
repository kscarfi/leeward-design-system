import type { ButtonHTMLAttributes, Ref } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import styles from "./IconButton.module.css";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> {
  icon: IconName;
  /** Required. Becomes the accessible name. Describe the outcome: "Close", "Show balance". */
  label: string;
  variant?: "ghost" | "secondary" | "primary";
  size?: "sm" | "md";
  ref?: Ref<HTMLButtonElement>;
}

/** Icon-only button. Not for moving money: use Button with a text label for that. */
export function IconButton({ icon, label, variant = "ghost", size = "md", type = "button", className, ref, ...rest }: IconButtonProps) {
  return (
    <button ref={ref} type={type} aria-label={label} className={cx(styles.iconButton, styles[variant], styles[size], className)} {...rest}>
      <Icon name={icon} size={size === "sm" ? "sm" : "md"} />
    </button>
  );
}
