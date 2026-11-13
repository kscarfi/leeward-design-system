import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import styles from "./Card.module.css";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "article" | "li";
  variant?: "outlined" | "elevated" | "filled";
  padding?: "none" | "sm" | "md" | "lg";
  children: ReactNode;
}

export function Card({ as: Component = "div", variant = "outlined", padding = "md", className, children, ...rest }: CardProps) {
  return (
    <Component className={cx(styles.card, styles[variant], styles[`padding-${padding}`], className)} {...rest}>
      {children}
    </Component>
  );
}
