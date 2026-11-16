import { Toast as RadixToast } from "radix-ui";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { Icon } from "../Icon/Icon.tsx";
import type { IconName } from "../Icon/icons.ts";
import { IconButton } from "../IconButton/IconButton.tsx";
import styles from "./Toast.module.css";

export type ToastTone = "neutral" | "success" | "warning" | "danger";

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Optional action. Must not be the only way to do something: toasts disappear. */
  action?: { label: string; onClick: () => void; altText: string };
  /** Milliseconds before it hides. Errors stay until dismissed. */
  duration?: number;
}

interface ToastEntry extends ToastOptions {
  id: number;
}

const ToastContext = createContext<((options: ToastOptions) => void) | null>(null);

const toneIcon: Record<ToastTone, IconName> = {
  neutral: "info",
  success: "check-circle",
  warning: "alert-triangle",
  danger: "alert-circle",
};

export interface ToastProviderProps {
  children: ReactNode;
  /** Label for the region, read by screen readers. */
  label?: string;
  dismissLabel?: string;
  /** bottom (default) sits near the actions on the web. top suits phone apps, where the bottom holds the tab bar and main buttons, as on iOS. */
  placement?: "bottom" | "top";
}

export function ToastProvider({ children, label = "Notifications", dismissLabel = "Dismiss", placement = "bottom" }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const show = useCallback((options: ToastOptions) => {
    setToasts((current) => [...current, { ...options, id: Date.now() + Math.random() }]);
  }, []);
  const remove = (id: number) => setToasts((current) => current.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={show}>
      <RadixToast.Provider label={label} swipeDirection={placement === "top" ? "up" : "down"}>
        {children}
        {toasts.map(({ id, title, description, tone = "neutral", action, duration }) => (
          <RadixToast.Root
            key={id}
            className={cx(styles.toast, styles[tone])}
            duration={duration ?? (tone === "danger" ? Infinity : 6000)}
            type={tone === "danger" ? "foreground" : "background"}
            onOpenChange={(open) => !open && remove(id)}
          >
            <span className={styles.iconWrap} aria-hidden="true">
              <Icon name={toneIcon[tone]} weight="bold" />
            </span>
            <div className={styles.text}>
              <RadixToast.Title className={styles.title}>{title}</RadixToast.Title>
              {description && <RadixToast.Description className={styles.description}>{description}</RadixToast.Description>}
            </div>
            {action && (
              <RadixToast.Action altText={action.altText} className={styles.action} onClick={action.onClick}>
                {action.label}
              </RadixToast.Action>
            )}
            <RadixToast.Close asChild>
              <IconButton icon="close" label={dismissLabel} size="sm" className={styles.close} />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className={cx(styles.viewport, placement === "top" && styles.top)} />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

/** Returns a function that shows a toast. Must be used inside ToastProvider. */
export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast must be used inside <ToastProvider>.");
  return useMemo(() => ({ show }), [show]);
}
