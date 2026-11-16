// Hash routes, so the app works as static files on GitHub Pages: #/home, #/activity/t1, #/send/2.
import { useSyncExternalStore } from "react";

const TABS = ["home", "payments", "cards", "savings"] as const;
const PAGES = ["transactions", "profile", "notifications"] as const;
export type Tab = (typeof TABS)[number];

export type Route =
  | { screen: Tab | (typeof PAGES)[number] }
  | { screen: "activity"; id: string }
  | { screen: "send"; to?: number };

function parse(hash: string): Route {
  const [, screen, param] = hash.replace(/^#/, "").split("/");
  if (screen === "activity" && param) return { screen, id: param };
  if (screen === "send") return param && /^\d+$/.test(param) ? { screen, to: Number(param) } : { screen };
  if ((TABS as readonly string[]).includes(screen ?? "") || (PAGES as readonly string[]).includes(screen ?? "")) return { screen: screen as Tab };
  return { screen: "home" };
}

const subscribe = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => location.hash);
  return parse(hash);
}

/** The tab a screen belongs to, for the tab bar. */
export function tabOf(route: Route): Tab {
  if (route.screen === "send") return "payments";
  if ((TABS as readonly string[]).includes(route.screen)) return route.screen as Tab;
  return "home";
}

export const href = (path: string) => `#/${path}`;
export const go = (path: string) => {
  location.hash = `/${path}`;
};
