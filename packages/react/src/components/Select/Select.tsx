import { Select as RadixSelect } from "radix-ui";
import type { ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { FieldError, FieldHint, FieldLabel, FieldRoot, useFieldIds } from "../Field/Field.tsx";
import { Icon } from "../Icon/Icon.tsx";
import styles from "./Select.module.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  hint?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

export function Select({ label, options, placeholder = "Choose an option", hint, error, id, className, disabled, ...root }: SelectProps) {
  const ids = useFieldIds({ id, hint, error });
  return (
    <FieldRoot className={className}>
      <FieldLabel htmlFor={ids.control}>{label}</FieldLabel>
      <FieldHint id={ids.hint}>{hint}</FieldHint>
      <RadixSelect.Root disabled={disabled ?? false} {...root}>
        <RadixSelect.Trigger
          id={ids.control}
          className={cx(styles.trigger, error && styles.invalid)}
          aria-invalid={error ? true : undefined}
          aria-describedby={ids.describedBy}
        >
          <RadixSelect.Value placeholder={<span className={styles.placeholder}>{placeholder}</span>} />
          <RadixSelect.Icon className={styles.chevron}>
            <Icon name="chevron-down" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className={styles.content} position="popper" sideOffset={4}>
            <RadixSelect.Viewport className={styles.viewport}>
              {options.map((option) => (
                <RadixSelect.Item key={option.value} value={option.value} disabled={option.disabled ?? false} className={styles.item}>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className={styles.indicator}>
                    <Icon name="check" size="sm" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      <FieldError id={ids.error}>{error}</FieldError>
    </FieldRoot>
  );
}
