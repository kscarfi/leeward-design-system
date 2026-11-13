import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import styles from "./Heading.module.css";

export type HeadingSize =
  | "display-lg"
  | "display-md"
  | "title-xl"
  | "title-lg"
  | "title-md"
  | "title-sm"
  | "title-xs"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  /** Older short names: xl = title-lg, lg = title-sm, md = h2, sm = h3, xs = h5. */
  | "xl"
  | "lg"
  | "md"
  | "sm"
  | "xs";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Document outline level. Required so the page structure is always intentional. */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual size. Defaults to the heading role of the same level. Display and title sizes are fluid. */
  size?: HeadingSize;
  tone?: "default" | "muted" | "primary" | "inverse";
  children: ReactNode;
}

const sizeClass: Record<HeadingSize, string> = {
  "display-lg": "displayLg",
  "display-md": "displayMd",
  "title-xl": "titleXl",
  "title-lg": "titleLg",
  "title-md": "titleMd",
  "title-sm": "titleSm",
  "title-xs": "titleXs",
  h1: "headingH1",
  h2: "headingH2",
  h3: "headingH3",
  h4: "headingH4",
  h5: "headingH5",
  h6: "headingH6",
  xl: "titleLg",
  lg: "titleSm",
  md: "headingH2",
  sm: "headingH3",
  xs: "headingH5",
};

export function Heading({ level, size, tone = "default", className, children, ...rest }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag className={cx(styles[sizeClass[size ?? (`h${level}` as HeadingSize)]], styles[`tone-${tone}`], className)} {...rest}>
      {children}
    </Tag>
  );
}
