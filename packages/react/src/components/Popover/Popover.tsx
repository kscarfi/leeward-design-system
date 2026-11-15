import { Popover as RadixPopover } from "radix-ui";
import type { ReactElement, ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { IconButton } from "../IconButton/IconButton.tsx";
import styles from "./Popover.module.css";

export interface PopoverProps {
  /** A single focusable element, usually a Button, IconButton or Link. */
  trigger: ReactElement;
  /** Short heading. Also the popover's accessible name. */
  title: string;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  locale?: Locale;
  className?: string;
}

/** Extra detail next to the thing it explains, such as how a fee is calculated. Can hold links and buttons, unlike Tooltip. */
export function Popover({ trigger, title, children, side = "bottom", align = "center", locale = "en-US", className, ...root }: PopoverProps) {
  return (
    <RadixPopover.Root {...root}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content side={side} align={align} sideOffset={8} collisionPadding={12} className={cx(styles.content, className)} aria-label={title}>
          <div className={styles.header}>
            <p className={styles.title}>{title}</p>
            <RadixPopover.Close asChild>
              <IconButton icon="close" size="sm" label={messages(locale).close} />
            </RadixPopover.Close>
          </div>
          <div className={styles.body}>{children}</div>
          <RadixPopover.Arrow className={styles.arrow} />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}
