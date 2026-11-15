import { Tabs as RadixTabs } from "radix-ui";
import type { ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import styles from "./Tabs.module.css";

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  /** Optional icon before the label. The label stays: tabs are never icon-only. */
  icon?: IconName;
}

export interface TabsProps {
  /** Accessible name for the tab list, for example "Account views". */
  label: string;
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Stretch tabs to fill the width, for mobile segmented views. */
  fullWidth?: boolean;
  className?: string;
}

/** Arrow keys move between tabs, Tab moves into the panel. Behavior from Radix Tabs. */
export function Tabs({ label, items, defaultValue, fullWidth, className, ...root }: TabsProps) {
  return (
    <RadixTabs.Root defaultValue={defaultValue ?? items[0]?.value} className={cx(styles.root, className)} {...root}>
      <RadixTabs.List aria-label={label} className={cx(styles.list, fullWidth && styles.fullWidth)}>
        {items.map((item) => (
          <RadixTabs.Trigger key={item.value} value={item.value} disabled={item.disabled ?? false} className={styles.trigger}>
            {item.icon && <Icon name={item.icon} size="sm" />}
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content key={item.value} value={item.value} className={styles.panel}>
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
