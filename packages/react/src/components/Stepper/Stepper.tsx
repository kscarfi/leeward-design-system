import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import styles from "./Stepper.module.css";

export interface StepperProps {
  /** Short step names, for example ["Recipient", "Amount", "Review", "Confirm"]. */
  steps: string[];
  /** Zero-based index of the current step. */
  current: number;
  /** compact shows "Step 2 of 4" and a bar, for phones. */
  variant?: "full" | "compact";
  label?: string;
  className?: string;
}

/** Shows where people are in a multi-step flow. Completed, current and upcoming use icons and text, not color alone. */
export function Stepper({ steps, current, variant = "full", label = "Progress", className }: StepperProps) {
  if (variant === "compact") {
    const percent = Math.round(((current + 1) / steps.length) * 100);
    return (
      <div className={cx(styles.compact, className)}>
        <p className={styles.compactText}>
          <span>Step {current + 1} of {steps.length}</span>
          <span className={styles.compactName}>{steps[current]}</span>
        </p>
        <div className={styles.bar} aria-hidden="true">
          <span className={styles.barFill} style={{ inlineSize: `${percent}%` }} />
        </div>
      </div>
    );
  }
  return (
    <nav aria-label={label} className={cx(styles.root, className)}>
      <ol className={styles.list}>
        {steps.map((step, i) => {
          const state = i < current ? "done" : i === current ? "current" : "upcoming";
          return (
            <li key={step} className={cx(styles.step, styles[state])} {...(state === "current" ? { "aria-current": "step" as const } : {})}>
              <span className={styles.marker} aria-hidden="true">
                {state === "done" ? <Icon name="check" size="sm" weight="bold" /> : i + 1}
              </span>
              <span className={styles.name}>
                {step}
                {state === "done" && <span className={styles.srOnly}>, completed</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
