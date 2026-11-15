import { useState } from "react";
import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import styles from "./Breadcrumbs.module.css";

export interface BreadcrumbItem {
  label: string;
  /** Omit for the current page, which is always last. */
  href?: string;
  icon?: IconName;
}

export interface BreadcrumbsProps {
  /** From the top level to the current page. */
  items: BreadcrumbItem[];
  /** Above this many items the middle collapses behind a "…" button. Default 4. */
  maxItems?: number;
  locale?: Locale;
  className?: string;
}

/** Where this page sits. Desktop only: on phones, use a back button in PageHeader. */
export function Breadcrumbs({ items, maxItems = 4, locale = "en-US", className }: BreadcrumbsProps) {
  const m = messages(locale);
  const [expanded, setExpanded] = useState(false);
  const collapse = !expanded && items.length > maxItems;
  const visible = collapse ? [items[0]!, null, ...items.slice(-(maxItems - 2))] : items;
  return (
    <nav aria-label={m.breadcrumbs} className={cx(styles.nav, className)}>
      <ol className={styles.list}>
        {visible.map((item, i) => {
          const last = i === visible.length - 1;
          return (
            <li key={item ? `${item.label}-${i}` : "more"} className={styles.item}>
              {item === null ? (
                <button type="button" className={styles.more} aria-label={m.showPath} onClick={() => setExpanded(true)}>
                  …
                </button>
              ) : last || !item.href ? (
                <span className={styles.current} aria-current={last ? "page" : undefined}>
                  {item.icon && <Icon name={item.icon} size="sm" />}
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className={styles.link}>
                  {item.icon && <Icon name={item.icon} size="sm" />}
                  {item.label}
                </a>
              )}
              {!last && <Icon name="chevron-right" size="sm" className={styles.separator} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
