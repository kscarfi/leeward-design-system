import { cx } from "../../utils/cx.ts";
import styles from "./Spinner.module.css";

export interface SpinnerProps {
  /** With a label the spinner is announced as a status. Without one it is decorative. */
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string | undefined;
}

/** Loading indicator. Prefer Skeleton for content and Button loading for actions. */
export function Spinner({ label, size = "md", className }: SpinnerProps) {
  const svg = (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={cx(styles.spinner, styles[size], className)}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
  if (!label) return svg;
  return (
    <span role="status" className={styles.wrap}>
      {svg}
      <span className={styles.srOnly}>{label}</span>
    </span>
  );
}
