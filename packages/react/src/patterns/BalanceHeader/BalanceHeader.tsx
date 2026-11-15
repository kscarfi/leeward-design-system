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
  /** Controlled state: true shows four dots in place of the balance. */
  masked?: boolean;
  defaultMasked?: boolean;
  onMaskedChange?: (masked: boolean) => void;
  /** @deprecated Use `masked`. Kept until 2.0. */
  hidden?: boolean;
  /** @deprecated Use `defaultMasked`. Kept until 2.0. */
  defaultHidden?: boolean;
  /** @deprecated Use `onMaskedChange`. Kept until 2.0. */
  onHiddenChange?: (hidden: boolean) => void;
  /** Supporting line, for example "Updated 2 minutes ago". */
  meta?: ReactNode;
  /** Actions under the balance, usually Buttons with text labels. */
  actions?: ReactNode;
  className?: string;
}

export function BalanceHeader({ label, balance, currency, locale = "en-US", masked, defaultMasked, onMaskedChange, hidden, defaultHidden, onHiddenChange, meta, actions, className }: BalanceHeaderProps) {
  const m = messages(locale);
  const controlled = masked ?? hidden;
  const [internal, setInternal] = useState(defaultMasked ?? defaultHidden ?? false);
  const isMasked = controlled ?? internal;
  const toggle = () => {
    const next = !isMasked;
    if (controlled === undefined) setInternal(next);
    (onMaskedChange ?? onHiddenChange)?.(next);
  };
  return (
    <section className={cx(styles.root, className)} aria-label={label}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{label}</span>
        <IconButton
          icon={isMasked ? "eye" : "eye-off"}
          label={isMasked ? m.showBalance : m.hideBalance}
          size="sm"
          aria-pressed={isMasked}
          onClick={toggle}
        />
      </div>
      <AmountDisplay value={balance} currency={currency} locale={locale} size="xl" masked={isMasked} />
      {meta && <p className={styles.meta}>{meta}</p>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </section>
  );
}
