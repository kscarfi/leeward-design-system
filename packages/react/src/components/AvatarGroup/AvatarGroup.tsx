import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Avatar } from "../Avatar/Avatar.tsx";
import styles from "./AvatarGroup.module.css";

export interface AvatarGroupPerson {
  name: string;
  src?: string;
}

export interface AvatarGroupProps {
  people: AvatarGroupPerson[];
  /** Avatars shown before the "+n" counter. Default 3. */
  max?: number;
  size?: "xs" | "sm" | "md" | "lg";
  locale?: Locale;
  className?: string;
}

/** A few people at once, for example who shares a joint account or a split bill. */
export function AvatarGroup({ people, max = 3, size = "sm", locale = "en-US", className }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  const names = shown.map((p) => p.name).join(", ");
  const label = rest > 0 ? messages(locale).andOthers(names, rest) : names;
  return (
    <div role="img" aria-label={label} className={cx(styles.group, styles[size], className)}>
      {shown.map((p) => (
        <Avatar key={p.name} name={p.name} size={size} decorative className={cx(styles.avatar)} {...(p.src ? { src: p.src } : {})} />
      ))}
      {rest > 0 && (
        <span className={cx(styles.more, styles.avatar)} aria-hidden="true">
          +{rest}
        </span>
      )}
    </div>
  );
}
