import type { ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps {
  icon?: IconName;
  /** Say what is missing in plain words: "No payments yet". */
  title: string;
  /** Say what people can do next. */
  description?: ReactNode;
  action?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

export function EmptyState({ icon = "inbox", title, description, action, headingLevel = 3, className }: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div className={cx(styles.root, className)}>
      <span className={styles.art} aria-hidden="true">
        <Icon name={icon} size="xl" weight="duotone" />
      </span>
      <Heading className={styles.title}>{title}</Heading>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
