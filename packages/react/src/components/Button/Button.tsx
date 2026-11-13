import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import { Spinner } from "../Spinner/Spinner.tsx";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary: the one main action on a screen. danger: irreversible actions only. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, keeps the label for screen readers and blocks repeat clicks. */
  loading?: boolean;
  fullWidth?: boolean;
  iconStart?: IconName;
  iconEnd?: IconName;
  children: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  iconStart,
  iconEnd,
  disabled,
  type = "button",
  className,
  children,
  onClick,
  ref,
  ...rest
}: ButtonProps) {
  // Loading buttons stay focusable (aria-disabled) so focus does not jump away mid-action.
  const inactive = disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      className={cx(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, loading && styles.loading, className)}
      disabled={disabled && !loading}
      aria-disabled={inactive || undefined}
      aria-busy={loading || undefined}
      onClick={inactive ? (event) => event.preventDefault() : onClick}
      {...rest}
    >
      {loading && <Spinner className={styles.spinner} />}
      <span className={styles.content}>
        {iconStart && <Icon name={iconStart} size={size === "lg" ? "lg" : "md"} />}
        <span>{children}</span>
        {iconEnd && <Icon name={iconEnd} size={size === "lg" ? "lg" : "md"} />}
      </span>
    </button>
  );
}
