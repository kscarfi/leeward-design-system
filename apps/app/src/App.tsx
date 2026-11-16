import { Heading, Link, SegmentedControl, Select, Stack, Text } from "@leeward/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { PhoneApp } from "./PhoneApp.tsx";
import { applyTheme, type Theme } from "./theme.ts";
import mark from "../../../docs/assets/brand/leeward-mark.svg";
import styles from "./App.module.css";

const BRANDS = [
  { value: "leeward", label: "Leeward" },
  { value: "business", label: "Leeward Business" },
  { value: "harbor", label: "Harbor, a partner brand made from one color" },
];

// Same width as --lw-breakpoint-md: from here the app is shown in a phone frame.
const WIDE = "(min-width: 48rem)";
const wide = window.matchMedia(WIDE);
const useWide = () =>
  useSyncExternalStore(
    (onChange) => {
      wide.addEventListener("change", onChange);
      return () => wide.removeEventListener("change", onChange);
    },
    () => wide.matches,
  );

/** The showcase page: a panel to change brand and mode, and the app in a phone frame. */
export function App() {
  const isWide = useWide();
  const [theme, setTheme] = useState<Theme>({ brand: "leeward", mode: "light" });
  const frame = useRef<HTMLIFrameElement>(null);
  // Set once: later brand and mode changes go in by message, so the app keeps its screen and state.
  const [src] = useState(() => `./?embed&brand=${theme.brand}&mode=${theme.mode}`);
  const send = () => frame.current?.contentWindow?.postMessage({ type: "leeward-theme", ...theme }, location.origin);

  useEffect(() => {
    applyTheme(theme);
    send();
  });

  return (
    <div className={styles.page}>
      <aside className={styles.panel} aria-labelledby="about">
        <Stack gap="lg">
          <Stack gap="sm">
            <img className={styles.logo} src={mark} alt="" />
            <Heading level={1} size="title-sm" id="about">Leeward app</Heading>
            <Text tone="secondary">
              A clickable banking app built only from the Leeward Design System: components, patterns and tokens, with no custom component code. Change the brand and mode to see the same app rethemed.
            </Text>
          </Stack>
          <Select label="Brand" value={theme.brand} onValueChange={(brand) => setTheme({ ...theme, brand })} options={BRANDS} />
          <SegmentedControl
            label="Mode"
            fullWidth
            value={theme.mode}
            onValueChange={(mode) => setTheme({ ...theme, mode })}
            options={[
              { value: "light", label: "Light", icon: "sun" },
              { value: "dark", label: "Dark", icon: "moon" },
            ]}
          />
          <Text variant="body-sm" tone="secondary">Try sending money to Deniz Yılmaz, freezing your card, or opening a transaction.</Text>
          <Stack gap="xs">
            <Link variant="standalone" href="../">Storybook</Link>
            <Link variant="standalone" href="https://www.figma.com/community/file/1703881089318257135/leeward-design-system" external>Figma file</Link>
            <Link variant="standalone" href="https://github.com/kscarfi/leeward-design-system/tree/main/apps/app" external>Source code</Link>
          </Stack>
        </Stack>
      </aside>

      {isWide ? (
        <iframe ref={frame} className={styles.phone} src={src} title="Leeward app on a phone-sized screen" onLoad={send} />
      ) : (
        <PhoneApp />
      )}
    </div>
  );
}
