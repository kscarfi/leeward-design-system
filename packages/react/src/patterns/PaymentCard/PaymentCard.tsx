import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Icon } from "../../components/Icon/Icon.tsx";
import styles from "./PaymentCard.module.css";

export interface PaymentCardProps {
  /** For example "Everyday debit" or "Travel card". */
  name: string;
  /** The last four digits only. Never pass the full card number. */
  last4: string;
  /** "MM/YY". */
  expiry: string;
  holder: string;
  /** Network or type shown in the corner, for example "Debit" or "Virtual". */
  type?: string;
  /** Bank name on the card. Defaults to "Leeward". */
  bank?: string;
  frozen?: boolean;
  locale?: Locale;
  className?: string;
}

/** Card artwork with the masked number, holder and expiry. Shows a clear frozen state. */
export function PaymentCard({ name, last4, expiry, holder, type, bank = "Leeward", frozen, locale = "en-US", className }: PaymentCardProps) {
  const m = messages(locale);
  const label = `${name}, ${m.cardEnding} ${last4.split("").join(" ")}, ${m.expires} ${expiry}${frozen ? `, ${m.frozen}` : ""}`;
  return (
    <article className={cx(styles.card, frozen && styles.frozen, className)} aria-label={label}>
      <div className={styles.top} aria-hidden="true">
        <span className={styles.brand}>{bank}</span>
        {frozen ? (
          <span className={styles.badge}>
            <Icon name="lock" size="sm" />
            {m.frozen}
          </span>
        ) : (
          type && <span className={styles.type}>{type}</span>
        )}
      </div>
      <p className={styles.number} aria-hidden="true">
        <span>••••</span>
        <span>••••</span>
        <span>••••</span>
        <span>{last4}</span>
      </p>
      <div className={styles.bottom} aria-hidden="true">
        <div className={styles.field}>
          <span className={styles.caption}>{name}</span>
          <span className={styles.holder}>{holder}</span>
        </div>
        <div className={cx(styles.field, styles.end)}>
          <span className={styles.caption}>{m.expires}</span>
          <span className={styles.holder}>{expiry}</span>
        </div>
      </div>
    </article>
  );
}
