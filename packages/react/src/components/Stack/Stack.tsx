import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import styles from "./Stack.module.css";

export type SpaceToken = "none" | "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

export interface StackProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "ul" | "ol" | "li" | "header" | "footer" | "main" | "nav" | "form";
  /** vertical (default) stacks children top to bottom; horizontal puts them in a row. */
  direction?: "vertical" | "horizontal";
  /** Space between children, from the spacing scale. */
  gap?: SpaceToken;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between";
  /** Let a horizontal stack wrap onto new lines on narrow screens. */
  wrap?: boolean;
  children: ReactNode;
}

const alignMap = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline" } as const;
const justifyMap = { start: "flex-start", center: "center", end: "flex-end", between: "space-between" } as const;

/** Lays out children with consistent spacing from the scale, so screens never need hand-written margins. */
export function Stack({ as: Component = "div", direction = "vertical", gap = "md", align, justify, wrap, className, style, children, ...rest }: StackProps) {
  const layout: CSSProperties = {
    gap: `var(--lw-space-${gap})`,
    ...(align ? { alignItems: alignMap[align] } : {}),
    ...(justify ? { justifyContent: justifyMap[justify] } : {}),
    ...style,
  };
  return (
    <Component className={cx(styles.stack, styles[direction], wrap && styles.wrap, className)} style={layout} {...rest}>
      {children}
    </Component>
  );
}
