import type { MouseEventHandler } from "react";
import { cx } from "../../utils/cx.ts";
import { formatAmount, formatDate, spokenAmount, type Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Avatar } from "../../components/Avatar/Avatar.tsx";
import { Badge } from "../../components/Badge/Badge.tsx";
import type { IconName } from "../../components/Icon/icons.ts";
import styles from "./TransactionRow.module.css";

export type TransactionStatus = "completed" | "pending" | "declined";

export interface TransactionRowProps {
  merchant: string;
  category: string;
  date: Date;
  /** Positive number. Direction decides the sign. */
  amount: number;
  direction: "incoming" | "outgoing";
  currency: string;
  locale?: Locale;
  status?: TransactionStatus;
  /** Category icon. Without it the merchant initials are shown. */
  icon?: IconName;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

/** Builds the one sentence a screen reader hears for the whole row. */
export function transactionSentence(p: Pick<TransactionRowProps, "merchant" | "category" | "date" | "amount" | "direction" | "currency" | "locale" | "status">): string {
  const m = messages(p.locale);
  const parts = [
    p.merchant,
    p.category,
    formatDate(p.date, p.locale, "long"),
    `${p.direction === "incoming" ? m.moneyIn : m.moneyOut} ${spokenAmount(p.amount, p.currency, p.locale)}`,
  ];
  if (p.status === "pending") parts.push(m.pending);
  if (p.status === "declined") parts.push(m.declined);
  return parts.join(", ");
}

export function TransactionRow(props: TransactionRowProps) {
  const { merchant, category, date, amount, direction, currency, locale = "en-US", status = "completed", icon, onClick, className } = props;
  const m = messages(locale);
  const sentence = transactionSentence({ ...props, locale, status });
  const signed = direction === "outgoing" ? -Math.abs(amount) : Math.abs(amount);

  const visual = (
    <span className={styles.visual} aria-hidden="true">
      <Avatar name={merchant} {...(icon ? { icon } : {})} decorative />
      <span className={styles.text}>
        <span className={styles.merchant}>{merchant}</span>
        <span className={styles.meta}>
          {category} · {formatDate(date, locale)}
        </span>
      </span>
      <span className={styles.end}>
        <span className={cx(styles.amount, styles[direction], status === "declined" && styles.declined)}>
          {formatAmount(signed, { currency, locale, sign: direction === "incoming" ? "always" : "auto" })}
        </span>
        {status === "pending" && <Badge tone="warning">{m.pending}</Badge>}
        {status === "declined" && <Badge tone="danger">{m.declined}</Badge>}
      </span>
    </span>
  );

  return (
    <li className={cx(styles.row, className)}>
      {onClick ? (
        // The name comes from the hidden sentence, which starts with the visible merchant name,
        // so voice control users can say what they see.
        <button type="button" className={styles.button} onClick={onClick}>
          <span className={styles.srOnly}>{sentence}</span>
          {visual}
        </button>
      ) : (
        <div className={styles.static}>
          <span className={styles.srOnly}>{sentence}</span>
          {visual}
        </div>
      )}
    </li>
  );
}
