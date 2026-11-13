import { Accordion as RadixAccordion } from "radix-ui";
import type { ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import styles from "./Accordion.module.css";

export interface AccordionItem {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** single opens one item at a time, multiple lets people open several. */
  type?: "single" | "multiple";
  defaultValue?: string[];
  /** Heading level of each trigger, to fit the page outline. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

/** Expandable sections, for FAQs, fees and account details. Behavior from Radix Accordion. */
export function Accordion({ items, type = "single", defaultValue, headingLevel = 3, className }: AccordionProps) {
  const Heading = `h${headingLevel}` as const;
  const content = items.map((item) => (
    <RadixAccordion.Item key={item.value} value={item.value} disabled={item.disabled ?? false} className={styles.item}>
      <Heading className={styles.header}>
        <RadixAccordion.Trigger className={styles.trigger}>
          <span>{item.title}</span>
          <Icon name="chevron-down" className={styles.chevron} />
        </RadixAccordion.Trigger>
      </Heading>
      <RadixAccordion.Content className={styles.content}>
        <div className={styles.inner}>{item.content}</div>
      </RadixAccordion.Content>
    </RadixAccordion.Item>
  ));
  return type === "single" ? (
    <RadixAccordion.Root type="single" collapsible {...(defaultValue?.[0] ? { defaultValue: defaultValue[0] } : {})} className={cx(styles.root, className)}>
      {content}
    </RadixAccordion.Root>
  ) : (
    <RadixAccordion.Root type="multiple" {...(defaultValue ? { defaultValue } : {})} className={cx(styles.root, className)}>
      {content}
    </RadixAccordion.Root>
  );
}
