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
