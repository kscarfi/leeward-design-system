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
  /** Screen reader text, for example "3 unread messages". Defaults to "3 new". Pass "" when the element's own name already says it. */
  label?: string;
  tone?: "danger" | "primary" | "success";
  /** circle (default) for IconButtons and Avatars: the mark sits on the circle's edge. rectangle for square or rounded corners. */
  anchor?: "circle" | "rectangle";
  /** top (default) for counts and news; bottom for status, such as "online". */
  placement?: "top" | "bottom";
  locale?: Locale;
  className?: string;
}

/** A dot or count on the corner of an icon or avatar, such as unread notifications. */
export function Indicator({ children, count, dot, max = 99, label, tone = "danger", anchor = "circle", placement = "top", locale = "en-US", className }: IndicatorProps) {
  const show = dot || (count !== undefined && count > 0);
  const text = label ?? (count ? messages(locale).newItems(count) : messages(locale).newItems(1));
  return (
    <span className={cx(styles.wrap, className)}>
      {children}
      {show && (
        <>
          <span className={cx(styles.mark, dot && !count ? styles.dot : styles.count, styles[tone], styles[anchor], styles[placement])} aria-hidden="true">
            {!dot || count ? (count! > max ? `${max}+` : count) : null}
          </span>
          {text ? <span className={styles.srOnly}>{text}</span> : null}
        </>
      )}
    </span>
  );
}
