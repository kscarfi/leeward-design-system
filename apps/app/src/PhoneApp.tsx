import { NavigationBar, SkipLink } from "@leeward/react";
import { useEffect, useRef } from "react";
import { href, useRoute, type Route } from "./router.ts";
import { Activity } from "./screens/Activity.tsx";
import { Cards } from "./screens/Cards.tsx";
import { Home } from "./screens/Home.tsx";
import { Payments } from "./screens/Payments.tsx";
import { Savings } from "./screens/Savings.tsx";
import styles from "./PhoneApp.module.css";

const TABS = { home: "Home", payments: "Payments", cards: "Cards", savings: "Savings", activity: "Home" } as const;

function Screen({ route }: { route: Route }) {
  switch (route.screen) {
    case "payments":
      return <Payments />;
    case "cards":
      return <Cards />;
    case "savings":
      return <Savings />;
    case "activity":
      return <Activity id={route.id} />;
    default:
      return <Home />;
  }
}

/** The banking app itself. On wide screens it runs inside the phone frame's iframe, so it sees a real phone-sized viewport. */
export function PhoneApp() {
  const route = useRoute();
  const mainRef = useRef<HTMLElement>(null);
  const routeKey = route.screen === "activity" ? `activity/${route.id}` : route.screen;
  const first = useRef(true);

  // A new screen starts at the top, and keyboard and screen reader users land on it.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (first.current) first.current = false;
    else mainRef.current?.focus({ preventScroll: true });
  }, [routeKey]);

  return (
    <div className={styles.app}>
      <SkipLink targetId="screen" />
      <main id="screen" ref={mainRef} tabIndex={-1} className={styles.screen} aria-label={`${TABS[route.screen]} screen`}>
        <Screen key={routeKey} route={route} />
      </main>
      <div className={styles.nav}>
        <NavigationBar
          current={TABS[route.screen]}
          items={[
            { label: "Home", icon: "home", href: href("home") },
            { label: "Payments", icon: "arrows-left-right", href: href("payments") },
            { label: "Cards", icon: "card", href: href("cards") },
            { label: "Savings", icon: "piggy-bank", href: href("savings") },
          ]}
        />
      </div>
    </div>
  );
}
