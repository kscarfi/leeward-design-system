import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import styles from "./SkipLink.module.css";

export interface SkipLinkProps {
  /** The id of the main content, without "#". */
  targetId?: string;
  /** Defaults to "Skip to main content" in the locale. */
  label?: string;
  locale?: Locale;
  className?: string;
}

/** The first focusable element on the page. Hidden until focused; lets keyboard users jump past the navigation. */
export function SkipLink({ targetId = "main", label, locale = "en-US", className }: SkipLinkProps) {
  return (
    <a href={`#${targetId}`} className={cx(styles.link, className)}>
      {label ?? messages(locale).skipToContent}
    </a>
  );
}
