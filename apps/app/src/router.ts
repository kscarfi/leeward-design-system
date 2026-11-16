// Hash routes, so the app works as static files on GitHub Pages: #/home, #/activity/t1, #/payments.
import { useSyncExternalStore } from "react";

export type Route = { screen: "home" | "payments" | "cards" | "savings" } | { screen: "activity"; id: string };

function parse(hash: string): Route {
  const [, screen, id] = hash.replace(/^#/, "").split("/");
  if (screen === "activity" && id) return { screen, id };
  if (screen === "payments" || screen === "cards" || screen === "savings") return { screen };
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

export const href = (path: string) => `#/${path}`;
export const go = (path: string) => {
  location.hash = `/${path}`;
};
