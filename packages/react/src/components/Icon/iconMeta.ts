// Search keywords and categories for every icon, and the icons reserved for one meaning.
// Names say what an icon means, not what it draws; keywords help people find it by other words.
import type { IconName } from "./icons.ts";

export type IconCategory =
  | "Direction and navigation"
  | "Actions and status"
  | "Security"
  | "Notifications and people"
  | "Money"
  | "Charts and business"
  | "Time"
  | "Communication and documents"
  | "Spending categories"
  | "Places and settings";

export interface IconMeta {
  category: IconCategory;
  keywords: string[];
  /** Set when the icon is reserved: use it only for this meaning, and use nothing else for it. */
  reserved?: string;
}

const m = (category: IconCategory, keywords: string, reserved?: string): IconMeta => ({ category, keywords: keywords.split(" "), ...(reserved ? { reserved } : {}) });
const nav = "Direction and navigation";
const act = "Actions and status";
const sec = "Security";
const ppl = "Notifications and people";
const money = "Money";
const biz = "Charts and business";
const time = "Time";
const doc = "Communication and documents";
const spend = "Spending categories";
const place = "Places and settings";

export const iconMeta: Record<IconName, IconMeta> = {
  "arrow-left": m(nav, "back previous return", "Go back to the previous screen"),
  "arrow-right": m(nav, "next forward continue"),
  "arrow-up": m(nav, "up increase top"),
  "arrow-down": m(nav, "down decrease bottom"),
  "arrow-up-right": m(nav, "outgoing send pay external"),
  "arrow-down-left": m(nav, "incoming receive deposit"),
  "arrows-left-right": m(nav, "transfer exchange swap between-accounts"),
  "arrows-up-down": m(nav, "reorder sort swap"),
  "chevron-left": m(nav, "previous back caret"),
  "chevron-right": m(nav, "next caret open", "Row or link that opens another screen"),
  "chevron-up": m(nav, "collapse caret less"),
  "chevron-down": m(nav, "expand caret more select", "Expand, or open a list of options"),
  refresh: m(nav, "reload retry sync update"),
  undo: m(nav, "revert back cancel-last"),
  download: m(nav, "save statement export file"),
  upload: m(nav, "attach import file document"),
  export: m(nav, "share out external open"),
  login: m(nav, "sign-in enter"),
  logout: m(nav, "sign-out exit leave", "Sign out"),
  send: m(nav, "send-money pay transfer plane", "Send money"),
  plus: m(act, "add new create", "Add something new"),
  minus: m(act, "remove subtract less"),
  check: m(act, "done selected tick confirm", "Selected or done"),
  close: m(act, "dismiss cancel x clear", "Close or dismiss"),
  "plus-circle": m(act, "add new top-up"),
  "check-circle": m(act, "success complete verified", "Success status"),
  "close-circle": m(act, "failed declined error"),
  info: m(act, "information about details", "Information status"),
  "alert-circle": m(act, "error danger problem", "Error status"),
  "alert-triangle": m(act, "warning caution risk", "Warning status"),
  help: m(act, "question support faq"),
  search: m(act, "find magnifier look", "Search"),
  filter: m(act, "narrow refine funnel"),
  sort: m(act, "order arrange"),
  settings: m(act, "preferences gear options"),
  tuning: m(act, "adjust sliders controls"),
  menu: m(act, "navigation hamburger list"),
  "more-horizontal": m(act, "more options actions dots", "More actions"),
  "more-vertical": m(act, "more options actions dots kebab", "More actions"),
  home: m(act, "start main dashboard"),
  widget: m(act, "apps grid tiles"),
  star: m(act, "favorite saved rating"),
  heart: m(act, "like love favorite"),
  gift: m(act, "present reward cashback"),
  percent: m(act, "interest rate discount"),
  bolt: m(act, "instant fast energy"),
  sparkles: m(act, "new magic highlight"),
  trash: m(act, "delete remove bin", "Delete"),
  share: m(act, "send-to forward"),
  pin: m(act, "pinned keep top"),
  flag: m(act, "report mark"),
  copy: m(act, "duplicate clipboard copy-iban"),
  edit: m(act, "change pencil rename"),
  link: m(act, "url chain connect"),
  power: m(act, "on off turn"),
  eye: m(sec, "show visible reveal", "Show hidden content, such as a balance"),
  "eye-off": m(sec, "hide hidden mask", "Hide content, such as a balance"),
  lock: m(sec, "locked frozen secure", "Locked or frozen"),
  unlock: m(sec, "unlocked unfreeze open"),
  shield: m(sec, "security protected safe"),
  "shield-warning": m(sec, "fraud risk alert"),
  key: m(sec, "password access api"),
  fingerprint: m(sec, "biometric touch-id"),
  "face-id": m(sec, "biometric face scan"),
  "qr-code": m(sec, "scan code pay"),
  scan: m(sec, "camera capture document"),
  password: m(sec, "pin code secret"),
  bell: m(ppl, "notifications alerts"),
  "bell-off": m(ppl, "mute silence notifications-off"),
  user: m(ppl, "profile account person"),
  users: m(ppl, "people group contacts"),
  "user-plus": m(ppl, "add-recipient new-contact invite"),
  "user-check": m(ppl, "verified recipient"),
  "user-id": m(ppl, "identity kyc card"),
  wallet: m(money, "account balance money"),
  "wallet-money": m(money, "savings cash balance"),
  card: m(money, "debit credit card payment"),
  "card-send": m(money, "card-payment pay-out"),
  "card-receive": m(money, "card-refund pay-in"),
  "card-transfer": m(money, "card-to-card transfer"),
  cardholder: m(money, "cards wallet"),
  banknote: m(money, "cash money note"),
  coins: m(money, "change savings"),
  "piggy-bank": m(money, "savings goal"),
  safe: m(money, "vault deposit secure"),
  bill: m(money, "invoice utility payment"),
  "bill-check": m(money, "paid invoice"),
  "cash-out": m(money, "withdraw atm"),
  "money-bag": m(money, "loan funds"),
  tag: m(money, "category label price"),
  ticket: m(money, "voucher event"),
  dollar: m(money, "usd currency"),
  euro: m(money, "eur currency"),
  "hand-money": m(money, "request receive get-paid"),
  handshake: m(money, "agreement deal partner"),
  chart: m(biz, "statistics graph insights"),
  "pie-chart": m(biz, "breakdown spending share"),
  "trend-up": m(biz, "growth increase gain"),
  "trend-down": m(biz, "decline decrease loss"),
  bank: m(biz, "account institution building"),
  building: m(biz, "company business office"),
  house: m(biz, "home mortgage rent"),
  clock: m(time, "time pending later"),
  calendar: m(time, "date schedule"),
  "calendar-date": m(time, "scheduled due-date"),
  history: m(time, "past activity recent"),
  hourglass: m(time, "waiting processing"),
  chat: m(doc, "message support conversation"),
  mail: m(doc, "email envelope"),
  inbox: m(doc, "messages received"),
  paperclip: m(doc, "attachment file"),
  phone: m(doc, "call telephone"),
  smartphone: m(doc, "mobile device top-up"),
  laptop: m(doc, "computer online device"),
  document: m(doc, "file page contract"),
  documents: m(doc, "files statements"),
  receipt: m(doc, "proof payment invoice"),
  clipboard: m(doc, "list tasks paste"),
  "shopping-bag": m(spend, "shopping purchase retail"),
  cart: m(spend, "groceries supermarket basket"),
  shop: m(spend, "store merchant"),
  coffee: m(spend, "cafe drink"),
  restaurant: m(spend, "eating-out food dining"),
  transport: m(spend, "bus metro public-transport"),
  car: m(spend, "vehicle taxi auto"),
  airplane: m(spend, "travel flight holiday"),
  fuel: m(spend, "gas petrol"),
  health: m(spend, "medical pharmacy"),
  education: m(spend, "school university"),
  book: m(spend, "books reading"),
  calculator: m(spend, "calculate budget"),
  gym: m(spend, "fitness sport"),
  clothing: m(spend, "fashion clothes"),
  waterdrop: m(spend, "water utility bill"),
  fire: m(spend, "gas heating hot"),
  lightbulb: m(spend, "electricity idea tip"),
  wifi: m(spend, "internet connection"),
  globe: m(place, "world international web"),
  "map-point": m(place, "location address atm-nearby"),
  language: m(place, "translate locale"),
  sun: m(place, "light-mode day"),
  moon: m(place, "dark-mode night"),
};

/** Icons reserved for one meaning. Never use them for anything else, and never use another icon for these meanings. */
export const reservedIcons = (Object.entries(iconMeta) as Array<[IconName, IconMeta]>).filter(([, meta]) => meta.reserved).map(([name, meta]) => ({ name, meaning: meta.reserved! }));
