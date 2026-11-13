import type { ButtonHTMLAttributes, Ref } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import styles from "./IconButton.module.css";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label"> {
  icon: IconName;
  /** Required. Becomes the accessible name. Describe the outcome: "Close", "Show balance". */
  label: string;
  variant?: "ghost" | "secondary" | "outline" | "primary";
  size?: "xs" | "sm" | "md" | "lg";
  ref?: Ref<HTMLButtonElement>;
}

const iconSize = { xs: "sm", sm: "sm", md: "md", lg: "lg" } as const;

/** Icon-only button. Not for moving money: use Button with a text label for that. */
export function IconButton({ icon, label, variant = "ghost", size = "md", type = "button", className, ref, ...rest }: IconButtonProps) {
  // A pressed toggle shows the bold weight, so state is visible without relying on color.
  const pressed = rest["aria-pressed"] === true || rest["aria-pressed"] === "true";
  return (
    <button ref={ref} type={type} aria-label={label} className={cx(styles.iconButton, styles[variant], styles[size], className)} {...rest}>
      <Icon name={icon} size={iconSize[size]} weight={pressed ? "bold" : "linear"} />
    </button>
  );
}
