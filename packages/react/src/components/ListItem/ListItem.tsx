import type { AnchorHTMLAttributes, HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import styles from "./ListItem.module.css";

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** Draw a divider between items. */
  divided?: boolean;
  children: ReactNode;
}

export function List({ divided = true, className, children, ...rest }: ListProps) {
  return (
    <ul className={cx(styles.list, divided && styles.divided, className)} {...rest}>
      {children}
    </ul>
  );
}

export interface ListItemProps {
  title: ReactNode;
  description?: ReactNode;
  /** Avatar or icon on the start side. */
  leading?: ReactNode;
  /** Value, badge or control on the end side. */
  trailing?: ReactNode;
  /** Makes the whole row a link. */
  href?: string;
  /** Makes the whole row a button. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Show a chevron when the row opens another screen. */
  chevron?: boolean;
  /** Overrides the accessible name of the interactive row. */
  "aria-label"?: string;
  linkProps?: AnchorHTMLAttributes<HTMLAnchorElement>;
  className?: string;
}

export function ListItem({ title, description, leading, trailing, href, onClick, chevron, linkProps, className, ...aria }: ListItemProps) {
  const body = (
    <>
      {leading && <span className={styles.leading}>{leading}</span>}
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
      {trailing && <span className={styles.trailing}>{trailing}</span>}
      {chevron && <Icon name="chevron-right" className={styles.chevron} />}
    </>
  );
  let content: ReactNode;
  if (href) {
    content = (
      <a href={href} className={cx(styles.row, styles.interactive)} aria-label={aria["aria-label"]} {...linkProps}>
        {body}
      </a>
    );
  } else if (onClick) {
    content = (
      <button type="button" onClick={onClick} className={cx(styles.row, styles.interactive)} aria-label={aria["aria-label"]}>
        {body}
      </button>
    );
  } else {
    content = <div className={styles.row}>{body}</div>;
  }
  return <li className={cx(styles.item, className)}>{content}</li>;
}
