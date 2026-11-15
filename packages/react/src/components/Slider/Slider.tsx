import { Slider as RadixSlider } from "radix-ui";
import { useState, type ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { FieldHint, useFieldIds } from "../Field/Field.tsx";
import styles from "./Slider.module.css";

export interface SliderProps {
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Called when people let go, for expensive updates. */
  onValueCommit?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** How the value is shown and read, for example (v) => formatAmount(v, { currency: "TRY", locale }). */
  formatValue?: (value: number) => string;
  /** Labels under the two ends, for example the minimum and maximum amounts. */
  showLimits?: boolean;
  hint?: ReactNode;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
}

/** Picks a value in a range when the exact number matters less than the feel, such as a monthly saving amount. Pair with a field when people need an exact value. */
export function Slider({ label, value, defaultValue, onValueChange, onValueCommit, min = 0, max = 100, step = 1, formatValue = String, showLimits = true, hint, disabled, name, id, className }: SliderProps) {
  const ids = useFieldIds({ id, hint });
  const [inner, setInner] = useState(defaultValue ?? min);
  const current = value ?? inner;
  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.top}>
        <label id={`${ids.control}-label`} htmlFor={ids.control} className={styles.label}>
          {label}
        </label>
        <output htmlFor={ids.control} className={styles.value} aria-hidden="true">
          {formatValue(current)}
        </output>
      </div>
      <FieldHint id={ids.hint}>{hint}</FieldHint>
      <RadixSlider.Root
        className={styles.slider}
        value={[current]}
        min={min}
        max={max}
        step={step}
        disabled={disabled ?? false}
        {...(name ? { name } : {})}
        onValueChange={([v]) => {
          if (value === undefined) setInner(v!);
          onValueChange?.(v!);
        }}
        {...(onValueCommit ? { onValueCommit: ([v]: number[]) => onValueCommit(v!) } : {})}
      >
        <RadixSlider.Track className={styles.track}>
          <RadixSlider.Range className={styles.range} />
        </RadixSlider.Track>
        <RadixSlider.Thumb id={ids.control} className={styles.thumb} aria-labelledby={`${ids.control}-label`} aria-describedby={ids.describedBy} aria-valuetext={formatValue(current)} />
      </RadixSlider.Root>
      {showLimits && (
        <div className={styles.limits} aria-hidden="true">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      )}
    </div>
  );
}
