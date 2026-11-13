import { cx } from "../../utils/cx.ts";
import styles from "./Spinner.module.css";

/** Internal loading indicator. Decorative: the parent announces the busy state. */
export function Spinner({ className }: { className?: string | undefined }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={cx(styles.spinner, className)}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
