import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import styles from "./Text.module.css";

export type TextVariant = "body-md" | "body-sm" | "label-md" | "label-sm" | "caption";
export type TextTone = "primary" | "secondary" | "tertiary" | "brand" | "success" | "warning" | "danger" | "inverse";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "div" | "label" | "strong" | "em" | "small" | "dt" | "dd" | "li";
  variant?: TextVariant;
  tone?: TextTone;
  /** Tabular figures, for numbers that line up in columns. */
  tabular?: boolean;
  /** Clamp to a number of lines with an ellipsis. */
  truncate?: boolean;
  htmlFor?: string;
  children: ReactNode;
}

const variantClass: Record<TextVariant, string> = {
  "body-md": "bodyMd",
  "body-sm": "bodySm",
  "label-md": "labelMd",
  "label-sm": "labelSm",
  caption: "caption",
};

export function Text({ as = "p", variant = "body-md", tone = "primary", tabular, truncate, className, children, ...rest }: TextProps) {
  const Component = as as ElementType;
  return (
    <Component
      className={cx(styles[variantClass[variant]], styles[`tone-${tone}`], tabular && styles.tabular, truncate && styles.truncate, className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
