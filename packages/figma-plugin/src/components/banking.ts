// Banking patterns: AmountDisplay, TransactionRow, AccountCard, BalanceHeader, PaymentCard,
// QuickActions, RecipientRow, SavingsGoal, SpendingBreakdown and SummaryList. Each is made of
// instances of components and base parts, so a change to Button or AmountDisplay reaches every pattern.
import { box, fillParent, paint, rect, text } from "../dsl.ts";
import { icon } from "../icons.ts";
import { comp, instance, instances, variantSet } from "../kit.ts";

const MINUS = "−";

export async function buildAmountDisplay() {
  return variantSet(
    "AmountDisplay",
    { direction: ["incoming", "outgoing", "neutral", "pending"], size: ["sm", "md", "lg", "xl"] },
    async (p) => {
      const value = p.direction === "incoming" ? "+₺1.250,00" : p.direction === "neutral" ? "₺1.250,00" : `${MINUS}₺1.250,00`;
      const color = p.direction === "incoming" ? "amount.incoming" : p.direction === "pending" ? "amount.pending" : p.direction === "outgoing" ? "amount.outgoing" : "text.default";
      const parts: SceneNode[] = [await text(value, `amount.${p.size}`, color, { name: "#Amount", numeric: true })];
      if (p.direction === "pending") parts.push(await box({ name: "Pending", dir: "row", cross: "center", gap: "space.3xs" }, [icon("clock", "icon-size.sm", "amount.pending"), await text("Pending", "label.sm", "amount.pending", { name: "#Pending label" })]));
      return comp({ dir: "row", cross: "baseline", gap: "space.xs" }, parts);
    },
    { description: "Money, always with an explicit sign from the direction. Color repeats the sign, never replaces it." },
  );
}

export async function buildTransactionRow() {
  return variantSet(
    "TransactionRow",
    { direction: ["outgoing", "incoming"], status: ["completed", "pending", "declined"] },
    async (p) => {
      const incoming = p.direction === "incoming";
      const declined = p.status === "declined";
      const lead = instance("_Icon tile", { tone: "primary", shape: "circle" }, {}, {}, { Icon: incoming ? "bank" : "coffee" });
      const texts = await box({ name: "Text", dir: "column" }, [await text(incoming ? "Salary, Acme Studio" : "Coffee Lab", "label.md", "text.default", { name: "#Merchant", truncate: true }), await text(incoming ? "Income · 12 Nov" : "Eating out · 12 Nov", "body.sm", "text.muted", { name: "#Meta" })]);
      const amount = instance("AmountDisplay", { direction: declined ? "neutral" : incoming ? "incoming" : "outgoing", size: "sm" }, { Amount: incoming ? "+₺52.000,00" : `${MINUS}₺85,00` });
      if (declined && amount) {
        const t = amount.findOne((n) => n.type === "TEXT") as TextNode | null;
        if (t) {
          t.textDecoration = "STRIKETHROUGH";
          t.fills = [paint("text.muted")];
        }
      }
      const end: SceneNode[] = [];
      if (amount) end.push(amount);
      if (p.status === "pending") end.push(instance("Badge", { tone: "warning", emphasis: "subtle", size: "sm" }, { Label: "Pending" })!);
      if (declined) end.push(instance("Badge", { tone: "danger", emphasis: "subtle", size: "sm" }, { Label: "Declined" })!);
      return comp({ dir: "row", cross: "center", gap: "space.sm", px: "space.md", py: "space.sm", w: 360, fill: "fill.surface.default" }, [lead, fillParent(texts), await box({ name: "End", dir: "column", cross: "end", gap: "space.3xs" }, end)]);
    },
    { description: "One payment in a list: _Icon tile, merchant, AmountDisplay and a Badge with the status in words." },
  );
}

async function card(children: Array<SceneNode | null>, w = 360): Promise<ComponentNode> {
  return comp({ dir: "column", gap: "space.md", px: "card.padding-lg", py: "card.padding-lg", radius: "card.radius", fill: "fill.surface.default", stroke: "border.muted", w }, children);
}

export async function buildAccountCard() {
  return variantSet(
    "AccountCard",
    { masked: ["false", "true"] },
    async (p) => {
      const masked = p.masked === "true";
      const top = await box({ name: "Top", dir: "row", cross: "center", gap: "space.sm" }, [instance("_Icon tile", { tone: "primary", shape: "rounded" }, {}, {}, { Icon: "bank" }), await box({ name: "Titles", dir: "column" }, [await text("Everyday", "heading.h5", "text.default", { name: "#Name" }), await text("Current account", "body.sm", "text.muted", { name: "#Type" })])]);
      const balance = masked ? await text("••••", "amount.lg", "text.default", { name: "Balance" }) : instance("AmountDisplay", { direction: "neutral", size: "lg" }, { Amount: "₺24.580,35" });
      const iban = await text("TR•• •••• •••• •••• •••• ••13 26", "body.sm", "text.muted", { name: "#IBAN" });
      const actions = await box({ name: "Actions", dir: "row", gap: "space.xs" }, instances([
        ["Button", { variant: "primary", shape: "rounded", size: "sm", state: "default" }, { Label: "Send" }, { "Show icon start": true }, { "Icon start": "arrow-up-right" }],
        ["Button", { variant: "secondary", shape: "rounded", size: "sm", state: "default" }, { Label: "Add money" }, { "Show icon start": true }, { "Icon start": "plus" }],
        ["Button", { variant: "secondary", shape: "rounded", size: "sm", state: "default" }, { Label: "Details" }],
      ]));
      return card([top, await box({ name: "Balance", dir: "column", gap: "space.2xs" }, [balance, iban]), actions]);
    },
    { description: "One account: _Icon tile, AmountDisplay, masked IBAN and Button actions." },
  );
}

export async function buildBalanceHeader() {
  return variantSet(
    "BalanceHeader",
    { masked: ["false", "true"] },
    async (p) => {
      const masked = p.masked === "true";
      const eye = instance("IconButton", { variant: "ghost", shape: "pill", size: "xs", state: "default" }, {}, {}, { Icon: masked ? "eye" : "eye-off" });
      const row = await box({ name: "Label row", dir: "row", cross: "center", gap: "space.2xs" }, [await text("Available balance", "label.sm", "text.muted", { name: "#Label" }), eye]);
      const balance = masked ? await text("••••", "amount.xl", "text.default", { name: "Balance" }) : instance("AmountDisplay", { direction: "neutral", size: "xl" }, { Amount: "₺24.580,35" });
      const actions = await box({ name: "?Actions", dir: "row", gap: "space.sm", pad: ["space.md", 0, 0, 0] }, instances([
        ["Button", { variant: "primary", shape: "rounded", size: "md", state: "default" }, { Label: "Send" }, { "Show icon start": true }, { "Icon start": "arrow-up-right" }],
        ["Button", { variant: "secondary", shape: "rounded", size: "md", state: "default" }, { Label: "Request" }, { "Show icon start": true }, { "Icon start": "arrow-down-left" }],
      ]));
      return comp({ dir: "column", gap: "space.2xs" }, [row, balance, await text("Updated 2 minutes ago", "caption", "text.subtle", { name: "#Updated" }), actions]);
    },
    { description: "The hero balance at the top of a home screen, with an IconButton that hides it." },
  );
}

export async function buildPaymentCard() {
  return variantSet(
    "PaymentCard",
    { state: ["active", "frozen"] },
    async (p) => {
      const frozen = p.state === "frozen";
      const on = frozen ? "fill.neutral.on-default" : "fill.primary.on-default";
      const badge = frozen ? await box({ name: "Frozen", dir: "row", cross: "center", gap: "space.2xs", px: "space.sm", py: "space.2xs", radius: "radius.pill", fill: "fill.surface.default", effect: "200" }, [icon("lock", "icon-size.sm", "text.default"), await text("Frozen", "label.sm", "text.default")]) : await text("Debit", "label.sm", on, { name: "Type" });
      const top = await box({ name: "Top", dir: "row", main: "between", cross: "center", w: "fill" }, [await text("Leeward", "heading.h5", on, { name: "#Brand" }), badge]);
      const number = await text("••••  ••••  ••••  4821", "code", on, { name: "#Number" });
      number.fontSize = 20;
      const col = async (caption: string, value: string, prop: string, end = false) => box({ name: caption, dir: "column", cross: end ? "end" : "start" }, [await text(caption, "caption", on), await text(value, "label.md", on, { name: `#${prop}` })]);
      const bottom = await box({ name: "Bottom", dir: "row", main: "between", cross: "end", w: "fill" }, [await col("Everyday debit", "Ece Kaya", "Holder"), await col("Expires", "08/28", "Expiry", true)]);
      const c = await comp({ dir: "column", main: "between", px: "payment-card.padding", py: "payment-card.padding", radius: "payment-card.radius", w: 340, h: 214, fill: frozen ? "fill.neutral.default" : "fill.primary.default", effect: frozen ? "100" : "300" }, [top, number, bottom]);
      if (!frozen) {
        // The same 135 degree gradient as the CSS, from default to strong; the stops are bound to those variables.
        const a = paint("fill.primary.default");
        const b = paint("fill.primary.strong");
        c.fills = [{ type: "GRADIENT_LINEAR", gradientTransform: [[0.5, 0.5, 0], [-0.5, 0.5, 0.5]], gradientStops: [{ position: 0, color: { r: 0.31, g: 0.27, b: 0.9, a: 1 }, boundVariables: a.boundVariables?.color ? { color: a.boundVariables.color } : {} }, { position: 1, color: { r: 0.22, g: 0.19, b: 0.64, a: 1 }, boundVariables: b.boundVariables?.color ? { color: b.boundVariables.color } : {} }] } as GradientPaint];
      }
      return c;
    },
    { description: "Card artwork with the last four digits only. The frozen state says so in a badge, not only in color." },
  );
}

export async function buildQuickActions() {
  await variantSet(
    "_Quick action",
    { state: ["default", "hover", "focus"] },
    async (p) => {
      const glyph = icon("send", "icon-size.lg", "icon.primary");
      glyph.name = "~Icon";
      const circle = await box({ name: "Icon", dir: "row", main: "center", cross: "center", w: "quick-action.icon-size", h: "quick-action.icon-size", radius: "quick-action.radius", fill: p.state === "hover" ? "fill.primary.subtlest" : "fill.primary.weak" }, [glyph]);
      const badge = instance("Indicator", { tone: "danger", kind: "count" });
      if (badge) {
        circle.appendChild(badge);
        badge.layoutPositioning = "ABSOLUTE";
        badge.x = 34;
        badge.y = -4;
        badge.name = "?Badge";
        badge.visible = false;
      }
      return comp({ dir: "column", cross: "center", gap: "space.xs", px: "space.2xs", py: "space.xs", radius: "radius.lg", w: 84, ...(p.state === "focus" ? { effect: "focus" } : {}) }, [circle, await text("Send", "label.sm", "text.default", { name: "#Label" })]);
    },
    { description: "One quick action: icon in a circle, a label and an optional Indicator badge." },
  );
  return variantSet(
    "QuickActions",
    {},
    async () => {
      const items = instances([
        ["_Quick action", { state: "default" }, { Label: "Send" }, {}, { Icon: "send" }],
        ["_Quick action", { state: "default" }, { Label: "Request" }, {}, { Icon: "hand-money" }],
        ["_Quick action", { state: "default" }, { Label: "Top up" }, {}, { Icon: "wallet-money" }],
        ["_Quick action", { state: "default" }, { Label: "Pay bills" }, { Badge: true }, { Icon: "bill" }],
      ]);
      return comp({ dir: "row", gap: "space.xs", w: 360 }, items.map((n) => fillParent(n)));
    },
    { description: "Two to five main actions of a screen, as _Quick action instances." },
  );
}

export async function buildRecipientRow() {
  return variantSet(
    "RecipientRow",
    { kind: ["static", "choosable"], favorite: ["false", "true"] },
    async (p) => {
      const star = icon("star", "icon-size.sm", "icon.attention", "bold");
      star.visible = p.favorite === "true";
      const name = await box({ name: "Name", dir: "row", cross: "center", gap: "space.2xs" }, [await text("Deniz Yılmaz", "label.md", "text.default", { name: "#Name" }), star]);
      const texts = await box({ name: "Text", dir: "column" }, [name, await text("Leeward · TR•• •••• •••• •••• •••• ••13 26", "body.sm", "text.muted", { name: "#Detail", truncate: true })]);
      const chevron = icon("chevron-right", "icon-size.md", "icon.muted");
      chevron.visible = p.kind === "choosable";
      return comp({ dir: "row", cross: "center", gap: "space.sm", px: "space.md", py: "space.sm", w: 360, fill: "fill.surface.default" }, [instance("Avatar", { tone: "primary", size: "md" }, { Initials: "DY" }), fillParent(texts), chevron]);
    },
    { description: "A saved recipient: Avatar, bank and masked IBAN. Favorites have a star and say so to screen readers." },
  );
}

export async function buildSavingsGoal() {
  return variantSet(
    "SavingsGoal",
    { state: ["in-progress", "reached"] },
    async (p) => {
      const reached = p.state === "reached";
      const top = await box({ name: "Top", dir: "row", cross: "center", gap: "space.sm" }, [instance("_Icon tile", { tone: "secondary", shape: "circle" }, {}, {}, { Icon: reached ? "laptop" : "airplane" }), await box({ name: "Titles", dir: "column" }, [await text(reached ? "New laptop" : "Holiday fund", "heading.h5", "text.default", { name: "Name" }), await text("By June 1, 2027", "body.sm", "text.muted", { name: "#Meta" })])]);
      const amounts = await box({ name: "Amounts", dir: "row", cross: "baseline", gap: "space.xs" }, [instance("AmountDisplay", { direction: "neutral", size: "lg" }, { Amount: reached ? "₺31.200,00" : "₺18.500,00" }), await text("of ₺30.000,00", "body.sm", "text.muted", { name: "#Target" })]);
      const progress = instance("ProgressBar", { tone: reached ? "success" : "brand", size: "md" }, { Label: "Progress", Value: reached ? "Goal reached" : "61% saved" });
      const action = reached ? null : await box({ name: "Action", dir: "row" }, [instance("Button", { variant: "secondary", shape: "rounded", size: "sm", state: "default" }, { Label: "Add money" }, { "Show icon start": true }, { "Icon start": "plus" })]);
      return card([top, amounts, progress ? fillParent(progress) : null, action]);
    },
    { description: "Progress toward a savings goal from _Icon tile, AmountDisplay, ProgressBar and Button." },
  );
}

const SPENDING_TONES = ["primary", "secondary", "info", "success", "attention", "warning", "neutral"];

export async function buildSpendingBreakdown() {
  await variantSet(
    "_Spending row",
    { tone: SPENDING_TONES },
    async (p) => {
      const glyph = icon("cart", "icon-size.sm", "icon.muted");
      glyph.name = "~Icon";
      return comp({ dir: "row", cross: "center", gap: "space.xs", py: "space.xs", w: 360, stroke: "border.subtle", strokeSides: { top: true }, strokeWidth: 1 }, [rect({ name: "Swatch", w: "spending.swatch-size", h: "spending.swatch-size", radius: "spending.swatch-radius", fill: `fill.${p.tone}.default` }), glyph, fillParent(await text("Groceries", "body.md", "text.default", { name: "#Category" })), await text("39%", "body.sm", "text.muted", { name: "#Share" }), await text("₺4.200,00", "label.md", "text.default", { name: "#Amount", numeric: true })]);
    },
    { description: "One category: a swatch in the bar's color, an icon, the share and the amount. Shares never rely on color alone." },
  );
  return variantSet(
    "SpendingBreakdown",
    {},
    async () => {
      const cats: Array<[string, string, string, string, number]> = [
        ["Groceries", "cart", "primary", "₺4.200,00", 39],
        ["Bills", "bill", "secondary", "₺3.100,00", 29],
        ["Eating out", "restaurant", "info", "₺1.850,00", 17],
        ["Transport", "transport", "success", "₺960,00", 9],
        ["Shopping", "shopping-bag", "attention", "₺640,00", 6],
      ];
      const W = 360;
      const bar = await box({ name: "Bar", dir: "row", gap: "spending.bar-gap", h: "spending.bar-height", radius: "spending.bar-radius", w: W, clip: true }, cats.map(([name, , tone, , share]) => rect({ name, w: Math.round(((W - 8) * share) / 100), h: "spending.bar-height", fill: `fill.${tone}.default` })));
      const rows = instances(cats.map(([name, iconName, tone, amount, share]) => ["_Spending row", { tone }, { Category: name, Share: `${share}%`, Amount: amount }, {}, { Icon: iconName }]));
      const first = rows[0];
      if (first) first.strokeTopWeight = 0;
      return comp({ dir: "column", gap: "space.md", w: W }, [await box({ name: "Header", dir: "column", gap: "space.2xs" }, [await text("Spending in November", "heading.h5", "text.default", { name: "#Title" }), instance("AmountDisplay", { direction: "neutral", size: "lg" }, { Amount: "₺10.750,00" })]), bar, await box({ name: "List", dir: "column", w: "fill" }, rows.map((n) => fillParent(n)))]);
    },
    { description: "Where the money went: one bar of shares and _Spending row instances with the same colors, icons, shares and amounts." },
  );
}

export async function buildSummaryList() {
  await variantSet(
    "_Summary row",
    { kind: ["default", "total"] },
    async (p) => {
      if (p.kind === "total") return comp({ dir: "row", main: "between", py: "summary-list.row-padding-y", w: 360, stroke: "border.default", strokeSides: { top: true }, strokeWidth: 2 }, [await text("Total", "heading.h5", "text.default", { name: "#Label" }), await text("₺250,00", "heading.h5", "text.default", { name: "#Value", numeric: true })]);
      const hint = await text("Free for Leeward accounts", "body.sm", "text.muted", { name: "?#Hint", align: "right" });
      hint.visible = false;
      const value = await box({ name: "Value", dir: "column", cross: "end" }, [await text("₺250,00", "label.lg", "text.default", { name: "#Value", align: "right" }), hint]);
      return comp({ dir: "row", main: "between", cross: "start", gap: "summary-list.column-gap", py: "summary-list.row-padding-y", w: 360, stroke: "border.subtle", strokeSides: { top: true }, strokeWidth: 1 }, [await text("Amount", "body.md", "text.muted", { name: "#Label" }), value]);
    },
    { description: "One label and value pair with an optional hint, or the total row." },
  );
  return variantSet(
    "SummaryList",
    {},
    async () => {
      const rows = instances([
        ["_Summary row", { kind: "default" }, { Label: "Recipient", Value: "Deniz Yılmaz", Hint: "TR•• •••• •••• •••• •••• ••13 26" }, { "Show hint": true }],
        ["_Summary row", { kind: "default" }, { Label: "Amount", Value: "₺250,00" }],
        ["_Summary row", { kind: "default" }, { Label: "Fee", Value: "₺0,00", Hint: "Free for Leeward accounts" }, { "Show hint": true }],
        ["_Summary row", { kind: "default" }, { Label: "Arrives", Value: "In a few seconds" }],
        ["_Summary row", { kind: "total" }, { Label: "Total", Value: "₺250,00" }],
      ]);
      const first = rows[0];
      if (first) first.strokeTopWeight = 0;
      return comp({ dir: "column", w: 360 }, rows.map((n) => fillParent(n)));
    },
    { description: "Label and value pairs for reviewing a transfer or reading a receipt, from _Summary row instances." },
  );
}
