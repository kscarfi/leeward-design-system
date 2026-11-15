import { useId, useMemo, useState, type ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import { TextField } from "../TextField/TextField.tsx";
import styles from "./Combobox.module.css";

export interface ComboboxOption {
  value: string;
  label: string;
  /** Second line, for example a bank name or a masked IBAN. Also searched. */
  description?: string;
  icon?: IconName;
}

export interface ComboboxProps {
  label: string;
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  hint?: ReactNode;
  error?: ReactNode;
  /** Shown when nothing matches. Defaults to "No results". */
  emptyText?: string;
  size?: "sm" | "md" | "lg";
  shape?: "rounded" | "pill";
  disabled?: boolean;
  name?: string;
  id?: string;
  locale?: Locale;
  className?: string;
}

/** A text field that filters a list as people type, such as choosing a bank or a saved recipient from many. */
export function Combobox({ label, options, value, defaultValue = null, onValueChange, placeholder, hint, error, emptyText, size = "md", shape = "rounded", disabled, name, id, locale = "en-US", className }: ComboboxProps) {
  const m = messages(locale);
  const listId = useId();
  const [inner, setInner] = useState<string | null>(defaultValue);
  const selected = value === undefined ? inner : value;
  const selectedOption = options.find((o) => o.value === selected);
  const [query, setQuery] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const text = query ?? selectedOption?.label ?? "";
  const results = useMemo(() => {
    if (query === null || query.trim() === "") return options;
    // Lower case in the locale, then drop accents and treat ı as i, so "is", "iş" and "İŞ" all match "İş Bankası".
    const lower = (t: string) => t.toLocaleLowerCase(locale).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i");
    const q = lower(query.trim());
    return options.filter((o) => lower(o.label).includes(q) || (o.description ? lower(o.description).includes(q) : false));
  }, [options, query, locale]);
  const choose = (option: ComboboxOption) => {
    if (value === undefined) setInner(option.value);
    onValueChange?.(option.value);
    setQuery(null);
    setOpen(false);
  };
  const optionId = (i: number) => `${listId}-option-${i}`;
  return (
    <div className={cx(styles.root, className)}>
      <TextField
        label={label}
        {...(id ? { id } : {})}
        {...(hint ? { hint } : {})}
        {...(error ? { error } : {})}
        {...(placeholder ? { placeholder } : {})}
        size={size}
        shape={shape}
        disabled={disabled ?? false}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        {...(open && results[active] ? { "aria-activedescendant": optionId(active) } : {})}
        autoComplete="off"
        value={text}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
          setOpen(true);
          if (event.target.value === "" && selected !== null) {
            if (value === undefined) setInner(null);
            onValueChange?.(null);
          }
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setOpen(false);
          setQuery(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!open) setOpen(true);
            else setActive((a) => Math.min(a + 1, results.length - 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (event.key === "Enter" && open && results[active]) {
            event.preventDefault();
            choose(results[active]!);
          } else if (event.key === "Escape") {
            if (open) setOpen(false);
            else setQuery("");
          }
        }}
        suffix={<Icon name="chevron-down" size="md" />}
      />
      {name && <input type="hidden" name={name} value={selected ?? ""} />}
      {open && results.length === 0 && <p className={cx(styles.list, styles.empty)}>{emptyText ?? m.noResults}</p>}
      <ul id={listId} role="listbox" aria-label={label} className={styles.list} hidden={!open || results.length === 0}>
        {results.map((option, i) => (
            <li
              key={option.value}
              id={optionId(i)}
              role="option"
              aria-selected={option.value === selected}
              className={cx(styles.option, i === active && styles.active)}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(option)}
            >
              {option.icon && <Icon name={option.icon} size="md" className={styles.optionIcon} />}
              <span className={styles.text}>
                <span className={styles.optionLabel}>{option.label}</span>
                {option.description && <span className={styles.description}>{option.description}</span>}
              </span>
              {option.value === selected && <Icon name="check" size="sm" className={styles.check} />}
            </li>
        ))}
      </ul>
      <p className={styles.srOnly} role="status">
        {open && query !== null ? m.results(results.length) : ""}
      </p>
    </div>
  );
}
