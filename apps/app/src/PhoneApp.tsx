import { NavigationBar, SkipLink } from "@leeward/react";
import { useEffect, useRef } from "react";
import { href, tabOf, useRoute, type Route } from "./router.ts";
import { Activity } from "./screens/Activity.tsx";
import { Cards } from "./screens/Cards.tsx";
import { Home } from "./screens/Home.tsx";
import { Notifications } from "./screens/Notifications.tsx";
import { Payments } from "./screens/Payments.tsx";
import { Profile } from "./screens/Profile.tsx";
import { Savings } from "./screens/Savings.tsx";
import { Send } from "./screens/Send.tsx";
import { Transactions } from "./screens/Transactions.tsx";
import styles from "./PhoneApp.module.css";

const LABELS = { home: "Home", payments: "Payments", cards: "Cards", savings: "Savings" } as const;

function Screen({ route }: { route: Route }) {
  switch (route.screen) {
    case "payments":
      return <Payments />;
    case "send":
      return <Send {...(route.to !== undefined ? { to: route.to } : {})} />;
    case "cards":
      return <Cards />;
    case "savings":
      return <Savings />;
    case "transactions":
      return <Transactions />;
    case "profile":
      return <Profile />;
    case "notifications":
      return <Notifications />;
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
  const routeKey = location.hash || "#/home";
  const first = useRef(true);
  const tab = tabOf(route);
  // A transfer in progress is a task: the tab bar steps aside so the main button has the bottom of the screen.
  const task = route.screen === "send";

  // A new screen starts at the top, and keyboard and screen reader users land on it.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (first.current) first.current = false;
    else mainRef.current?.focus({ preventScroll: true });
  }, [routeKey]);

  return (
    <div className={styles.app}>
      <SkipLink targetId="screen" />
      <main id="screen" ref={mainRef} tabIndex={-1} className={styles.screen} aria-label={`${LABELS[tab]} screen`}>
        <Screen key={routeKey} route={route} />
      </main>
      {!task && (
        <div className={styles.nav}>
          <NavigationBar
            current={LABELS[tab]}
            items={[
              { label: "Home", icon: "home", href: href("home") },
              { label: "Payments", icon: "arrows-left-right", href: href("payments") },
              { label: "Cards", icon: "card", href: href("cards") },
              { label: "Savings", icon: "piggy-bank", href: href("savings") },
            ]}
          />
        </div>
      )}
    </div>
  );
}
