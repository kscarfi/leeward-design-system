import { Dialog as RadixDialog } from "radix-ui";
import type { ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { IconButton } from "../IconButton/IconButton.tsx";
import styles from "./Sheet.module.css";

export interface SheetProps {
  title: string;
  description?: ReactNode;
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** bottom on phones by default; end slides in from the right on wider screens. */
  side?: "bottom" | "end";
  children?: ReactNode;
  footer?: ReactNode;
  closeLabel?: string;
  className?: string;
}

/** Panel for a task in context, such as filters or transaction details. Traps focus like Dialog. */
export function Sheet({ title, description, trigger, side = "bottom", children, footer, closeLabel = "Close", className, ...root }: SheetProps) {
  return (
    <RadixDialog.Root {...root}>
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={styles.overlay} />
        <RadixDialog.Content className={cx(styles.sheet, styles[side], className)} {...(description ? {} : { "aria-describedby": undefined })}>
          {side === "bottom" && <span className={styles.handle} aria-hidden="true" />}
          <header className={styles.header}>
            <RadixDialog.Title className={styles.title}>{title}</RadixDialog.Title>
            <RadixDialog.Close asChild>
              <IconButton icon="close" label={closeLabel} size="sm" />
            </RadixDialog.Close>
          </header>
          {description && <RadixDialog.Description className={styles.description}>{description}</RadixDialog.Description>}
          <div className={styles.body}>{children}</div>
          {footer && <footer className={styles.footer}>{footer}</footer>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

export const SheetClose = RadixDialog.Close;
