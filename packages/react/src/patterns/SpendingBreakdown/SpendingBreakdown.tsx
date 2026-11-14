import { cx } from "../../utils/cx.ts";
import { formatAmount, type Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Icon } from "../../components/Icon/Icon.tsx";
import type { IconName } from "../../components/Icon/icons.ts";
import { AmountDisplay } from "../AmountDisplay/AmountDisplay.tsx";
import styles from "./SpendingBreakdown.module.css";

export interface SpendingCategory {
  name: string;
  /** Positive amount spent in this category. */
  amount: number;
  icon?: IconName;
}

export interface SpendingBreakdownProps {
  /** For example "Spending in November". */
  title: string;
  categories: SpendingCategory[];
  currency: string;
  locale?: Locale;
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

// Spending is not an error, so red is never used. Every slice also has a name and amount in the list.
const TONES = ["primary", "secondary", "info", "success", "attention", "warning", "neutral"] as const;

/** Spending by category: one bar for the shape, and a list with names, amounts and shares. */
export function SpendingBreakdown({ title, categories, currency, locale = "en-US", headingLevel = 3, className }: SpendingBreakdownProps) {
  const m = messages(locale);
  const Heading = `h${headingLevel}` as const;
  const sorted = [...categories].filter((c) => c.amount > 0).sort((a, b) => b.amount - a.amount);
  const total = sorted.reduce((sum, c) => sum + c.amount, 0);
  const share = (amount: number) => (total > 0 ? Math.round((amount / total) * 100) : 0);
  return (
    <section className={cx(styles.root, className)} aria-label={title}>
      <div className={styles.header}>
        <Heading className={styles.title}>{title}</Heading>
        <AmountDisplay value={total} currency={currency} locale={locale} size="lg" />
      </div>
      <div className={styles.bar} aria-hidden="true">
        {sorted.map((c, i) => (
          <span key={c.name} className={cx(styles.slice, styles[TONES[i % TONES.length]!])} style={{ flexGrow: c.amount }} />
        ))}
      </div>
      <ul className={styles.list}>
        {sorted.map((c, i) => (
          <li key={c.name} className={styles.item}>
            <span className={cx(styles.swatch, styles[TONES[i % TONES.length]!])} aria-hidden="true" />
            {c.icon ? <Icon name={c.icon} size="sm" className={styles.icon} /> : <span aria-hidden="true" />}
            <span className={styles.name}>{c.name}</span>
            <span className={styles.share}>
              <span aria-hidden="true">{share(c.amount)}%</span>
              <span className={styles.srOnly}>{m.percentOfTotal(share(c.amount))}</span>
            </span>
            <span className={styles.amount}>{formatAmount(c.amount, { currency, locale })}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
