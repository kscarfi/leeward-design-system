import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import styles from "./Heading.module.css";

export type HeadingSize = "display-lg" | "display-md" | "xl" | "lg" | "md" | "sm" | "xs";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Document outline level. Required so the page structure is always intentional. */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual size. Defaults from the level, can differ when the design needs it. */
  size?: HeadingSize;
  tone?: "primary" | "secondary" | "inverse";
  children: ReactNode;
}

const defaultSize: Record<HeadingProps["level"], HeadingSize> = { 1: "xl", 2: "lg", 3: "md", 4: "sm", 5: "xs", 6: "xs" };
const sizeClass: Record<HeadingSize, string> = {
  "display-lg": "displayLg",
  "display-md": "displayMd",
  xl: "headingXl",
  lg: "headingLg",
  md: "headingMd",
  sm: "headingSm",
  xs: "headingXs",
};

export function Heading({ level, size, tone = "primary", className, children, ...rest }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag className={cx(styles[sizeClass[size ?? defaultSize[level]]], styles[`tone-${tone}`], className)} {...rest}>
      {children}
    </Tag>
  );
}
