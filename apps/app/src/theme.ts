// Brand and mode live on the root element, so the whole page, portals included, follows them.
export interface Theme {
  brand: string;
  mode: string;
}

export function applyTheme({ brand, mode }: Theme) {
  document.documentElement.dataset.brand = brand;
  document.documentElement.dataset.theme = mode;
}

/** Inside the phone frame: start from the URL, then follow the showcase page's choices. */
export function followParent() {
  const params = new URLSearchParams(location.search);
  document.documentElement.dataset.device = "phone";
  applyTheme({ brand: params.get("brand") ?? "leeward", mode: params.get("mode") ?? "light" });
  window.addEventListener("message", (event: MessageEvent<{ type?: string } & Theme>) => {
    if (event.origin === location.origin && event.data?.type === "leeward-theme") applyTheme(event.data);
  });
}
