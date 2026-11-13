import { cx } from "../../utils/cx.ts";
import { formatAmount, spokenAmount, type Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Icon } from "../../components/Icon/Icon.tsx";
import styles from "./AmountDisplay.module.css";

export type AmountDirection = "incoming" | "outgoing" | "neutral";

export interface AmountDisplayProps {
  /** Positive number. Direction decides the sign. Negative values are treated as outgoing. */
  value: number;
  currency: string;
  locale?: Locale;
  /** incoming: plus sign and teal. outgoing: minus sign and ink, never red. neutral: no sign, for balances. */
  direction?: AmountDirection;
  /** xl for the hero balance, lg for account cards, md and sm for lists. */
  size?: "sm" | "md" | "lg" | "xl";
  /** Not settled yet. Adds a clock icon and a "Pending" label. */
  pending?: boolean;
  /** Replace digits with dots, for example when the user hides balances. */
  masked?: boolean;
  className?: string;
}

export function AmountDisplay({ value, currency, locale = "en-US", direction, size = "md", pending, masked, className }: AmountDisplayProps) {
  const m = messages(locale);
  const dir: AmountDirection = direction ?? (value < 0 ? "outgoing" : "neutral");
  const abs = Math.abs(value);
  const signed = dir === "outgoing" ? -abs : abs;
  const visual = masked ? "••••" : formatAmount(signed, { currency, locale, sign: dir === "incoming" ? "always" : "auto" });
  const spokenDirection = dir === "incoming" ? `${m.moneyIn}: ` : dir === "outgoing" ? `${m.moneyOut}: ` : "";
  const spoken = masked ? m.balanceHidden : `${spokenDirection}${spokenAmount(abs, currency, locale)}${pending ? `, ${m.pending}` : ""}`;

  return (
    <span className={cx(styles.amount, styles[dir], pending && styles.pending, className)} data-direction={dir}>
      <span aria-hidden="true" className={styles[`value-${size}`]}>
        {visual}
      </span>
      {pending && (
        <span aria-hidden="true" className={styles.pendingLabel}>
          <Icon name="clock" size="sm" />
          {m.pending}
        </span>
      )}
      <span className={styles.srOnly}>{spoken}</span>
    </span>
  );
}
