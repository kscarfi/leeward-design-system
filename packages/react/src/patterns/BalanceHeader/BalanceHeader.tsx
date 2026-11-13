import { useState, type ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { IconButton } from "../../components/IconButton/IconButton.tsx";
import { AmountDisplay } from "../AmountDisplay/AmountDisplay.tsx";
import styles from "./BalanceHeader.module.css";

export interface BalanceHeaderProps {
  /** For example "Available balance". */
  label: string;
  balance: number;
  currency: string;
  locale?: Locale;
  /** Controlled hidden state. */
  hidden?: boolean;
  defaultHidden?: boolean;
  onHiddenChange?: (hidden: boolean) => void;
  /** Supporting line, for example "Updated 2 minutes ago". */
  meta?: ReactNode;
  /** Actions under the balance, usually Buttons with text labels. */
  actions?: ReactNode;
  className?: string;
}

export function BalanceHeader({ label, balance, currency, locale = "en-US", hidden, defaultHidden = false, onHiddenChange, meta, actions, className }: BalanceHeaderProps) {
  const m = messages(locale);
  const [internal, setInternal] = useState(defaultHidden);
  const isHidden = hidden ?? internal;
  const toggle = () => {
    const next = !isHidden;
    if (hidden === undefined) setInternal(next);
    onHiddenChange?.(next);
  };
  return (
    <section className={cx(styles.root, className)} aria-label={label}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{label}</span>
        <IconButton
          icon={isHidden ? "eye" : "eye-off"}
          label={isHidden ? m.showBalance : m.hideBalance}
          size="sm"
          aria-pressed={isHidden}
          onClick={toggle}
        />
      </div>
      <AmountDisplay value={balance} currency={currency} locale={locale} size="lg" masked={isHidden} />
      {meta && <p className={styles.meta}>{meta}</p>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </section>
  );
}
