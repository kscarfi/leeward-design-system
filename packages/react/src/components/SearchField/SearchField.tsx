import { useRef, useState, type Ref } from "react";
import type { Locale } from "../../utils/format.ts";
import { messages } from "../../utils/messages.ts";
import { Icon } from "../Icon/Icon.tsx";
import { IconButton } from "../IconButton/IconButton.tsx";
import { TextField, type TextFieldProps } from "../TextField/TextField.tsx";

export interface SearchFieldProps extends Omit<TextFieldProps, "prefix" | "suffix" | "type" | "onChange" | "value" | "defaultValue"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called on Enter. Results that update while typing do not need it. */
  onSearch?: (value: string) => void;
  locale?: Locale;
  ref?: Ref<HTMLInputElement>;
}

/** A text field for searching, with a search icon and a clear button. Pill by default. */
export function SearchField({ value, defaultValue = "", onValueChange, onSearch, locale = "en-US", shape = "pill", ref, ...rest }: SearchFieldProps) {
  const [inner, setInner] = useState(defaultValue);
  const text = value ?? inner;
  const input = useRef<HTMLInputElement | null>(null);
  const set = (next: string) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch?.(text);
      }}
    >
      <TextField
        {...rest}
        ref={(node) => {
          input.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        type="search"
        shape={shape}
        value={text}
        onChange={(event) => set(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && text) {
            event.preventDefault();
            set("");
          }
          rest.onKeyDown?.(event);
        }}
        prefix={<Icon name="search" size="md" />}
        endAction={
          text ? (
            <IconButton
              icon="close"
              size="xs"
              label={messages(locale).clearSearch}
              onClick={() => {
                set("");
                input.current?.focus();
              }}
            />
          ) : undefined
        }
      />
    </form>
  );
}
