// Form controls, built from base parts. Bases (names start with _) hold the states; the published
// components are instances of them put together, like the React components compose their parts.
import { box, fillParent, rect, text } from "../dsl.ts";
import { icon } from "../icons.ts";
import { comp, instance, instances, variantSet, type Props } from "../kit.ts";

const W = 320;
// typing: focused with a value, so placeholder and value states both have a focused look.
const FIELD_STATES = ["default", "hover", "focus", "typing", "filled", "error", "disabled"];
const hidden = <T extends SceneNode>(node: T): T => {
  node.visible = false;
  return node;
};

/** _Field label and _Field message: the text around every field. */
export async function buildFieldParts() {
  await variantSet("_Field label", {}, async () => comp({ dir: "row", gap: "space.2xs" }, [await text("Label", "label.sm", "text.default", { name: "#Label" }), hidden(await text("(optional)", "body.sm", "text.muted", { name: "?Optional" }))]), { description: "The label above a field, with an optional marker." });
  await variantSet(
    "_Field message",
    { kind: ["hint", "error"] },
    async (p) =>
      p.kind === "hint"
        ? comp({ dir: "row", w: W }, [await text("Message", "body.sm", "text.muted", { name: "#Message", w: "fill" })])
        : comp({ dir: "row", gap: "space.2xs", cross: "start", w: W }, [icon("alert-circle", "icon-size.sm", "text.danger"), await text("Message", "body.sm", "text.danger", { name: "#Message", w: "fill" })]),
    { description: "A hint under the label, or an error under the field. Errors always have the icon and words, never color alone." },
  );
}

/** _Input: the bordered control shared by every text-like field, with optional slots. */
export async function buildInput() {
  return variantSet(
    "_Input",
    { shape: ["rounded", "pill"], size: ["sm", "md", "lg"], state: FIELD_STATES },
    async (p) => {
      const size = p.size!;
      const pill = p.shape === "pill";
      const state = p.state!;
      const disabled = state === "disabled";
      const filled = state === "filled" || state === "typing" || state === "error" || disabled;
      const role = size === "sm" ? "body.sm" : size === "lg" ? "body.lg" : "body.md";
      const iconColor = disabled ? "icon.subtler" : "icon.muted";
      const steppers = await box({ name: "?Steppers", dir: "row", gap: "space.3xs" }, instances([
        ["IconButton", { variant: "ghost", shape: "rounded", size: "xs", state: disabled ? "disabled" : "default" }, {}, {}, { Icon: "minus" }],
        ["IconButton", { variant: "ghost", shape: "rounded", size: "xs", state: disabled ? "disabled" : "default" }, {}, {}, { Icon: "plus" }],
      ]));
      const start = hidden(icon("search", "icon-size.md", iconColor));
      start.name = "?~Icon start";
      const end = hidden(icon("chevron-down", "icon-size.md", iconColor));
      end.name = "?~Icon end";
      const placeholder = await text("Placeholder", role, disabled ? "text.subtler" : "text.subtle", { name: "#Placeholder", truncate: true });
      const value = await text("Value", role, disabled ? "text.subtler" : "text.default", { name: "#Value", truncate: true, numeric: true });
      placeholder.visible = !filled;
      value.visible = filled;
      return comp({
        dir: "row",
        cross: "center",
        gap: "space.xs",
        w: W,
        h: `input.height-${size}`,
        px: pill ? `input.padding-x-pill-${size}` : `input.padding-x-${size}`,
        radius: pill ? "input.radius-pill" : `input.radius-${size}`,
        fill: disabled ? "fill.disabled.default" : "fill.surface.default",
        stroke: state === "error" ? "border.danger" : disabled ? "border.subtle" : state === "hover" ? "border.strong" : "border.default",
        strokeWidth: state === "error" ? "input.border-width-invalid" : "input.border-width",
        ...(state === "focus" || state === "typing" ? { effect: "focus" } : {}),
      }, [start, hidden(await text("₺", role, "text.muted", { name: "?#Prefix" })), fillParent(placeholder), fillParent(value), hidden(await text("unit", role, "text.muted", { name: "?#Suffix" })), hidden(steppers), end]);
    },
    { description: "The control inside TextField, Select, SearchField, NumberInput, AmountInput, Combobox and DatePicker. Turn slots on with the Show properties and swap the icons." },
  );
}

interface FieldOptions {
  label: string;
  input: Props;
  texts?: Record<string, string>;
  flags?: Record<string, boolean>;
  swaps?: Record<string, string>;
  hint?: string;
  error?: string;
  optional?: boolean;
  extra?: SceneNode | null;
}

/** A field put together from its parts: label, hint, the _Input and an error. */
async function field(o: FieldOptions): Promise<ComponentNode> {
  const parts: SceneNode[] = [];
  const label = instance("_Field label", {}, { Label: o.label }, { Optional: Boolean(o.optional) });
  if (label) parts.push(label);
  if (o.hint) {
    const hint = instance("_Field message", { kind: "hint" }, { Message: o.hint });
    if (hint) {
      hint.name = "?Hint";
      parts.push(fillParent(hint));
    }
  }
  const input = instance("_Input", o.input, o.texts ?? {}, o.flags ?? {}, o.swaps ?? {});
  if (input) parts.push(fillParent(input));
  if (o.extra) parts.push(o.extra);
  if (o.error) {
    const error = instance("_Field message", { kind: "error" }, { Message: o.error });
    if (error) parts.push(fillParent(error));
  }
  return comp({ dir: "column", gap: "space.2xs", w: W }, parts);
}

export async function buildTextField() {
  await buildFieldParts();
  await buildInput();
  return variantSet(
    "TextField",
    { shape: ["rounded", "pill"], size: ["sm", "md", "lg"], state: FIELD_STATES },
    async (p) => field({ label: "Recipient name", input: p, texts: { Placeholder: "Full name", Value: "Deniz Yılmaz" }, hint: "As it appears on their bank account", ...(p.state === "error" ? { error: "Enter the recipient's name" } : {}) }),
    { description: "One line of text, built from _Field label, _Field message and _Input. Hints sit under the label, errors under the field." },
  );
}

export async function buildTextarea() {
  return variantSet(
    "Textarea",
    { state: ["default", "focus", "filled", "error", "disabled"] },
    async (p) => {
      const error = p.state === "error";
      const area = await box({
        name: "Control",
        dir: "column",
        px: "textarea.padding",
        py: "textarea.padding",
        radius: "textarea.radius",
        fill: p.state === "disabled" ? "fill.disabled.default" : "fill.surface.default",
        stroke: error ? "border.danger" : "border.default",
        strokeWidth: error ? "size.border.strong" : "size.border.default",
        ...(p.state === "focus" ? { effect: "focus" } : {}),
      }, [await text(p.state === "filled" || p.state === "disabled" ? "Rent for November" : "What is this payment for?", "body.md", p.state === "filled" ? "text.default" : p.state === "disabled" ? "text.subtler" : "text.placeholder", { name: "Value", w: "fill" })]);
      area.minHeight = 56;
      const count = await text(p.state === "filled" ? "17 of 140" : "0 of 140", "caption", "text.subtle", { name: "Count", align: "right", w: "fill" });
      const parts = [instance("_Field label", {}, { Label: "Payment note" }, { Optional: true }), fillParent(instance("_Field message", { kind: "hint" }, { Message: "The recipient sees this" })!), fillParent(area), count, error ? fillParent(instance("_Field message", { kind: "error" }, { Message: "Add a note so you can find this payment later" })!) : null];
      return comp({ dir: "column", gap: "space.2xs", w: W }, parts);
    },
    { description: "Several lines of text, with a character count when there is a limit." },
  );
}

export async function buildSelect() {
  return variantSet(
    "Select",
    { shape: ["rounded", "pill"], size: ["sm", "md", "lg"], state: FIELD_STATES },
    async (p) => field({ label: "Pay from", input: p, texts: { Placeholder: "Choose an account", Value: "Savings" }, flags: { "Show icon end": true }, swaps: { "Icon end": "chevron-down" }, ...(p.state === "error" ? { error: "Choose an account to continue" } : {}) }),
    { description: "Picks one option from a short list. For long lists with search, use Combobox." },
  );
}

export async function buildSearchField() {
  return variantSet(
    "SearchField",
    { shape: ["rounded", "pill"], size: ["sm", "md"], state: ["default", "focus", "typing", "filled"] },
    async (p) =>
      field({ label: "Search transactions", input: p, texts: { Placeholder: "Merchant or amount", Value: "Coffee" }, flags: { "Show icon start": true, "Show icon end": p.state === "filled" || p.state === "typing" }, swaps: { "Icon start": "search", "Icon end": "close" } }),
    { description: "Searches a list. The clear button appears once there is text." },
  );
}

export async function buildNumberInput() {
  return variantSet(
    "NumberInput",
    { state: ["default", "focus", "error", "disabled"] },
    async (p) =>
      field({ label: "Loan term", input: { shape: "rounded", size: "md", state: p.state === "default" ? "filled" : p.state === "focus" ? "typing" : p.state! }, texts: { Placeholder: "0", Value: p.state === "error" ? "48" : "12", Suffix: "months" }, flags: { "Show suffix": true, Steppers: true }, hint: "Between 3 and 36 months", ...(p.state === "error" ? { error: "Choose between 3 and 36 months" } : {}) }),
    { description: "A number with step buttons and a unit. Typing works too; arrow keys step by one." },
  );
}

export async function buildAmountInput() {
  return variantSet(
    "AmountInput",
    { state: ["default", "focus", "error"] },
    async (p) =>
      field({ label: "Amount", input: { shape: "rounded", size: "lg", state: p.state === "default" ? "filled" : p.state === "focus" ? "typing" : p.state! }, texts: { Prefix: "₺", Value: p.state === "error" ? "30.000,00" : "1.250,50" }, flags: { "Show prefix": true }, hint: "Available: ₺24.580,35", ...(p.state === "error" ? { error: "This is more than you have. You can send up to ₺24.580,35." } : {}) }),
    { description: "Money in the person's locale, with the currency shown and the available balance as the hint." },
  );
}

/** A list of _Menu item instances in an overlay surface. */
async function menuList(items: Array<[Props, Record<string, string>]>, w = W): Promise<FrameNode> {
  return box({ name: "List", dir: "column", px: "menu.padding", py: "menu.padding", radius: "menu.radius", fill: "fill.surface.overlay", stroke: "border.muted", effect: "500", w }, instances(items.map(([props, texts]) => ["_Menu item", props, texts, { "Show icon": false }])).map((n) => fillParent(n)));
}

export async function buildCombobox() {
  return variantSet(
    "Combobox",
    { state: ["default", "filled", "open", "error"] },
    async (p) => {
      const open = p.state === "open";
      const list = open ? await menuList([[{ state: "selected" }, { Label: "Türkiye İş Bankası" }], [{ state: "default" }, { Label: "İş Yatırım" }], [{ state: "default" }, { Label: "Ziraat Bankası" }]]) : null;
      return field({ label: "Bank", input: { shape: "rounded", size: "md", state: open ? "typing" : p.state! }, texts: { Placeholder: "Start typing a bank name", Value: open ? "iş" : "Türkiye İş Bankası" }, flags: { "Show icon end": true }, swaps: { "Icon end": "chevron-down" }, extra: list, ...(p.state === "error" ? { error: "Choose the recipient's bank" } : {}) });
    },
    { description: "Type to filter a long list of _Menu item options, then pick one. Matching ignores accents and Turkish dotted and dotless i." },
  );
}

export async function buildCalendar() {
  await variantSet(
    "_Calendar day",
    { state: ["default", "hover", "today", "selected", "outside", "disabled", "focus"] },
    async (p) => {
      const s = p.state!;
      const color = s === "selected" ? "fill.primary.on-default" : s === "outside" ? "text.subtle" : s === "disabled" ? "text.subtler" : "text.default";
      return comp({ dir: "row", main: "center", cross: "center", w: "calendar.cell-size", h: "calendar.cell-size", radius: "calendar.cell-radius", ...(s === "selected" ? { fill: "fill.primary.default", stroke: "fill.primary.default" } : s === "hover" ? { fill: "fill.surface.bold" } : {}), ...(s === "today" ? { stroke: "border.strong" } : {}), ...(s === "focus" ? { effect: "focus" } : {}) }, [await text("18", "label.sm", color, { name: "#Day", strike: s === "disabled" })]);
    },
    { description: "One day cell. Today has a ring, the selected day is filled, days outside the month are lighter, disabled days are struck through." },
  );
  return variantSet(
    "Calendar",
    {},
    async () => {
      const header = await box({ name: "Header", dir: "row", main: "between", cross: "center", w: "fill" }, [
        instance("IconButton", { variant: "ghost", shape: "pill", size: "sm", state: "default" }, {}, {}, { Icon: "chevron-left" }),
        await text("November 2026", "label.md", "text.default", { name: "#Month" }),
        instance("IconButton", { variant: "ghost", shape: "pill", size: "sm", state: "default" }, {}, {}, { Icon: "chevron-right" }),
      ]);
      const week = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
      const head = await box({ name: "Weekdays", dir: "row", gap: "calendar.gap" }, await Promise.all(week.map(async (d) => box({ name: d, dir: "row", main: "center", cross: "center", w: "calendar.cell-size", h: "space.lg" }, [await text(d, "caption", "text.muted", { weight: "SemiBold" })]))));
      const rows: FrameNode[] = [];
      // November 2026 starts on a Sunday; the grid starts on Monday.
      let day = -5;
      for (let r = 0; r < 5; r++) {
        const cells: InstanceNode[] = [];
        for (let c = 0; c < 7; c++, day++) {
          const outside = day < 1 || day > 30;
          const label = String(outside ? (day < 1 ? 31 + day : day - 30) : day);
          const state = outside ? "outside" : day === 18 ? "selected" : day === 15 ? "today" : "default";
          const cell = instance("_Calendar day", { state }, { Day: label });
          if (cell) cells.push(cell);
        }
        rows.push(await box({ name: `Week ${r + 1}`, dir: "row", gap: "calendar.gap" }, cells));
      }
      return comp({ dir: "column", gap: "space.xs", px: "calendar.padding", py: "calendar.padding" }, [header, head, ...rows]);
    },
    { description: "A month grid of _Calendar day instances. Arrow keys move by day, Page Up and Page Down by month." },
  );
}

export async function buildDatePicker() {
  return variantSet(
    "DatePicker",
    { state: ["default", "filled", "open", "error"] },
    async (p) => {
      const popover = p.state === "open" ? await box({ name: "Popover", dir: "column", radius: "popover.radius", fill: "fill.surface.overlay", stroke: "border.muted", effect: "500" }, [instance("Calendar")]) : null;
      return field({ label: "Send on", input: { shape: "rounded", size: "md", state: p.state === "open" ? "typing" : p.state! }, texts: { Placeholder: "MM/DD/YYYY", Value: "11/18/2026" }, flags: { "Show icon end": true }, swaps: { "Icon end": "calendar" }, hint: "MM/DD/YYYY", extra: popover, ...(p.state === "error" ? { error: "Enter a date as MM/DD/YYYY." } : {}) });
    },
    { description: "Type a date or pick it from the calendar. The format hint follows the locale." },
  );
}

const CONTROL_STATES = ["default", "hover", "focus", "error", "disabled"];

export async function buildCheckbox() {
  await variantSet(
    "_Checkbox box",
    { checked: ["false", "true", "indeterminate"], state: CONTROL_STATES },
    async (p) => {
      const checked = p.checked !== "false";
      const disabled = p.state === "disabled";
      const c = await comp({
        dir: "row",
        main: "center",
        cross: "center",
        w: "checkbox.size",
        h: "checkbox.size",
        radius: "checkbox.radius",
        fill: disabled ? "fill.disabled.default" : checked ? "fill.primary.default" : "fill.surface.default",
        stroke: disabled ? "fill.disabled.stronger" : p.state === "error" ? "border.danger" : checked ? "fill.primary.default" : p.state === "hover" ? "border.strong" : "border.default",
        strokeWidth: "size.border.strong",
        ...(p.state === "focus" ? { effect: "focus" } : {}),
      });
      if (checked) c.appendChild(icon(p.checked === "indeterminate" ? "minus" : "check", "icon-size.sm", disabled ? "text.subtler" : "fill.primary.on-default"));
      return c;
    },
    { description: "The box alone: unchecked, checked and indeterminate in every state." },
  );
  return variantSet(
    "Checkbox",
    { checked: ["false", "true", "indeterminate"], state: CONTROL_STATES },
    async (p) => {
      const row = await box({ name: "Row", dir: "row", gap: "space.sm", cross: "center" }, [instance("_Checkbox box", p), await text("Save as a recipient", "body.md", p.state === "disabled" ? "text.subtler" : "text.default", { name: "#Label" })]);
      const error = p.state === "error" ? instance("_Field message", { kind: "error" }, { Message: "Accept the terms to continue" }) : null;
      return comp({ dir: "column", gap: "space.2xs" }, [row, error]);
    },
    { description: "Turns one option on or off, or picks several options from a group. Built from _Checkbox box and a label." },
  );
}

export async function buildCheckboxGroup() {
  return variantSet(
    "CheckboxGroup",
    { orientation: ["vertical", "horizontal"] },
    async (p) =>
      comp({ dir: "column", gap: "space.xs" }, [
        await text("Show", "label.sm", "text.default", { name: "#Legend" }),
        await box({ name: "Options", dir: p.orientation === "vertical" ? "column" : "row", gap: p.orientation === "vertical" ? "space.sm" : "space.lg" }, instances([
          ["Checkbox", { checked: "true", state: "default" }, { Label: "Money in" }],
          ["Checkbox", { checked: "true", state: "default" }, { Label: "Money out" }],
          ["Checkbox", { checked: "false", state: "default" }, { Label: "Pending only" }],
        ])),
      ]),
    { description: "Several related Checkbox instances under one legend." },
  );
}

export async function buildRadioGroup() {
  await variantSet(
    "_Radio",
    { selected: ["false", "true"], state: CONTROL_STATES },
    async (p) => {
      const on = p.selected === "true";
      const disabled = p.state === "disabled";
      const c = await comp({
        dir: "row",
        main: "center",
        cross: "center",
        w: "radio.size",
        h: "radio.size",
        radius: "radius.pill",
        fill: disabled ? "fill.disabled.default" : "fill.surface.default",
        stroke: disabled ? "fill.disabled.stronger" : p.state === "error" ? "border.danger" : on ? "fill.primary.default" : p.state === "hover" ? "border.strong" : "border.default",
        strokeWidth: "size.border.strong",
        ...(p.state === "focus" ? { effect: "focus" } : {}),
      });
      if (on) c.appendChild(rect({ name: "Dot", w: "radio.dot-size", h: "radio.dot-size", radius: "radius.pill", fill: disabled ? "fill.disabled.stronger" : "fill.primary.default" }));
      return c;
    },
    { description: "The radio circle alone, selected or not, in every state." },
  );
  await variantSet(
    "_Radio option",
    { selected: ["false", "true"], state: CONTROL_STATES },
    async (p) => {
      const texts = await box({ name: "Text", dir: "column" }, [await text("Now", "body.md", p.state === "disabled" ? "text.subtler" : "text.default", { name: "#Label" }), await text("Free, arrives in seconds", "body.sm", "text.muted", { name: "?#Description" })]);
      return comp({ dir: "row", gap: "space.sm", cross: "start" }, [instance("_Radio", p), texts]);
    },
    { description: "A _Radio with its label and an optional description." },
  );
  return variantSet(
    "RadioGroup",
    { orientation: ["vertical", "horizontal"], state: ["default", "error", "disabled"] },
    async (p) => {
      const state = p.state === "error" ? "error" : p.state === "disabled" ? "disabled" : "default";
      const vertical = p.orientation === "vertical";
      const options: Array<[string, string]> = [["Now", "Free, arrives in seconds"], ["On a date", "Choose a day in the next 12 months"], ["Every month", "Sends on the same day each month"]];
      const items = instances(options.map(([label, description], i) => ["_Radio option", { selected: String(i === 1 && p.state !== "error"), state }, { Label: label, Description: description }, { "Show description": vertical }]));
      const parts: Array<SceneNode | null> = [await text("When should it arrive?", "label.sm", "text.default", { name: "#Legend" }), await box({ name: "Options", dir: vertical ? "column" : "row", gap: vertical ? "space.sm" : "space.lg" }, items)];
      if (p.state === "error") parts.push(instance("_Field message", { kind: "error" }, { Message: "Choose when the money should arrive" }));
      return comp({ dir: "column", gap: "space.xs" }, parts);
    },
    { description: "Picks exactly one option from _Radio option instances. For more than five options, use Select." },
  );
}

export async function buildSwitch() {
  await variantSet(
    "_Switch track",
    { checked: ["false", "true"], state: ["default", "focus", "disabled"] },
    async (p) => {
      const on = p.checked === "true";
      const disabled = p.state === "disabled";
      return comp({ dir: "row", cross: "center", main: on ? "end" : "start", px: "switch.inset", w: "switch.track-width", h: "switch.track-height", radius: "switch.radius", fill: disabled ? "fill.disabled.stronger" : on ? "fill.primary.default" : "fill.control.track", ...(p.state === "focus" ? { effect: "focus" } : {}) }, [
        await box({ name: "Thumb", dir: "none", w: "switch.thumb-size", h: "switch.thumb-size", radius: "radius.pill", fill: disabled ? "fill.surface.default" : "fill.control.thumb", ...(disabled ? {} : { effect: "200" }) }),
      ]);
    },
    { description: "The track and thumb alone, on or off, in every state." },
  );
  return variantSet(
    "Switch",
    { checked: ["false", "true"], state: ["default", "focus", "disabled"] },
    async (p) => {
      const texts = await box({ name: "Text", dir: "column", gap: "space.3xs" }, [await text("Online card payments", "body.md", p.state === "disabled" ? "text.subtler" : "text.default", { name: "#Label" }), await text("Turn off to block payments on websites", "body.sm", "text.muted", { name: "?#Hint" })]);
      return comp({ dir: "row", main: "between", cross: "start", gap: "space.md", w: W }, [texts, instance("_Switch track", p)]);
    },
    { description: "Turns a setting on or off right away. Built from _Switch track and a label. If the change needs a Save button, use a Checkbox." },
  );
}

export async function buildSegmentedControl() {
  await variantSet(
    "_Segment",
    { shape: ["rounded", "pill"], size: ["sm", "md", "lg"], selected: ["false", "true"], state: ["default", "hover", "disabled"] },
    async (p) => {
      const on = p.selected === "true";
      const color = p.state === "disabled" ? "text.subtler" : on || p.state === "hover" ? "text.default" : "text.muted";
      const lead = hidden(icon("history", "icon-size.sm", color));
      lead.name = "?~Icon";
      return comp({ dir: "row", main: "center", cross: "center", gap: "space.2xs", px: `control.padding-x.${p.size}`, h: `segmented.height-${p.size}`, radius: p.shape === "pill" ? "segmented.radius-pill" : `segmented.item-radius-${p.size}`, ...(on ? { fill: "fill.surface.default", effect: "100" } : p.state === "hover" ? { fill: "fill.surface.bolder" } : {}) }, [lead, await text("Month", p.size === "lg" ? "button.md" : "button.sm", color, { name: "#Label" })]);
    },
    { description: "One option of a SegmentedControl, selected or not." },
  );
  return variantSet(
    "SegmentedControl",
    { shape: ["rounded", "pill"], size: ["sm", "md", "lg"] },
    async (p) => {
      const items = instances(["Week", "Month", "Year"].map((label, i) => ["_Segment", { shape: p.shape!, size: p.size!, selected: String(i === 1), state: "default" }, { Label: label }]));
      // The control keeps the token height; segments fill it inside the inset.
      return comp({ dir: "row", cross: "center", gap: "segmented.inset", px: "segmented.inset", py: "segmented.inset", h: `segmented.height-${p.size}`, radius: p.shape === "pill" ? "segmented.radius-pill" : `segmented.radius-${p.size}`, fill: "fill.surface.bold", stroke: "border.muted" }, items.map((n) => fillParent(n, "h")));
    },
    { description: "Switches between two to five views of the same content. Built from _Segment instances." },
  );
}

export async function buildSlider() {
  await variantSet(
    "_Slider thumb",
    { state: ["default", "focus", "disabled"] },
    async (p) => comp({ dir: "none", w: "slider.thumb-size", h: "slider.thumb-size", radius: "slider.radius", fill: "fill.surface.default", stroke: p.state === "disabled" ? "fill.disabled.stronger" : "fill.primary.default", strokeWidth: "size.border.strong", effect: p.state === "focus" ? "focus" : "100" }),
    { description: "The handle people drag." },
  );
  return variantSet(
    "Slider",
    { state: ["default", "focus", "disabled"] },
    async (p) => {
      const disabled = p.state === "disabled";
      const top = await box({ name: "Top", dir: "row", main: "between", cross: "end", w: "fill" }, [await text("Save each month", "label.sm", "text.default", { name: "#Label" }), await text("₺2.250", "label.lg", "text.default", { name: "#Value" })]);
      const track = await box({ name: "Track", dir: "none", w: W, h: 20 });
      const rail = rect({ name: "Rail", w: W, h: "slider.track-height", radius: "slider.radius", fill: "fill.surface.bolder" });
      const range = rect({ name: "Range", w: Math.round(W * 0.225), h: "slider.track-height", radius: "slider.radius", fill: disabled ? "fill.disabled.stronger" : "fill.primary.default" });
      rail.y = range.y = 8;
      track.appendChild(rail);
      track.appendChild(range);
      const thumb = instance("_Slider thumb", { state: p.state! });
      if (thumb) {
        track.appendChild(thumb);
        thumb.x = Math.round(W * 0.225) - 10;
      }
      const limits = await box({ name: "Limits", dir: "row", main: "between", w: "fill" }, [await text("₺0", "caption", "text.muted", { name: "#Min" }), await text("₺10.000", "caption", "text.muted", { name: "#Max" })]);
      return comp({ dir: "column", gap: "space.xs", w: W }, [top, track, limits]);
    },
    { description: "Picks a value in a range by dragging the _Slider thumb. Always shows the current value as text." },
  );
}

export async function buildFileUpload() {
  await variantSet(
    "_File item",
    {},
    async () => comp({ dir: "row", cross: "center", gap: "space.xs", pad: ["space.2xs", "space.2xs", "space.2xs", "space.sm"], radius: "control.radius.md", stroke: "border.subtle", w: W }, [icon("document", "icon-size.md", "icon.muted"), fillParent(await box({ name: "Text", dir: "column" }, [await text("proof-of-address.pdf", "label.sm", "text.default", { name: "#Name" }), await text("240 KB", "caption", "text.muted", { name: "#Size" })])), instance("IconButton", { variant: "ghost", shape: "pill", size: "xs", state: "default" }, {}, {}, { Icon: "close" })]),
    { description: "One chosen file with its size and a remove button." },
  );
  return variantSet(
    "FileUpload",
    { state: ["default", "hover", "error", "disabled", "with-file"] },
    async (p) => {
      const disabled = p.state === "disabled";
      const hover = p.state === "hover";
      const zone = await box({
        name: "Zone",
        dir: "column",
        cross: "center",
        gap: "file-upload.gap",
        px: "file-upload.padding",
        py: "file-upload.padding",
        radius: "file-upload.radius",
        fill: disabled ? "fill.disabled.default" : hover ? "fill.primary.weak" : "fill.surface.default",
        stroke: p.state === "error" ? "border.danger" : disabled ? "border.subtle" : hover ? "border.primary-emphasis" : "border.default",
        strokeWidth: "size.border.strong",
        dashed: true,
      }, [icon("upload", "icon-size.lg", disabled ? "text.subtler" : "icon.primary"), await box({ name: "Prompt", dir: "row", gap: "space.2xs" }, [await text("Choose file", "label.md", disabled ? "text.subtler" : "text.primary", { underline: true }), await text("or drop it here", "body.md", disabled ? "text.subtler" : "text.muted")])]);
      const parts = [instance("_Field label", {}, { Label: "Proof of address" }), fillParent(instance("_Field message", { kind: "hint" }, { Message: "PDF or photo, up to 1 MB" })!), fillParent(zone), p.state === "with-file" ? fillParent(instance("_File item")!) : null, p.state === "error" ? fillParent(instance("_Field message", { kind: "error" }, { Message: "scan.pdf is larger than 1 MB. Choose a smaller file." })!) : null];
      return comp({ dir: "column", gap: "space.2xs", w: W }, parts);
    },
    { description: "Adds files by choosing or dropping. States the type and size limits before people pick a file." },
  );
}

export async function buildFieldset() {
  return variantSet(
    "Fieldset",
    {},
    async () => {
      const fields = await box({ name: "Fields", dir: "column", gap: "space.md", w: "fill" }, instances([
        ["TextField", { shape: "rounded", size: "md", state: "default" }, { Label: "Street and number" }],
        ["TextField", { shape: "rounded", size: "md", state: "default" }, { Label: "City" }],
      ]).map((n) => fillParent(n)));
      return comp({ dir: "column", gap: "space.xs", w: W }, [await text("Card address", "heading.h5", "text.default", { name: "#Legend" }), await text("Where we send your new card", "body.sm", "text.muted", { name: "?#Description" }), fields]);
    },
    { description: "Groups related fields under one legend, such as an address." },
  );
}

export async function buildOTPInput() {
  await variantSet(
    "_OTPInput digit",
    { state: ["empty", "hover", "active", "filled", "error", "disabled"] },
    async (p) => {
      const s = p.state!;
      const digit = await text("4", "amount.md", s === "disabled" ? "text.subtler" : "text.default", { name: "#Digit" });
      digit.visible = s === "filled" || s === "error" || s === "disabled";
      return comp({ dir: "row", main: "center", cross: "center", w: "otp.box-size", h: "otp.box-size", radius: "otp.radius", fill: s === "disabled" ? "fill.disabled.default" : "fill.surface.default", stroke: s === "error" ? "border.danger" : s === "disabled" ? "border.subtle" : s === "hover" ? "border.strong" : "border.default", strokeWidth: s === "error" ? "size.border.strong" : "size.border.default", ...(s === "active" ? { effect: "focus" } : {}) }, [digit]);
    },
    { description: "One box of a one-time code: empty, hover, active (the caret is here), filled, error and disabled." },
  );
  return variantSet(
    "OTPInput",
    { state: ["empty", "partial", "filled", "error", "disabled"] },
    async (p) => {
      const digits = "482913";
      const shown = p.state === "empty" ? 0 : p.state === "partial" ? 3 : 6;
      const stateOf = (i: number) => (p.state === "error" ? "error" : p.state === "disabled" ? "disabled" : i < shown ? "filled" : i === shown ? "active" : "empty");
      const boxes = await box({ name: "Boxes", dir: "row", gap: "space.xs", pad: ["space.2xs", 0, 0, 0] }, instances([...digits].map((d, i) => ["_OTPInput digit", { state: stateOf(i) }, { Digit: d }])));
      const parts: Array<SceneNode | null> = [instance("_Field label", {}, { Label: "Verification code" }), instance("_Field message", { kind: "hint" }, { Message: "We sent a 6-digit code to •••• 4821" }), boxes];
      if (p.state === "error") parts.push(instance("_Field message", { kind: "error" }, { Message: "This code does not match. Check the SMS and try again." }));
      return comp({ dir: "column", gap: "space.2xs" }, parts);
    },
    { description: "One-time codes from _OTPInput digit instances. Pasting a whole code fills every box; the field reads as one input to screen readers." },
  );
}
