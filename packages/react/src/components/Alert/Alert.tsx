import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import { IconButton } from "../IconButton/IconButton.tsx";
import styles from "./Alert.module.css";

export type AlertTone = "info" | "success" | "warning" | "danger" | "neutral";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  /** Buttons or links under the message. */
  actions?: ReactNode;
  /** Shows a close button. The parent decides what closing means. */
  onDismiss?: () => void;
  dismissLabel?: string;
  /** Use "alert" only for urgent problems that need attention now. Default "status". */
  live?: "status" | "alert" | "off";
}

const toneIcon: Record<AlertTone, IconName> = { info: "info", success: "check-circle", warning: "alert-triangle", danger: "alert-circle", neutral: "info" };

/** Inline message on the page: what happened and what to do. Icon, title and text, never color alone. */
export function Alert({ tone = "info", title, children, actions, onDismiss, dismissLabel = "Dismiss", live = "status", className, ...rest }: AlertProps) {
  const role = live === "off" ? undefined : live;
  return (
    <div role={role} className={cx(styles.alert, styles[tone], className)} {...rest}>
      <Icon name={toneIcon[tone]} weight="bold" className={styles.icon} />
      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.text}>{children}</div>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {onDismiss && <IconButton icon="close" label={dismissLabel} size="sm" onClick={onDismiss} className={styles.close} />}
    </div>
  );
}
