import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { IconButton } from "../IconButton/IconButton.tsx";
import target from "../../styles/target.module.css";
import styles from "./Pagination.module.css";

export interface PaginationProps {
  /** The current page, starting at 1. */
  page: number;
  /** Total pages. Omit when the total is unknown, and pass `hasNext` instead. */
  totalPages?: number;
  /** For an unknown total: whether a next page exists. */
  hasNext?: boolean;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current page. Default 1. */
  siblings?: number;
  locale?: Locale;
  className?: string;
}

/** Pages to show: first, last, the current page and its neighbours, with gaps as null. */
export function pageRange(page: number, total: number, siblings = 1): Array<number | null> {
  const pages = new Set([1, total]);
  for (let p = page - siblings; p <= page + siblings; p++) if (p >= 1 && p <= total) pages.add(p);
  const sorted = [...pages].sort((a, b) => a - b);
  const out: Array<number | null> = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev === 2) out.push(prev + 1);
    else if (prev !== undefined && p - prev > 2) out.push(null);
    out.push(p);
  });
  return out;
}

/** Moves through long lists, such as transactions, a page at a time. */
export function Pagination({ page, totalPages, hasNext, onPageChange, siblings = 1, locale = "en-US", className }: PaginationProps) {
  const m = messages(locale);
  const known = totalPages !== undefined;
  const nextExists = known ? page < totalPages : Boolean(hasNext);
  return (
    <nav aria-label={m.pagination} className={cx(styles.nav, className)}>
      <ul className={styles.list}>
        <li>
          <IconButton icon="chevron-left" size="sm" shape="rounded" label={m.previousPage} disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
        </li>
        {known ? (
          pageRange(page, totalPages, siblings).map((p, i) =>
            p === null ? (
              <li key={`gap-${i}`} className={styles.gap} aria-hidden="true">
                …
              </li>
            ) : (
              <li key={p}>
                <button type="button" className={cx(styles.page, target.target, p === page && styles.current)} aria-current={p === page ? "page" : undefined} aria-label={m.page(p)} onClick={() => onPageChange(p)}>
                  {p}
                </button>
              </li>
            ),
          )
        ) : (
          <li className={styles.status} aria-current="page">
            {m.page(page)}
          </li>
        )}
        <li>
          <IconButton icon="chevron-right" size="sm" shape="rounded" label={m.nextPage} disabled={!nextExists} onClick={() => onPageChange(page + 1)} />
        </li>
      </ul>
      {known && (
        <p className={styles.srOnly} aria-live="polite">
          {m.pageOf(page, totalPages)}
        </p>
      )}
    </nav>
  );
}
