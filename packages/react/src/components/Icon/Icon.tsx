import type { SVGProps } from "react";
import { cx } from "../../utils/cx.ts";
import styles from "./Icon.module.css";
import { iconData, type IconName, type IconWeight } from "./icons.ts";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children" | "dangerouslySetInnerHTML"> {
  name: IconName;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** linear for most UI, bold for selected or active states, duotone for illustrations and empty states. */
  weight?: IconWeight;
  /** Give a label only when the icon carries meaning on its own. Without one the icon is hidden from assistive tech. */
  label?: string;
}

/** Solar icon on a 24 px grid. Draws in currentColor, so it follows the surrounding text tone. */
export function Icon({ name, size = "md", weight = "linear", label, className, ...rest }: IconProps) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      focusable="false"
      className={cx(styles.icon, styles[size], className)}
      data-icon={name}
      {...a11y}
      {...rest}
      // Static markup generated at build time from the Solar SVG files, never from user input.
      dangerouslySetInnerHTML={{ __html: iconData[name][weight] }}
    />
  );
}
