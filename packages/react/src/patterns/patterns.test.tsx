import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AccountCard } from "./AccountCard/AccountCard.tsx";
import { AmountDisplay } from "./AmountDisplay/AmountDisplay.tsx";
import { BalanceHeader } from "./BalanceHeader/BalanceHeader.tsx";
import { OTPInput } from "./OTPInput/OTPInput.tsx";
import { TransactionRow, transactionSentence } from "./TransactionRow/TransactionRow.tsx";
import { SummaryList } from "./SummaryList/SummaryList.tsx";
import { RecipientRow } from "./RecipientRow/RecipientRow.tsx";
import { PaymentCard } from "./PaymentCard/PaymentCard.tsx";
import { SavingsGoal } from "./SavingsGoal/SavingsGoal.tsx";
import { SpendingBreakdown } from "./SpendingBreakdown/SpendingBreakdown.tsx";

describe("AmountDisplay", () => {
  it("signs incoming amounts and announces the direction", () => {
    const { container } = render(<AmountDisplay value={1250} currency="TRY" locale="tr-TR" direction="incoming" />);
    expect(container.textContent).toContain("+₺1.250,00");
    expect(screen.getByText(/Para girişi: 1\.250,00/)).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute("data-direction", "incoming");
  });

  it("treats negative values as outgoing with a minus sign", () => {
    const { container } = render(<AmountDisplay value={-85} currency="TRY" locale="en-US" />);
    expect(container.textContent).toContain("−TRY 85.00");
    expect(screen.getByText(/Money out: 85\.00/)).toBeInTheDocument();
  });

  it("adds a pending label, not just a color", () => {
    const { container } = render(<AmountDisplay value={10} currency="TRY" direction="outgoing" pending />);
    expect(container.textContent).toContain("Pending");
  });

  it("hides digits when masked", () => {
    const { container } = render(<AmountDisplay value={10} currency="TRY" masked />);
    expect(container.textContent).not.toContain("10");
    expect(screen.getByText("Balance hidden")).toBeInTheDocument();
  });
});

describe("BalanceHeader", () => {
  it("toggles hidden state with a pressed button", async () => {
    const onHiddenChange = vi.fn();
    render(<BalanceHeader label="Available balance" balance={100} currency="TRY" onHiddenChange={onHiddenChange} />);
    expect(screen.getByRole("region", { name: "Available balance" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Hide balance" }));
    expect(onHiddenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: "Show balance" })).toHaveAttribute("aria-pressed", "true");
  });
});

describe("TransactionRow", () => {
  const base = { merchant: "Coffee Lab", category: "Eating out", date: new Date("2026-11-12T10:00:00"), amount: 85, direction: "outgoing" as const, currency: "TRY" };

  it("reads as one sentence", () => {
    expect(transactionSentence({ ...base, locale: "en-US", status: "pending" })).toMatch(
      /^Coffee Lab, Eating out, November 12, 2026, Money out 85\.00 Turkish lira, Pending$/i,
    );
  });

  it("uses the sentence as the button name, starting with the visible merchant", () => {
    render(<ul><TransactionRow {...base} onClick={() => {}} /></ul>);
    expect(screen.getByRole("button")).toHaveAccessibleName(/^Coffee Lab, Eating out/);
  });

  it("is a plain list item without onClick", () => {
    render(<ul><TransactionRow {...base} /></ul>);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("listitem")).toHaveTextContent(/Coffee Lab/);
  });
});

describe("AccountCard", () => {
  it("masks the IBAN and labels actions with text", () => {
    const onSend = vi.fn();
    render(
      <AccountCard name="Everyday" type="Current account" iban="TR33 0006 1005 1978 6457 8413 26" balance={10} currency="TRY" actions={[{ label: "Send", onClick: onSend }]} />,
    );
    expect(screen.getByRole("article", { name: "Everyday, Current account" })).toBeInTheDocument();
    expect(screen.getByText("IBAN ending in 1 3 2 6")).toBeInTheDocument();
    expect(screen.queryByText(/0006/)).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSend).toHaveBeenCalled();
  });
});

describe("OTPInput", () => {
  it("is one labelled field with one-time-code autofill", () => {
    render(<OTPInput label="Code" />);
    const input = screen.getByLabelText("Code");
    expect(input).toHaveAttribute("autocomplete", "one-time-code");
    expect(input).toHaveAttribute("inputmode", "numeric");
  });

  it("strips spaces and letters from pasted codes and completes once", async () => {
    const onComplete = vi.fn();
    render(<OTPInput label="Code" onComplete={onComplete} />);
    const input = screen.getByLabelText("Code");
    await userEvent.click(input);
    await userEvent.paste("482 913");
    expect(input).toHaveValue("482913");
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith("482913");
  });

  it("links the error message", () => {
    render(<OTPInput label="Code" error="Wrong code" />);
    expect(screen.getByLabelText("Code")).toHaveAccessibleDescription("Wrong code");
  });
});

describe("SummaryList", () => {
  it("pairs every label with its value in a description list", () => {
    const { container } = render(<SummaryList items={[{ label: "Fee", value: "₺0,00", hint: "Free" }]} total={{ label: "Total", value: "₺250,00" }} />);
    expect(container.querySelector("dl")).toBeInTheDocument();
    expect(screen.getByText("Fee").tagName).toBe("DT");
    expect(screen.getByText("₺0,00").closest("dd")).toHaveTextContent("Free");
    expect(screen.getByText("Total").tagName).toBe("DT");
  });
});

describe("RecipientRow", () => {
  it("reads the masked IBAN as its last four digits and calls onClick", async () => {
    const onClick = vi.fn();
    render(<ul><RecipientRow name="Deniz Yılmaz" bank="Leeward" iban="TR33 0006 1005 1978 6457 8413 26" favorite onClick={onClick} /></ul>);
    const row = screen.getByRole("button");
    expect(row).toHaveAccessibleName(/Deniz Yılmaz, Favorite/);
    expect(row).toHaveAccessibleName(/IBAN ending in 1 3 2 6/);
    await userEvent.click(row);
    expect(onClick).toHaveBeenCalledOnce();
  });
  it("is static without onClick or href", () => {
    render(<ul><RecipientRow name="Ece" iban="TR12 0001 0012 3456 7890 1234 56" /></ul>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

describe("PaymentCard", () => {
  it("names the card in one sentence and says when it is frozen", () => {
    render(<PaymentCard name="Everyday debit" last4="4821" expiry="08/28" holder="Ece Kaya" frozen />);
    expect(screen.getByRole("article", { name: "Everyday debit, Card ending in 4 8 2 1, Expires 08/28, Frozen" })).toBeInTheDocument();
    expect(screen.getByText("Frozen")).toBeInTheDocument();
  });
});

describe("SavingsGoal", () => {
  it("rounds progress down and says when the goal is reached", () => {
    const { rerender } = render(<SavingsGoal name="Holiday" saved={2999} target={3000} currency="USD" />);
    expect(screen.getByText("99% saved")).toBeInTheDocument();
    rerender(<SavingsGoal name="Holiday" saved={3200} target={3000} currency="USD" />);
    expect(screen.getByText("Goal reached")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Progress" })).toHaveAttribute("aria-valuenow", "3000");
  });
});

describe("SpendingBreakdown", () => {
  it("sorts by amount, drops zero and gives every share in words", () => {
    render(<SpendingBreakdown title="November" currency="USD" categories={[{ name: "Bills", amount: 25 }, { name: "Food", amount: 75 }, { name: "Gifts", amount: 0 }]} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Food");
    expect(items[0]).toHaveTextContent("75% of total");
    expect(screen.queryByText("Gifts")).not.toBeInTheDocument();
  });
});
