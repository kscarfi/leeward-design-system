import type { ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import styles from "./SummaryList.module.css";

export interface SummaryItem {
  /** What the value is, for example "Fee" or "Arrives". */
  label: string;
  /** Text or an AmountDisplay. */
  value: ReactNode;
  /** Short extra line under the value, for example "Free for Leeward accounts". */
  hint?: ReactNode;
}

export interface SummaryListProps {
  items: SummaryItem[];
  /** Emphasized last row with a line above it, for example the total that leaves the account. */
  total?: SummaryItem;
  className?: string;
}

/** Label and value pairs for reviewing a transfer before it is sent, and for receipts. */
export function SummaryList({ items, total, className }: SummaryListProps) {
  return (
    <dl className={cx(styles.list, className)}>
      {items.map((item) => (
        <div key={item.label} className={styles.row}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>
            {item.value}
            {item.hint && <span className={styles.hint}>{item.hint}</span>}
          </dd>
        </div>
      ))}
      {total && (
        <div className={cx(styles.row, styles.total)}>
          <dt className={styles.totalLabel}>{total.label}</dt>
          <dd className={styles.totalValue}>
            {total.value}
            {total.hint && <span className={styles.hint}>{total.hint}</span>}
          </dd>
        </div>
      )}
    </dl>
  );
}
