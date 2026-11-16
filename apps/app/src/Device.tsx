import { Icon } from "@leeward/react";
import { useSyncExternalStore, type Ref } from "react";
import type { Theme } from "./theme.ts";
import styles from "./Device.module.css";

// The frame's full height in px at 1x (screen 844 plus the bezel), used to scale it down on short windows.
const DEVICE_HEIGHT = 868;
const subscribe = (onChange: () => void) => {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
};
const useScale = () => useSyncExternalStore(subscribe, () => Math.min(1, (window.innerHeight - 48) / DEVICE_HEIGHT));

/**
 * An iPhone-sized frame around the app: bezel, status bar, Dynamic Island and home indicator.
 * The bezel is always dark; the screen follows the chosen brand and mode. Device chrome is decoration, so it is hidden from screen readers.
 */
export function Device({ theme, src, frameRef, onLoad }: { theme: Theme; src: string; frameRef: Ref<HTMLIFrameElement>; onLoad: () => void }) {
  const scale = useScale();
  return (
    <div className={styles.slot} style={{ width: `calc(26.375rem * ${scale})`, height: `calc(54.25rem * ${scale})` }}>
      <div className={styles.bezel} data-theme="dark" style={{ transform: `scale(${scale})` }}>
        <div className={styles.screen} data-brand={theme.brand} data-theme={theme.mode}>
          <div className={styles.statusBar} aria-hidden="true">
            <span className={styles.time}>9:41</span>
            <span className={styles.island} data-theme="dark" />
            <span className={styles.icons}>
              <span className={styles.signal}>
                <span />
                <span />
                <span />
                <span />
              </span>
              <Icon name="wifi" size="sm" />
              <span className={styles.battery}>
                <span />
              </span>
            </span>
          </div>
          <iframe ref={frameRef} className={styles.frame} src={src} title="Leeward app on an iPhone-sized screen" onLoad={onLoad} />
          <div className={styles.homeArea} aria-hidden="true">
            <span className={styles.homeIndicator} />
          </div>
        </div>
      </div>
    </div>
  );
}
