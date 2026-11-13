import type { SVGProps } from "react";
import { cx } from "../../utils/cx.ts";
import styles from "./Icon.module.css";
import { icons, type IconName } from "./icons.ts";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  name: IconName;
  size?: "sm" | "md" | "lg";
  /** Give a label only when the icon carries meaning on its own. Without one the icon is hidden from assistive tech. */
  label?: string;
}

export function Icon({ name, size = "md", label, className, ...rest }: IconProps) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      className={cx(styles.icon, styles[size], className)}
      data-icon={name}
      {...a11y}
      {...rest}
    >
      {icons[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
