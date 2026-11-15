import type { ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { IconButton } from "../IconButton/IconButton.tsx";
import styles from "./PageHeader.module.css";

export interface PageHeaderProps {
  /** The screen title. Rendered as the page's h1. */
  title: string;
  /** Shows a back button. Leave it out on top-level screens. */
  onBack?: () => void;
  backLabel?: string;
  /** Up to two IconButtons or one small Button on the end side. */
  actions?: ReactNode;
  /** Stays at the top while the page scrolls. */
  sticky?: boolean;
  locale?: Locale;
  className?: string;
}

/** The top of a screen: back, title and a few actions. Keeps the same height on every screen. */
export function PageHeader({ title, onBack, backLabel, actions, sticky, locale = "en-US", className }: PageHeaderProps) {
  return (
    <header className={cx(styles.header, sticky && styles.sticky, className)}>
      {onBack && <IconButton icon="arrow-left" label={backLabel ?? messages(locale).back} onClick={onBack} />}
      <h1 className={styles.title}>{title}</h1>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
