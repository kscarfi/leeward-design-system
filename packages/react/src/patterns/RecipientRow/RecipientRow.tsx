import type { MouseEventHandler } from "react";
import { maskIban, type Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Avatar } from "../../components/Avatar/Avatar.tsx";
import { Icon } from "../../components/Icon/Icon.tsx";
import { ListItem } from "../../components/ListItem/ListItem.tsx";
import styles from "./RecipientRow.module.css";

export interface RecipientRowProps {
  /** The person's or company's name, as saved. */
  name: string;
  iban: string;
  /** Bank name, for example "Leeward" or "Ziraat Bankası". */
  bank?: string;
  /** Photo or logo. Initials are shown without it. */
  avatarSrc?: string;
  favorite?: boolean;
  /** Choose this recipient. Renders the row as a button. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Open the recipient's page. Renders the row as a link. */
  href?: string;
  locale?: Locale;
  className?: string;
}

/** A saved recipient: avatar, name, bank and masked IBAN. Use inside List. */
export function RecipientRow({ name, iban, bank, avatarSrc, favorite, onClick, href, locale = "en-US", className }: RecipientRowProps) {
  const m = messages(locale);
  const last4 = iban.replace(/\s+/g, "").slice(-4);
  const interactive = Boolean(onClick || href);
  return (
    <ListItem
      {...(className ? { className } : {})}
      leading={<Avatar name={name} size="md" decorative {...(avatarSrc ? { src: avatarSrc } : {})} />}
      title={
        <>
          {/* Screen readers get one sentence; the visible name and star are hidden from them. */}
          <span aria-hidden="true">
            {name}
            {favorite && (
              <span className={styles.favorite}>
                <Icon name="star" size="sm" weight="bold" />
              </span>
            )}
          </span>
          <span className={styles.srOnly}>{favorite ? `${name}, ${m.favorite}` : name}</span>
        </>
      }
      description={
        <>
          <span aria-hidden="true">
            {bank ? `${bank} · ` : ""}
            {maskIban(iban)}
          </span>
          <span className={styles.srOnly}>
            {bank ? `${bank}, ` : ""}
            {m.ibanEnding} {last4.split("").join(" ")}
          </span>
        </>
      }
      chevron={interactive}
      {...(onClick ? { onClick } : {})}
      {...(href ? { href } : {})}
    />
  );
}
