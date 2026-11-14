import { cx } from "../../utils/cx.ts";
import { formatAmount, formatDate, type Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Button } from "../../components/Button/Button.tsx";
import { Card } from "../../components/Card/Card.tsx";
import { Icon } from "../../components/Icon/Icon.tsx";
import type { IconName } from "../../components/Icon/icons.ts";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar.tsx";
import { AmountDisplay } from "../AmountDisplay/AmountDisplay.tsx";
import styles from "./SavingsGoal.module.css";

export interface SavingsGoalProps {
  /** For example "Holiday fund". */
  name: string;
  saved: number;
  target: number;
  currency: string;
  targetDate?: Date;
  icon?: IconName;
  locale?: Locale;
  /** Shows an "Add money" button. */
  onAddMoney?: () => void;
  addMoneyLabel?: string;
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

/** A savings goal: saved amount, target, progress and the date to reach it. */
export function SavingsGoal({ name, saved, target, currency, targetDate, icon = "piggy-bank", locale = "en-US", onAddMoney, addMoneyLabel, headingLevel = 3, className }: SavingsGoalProps) {
  const m = messages(locale);
  const Heading = `h${headingLevel}` as const;
  const percent = target > 0 ? Math.min(100, Math.floor((saved / target) * 100)) : 0;
  const reached = saved >= target;
  const targetText = formatAmount(target, { currency, locale });
  return (
    <Card as="article" variant="outlined" padding="lg" className={cx(styles.card, className)} aria-label={name}>
      <div className={styles.top}>
        <span className={styles.icon} aria-hidden="true">
          <Icon name={icon} />
        </span>
        <div className={styles.titles}>
          <Heading className={styles.name}>{name}</Heading>
          {targetDate && <p className={styles.meta}>{m.targetBy(formatDate(targetDate, locale, "long"))}</p>}
        </div>
      </div>
      <div className={styles.amounts}>
        <AmountDisplay value={saved} currency={currency} locale={locale} size="lg" />
        <span className={styles.meta}>{m.ofTarget(targetText)}</span>
      </div>
      <ProgressBar label={m.progress} value={Math.min(saved, target)} max={target} valueText={reached ? m.goalReached : m.saved(percent)} tone={reached ? "success" : "brand"} />
      {onAddMoney && (
        <div>
          <Button variant="secondary" size="sm" iconStart="plus" onClick={onAddMoney}>
            {addMoneyLabel ?? m.addMoney}
          </Button>
        </div>
      )}
    </Card>
  );
}
