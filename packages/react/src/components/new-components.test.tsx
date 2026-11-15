import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AmountInput, parseAmount } from "../patterns/AmountInput/AmountInput.tsx";
import { QuickActions } from "../patterns/QuickActions/QuickActions.tsx";
import { Accordion } from "./Accordion/Accordion.tsx";
import { Alert } from "./Alert/Alert.tsx";
import { Button } from "./Button/Button.tsx";
import { Divider } from "./Divider/Divider.tsx";
import { DropdownMenu } from "./DropdownMenu/DropdownMenu.tsx";
import { IconButton } from "./IconButton/IconButton.tsx";
import { EmptyState } from "./EmptyState/EmptyState.tsx";
import { Icon } from "./Icon/Icon.tsx";
import { iconNames } from "./Icon/icons.ts";
import { Link } from "./Link/Link.tsx";
import { SegmentedControl } from "./SegmentedControl/SegmentedControl.tsx";
import { Sheet } from "./Sheet/Sheet.tsx";
import { Spinner } from "./Spinner/Spinner.tsx";
import { Stepper } from "./Stepper/Stepper.tsx";
import { Textarea } from "./Textarea/Textarea.tsx";
import { CheckboxGroup } from "./CheckboxGroup/CheckboxGroup.tsx";
import { Stack } from "./Stack/Stack.tsx";
import { SkipLink } from "./SkipLink/SkipLink.tsx";
import { Fieldset } from "./Fieldset/Fieldset.tsx";
import { Breadcrumbs } from "./Breadcrumbs/Breadcrumbs.tsx";
import { Pagination, pageRange } from "./Pagination/Pagination.tsx";
import { PageHeader } from "./PageHeader/PageHeader.tsx";
import { NavigationBar } from "./NavigationBar/NavigationBar.tsx";
import { Banner } from "./Banner/Banner.tsx";
import { Popover } from "./Popover/Popover.tsx";
import { AvatarGroup } from "./AvatarGroup/AvatarGroup.tsx";
import { Indicator } from "./Indicator/Indicator.tsx";
import { Image } from "./Image/Image.tsx";
import { Table } from "./Table/Table.tsx";
import { SearchField } from "./SearchField/SearchField.tsx";
import { NumberInput } from "./NumberInput/NumberInput.tsx";
import { Slider } from "./Slider/Slider.tsx";
import { FileUpload, formatFileSize } from "./FileUpload/FileUpload.tsx";
import { Combobox } from "./Combobox/Combobox.tsx";
import { Calendar } from "./Calendar/Calendar.tsx";
import { DatePicker, formatDateInput, parseDateInput } from "./DatePicker/DatePicker.tsx";

describe("Icon v2", () => {
  it("ships the curated Solar set in three weights", () => {
    expect(iconNames.length).toBeGreaterThanOrEqual(140);
    for (const weight of ["linear", "bold", "duotone"] as const) {
      const { container } = render(<Icon name="wallet" weight={weight} />);
      expect(container.querySelector("path")).not.toBeNull();
      expect(container.innerHTML).not.toMatch(/black|#000/);
    }
  });
});

describe("Alert", () => {
  it("is a status by default and an alert when urgent", () => {
    const { rerender } = render(<Alert title="Saved">Done</Alert>);
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
    rerender(<Alert tone="danger" live="alert" title="Failed" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
  });
  it("can be dismissed", async () => {
    const onDismiss = vi.fn();
    render(<Alert title="Hi" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalled();
  });
});

describe("Accordion", () => {
  it("expands an item", async () => {
    render(<Accordion items={[{ value: "a", title: "Fees", content: "Free" }]} />);
    const trigger = screen.getByRole("button", { name: "Fees" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Free")).toBeVisible();
  });
});

describe("SegmentedControl", () => {
  it("always keeps one option selected", async () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl label="Period" options={[{ value: "w", label: "Week" }, { value: "m", label: "Month" }]} defaultValue="w" onValueChange={onValueChange} />);
    expect(screen.getByRole("radiogroup", { name: "Period" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("radio", { name: "Month" }));
    expect(onValueChange).toHaveBeenCalledWith("m");
    await userEvent.click(screen.getByRole("radio", { name: "Month" }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });
  it("adds the pill shape only when asked", () => {
    render(<SegmentedControl label="Period" shape="pill" options={[{ value: "w", label: "Week" }]} />);
    expect(screen.getByRole("radiogroup", { name: "Period" }).className).toMatch(/pill/);
  });
});

describe("Textarea", () => {
  it("counts characters", async () => {
    render(<Textarea label="Note" maxLength={20} showCount />);
    await userEvent.type(screen.getByLabelText("Note"), "Rent");
    expect(screen.getByText("4 of 20")).toBeInTheDocument();
  });
});

describe("Divider", () => {
  it("is hidden unless it separates real sections", () => {
    const { container, rerender } = render(<Divider />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    rerender(<Divider decorative={false} />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });
});

describe("Link", () => {
  it("says when it opens a new tab", () => {
    render(<Link href="https://example.com" external>Docs</Link>);
    const link = screen.getByRole("link", { name: "Docs, opens in a new tab" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer noopener");
  });
});

describe("Spinner", () => {
  it("is a status only with a label", () => {
    const { rerender } = render(<Spinner />);
    expect(screen.queryByRole("status")).toBeNull();
    rerender(<Spinner label="Loading" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
  });
});

describe("EmptyState", () => {
  it("has a heading at the requested level", () => {
    render(<EmptyState title="No payments yet" headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2, name: "No payments yet" })).toBeInTheDocument();
  });
});

describe("Sheet", () => {
  it("opens as a named dialog and closes on Escape", async () => {
    render(<Sheet title="Filters" trigger={<Button>Open</Button>} />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog", { name: "Filters" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});

describe("Stepper", () => {
  it("marks the current step and completed steps in text", () => {
    render(<Stepper steps={["Recipient", "Amount", "Review"]} current={1} />);
    expect(screen.getByRole("navigation", { name: "Progress" })).toBeInTheDocument();
    expect(screen.getByText("Amount").closest("li")).toHaveAttribute("aria-current", "step");
    expect(screen.getByText(", completed")).toBeInTheDocument();
  });
});

describe("AmountInput", () => {
  it("parses Turkish and English formats", () => {
    expect(parseAmount("1.250,50", "tr-TR")).toBe(1250.5);
    expect(parseAmount("1,250.50", "en-US")).toBe(1250.5);
    expect(parseAmount("", "tr-TR")).toBeNull();
    expect(parseAmount("12,345", "tr-TR")).toBe(12.34);
  });
  it("formats on blur and warns over the balance", async () => {
    const onValueChange = vi.fn();
    render(<AmountInput label="Amount" currency="TRY" locale="tr-TR" max={100} onValueChange={onValueChange} />);
    const input = screen.getByLabelText("Amount");
    expect(input).toHaveAttribute("inputmode", "decimal");
    await userEvent.type(input, "1250,5");
    fireEvent.blur(input);
    expect(input).toHaveValue("1.250,50");
    expect(onValueChange).toHaveBeenLastCalledWith(1250.5);
    expect(input).toHaveAccessibleDescription(/more than you have/);
  });
});

describe("QuickActions", () => {
  it("renders a labelled list of text actions", async () => {
    const onClick = vi.fn();
    render(<QuickActions label="Quick actions" actions={[{ label: "Send", icon: "send", onClick }]} />);
    expect(screen.getByRole("list", { name: "Quick actions" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onClick).toHaveBeenCalled();
  });
});

describe("DropdownMenu", () => {
  it("opens from its trigger and runs the chosen action", async () => {
    const onCopy = vi.fn();
    render(<DropdownMenu trigger={<IconButton icon="more-vertical" label="More actions" />} actions={[{ label: "Copy IBAN", icon: "copy", onSelect: onCopy }, { label: "Close account", onSelect: () => {}, destructive: true }]} />);
    await userEvent.click(screen.getByRole("button", { name: "More actions" }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Copy IBAN" }));
    expect(onCopy).toHaveBeenCalledOnce();
  });
});

describe("CheckboxGroup", () => {
  it("names the group by its legend and selects all enabled options", async () => {
    const onValueChange = vi.fn();
    render(<CheckboxGroup label="Accounts" selectAllLabel="All" defaultValue={["a"]} onValueChange={onValueChange} options={[{ value: "a", label: "A" }, { value: "b", label: "B" }, { value: "c", label: "C", disabled: true }]} />);
    expect(screen.getByRole("group", { name: "Accounts" })).toBeInTheDocument();
    const all = screen.getByRole("checkbox", { name: "All" });
    expect(all).toHaveAttribute("aria-checked", "mixed");
    await userEvent.click(all);
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"]);
    expect(all).toHaveAttribute("aria-checked", "true");
  });
});

describe("Link icons", () => {
  it("keeps the text as the accessible name", () => {
    render(<Link href="#s" variant="standalone" iconStart="download">Download statement</Link>);
    expect(screen.getByRole("link", { name: "Download statement" })).toBeInTheDocument();
  });
});

describe("Stack", () => {
  it("spaces children with a token", () => {
    render(<Stack gap="lg" data-testid="s"><span>a</span></Stack>);
    expect(screen.getByTestId("s").style.gap).toBe("var(--lw-space-lg)");
  });
});

describe("SkipLink", () => {
  it("links to the main content", () => {
    render(<SkipLink locale="tr-TR" />);
    expect(screen.getByRole("link", { name: "Ana içeriğe geç" })).toHaveAttribute("href", "#main");
  });
});

describe("Fieldset", () => {
  it("names the group by its legend and describes it", () => {
    render(<Fieldset legend="Card address" error="Enter a city"><input aria-label="City" /></Fieldset>);
    expect(screen.getByRole("group", { name: "Card address" })).toHaveAccessibleDescription("Enter a city");
  });
});

describe("Breadcrumbs", () => {
  it("marks the current page and collapses long paths", async () => {
    render(<Breadcrumbs items={[{ label: "A", href: "#a" }, { label: "B", href: "#b" }, { label: "C", href: "#c" }, { label: "D", href: "#d" }, { label: "E" }]} />);
    expect(screen.getByText("E")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByText("B")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Show full path" }));
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});

describe("Pagination", () => {
  it("shows first, last and neighbours with gaps", () => {
    expect(pageRange(5, 12)).toEqual([1, null, 4, 5, 6, null, 12]);
    expect(pageRange(2, 4)).toEqual([1, 2, 3, 4]);
  });
  it("disables previous on the first page and moves forward", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} totalPages={3} onPageChange={onPageChange} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});

describe("PageHeader", () => {
  it("renders the title as h1 and a back button", () => {
    render(<PageHeader title="Send money" onBack={() => {}} />);
    expect(screen.getByRole("heading", { level: 1, name: "Send money" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });
});

describe("NavigationBar", () => {
  it("marks the current destination and reads counts", () => {
    render(<NavigationBar current="Cards" items={[{ label: "Home", icon: "home", href: "#h" }, { label: "Cards", icon: "card", href: "#c", count: 2 }]} />);
    expect(screen.getByRole("link", { name: "Cards, 2 new" })).toHaveAttribute("aria-current", "page");
  });
});

describe("Banner", () => {
  it("is a status by default and an alert when urgent", () => {
    const { rerender } = render(<Banner>Maintenance tonight</Banner>);
    expect(screen.getByRole("status")).toHaveTextContent("Maintenance tonight");
    rerender(<Banner live="alert">Outage</Banner>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});

describe("Popover", () => {
  it("opens a dialog named by its title", async () => {
    render(<Popover title="About fees" trigger={<button type="button">Info</button>}>Text</Popover>);
    await userEvent.click(screen.getByRole("button", { name: "Info" }));
    expect(await screen.findByRole("dialog", { name: "About fees" })).toBeInTheDocument();
  });
});

describe("AvatarGroup", () => {
  it("names everyone, with a count for the rest", () => {
    render(<AvatarGroup people={[{ name: "A" }, { name: "B" }, { name: "C" }]} max={2} />);
    expect(screen.getByRole("img", { name: "A, B and 1 more" })).toBeInTheDocument();
  });
});

describe("Indicator", () => {
  it("caps the count and hides at zero", () => {
    const { rerender, container } = render(<Indicator count={150}><span>x</span></Indicator>);
    expect(container.textContent).toContain("99+");
    rerender(<Indicator count={0}><span>x</span></Indicator>);
    expect(container.textContent).toBe("x");
  });
});

describe("Image", () => {
  it("shows a fallback with the same name when loading fails", () => {
    render(<Image src="/missing.png" alt="Merchant logo" />);
    fireEvent.error(screen.getByRole("img", { name: "Merchant logo" }));
    expect(screen.getByText("Image unavailable")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Merchant logo" })).toBeInTheDocument();
  });
});

describe("Table", () => {
  it("sorts by a column and reports the direction", async () => {
    render(<Table caption="People" rowKey={(r: { n: string }) => r.n} rows={[{ n: "B" }, { n: "A" }]} columns={[{ key: "n", header: "Name", sortable: true }]} />);
    await userEvent.click(screen.getByRole("button", { name: /Name/ }));
    expect(screen.getByRole("columnheader", { name: /Name/ })).toHaveAttribute("aria-sort", "ascending");
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("A");
  });
});

describe("SearchField", () => {
  it("searches on Enter and clears", async () => {
    const onSearch = vi.fn();
    render(<SearchField label="Search" onSearch={onSearch} />);
    await userEvent.type(screen.getByRole("searchbox", { name: "Search" }), "rent{Enter}");
    expect(onSearch).toHaveBeenCalledWith("rent");
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });
});

describe("NumberInput", () => {
  it("steps with arrow keys and stays within limits", async () => {
    const onValueChange = vi.fn();
    render(<NumberInput label="Term" min={1} max={3} defaultValue={3} onValueChange={onValueChange} />);
    const input = screen.getByRole("spinbutton", { name: "Term" });
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowUp}");
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    await userEvent.keyboard("{ArrowDown}");
    expect(onValueChange).toHaveBeenLastCalledWith(2);
  });
});

describe("Slider", () => {
  it("names the thumb and reads the formatted value", () => {
    render(<Slider label="Amount" defaultValue={500} formatValue={(v) => `${v} TL`} />);
    expect(screen.getByRole("slider", { name: "Amount" })).toHaveAttribute("aria-valuetext", "500 TL");
  });
});

describe("FileUpload", () => {
  it("formats sizes and refuses files that are too large", async () => {
    expect(formatFileSize(1536)).toBe("1.5 KB");
    render(<FileUpload label="Document" maxSize={10} />);
    await userEvent.upload(screen.getByLabelText("Document"), new File(["more than ten bytes"], "big.pdf", { type: "application/pdf" }));
    expect(screen.getByText(/big.pdf is larger than 10 B/)).toBeInTheDocument();
  });
});

describe("Combobox", () => {
  it("filters with Turkish casing and chooses with Enter", async () => {
    const onValueChange = vi.fn();
    render(<Combobox label="Bank" locale="tr-TR" options={[{ value: "is", label: "İş Bankası" }, { value: "zi", label: "Ziraat" }]} onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole("combobox", { name: "Bank" }), "iş");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("is");
  });
});

describe("Calendar", () => {
  it("starts weeks on Monday in Turkish and selects a day", async () => {
    const onValueChange = vi.fn();
    render(<Calendar locale="tr-TR" defaultMonth={new Date(2026, 10, 1)} onValueChange={onValueChange} showToday={false} />);
    expect(screen.getAllByRole("columnheader")[0]).toHaveAttribute("abbr", "Pazartesi");
    await userEvent.click(screen.getByRole("button", { name: "18 Kasım 2026 Çarşamba" }));
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 10, 18));
  });
});

describe("DatePicker", () => {
  it("formats and parses dates in the locale's order", () => {
    expect(formatDateInput(new Date(2026, 10, 2), "tr-TR")).toBe("02.11.2026");
    expect(formatDateInput(new Date(2026, 10, 2), "en-US")).toBe("11/02/2026");
    expect(parseDateInput("02.11.2026", "tr-TR")).toEqual(new Date(2026, 10, 2));
    expect(parseDateInput("31.02.2026", "tr-TR")).toBeNull();
  });
  it("shows a message for a date it cannot read", async () => {
    render(<DatePicker label="Date" />);
    await userEvent.type(screen.getByLabelText("Date"), "99/99/2026");
    await userEvent.tab();
    expect(screen.getByText("Enter a date as MM/DD/YYYY.")).toBeInTheDocument();
  });
});
