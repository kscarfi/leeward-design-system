import { DropdownMenu as RadixMenu } from "radix-ui";
import { Fragment, type ReactElement } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import styles from "./DropdownMenu.module.css";

export interface MenuAction {
  label: string;
  icon?: IconName;
  /** Not needed when the action has `items`. */
  onSelect?: () => void;
  /** Destructive actions are listed last and say what they destroy. */
  destructive?: boolean;
  disabled?: boolean;
  /** Keyboard shortcut shown on the end side, for example "⌘C". Display only: register the shortcut in the app. */
  shortcut?: string;
  /** Opens a submenu. Keep submenus one level deep. */
  items?: MenuAction[];
}

export interface MenuGroup {
  /** Optional heading for the group, for example "Card". */
  label?: string;
  actions: MenuAction[];
}

export interface DropdownMenuProps {
  /** A single focusable trigger, usually an IconButton labelled "More actions". */
  trigger: ReactElement;
  /** A flat list of actions. Use `groups` instead for labelled sections. */
  actions?: MenuAction[];
  /** Sections separated by a line, each with an optional label. */
  groups?: MenuGroup[];
  align?: "start" | "end";
}

function Item({ action }: { action: MenuAction }) {
  const content = (
    <>
      {action.icon && <Icon name={action.icon} size="sm" />}
      <span className={styles.label}>{action.label}</span>
      {action.shortcut && <span className={styles.shortcut} aria-hidden="true">{action.shortcut}</span>}
    </>
  );
  if (action.items?.length) {
    return (
      <RadixMenu.Sub>
        <RadixMenu.SubTrigger disabled={action.disabled ?? false} className={styles.item}>
          {content}
          <Icon name="chevron-right" size="sm" className={styles.subIcon} />
        </RadixMenu.SubTrigger>
        <RadixMenu.Portal>
          <RadixMenu.SubContent sideOffset={4} collisionPadding={8} className={styles.content}>
            <Actions actions={action.items} />
          </RadixMenu.SubContent>
        </RadixMenu.Portal>
      </RadixMenu.Sub>
    );
  }
  return (
    <RadixMenu.Item disabled={action.disabled ?? false} {...(action.onSelect ? { onSelect: action.onSelect } : {})} className={cx(styles.item, action.destructive && styles.destructive)}>
      {content}
    </RadixMenu.Item>
  );
}

function Actions({ actions }: { actions: MenuAction[] }) {
  return (
    <>
      {actions.map((a, i) => (
        <Fragment key={a.label}>
          {a.destructive && i > 0 && !actions[i - 1]?.destructive && <RadixMenu.Separator className={styles.separator} />}
          <Item action={a} />
        </Fragment>
      ))}
    </>
  );
}

/** Secondary actions for an item. Arrow keys move, Enter selects, the right arrow opens a submenu, Escape closes. Behavior from Radix Dropdown Menu. */
export function DropdownMenu({ trigger, actions = [], groups, align = "end" }: DropdownMenuProps) {
  const sections: MenuGroup[] = groups ?? [{ actions }];
  return (
    <RadixMenu.Root>
      <RadixMenu.Trigger asChild>{trigger}</RadixMenu.Trigger>
      <RadixMenu.Portal>
        <RadixMenu.Content align={align} sideOffset={6} collisionPadding={8} className={styles.content}>
          {sections.map((group, g) => (
            <Fragment key={group.label ?? g}>
              {g > 0 && <RadixMenu.Separator className={styles.separator} />}
              {group.label ? (
                <RadixMenu.Group>
                  <RadixMenu.Label className={styles.groupLabel}>{group.label}</RadixMenu.Label>
                  <Actions actions={group.actions} />
                </RadixMenu.Group>
              ) : (
                <Actions actions={group.actions} />
              )}
            </Fragment>
          ))}
        </RadixMenu.Content>
      </RadixMenu.Portal>
    </RadixMenu.Root>
  );
}
