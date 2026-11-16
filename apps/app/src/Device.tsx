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
              <svg width="18" height="12" viewBox="0 0 18 12">
                <rect x="0" y="7.5" width="3" height="4.5" rx="1" />
                <rect x="5" y="5" width="3" height="7" rx="1" />
                <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
                <rect x="15" y="0" width="3" height="12" rx="1" />
              </svg>
              <svg width="17" height="12" viewBox="0 0 17 12">
                <path d="M8.5 2.4c2.4 0 4.6.9 6.2 2.5l1.2-1.2A10.4 10.4 0 0 0 8.5.7 10.4 10.4 0 0 0 1.1 3.7l1.2 1.2a8.7 8.7 0 0 1 6.2-2.5Z" />
                <path d="M8.5 5.8c1.5 0 2.8.6 3.8 1.5l1.2-1.2A7 7 0 0 0 8.5 4a7 7 0 0 0-5 2.1l1.2 1.2c1-1 2.3-1.5 3.8-1.5Z" />
                <path d="M8.5 9.1c.6 0 1.1.2 1.5.6l-1.5 1.6L7 9.7c.4-.4.9-.6 1.5-.6Z" />
              </svg>
              <svg width="27" height="13" viewBox="0 0 27 13">
                <rect x="0.5" y="0.5" width="22" height="12" rx="3.8" fill="none" stroke="currentColor" opacity="0.35" />
                <rect x="2" y="2" width="19" height="9" rx="2.5" />
                <path d="M24 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" opacity="0.4" />
              </svg>
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
