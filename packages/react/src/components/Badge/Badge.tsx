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
  children: ReactNode;
}

const defaultIcon: Record<BadgeTone, IconName | null> = {
  neutral: null,
  info: "info",
  success: "check-circle",
  warning: "clock",
  danger: "alert-circle",
};

export function Badge({ tone = "neutral", icon, className, children, ...rest }: BadgeProps) {
  const iconName = icon === undefined ? defaultIcon[tone] : icon;
  return (
    <span className={cx(styles.badge, styles[tone], className)} {...rest}>
      {iconName && <Icon name={iconName} size="sm" />}
      {children}
    </span>
  );
}
