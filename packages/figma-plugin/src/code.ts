// Entry point. Run it in an empty Figma file (or again in a file it built): it creates variables,
// styles, icons, base parts, every component and pattern with its documentation, then reports problems.
import { components, icons } from "./data.ts";
import { box, setLibrary, text } from "./dsl.ts";
import { docFrame } from "./docs.ts";
import { buildColors, buildCover, buildGettingStarted, buildLayout, buildPrimitives, buildSpacing, buildTypography } from "./foundations.ts";
import { buildIcons } from "./icons.ts";
import { takeBases, type Built } from "./kit.ts";
import { buildEffectStyles, buildTextStyles, loadFonts } from "./styles.ts";
import { problems, step } from "./util.ts";
import { buildVariables } from "./variables.ts";
import * as actions from "./components/actions.ts";
import * as banking from "./components/banking.ts";
import * as display from "./components/display.ts";
import * as feedback from "./components/feedback.ts";
import * as forms from "./components/forms.ts";
import * as navigation from "./components/navigation.ts";

/**
 * Build order: a component comes after every component and base part it uses. Base parts are
 * built by the first component that needs them and documented on that component's page.
 */
const ORDER: Array<[string, () => Promise<Built>]> = [
  ["Button", actions.buildButton],
  ["IconButton", actions.buildIconButton],
  ["Link", actions.buildLink],
  ["Chip", actions.buildChip],
  ["Badge", feedback.buildBadge],
  ["Indicator", feedback.buildIndicator],
  ["Avatar", display.buildAvatar],
  ["AvatarGroup", display.buildAvatarGroup],
  ["Image", display.buildImage],
  ["TextField", forms.buildTextField],
  ["Checkbox", forms.buildCheckbox],
  ["Switch", forms.buildSwitch],
  ["ListItem", display.buildListItem],
  ["ProgressBar", feedback.buildProgressBar],
  ["Heading", display.buildHeading],
  ["Text", display.buildText],
  ["Divider", display.buildDivider],
  ["Card", display.buildCard],
  ["Stack", display.buildStack],
  ["Spinner", feedback.buildSpinner],
  ["Skeleton", feedback.buildSkeleton],
  ["Textarea", forms.buildTextarea],
  ["Select", forms.buildSelect],
  ["SearchField", forms.buildSearchField],
  ["NumberInput", forms.buildNumberInput],
  ["AmountInput", forms.buildAmountInput],
  ["DropdownMenu", feedback.buildDropdownMenu],
  ["Combobox", forms.buildCombobox],
  ["Calendar", forms.buildCalendar],
  ["DatePicker", forms.buildDatePicker],
  ["CheckboxGroup", forms.buildCheckboxGroup],
  ["RadioGroup", forms.buildRadioGroup],
  ["SegmentedControl", forms.buildSegmentedControl],
  ["Slider", forms.buildSlider],
  ["FileUpload", forms.buildFileUpload],
  ["Fieldset", forms.buildFieldset],
  ["OTPInput", forms.buildOTPInput],
  ["Alert", feedback.buildAlert],
  ["Banner", feedback.buildBanner],
  ["Toast", feedback.buildToast],
  ["Tooltip", feedback.buildTooltip],
  ["Popover", feedback.buildPopover],
  ["EmptyState", feedback.buildEmptyState],
  ["Dialog", feedback.buildDialog],
  ["Sheet", feedback.buildSheet],
  ["Tabs", navigation.buildTabs],
  ["Breadcrumbs", navigation.buildBreadcrumbs],
  ["Pagination", navigation.buildPagination],
  ["NavigationBar", navigation.buildNavigationBar],
  ["PageHeader", navigation.buildPageHeader],
  ["Stepper", navigation.buildStepper],
  ["SkipLink", navigation.buildSkipLink],
  ["Accordion", navigation.buildAccordion],
  ["Table", display.buildTable],
  ["AmountDisplay", banking.buildAmountDisplay],
  ["TransactionRow", banking.buildTransactionRow],
  ["AccountCard", banking.buildAccountCard],
  ["BalanceHeader", banking.buildBalanceHeader],
  ["PaymentCard", banking.buildPaymentCard],
  ["QuickActions", banking.buildQuickActions],
  ["RecipientRow", banking.buildRecipientRow],
  ["SavingsGoal", banking.buildSavingsGoal],
  ["SpendingBreakdown", banking.buildSpendingBreakdown],
  ["SummaryList", banking.buildSummaryList],
];

async function newPage(name: string): Promise<PageNode> {
  const page = figma.createPage();
  page.name = name;
  await figma.setCurrentPageAsync(page);
  return page;
}

async function place(page: PageNode, frame: FrameNode, y = 0): Promise<void> {
  page.appendChild(frame);
  frame.x = 0;
  frame.y = y;
}

/** Removes everything a previous run created, so the builder can run again in the same file. */
async function clean(collections: VariableCollection[]): Promise<void> {
  for (const c of collections) c.remove();
  for (const style of await figma.getLocalTextStylesAsync()) style.remove();
  for (const style of await figma.getLocalEffectStylesAsync()) style.remove();
  const [first, ...rest] = figma.root.children;
  await figma.setCurrentPageAsync(first!);
  for (const page of rest) page.remove();
  for (const node of [...first!.children]) node.remove();
}

/** A page named only with dashes shows as a divider in Figma's page list. */
function divider(): PageNode {
  const page = figma.createPage();
  page.name = "---";
  return page;
}

async function run(): Promise<void> {
  const existing = await figma.variables.getLocalVariableCollectionsAsync();
  if (existing.length) {
    // Rebuild only a file this builder made: every collection is one of ours.
    if (!existing.every((c) => c.name === "Leeward" || c.name === "Primitives")) {
      figma.closePlugin("This file has other variables. Run the builder in a new, empty file.");
      return;
    }
    await clean(existing);
  }
  await step("Loading fonts", loadFonts);
  const lib = await step("Creating variables", buildVariables);
  if (!lib) {
    figma.closePlugin(`Could not create variables: ${problems.join("; ")}`);
    return;
  }
  setLibrary(lib);
  await step("Creating text and effect styles", () => {
    buildTextStyles();
    buildEffectStyles();
  });

  // The first page becomes Getting started; the cover sits on top of it and is the file thumbnail.
  const start = figma.currentPage;
  start.name = "Getting started";
  // Icons first: foundations and components use them. Pages are put in order at the end.
  const iconPage = await newPage("Icons");
  await step("Icons", () => buildIcons(iconPage));

  const foundationPages: PageNode[] = [start];
  const foundations: Array<[string, () => Promise<FrameNode>]> = [
    ["Color", buildColors],
    ["Primitive palette", buildPrimitives],
    ["Typography", buildTypography],
    ["Space, radius and elevation", buildSpacing],
    ["Layout", buildLayout],
  ];
  for (const [name, build] of foundations) {
    const page = await newPage(name);
    foundationPages.push(page);
    const frame = await step(name, build);
    if (frame) await place(page, frame);
  }
  foundationPages.push(iconPage);

  const byName = new Map(components.map((c) => [c.name, c]));
  const docPages = new Map<string, PageNode>();
  for (const [name, build] of ORDER) {
    const page = await newPage(name);
    docPages.set(name, page);
    takeBases();
    const set = await step(name, build);
    const bases = takeBases();
    if (!set) continue;
    const frame = await step(`${name} docs`, () => docFrame(byName.get(name), name, set, bases));
    if (frame) await place(page, frame);
  }

  console.log("Leeward: ordering pages");
  const sorted = [...docPages.entries()].sort(([a], [b]) => a.localeCompare(b));
  const componentPages = sorted.filter(([n]) => byName.get(n)?.kind !== "pattern").map(([, p]) => p);
  const patternPages = sorted.filter(([n]) => byName.get(n)?.kind === "pattern").map(([, p]) => p);
  const order = [...foundationPages, divider(), ...componentPages, divider(), ...patternPages];
  order.forEach((p, i) => figma.root.insertChild(i, p));

  console.log("Leeward: cover");
  await figma.setCurrentPageAsync(start);
  const coverFrame = await buildCover({ components: componentPages.length, patterns: patternPages.length, variables: lib.vars.size, icons: Object.keys(icons).length, modes: Object.keys(lib.modeIds).length });
  await place(start, coverFrame);
  const guide = await step("Getting started", buildGettingStarted);
  if (guide) await place(start, guide, coverFrame.height + 120);
  await figma.setFileThumbnailNodeAsync(coverFrame);
  if (problems.length) {
    const report = await box({ name: "Build report", dir: "column", gap: "space.xs", px: "space.xl", py: "space.xl", w: 1920, fill: "fill.danger.weak" }, [await text(`${problems.length} problems while building`, "title.sm", "text.danger-on-subtle"), ...(await Promise.all([...new Set(problems)].slice(0, 120).map((p) => text(p, "code", "text.danger-on-subtle", { w: "fill" }))))]);
    start.appendChild(report);
    report.x = 2040;
    report.y = 0;
  }
  figma.viewport.scrollAndZoomIntoView([coverFrame]);
  figma.closePlugin(problems.length ? `Leeward built with ${problems.length} problems. See the report next to the cover.` : "Leeward built. Every component is bound to variables.");
}

run().catch((error) => {
  console.error("Leeward builder failed", error);
  figma.closePlugin(`Leeward builder failed: ${error instanceof Error ? error.message : String(error)}`);
});
