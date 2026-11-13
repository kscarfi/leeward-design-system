import { DropdownMenu as RadixMenu } from "radix-ui";
import type { ReactElement } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import styles from "./DropdownMenu.module.css";

export interface MenuAction {
  label: string;
  icon?: IconName;
  onSelect: () => void;
  /** Destructive actions are listed last and say what they destroy. */
  destructive?: boolean;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  /** A single focusable trigger, usually an IconButton labelled "More actions". */
  trigger: ReactElement;
  actions: MenuAction[];
  align?: "start" | "end";
}

/** Secondary actions for an item. Arrow keys move, Enter selects, Escape closes. Behavior from Radix Dropdown Menu. */
export function DropdownMenu({ trigger, actions, align = "end" }: DropdownMenuProps) {
  return (
    <RadixMenu.Root>
      <RadixMenu.Trigger asChild>{trigger}</RadixMenu.Trigger>
      <RadixMenu.Portal>
        <RadixMenu.Content align={align} sideOffset={6} collisionPadding={8} className={styles.content}>
          {actions.map((a, i) => (
            <div key={a.label}>
              {a.destructive && i > 0 && !actions[i - 1]?.destructive && <RadixMenu.Separator className={styles.separator} />}
              <RadixMenu.Item disabled={a.disabled ?? false} onSelect={a.onSelect} className={cx(styles.item, a.destructive && styles.destructive)}>
                {a.icon && <Icon name={a.icon} size="sm" />}
                {a.label}
              </RadixMenu.Item>
            </div>
          ))}
        </RadixMenu.Content>
      </RadixMenu.Portal>
    </RadixMenu.Root>
  );
}
