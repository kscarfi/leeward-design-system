import { cx } from "../../utils/cx.ts";
import styles from "./Divider.module.css";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  /** Optional text in the middle, for example "or". */
  label?: string;
  /** Decorative dividers are hidden from screen readers. Set false when it separates real sections. */
  decorative?: boolean;
  className?: string;
}

export function Divider({ orientation = "horizontal", label, decorative = true, className }: DividerProps) {
  const a11y = decorative ? { "aria-hidden": true as const } : { role: "separator", "aria-orientation": orientation };
  if (label) {
    return (
      <div className={cx(styles.labelled, className)} {...a11y}>
        <span className={styles.line} />
        <span className={styles.label}>{label}</span>
        <span className={styles.line} />
      </div>
    );
  }
  return <div className={cx(styles.divider, styles[orientation], className)} {...a11y} />;
}
