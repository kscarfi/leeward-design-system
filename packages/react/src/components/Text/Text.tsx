import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import styles from "./Text.module.css";

export type TextVariant = "body-lg" | "body-md" | "body-sm" | "label-lg" | "label-md" | "label-sm" | "label-xs" | "subtitle-lg" | "subtitle-md" | "subtitle-sm" | "caption" | "code";
export type TextTone = "primary" | "secondary" | "tertiary" | "brand" | "success" | "warning" | "danger" | "inverse";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "div" | "label" | "strong" | "em" | "small" | "dt" | "dd" | "li" | "code";
  variant?: TextVariant;
  /** primary = default text, secondary = muted, tertiary = subtle. All pass AA on every surface. */
  tone?: TextTone;
  /** Tabular figures, for numbers that line up in columns. */
  tabular?: boolean;
  /** Cut to one line with an ellipsis. */
  truncate?: boolean;
  htmlFor?: string;
  children: ReactNode;
}

const variantClass: Record<TextVariant, string> = {
  "body-lg": "bodyLg",
  "body-md": "bodyMd",
  "body-sm": "bodySm",
  "label-lg": "labelLg",
  "label-md": "labelMd",
  "label-sm": "labelSm",
  "label-xs": "labelXs",
  "subtitle-lg": "subtitleLg",
  "subtitle-md": "subtitleMd",
  "subtitle-sm": "subtitleSm",
  caption: "caption",
  code: "code",
};

export function Text({ as = "p", variant = "body-md", tone = "primary", tabular, truncate, className, children, ...rest }: TextProps) {
  const Component = as as ElementType;
  return (
    <Component className={cx(styles[variantClass[variant]], styles[`tone-${tone}`], tabular && styles.tabular, truncate && styles.truncate, className)} {...rest}>
      {children}
    </Component>
  );
}
