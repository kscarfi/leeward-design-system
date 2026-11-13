import type { AnchorHTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import styles from "./Link.module.css";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  /** Opens in a new tab with an icon and screen reader text that say so. */
  external?: boolean;
  /** standalone for links on their own line, inline for links inside a sentence (always underlined). */
  variant?: "inline" | "standalone";
  externalLabel?: string;
  ref?: Ref<HTMLAnchorElement>;
}

export function Link({ children, external, variant = "inline", externalLabel = "opens in a new tab", className, ref, ...rest }: LinkProps) {
  return (
    <a ref={ref} className={cx(styles.link, styles[variant], className)} {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})} {...rest}>
      {children}
      {external && (
        <>
          <Icon name="arrow-up-right" size="sm" className={styles.icon} />
          <span className={styles.srOnly}>, {externalLabel}</span>
        </>
      )}
    </a>
  );
}
