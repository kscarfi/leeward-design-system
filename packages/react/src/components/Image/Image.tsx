import { useState, type ImgHTMLAttributes } from "react";
import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Icon } from "../Icon/Icon.tsx";
import styles from "./Image.module.css";

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "alt"> {
  /** Required. Describe what the image shows; use "" only for purely decorative images. */
  alt: string;
  /** Width to height, for example "16 / 9" or "1". Reserves space so the page does not jump. */
  ratio?: string;
  /** How the image fills its box. Default cover. */
  fit?: "cover" | "contain";
  rounded?: boolean;
  locale?: Locale;
}

/** An image that keeps its space while loading and shows a calm fallback if it fails. */
export function Image({ alt, ratio, fit = "cover", rounded = true, locale = "en-US", className, style, onError, ...rest }: ImageProps) {
  const [failed, setFailed] = useState(false);
  const box = { ...(ratio ? { aspectRatio: ratio } : {}), ...style };
  if (failed) {
    return (
      <span role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} className={cx(styles.fallback, rounded && styles.rounded, className)} style={box}>
        <Icon name="document" size="lg" />
        <span className={styles.fallbackText} aria-hidden="true">{messages(locale).imageUnavailable}</span>
      </span>
    );
  }
  return (
    <img
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cx(styles.image, styles[fit], rounded && styles.rounded, className)}
      style={box}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
      {...rest}
    />
  );
}
