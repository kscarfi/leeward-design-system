import type { ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import styles from "./Indicator.module.css";

export interface IndicatorProps {
  /** The element it sits on, usually an IconButton or Avatar. */
  children: ReactNode;
  /** Shows a number. Above `max` it shows "max+". 0 hides the indicator. */
  count?: number;
  /** Shows a dot without a number, for "something new". */
  dot?: boolean;
  max?: number;
  /** Screen reader text, for example "3 unread messages". Defaults to "3 new". */
  label?: string;
  tone?: "danger" | "primary";
  locale?: Locale;
  className?: string;
}

/** A dot or count on the corner of an icon or avatar, such as unread notifications. */
export function Indicator({ children, count, dot, max = 99, label, tone = "danger", locale = "en-US", className }: IndicatorProps) {
  const show = dot || (count !== undefined && count > 0);
  const text = label ?? (count ? messages(locale).newItems(count) : messages(locale).newItems(1));
  return (
    <span className={cx(styles.wrap, className)}>
      {children}
      {show && (
        <>
          <span className={cx(styles.mark, dot && !count ? styles.dot : styles.count, styles[tone])} aria-hidden="true">
            {!dot || count ? (count! > max ? `${max}+` : count) : null}
          </span>
          <span className={styles.srOnly}>{text}</span>
        </>
      )}
    </span>
  );
}
