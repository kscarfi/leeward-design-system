// Builds the Leeward icon set from Solar Icons (480 Design, CC BY 4.0, via github.com/saoudi-h/solar-icons).
//
//   git clone --depth 1 --filter=blob:none --sparse https://github.com/saoudi-h/solar-icons.git /tmp/solar
//   git -C /tmp/solar sparse-checkout set packages/core/svgs
//   pnpm icons:import /tmp/solar/packages/core/svgs
//
// To add an icon: add a line to ICONS (Leeward name -> Solar category/name) and run the import again.
// Writes packages/react/src/components/Icon/icons.generated.ts.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const STYLES = { linear: "Linear", bold: "Bold", duotone: "BoldDuotone" } as const;

/** Leeward name -> Solar "category/name". Names describe the meaning, not the drawing. */
export const ICONS: Record<string, string> = {
  // Direction and navigation
  "arrow-left": "arrows/arrow-left",
  "arrow-right": "arrows/arrow-right",
  "arrow-up": "arrows/arrow-up",
  "arrow-down": "arrows/arrow-down",
  "arrow-up-right": "arrows/arrow-right-up",
  "arrow-down-left": "arrows/arrow-left-down",
  "arrows-left-right": "arrows/transfer-horizontal",
  "arrows-up-down": "arrows/transfer-vertical",
  "chevron-left": "arrows/alt-arrow-left",
  "chevron-right": "arrows/alt-arrow-right",
  "chevron-up": "arrows/alt-arrow-up",
  "chevron-down": "arrows/alt-arrow-down",
  refresh: "arrows/refresh",
  undo: "arrows-action/undo-left",
  download: "arrows-action/download-minimalistic",
  upload: "arrows-action/upload-minimalistic",
  export: "arrows-action/export",
  login: "arrows-action/login-2",
  logout: "arrows-action/logout-2",
  send: "messages/plane",
  // Actions and status
  plus: "ui/add",
  minus: "ui/minus",
  check: "ui/check",
  close: "ui/close",
  "plus-circle": "ui/add-circle",
  "check-circle": "ui/check-circle",
  "close-circle": "ui/close-circle",
  info: "ui/info-circle",
  "alert-circle": "ui/danger-circle",
  "alert-triangle": "ui/danger-triangle",
  help: "ui/question-circle",
  search: "search/magnifier",
  filter: "ui/filter",
  sort: "list/sort-by-time",
  settings: "settings/settings",
  tuning: "settings/tuning-2",
  menu: "ui/hamburger-menu",
  "more-horizontal": "ui/menu-dots",
  "more-vertical": "ui/menu-dots-vertical",
  home: "ui/home-smile",
  widget: "settings/widget-2",
  star: "like/star",
  heart: "like/heart",
  gift: "ui/gift",
  percent: "ui/percent",
  bolt: "ui/bolt",
  sparkles: "ui/sparkles",
  trash: "ui/trash-bin-minimalistic",
  share: "ui/share",
  pin: "ui/pin",
  flag: "ui/flag",
  copy: "ui/copy",
  edit: "messages/pen",
  link: "text-formatting/link-round",
  power: "ui/power",
  // Security
  eye: "security/eye",
  "eye-off": "security/eye-closed",
  lock: "security/lock-keyhole-minimalistic",
  unlock: "security/lock-keyhole-minimalistic-unlocked",
  shield: "security/shield-check",
  "shield-warning": "security/shield-warning",
  key: "security/key-minimalistic-2",
  fingerprint: "security/fingerprint",
  "face-id": "faces/face-scan-square",
  "qr-code": "security/code-scan",
  scan: "security/scanner",
  password: "security/password-minimalistic",
  // Notifications and people
  bell: "notifications/bell",
  "bell-off": "notifications/bell-off",
  user: "users/user-rounded",
  users: "users/users-group-rounded",
  "user-plus": "users/user-plus-rounded",
  "user-check": "users/user-check-rounded",
  "user-id": "users/user-id",
  // Money
  wallet: "money/wallet",
  "wallet-money": "money/wallet-money",
  card: "money/card",
  "card-send": "money/card-send",
  "card-receive": "money/card-receive",
  "card-transfer": "money/card-transfer",
  cardholder: "money/cardholder",
  banknote: "money/banknote",
  coins: "money/coins",
  "piggy-bank": "money/piggy-bank",
  safe: "money/safe-square",
  bill: "money/bill-list",
  "bill-check": "money/bill-check",
  "cash-out": "money/cash-out",
  "money-bag": "money/money-bag",
  tag: "money/tag-price",
  ticket: "money/ticket",
  dollar: "money/dollar",
  euro: "money/euro",
  "hand-money": "hands/hand-money",
  handshake: "hands/hand-shake",
  // Charts and business
  chart: "business/chart-2",
  "pie-chart": "business/pie-chart-2",
  "trend-up": "business/graph-new-up",
  "trend-down": "business/graph-down-new",
  bank: "building/bank",
  building: "building/buildings-2",
  house: "ui/home-2",
  // Time
  clock: "time/clock-circle",
  calendar: "time/calendar-minimalistic",
  "calendar-date": "time/calendar-date",
  history: "time/history",
  hourglass: "time/hourglass-line",
  // Communication and documents
  chat: "messages/chat-round-dots",
  mail: "messages/letter",
  inbox: "messages/inbox",
  paperclip: "messages/paperclip",
  phone: "call/phone-rounded",
  smartphone: "devices/smartphone-2",
  laptop: "devices/laptop-minimalistic",
  document: "notes/document-text",
  documents: "notes/documents",
  receipt: "money/bill-check",
  clipboard: "notes/clipboard-list",
  // Spending categories
  "shopping-bag": "shopping/bag-4",
  cart: "shopping/cart-large-minimalistic",
  shop: "shopping/shop-2",
  coffee: "food/cup-hot",
  restaurant: "food/fork-knife",
  transport: "parts/bus",
  car: "parts/car",
  airplane: "parts/airplane",
  fuel: "parts/gas-station",
  health: "medicine/health",
  education: "school/square-academic-cap",
  book: "school/book-2",
  calculator: "school/calculator-minimalistic",
  gym: "sports/dumbbell-small",
  clothing: "ui/t-shirt",
  waterdrop: "ui/waterdrop",
  fire: "nature/fire",
  lightbulb: "devices/lightbulb-minimalistic",
  wifi: "it/wi-fi-router-round",
  // Places and settings
  globe: "map/global",
  "map-point": "map/map-point",
  language: "it/translation",
  sun: "weather/sun",
  moon: "weather/moon",
};

function clean(svg: string, file: string): string {
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim();
  if (/<(mask|defs|clipPath|style|script)\b/i.test(inner) || /url\(/.test(inner)) throw new Error(`${file} uses masks or styles; pick another icon.`);
  if (/fill="white"/.test(inner)) throw new Error(`${file} draws in white; pick another icon.`);
  return inner
    .replace(/(fill|stroke)="black"/g, '$1="currentColor"')
    // One decimal (0.05 px error at 24 px) is invisible and keeps the icon data small.
    .replace(/ d="([^"]+)"/g, (_m, d: string) => ` d="${d.replace(/-?\d*\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10))}"`)
    .replace(/\s*\n\s*/g, "")
    .replace(/\s{2,}/g, " ");
}

if (import.meta.main) {
  const source = process.argv[2];
  if (!source || !existsSync(source)) {
    console.error("Usage: pnpm icons:import <path to solar-icons/packages/core/svgs>");
    process.exit(2);
  }
  const out: Record<string, Record<string, string>> = {};
  const missing: string[] = [];
  for (const [name, path] of Object.entries(ICONS)) {
    const [category, file] = path.split("/");
    out[name] = {};
    for (const [style, dir] of Object.entries(STYLES)) {
      const svgPath = `${source}/${category}/${dir}/${file}.svg`;
      if (!existsSync(svgPath)) {
        missing.push(`${name} -> ${svgPath}`);
        continue;
      }
      out[name]![style] = clean(readFileSync(svgPath, "utf8"), svgPath);
    }
  }
  if (missing.length) {
    console.error(`Missing:\n${missing.join("\n")}`);
    process.exit(1);
  }
  const target = new URL("../packages/react/src/components/Icon/icons.generated.ts", import.meta.url);
  writeFileSync(
    target,
    [
      "// Generated by scripts/import-solar-icons.ts. Do not edit by hand.",
      "// Icons: Solar Icons Set by 480 Design (https://www.figma.com/community/file/1166831539721848736),",
      "// licensed CC BY 4.0, packaged by Hakim Saoudi (https://github.com/saoudi-h/solar-icons, MIT).",
      "// Colors are replaced with currentColor so icons follow the text color.",
      "",
      "export const iconData = " + JSON.stringify(out, null, 0).replace(/\},"/g, '},\n  "') + " as const;",
      "",
    ].join("\n"),
  );
  console.log(`Wrote ${Object.keys(out).length} icons in ${Object.keys(STYLES).length} styles.`);
}
