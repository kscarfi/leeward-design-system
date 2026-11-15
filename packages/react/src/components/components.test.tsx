import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Avatar, initials } from "./Avatar/Avatar.tsx";
import { Badge } from "./Badge/Badge.tsx";
import { Button } from "./Button/Button.tsx";
import { Card } from "./Card/Card.tsx";
import { Checkbox } from "./Checkbox/Checkbox.tsx";
import { Chip } from "./Chip/Chip.tsx";
import { Dialog } from "./Dialog/Dialog.tsx";
import { Heading } from "./Heading/Heading.tsx";
import { Icon } from "./Icon/Icon.tsx";
import { iconNames } from "./Icon/icons.ts";
import { IconButton } from "./IconButton/IconButton.tsx";
import { List, ListItem } from "./ListItem/ListItem.tsx";
import { ProgressBar } from "./ProgressBar/ProgressBar.tsx";
import { RadioGroup } from "./RadioGroup/RadioGroup.tsx";
import { Select } from "./Select/Select.tsx";
import { Skeleton } from "./Skeleton/Skeleton.tsx";
import { Switch } from "./Switch/Switch.tsx";
import { Tabs } from "./Tabs/Tabs.tsx";
import { Text } from "./Text/Text.tsx";
import { TextField } from "./TextField/TextField.tsx";
import { ToastProvider, useToast } from "./Toast/Toast.tsx";
import { Tooltip, TooltipProvider } from "./Tooltip/Tooltip.tsx";

describe("Button", () => {
  it("is a button with type=button by default", () => {
    render(<Button>Send</Button>);
    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute("type", "button");
  });

  it("calls onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Send</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("keeps its name and focus while loading, and ignores clicks", async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Sending</Button>);
    const button = screen.getByRole("button", { name: "Sending" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("adds the pill shape only when asked", () => {
    const { rerender } = render(<Button>Send</Button>);
    const rounded = screen.getByRole("button").className;
    rerender(<Button shape="pill">Send</Button>);
    expect(screen.getByRole("button").className).not.toBe(rounded);
    expect(screen.getByRole("button").className).toMatch(/pill/);
  });

  it("is disabled natively when disabled", () => {
    render(<Button disabled>Send</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("IconButton", () => {
  it("uses the label as its accessible name", () => {
    render(<IconButton icon="close" label="Close" />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });
  it("adds the rounded shape only when asked", () => {
    const { rerender } = render(<IconButton icon="close" label="Close" />);
    expect(screen.getByRole("button").className).not.toMatch(/rounded/);
    rerender(<IconButton icon="close" label="Close" shape="rounded" />);
    expect(screen.getByRole("button").className).toMatch(/rounded/);
  });
});

describe("Icon", () => {
  it("is hidden from assistive tech without a label", () => {
    const { container } = render(<Icon name="lock" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
  it("is an image with a name when labelled", () => {
    render(<Icon name="lock" label="Secured" />);
    expect(screen.getByRole("img", { name: "Secured" })).toBeInTheDocument();
  });
  it("ships at least 30 icons", () => {
    expect(iconNames.length).toBeGreaterThanOrEqual(30);
  });
});

describe("Text and Heading", () => {
  it("renders the requested element", () => {
    render(<Text as="span">Hi</Text>);
    expect(screen.getByText("Hi").tagName).toBe("SPAN");
  });
  it("renders the heading level independent of size", () => {
    render(<Heading level={2} size="sm">Recent activity</Heading>);
    expect(screen.getByRole("heading", { level: 2, name: "Recent activity" })).toBeInTheDocument();
  });
});

describe("TextField", () => {
  it("links label, hint and error", () => {
    render(<TextField label="IBAN" hint="Starts with TR" error="Too short" />);
    const input = screen.getByLabelText("IBAN");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Too short Starts with TR");
  });
  it("accepts typing", async () => {
    render(<TextField label="Name" />);
    await userEvent.type(screen.getByLabelText("Name"), "Ece");
    expect(screen.getByLabelText("Name")).toHaveValue("Ece");
  });
  it("adds the pill shape only when asked", () => {
    const { rerender } = render(<TextField label="Search" />);
    expect(screen.getByLabelText("Search").parentElement!.className).not.toMatch(/pill/);
    rerender(<TextField label="Search" shape="pill" />);
    expect(screen.getByLabelText("Search").parentElement!.className).toMatch(/pill/);
  });
});

describe("Select", () => {
  it("is a labelled combobox", () => {
    render(<Select label="Pay from" options={[{ value: "a", label: "Everyday" }]} />);
    expect(screen.getByRole("combobox", { name: "Pay from" })).toBeInTheDocument();
  });
  it("adds the pill shape only when asked", () => {
    render(<Select label="Category" shape="pill" options={[{ value: "a", label: "Bills" }]} />);
    expect(screen.getByRole("combobox", { name: "Category" }).className).toMatch(/pill/);
  });
});

describe("Checkbox", () => {
  it("toggles with the label", async () => {
    render(<Checkbox label="Save recipient" />);
    await userEvent.click(screen.getByText("Save recipient"));
    expect(screen.getByRole("checkbox", { name: "Save recipient" })).toBeChecked();
  });
});

describe("RadioGroup", () => {
  // Arrow key behavior is covered by the Storybook test in a real browser.
  it("names the group and selects an option", async () => {
    render(<RadioGroup label="When" options={[{ value: "now", label: "Now" }, { value: "later", label: "Later" }]} defaultValue="now" />);
    expect(screen.getByRole("radiogroup", { name: "When" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("radio", { name: "Later" }));
    expect(screen.getByRole("radio", { name: "Later" })).toBeChecked();
  });
});

describe("Switch", () => {
  it("is a labelled switch", async () => {
    const onChange = vi.fn();
    render(<Switch label="Online payments" onCheckedChange={onChange} />);
    await userEvent.click(screen.getByRole("switch", { name: "Online payments" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("Badge", () => {
  it("adds an icon for status tones so color is not the only signal", () => {
    const { container } = render(<Badge tone="danger">Declined</Badge>);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(screen.getByText("Declined")).toBeInTheDocument();
  });
});

describe("Chip", () => {
  it("exposes selection with aria-pressed", async () => {
    const onSelectedChange = vi.fn();
    render(<Chip onSelectedChange={onSelectedChange}>Bills</Chip>);
    const chip = screen.getByRole("button", { name: "Bills" });
    expect(chip).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(chip);
    expect(onSelectedChange).toHaveBeenCalledWith(true);
  });
});

describe("Avatar", () => {
  it("builds initials from first and last name", () => {
    expect(initials("Deniz Yılmaz")).toBe("DY");
    expect(initials("ece")).toBe("E");
  });
  it("has the name as accessible name unless decorative", () => {
    render(<Avatar name="Ece Kaya" />);
    expect(screen.getByRole("img", { name: "Ece Kaya" })).toBeInTheDocument();
  });
});

describe("Card", () => {
  it("renders the semantic element", () => {
    render(<Card as="section" aria-label="Goal">x</Card>);
    expect(screen.getByRole("region", { name: "Goal" })).toBeInTheDocument();
  });
});

describe("ListItem", () => {
  it("becomes a button or a link only when asked", async () => {
    const onClick = vi.fn();
    render(
      <List>
        <ListItem title="Static" />
        <ListItem title="Action" onClick={onClick} />
        <ListItem title="Link" href="#x" />
      </List>,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    await userEvent.click(screen.getByRole("button", { name: "Action" }));
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "Link" })).toHaveAttribute("href", "#x");
  });
});

describe("Tabs", () => {
  it("moves with arrow keys", async () => {
    render(<Tabs label="Views" items={[{ value: "a", label: "A", content: "Panel A" }, { value: "b", label: "B", content: "Panel B" }]} />);
    expect(screen.getByRole("tablist", { name: "Views" })).toBeInTheDocument();
    screen.getByRole("tab", { name: "A" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute("aria-selected", "true");
  });
});

describe("Dialog", () => {
  it("opens from the trigger with a name and closes on Escape", async () => {
    render(<Dialog title="Freeze card?" trigger={<Button>Open</Button>} />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog", { name: "Freeze card?" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });
});

describe("Toast", () => {
  it("shows a message from useToast", async () => {
    function Demo() {
      const toast = useToast();
      return <Button onClick={() => toast.show({ title: "Money sent", tone: "success" })}>Go</Button>;
    }
    render(<ToastProvider><Demo /></ToastProvider>);
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(await screen.findByText("Money sent")).toBeInTheDocument();
  });

  it("throws outside the provider", () => {
    function Bad() {
      useToast();
      return null;
    }
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Bad />)).toThrow(/ToastProvider/);
  });
});

describe("Tooltip", () => {
  it("shows on keyboard focus", async () => {
    render(
      <TooltipProvider>
        <Tooltip content="Same fee for every amount" delayDuration={0}>
          <IconButton icon="info" label="About the fee" />
        </Tooltip>
      </TooltipProvider>,
    );
    await userEvent.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Same fee for every amount");
  });
});

describe("Skeleton", () => {
  it("is hidden from screen readers", () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll("span span")).toHaveLength(3);
  });
});

describe("ProgressBar", () => {
  it("exposes value and text", () => {
    render(<ProgressBar label="Holiday fund" value={45} valueText="45% saved" />);
    const bar = screen.getByRole("progressbar", { name: "Holiday fund" });
    expect(bar).toHaveAttribute("aria-valuetext", "45% saved");
  });
});
