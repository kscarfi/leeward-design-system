import type { AnchorHTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import styles from "./Link.module.css";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  /** Opens in a new tab with an icon and screen reader text that say so. */
  external?: boolean;
  /** standalone for links on their own line, inline for links inside a sentence (always underlined). */
  variant?: "inline" | "standalone";
  externalLabel?: string;
  /** Icon before the text, for standalone links such as "Download statement". */
  iconStart?: IconName;
  /** Icon after the text, for example `arrow-right` for "See all". Not with `external`, which adds its own icon. */
  iconEnd?: IconName;
  ref?: Ref<HTMLAnchorElement>;
}

export function Link({ children, external, variant = "inline", externalLabel = "opens in a new tab", iconStart, iconEnd, className, ref, ...rest }: LinkProps) {
  return (
    <a ref={ref} className={cx(styles.link, styles[variant], className)} {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})} {...rest}>
      {iconStart && <Icon name={iconStart} size="sm" className={styles.iconStart} />}
      {children}
      {iconEnd && !external && <Icon name={iconEnd} size="sm" className={styles.icon} />}
      {external && (
        <>
          <Icon name="arrow-up-right" size="sm" className={styles.icon} />
          <span className={styles.srOnly}>, {externalLabel}</span>
        </>
      )}
    </a>
  );
}
