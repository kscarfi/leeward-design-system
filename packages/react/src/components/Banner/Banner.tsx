import type { ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import { IconButton } from "../IconButton/IconButton.tsx";
import { toneClasses, type MessageTone } from "../../utils/tone.ts";
import styles from "./Banner.module.css";

export type BannerTone = MessageTone;

export interface BannerProps {
  tone?: BannerTone;
  /** One or two short sentences about something that affects the whole app or page. */
  children: ReactNode;
  /** One Link or small Button, for example "See the schedule". */
  action?: ReactNode;
  /** Shows a close button. Leave it out for problems people cannot fix by closing the banner. */
  onDismiss?: () => void;
  /** "alert" only for urgent problems, such as an outage. Default "status". */
  live?: "status" | "alert" | "off";
  locale?: Locale;
  className?: string;
}

const toneIcon: Record<BannerTone, IconName> = { info: "info", success: "check-circle", warning: "alert-triangle", danger: "alert-circle", neutral: "bell" };

/** A full-width message at the top of the app or page, such as planned maintenance or a service problem. */
export function Banner({ tone = "info", children, action, onDismiss, live = "status", locale = "en-US", className }: BannerProps) {
  const role = live === "off" ? undefined : live;
  return (
    <div role={role} className={cx(styles.banner, toneClasses(tone).surface, className)}>
      <Icon name={toneIcon[tone]} weight="bold" className={cx(styles.icon, toneClasses(tone).icon)} />
      <div className={styles.body}>
        <p className={styles.text}>{children}</p>
        {action && <div className={styles.action}>{action}</div>}
      </div>
      {onDismiss && <IconButton icon="close" size="sm" label={messages(locale).dismiss} onClick={onDismiss} className={styles.dismiss} />}
    </div>
  );
}
