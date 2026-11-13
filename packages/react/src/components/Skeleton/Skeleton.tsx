import type { CSSProperties } from "react";
import { cx } from "../../utils/cx.ts";
import styles from "./Skeleton.module.css";

export interface SkeletonProps {
  shape?: "text" | "rect" | "circle";
  /** Any CSS length. Defaults to 100% for text and rect. */
  width?: string;
  /** Any CSS length. Text skeletons follow the line height. */
  height?: string;
  /** Number of text lines. The last one is shorter. */
  lines?: number;
  className?: string;
}

/** Loading placeholder. Hidden from screen readers: mark the loading region with aria-busy instead. */
export function Skeleton({ shape = "text", width, height, lines = 1, className }: SkeletonProps) {
  const style: CSSProperties = { ...(width ? { width } : {}), ...(height ? { height } : {}) };
  if (shape === "text" && lines > 1) {
    return (
      <span className={cx(styles.stack, className)} aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className={cx(styles.skeleton, styles.text, i === lines - 1 && styles.last)} style={style} />
        ))}
      </span>
    );
  }
  return <span className={cx(styles.skeleton, styles[shape], className)} style={style} aria-hidden="true" />;
}
