import { Avatar as RadixAvatar } from "radix-ui";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import styles from "./Avatar.module.css";

export interface AvatarProps {
  /** Person or merchant name. Used for initials and as the accessible name. */
  name: string;
  src?: string;
  /** Show an icon instead of initials, for example for categories. */
  icon?: IconName;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Set when a visible name sits next to the avatar, so screen readers do not hear it twice. */
  decorative?: boolean;
  className?: string;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toLocaleUpperCase();
}

const TONES = ["primary", "secondary", "info", "success", "warning"] as const;

/** A stable tone per name, so the same person always gets the same color. */
export function avatarTone(name: string): (typeof TONES)[number] {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.codePointAt(0)!) >>> 0;
  return TONES[hash % TONES.length]!;
}

export function Avatar({ name, src, icon, size = "md", decorative = false, className }: AvatarProps) {
  const a11y = decorative ? { "aria-hidden": true as const } : { role: "img", "aria-label": name };
  return (
    <RadixAvatar.Root className={cx(styles.avatar, styles[size], !icon && styles[`tone-${avatarTone(name)}`], className)} {...a11y}>
      {src && <RadixAvatar.Image src={src} alt="" className={styles.image} />}
      <RadixAvatar.Fallback className={styles.fallback} delayMs={src ? 300 : 0}>
        {icon ? <Icon name={icon} size={size === "xl" ? "xl" : size === "lg" ? "lg" : size === "xs" ? "sm" : "md"} /> : initials(name)}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
