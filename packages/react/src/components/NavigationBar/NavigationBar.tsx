import type { MouseEventHandler } from "react";
import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Icon } from "../Icon/Icon.tsx";
import { Indicator } from "../Indicator/Indicator.tsx";
import type { IconName } from "../Icon/icons.ts";
import styles from "./NavigationBar.module.css";

export interface NavigationItem {
  label: string;
  icon: IconName;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  /** Unread count shown on the icon. */
  count?: number;
}

export interface NavigationBarProps {
  /** Three to five top-level destinations. */
  items: NavigationItem[];
  /** The label of the current destination. */
  current: string;
  /** Accessible name of the navigation, for example "Main". */
  label?: string;
  locale?: Locale;
  className?: string;
}

/** Bottom navigation for phones: three to five top-level destinations, each with an icon and a label. */
export function NavigationBar({ items, current, label = "Main", locale = "en-US", className }: NavigationBarProps) {
  const m = messages(locale);
  return (
    <nav aria-label={label} className={cx(styles.bar, className)}>
      <ul className={styles.list}>
        {items.map((item) => {
          const active = item.label === current;
          const body = (
            <>
              {/* The item's hidden sentence already says the count, so the Indicator adds no text of its own. */}
              <Indicator {...(item.count ? { count: item.count } : {})} anchor="rectangle" label="" locale={locale}>
                <span className={styles.indicator}>
                  <Icon name={item.icon} size="lg" weight={active ? "bold" : "linear"} />
                </span>
              </Indicator>
              {/* With a count, screen readers get one sentence: separate flex children would add a space before the comma. */}
              <span className={styles.label} aria-hidden={item.count ? true : undefined}>
                {item.label}
              </span>
              {item.count ? <span className={styles.srOnly}>{`${item.label}, ${m.newItems(item.count)}`}</span> : null}
            </>
          );
          const props = { className: cx(styles.item, active && styles.active), "aria-current": active ? ("page" as const) : undefined };
          return (
            <li key={item.label} className={styles.cell}>
              {item.href ? (
                <a href={item.href} {...props} {...(item.onClick ? { onClick: item.onClick } : {})}>
                  {body}
                </a>
              ) : (
                <button type="button" {...props} {...(item.onClick ? { onClick: item.onClick } : {})}>
                  {body}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
