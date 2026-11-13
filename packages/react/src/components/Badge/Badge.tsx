import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import styles from "./Badge.module.css";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Status badges show an icon by default so state never depends on color. Pass null to hide it. */
  icon?: IconName | null;
  /** subtle for lists and tables, solid for counts and strong status. */
  appearance?: "subtle" | "solid";
  size?: "sm" | "md";
  children: ReactNode;
}

const defaultIcon: Record<BadgeTone, IconName | null> = {
  neutral: null,
  info: "info",
  success: "check-circle",
  warning: "clock",
  danger: "alert-circle",
};

export function Badge({ tone = "neutral", icon, appearance = "subtle", size = "md", className, children, ...rest }: BadgeProps) {
  const iconName = icon === undefined ? defaultIcon[tone] : icon;
  return (
    <span className={cx(styles.badge, styles[tone], styles[appearance], styles[size], className)} {...rest}>
      {iconName && <Icon name={iconName} size={size === "sm" ? "xs" : "sm"} weight="bold" />}
      {children}
    </span>
  );
}
