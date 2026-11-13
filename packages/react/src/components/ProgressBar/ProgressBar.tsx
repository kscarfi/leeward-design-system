import { Progress } from "radix-ui";
import { useId } from "react";
import { cx } from "../../utils/cx.ts";
import styles from "./ProgressBar.module.css";

export interface ProgressBarProps {
  /** Visible label, for example "Monthly spending limit". */
  label: string;
  value: number;
  max?: number;
  /** Text shown on the end side, for example "₺7.500 of ₺10.000". Defaults to a percentage. */
  valueText?: string;
  /** Pair warning and danger with words in valueText, for example "90% used". Color is never the only signal. */
  tone?: "brand" | "success" | "warning" | "danger";
  className?: string;
}

export function ProgressBar({ label, value, max = 100, valueText, tone = "brand", className }: ProgressBarProps) {
  const id = useId();
  const percent = Math.round((Math.min(Math.max(value, 0), max) / max) * 100);
  const text = valueText ?? `${percent}%`;
  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.header}>
        <span id={id} className={styles.label}>
          {label}
        </span>
        <span className={styles.value}>{text}</span>
      </div>
      <Progress.Root value={value} max={max} aria-labelledby={id} aria-valuetext={text} getValueLabel={() => text} className={styles.track}>
        <Progress.Indicator className={cx(styles.indicator, styles[tone])} style={{ transform: `translateX(-${100 - percent}%)` }} />
      </Progress.Root>
    </div>
  );
}
