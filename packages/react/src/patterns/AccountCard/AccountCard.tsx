import type { ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { maskIban, type Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Button } from "../../components/Button/Button.tsx";
import { Card } from "../../components/Card/Card.tsx";
import { Icon } from "../../components/Icon/Icon.tsx";
import type { IconName } from "../../components/Icon/icons.ts";
import { AmountDisplay } from "../AmountDisplay/AmountDisplay.tsx";
import styles from "./AccountCard.module.css";

export interface AccountAction {
  /** Text label is required: money movement is never icon-only. */
  label: string;
  icon?: IconName;
  onClick: () => void;
}

export interface AccountCardProps {
  /** For example "Everyday account". */
  name: string;
  /** For example "Current account" or "Savings". */
  type: string;
  iban: string;
  balance: number;
  currency: string;
  locale?: Locale;
  /** Up to three quick actions. */
  actions?: AccountAction[];
  /** Hide the balance digits. */
  masked?: boolean;
  /** Extra content under the balance, for example an interest rate. */
  footer?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

export function AccountCard({ name, type, iban, balance, currency, locale = "en-US", actions = [], masked, footer, headingLevel = 3, className }: AccountCardProps) {
  const m = messages(locale);
  const Heading = `h${headingLevel}` as const;
  const last4 = iban.replace(/\s+/g, "").slice(-4);
  return (
    <Card as="article" variant="elevated" padding="lg" className={cx(styles.card, className)} aria-label={`${name}, ${type}`}>
      <div className={styles.top}>
        <span className={styles.icon} aria-hidden="true">
          <Icon name={type.toLowerCase().includes("saving") ? "wallet" : "bank"} />
        </span>
        <div className={styles.titles}>
          <Heading className={styles.name}>{name}</Heading>
          <p className={styles.type}>{type}</p>
        </div>
      </div>
      <AmountDisplay value={balance} currency={currency} locale={locale} size="lg" masked={masked ?? false} />
      <p className={styles.iban}>
        <span aria-hidden="true">{maskIban(iban)}</span>
        <span className={styles.srOnly}>
          {m.ibanEnding} {last4.split("").join(" ")}
        </span>
      </p>
      {footer && <div className={styles.footer}>{footer}</div>}
      {actions.length > 0 && (
        <div className={styles.actions}>
          {actions.slice(0, 3).map((action, index) => (
            <Button key={action.label} variant={index === 0 ? "primary" : "secondary"} size="sm" {...(action.icon ? { iconStart: action.icon } : {})} onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
}
