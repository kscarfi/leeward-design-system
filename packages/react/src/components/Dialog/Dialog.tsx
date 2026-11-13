import { Dialog as RadixDialog } from "radix-ui";
import type { ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { IconButton } from "../IconButton/IconButton.tsx";
import styles from "./Dialog.module.css";

export interface DialogProps {
  /** Required. Read when the dialog opens. */
  title: string;
  description?: ReactNode;
  /** Element that opens the dialog, usually a Button. */
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Buttons for the footer. Put the main action last. */
  actions?: ReactNode;
  children?: ReactNode;
  /** Label for the close button. Defaults to "Close". */
  closeLabel?: string;
  /** Hide the close button for flows that must end with an explicit choice. */
  hideClose?: boolean;
  className?: string;
}

/** Modal dialog. Traps focus, closes on Escape and returns focus to the trigger. Behavior from Radix Dialog. */
export function Dialog({ title, description, trigger, actions, children, closeLabel = "Close", hideClose, className, ...root }: DialogProps) {
  return (
    <RadixDialog.Root {...root}>
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={styles.overlay} />
        <RadixDialog.Content className={cx(styles.content, className)} {...(description ? {} : { "aria-describedby": undefined })}>
          <header className={styles.header}>
            <RadixDialog.Title className={styles.title}>{title}</RadixDialog.Title>
            {!hideClose && (
              <RadixDialog.Close asChild>
                <IconButton icon="close" label={closeLabel} size="sm" />
              </RadixDialog.Close>
            )}
          </header>
          {description && <RadixDialog.Description className={styles.description}>{description}</RadixDialog.Description>}
          {children && <div className={styles.body}>{children}</div>}
          {actions && <footer className={styles.footer}>{actions}</footer>}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

export const DialogClose = RadixDialog.Close;
