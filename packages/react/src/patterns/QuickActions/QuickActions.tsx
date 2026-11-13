import type { ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../../components/Icon/Icon.tsx";
import type { IconName } from "../../components/Icon/icons.ts";
import styles from "./QuickActions.module.css";

export interface QuickAction {
  /** Text label is required: money movement is never icon-only. */
  label: string;
  icon: IconName;
  onClick?: () => void;
  href?: string;
  badge?: ReactNode;
}

export interface QuickActionsProps {
  /** Accessible name for the group, for example "Quick actions". */
  label: string;
  actions: QuickAction[];
  className?: string;
}

/** Row of shortcuts such as Send, Request, Top up and Pay bills. Wraps on narrow screens. */
export function QuickActions({ label, actions, className }: QuickActionsProps) {
  return (
    <ul aria-label={label} className={cx(styles.list, className)}>
      {actions.map((a) => {
        const body = (
          <>
            <span className={styles.icon} aria-hidden="true">
              <Icon name={a.icon} size="lg" weight="duotone" />
              {a.badge && <span className={styles.badge}>{a.badge}</span>}
            </span>
            <span className={styles.label}>{a.label}</span>
          </>
        );
        return (
          <li key={a.label}>
            {a.href ? (
              <a href={a.href} className={styles.action}>{body}</a>
            ) : (
              <button type="button" onClick={a.onClick} className={styles.action}>{body}</button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
