import { describe, expect, it } from "vitest";
import { formatAmount, formatIban, maskIban, MINUS, spokenAmount } from "./format.ts";

const nbsp = " ";

describe("formatAmount", () => {
  it("uses the lira symbol for TRY in tr-TR", () => {
    expect(formatAmount(1250, { currency: "TRY", locale: "tr-TR" })).toBe("₺1.250,00");
  });

  it("uses the currency code for TRY in en-US", () => {
    expect(formatAmount(1250, { currency: "TRY", locale: "en-US" })).toBe("TRY 1,250.00");
  });

  it("uses a typographic minus for negative values", () => {
    expect(formatAmount(-45.5, { currency: "TRY", locale: "tr-TR" })).toBe(`${MINUS}₺45,50`);
  });

  it("shows a plus sign only when asked", () => {
    expect(formatAmount(10, { currency: "TRY", locale: "tr-TR", sign: "always" })).toBe("+₺10,00");
    expect(formatAmount(10, { currency: "TRY", locale: "tr-TR" })).toBe("₺10,00");
  });

  it("never signs zero", () => {
    expect(formatAmount(0, { currency: "TRY", locale: "tr-TR", sign: "always" })).toBe("₺0,00");
  });

  it("uses codes for foreign currencies", () => {
    expect(formatAmount(89.9, { currency: "EUR", locale: "tr-TR" })).toBe(`EUR${nbsp}89,90`.replace(nbsp, " "));
  });
});

describe("spokenAmount", () => {
  it("spells out the currency name", () => {
    // ICU data decides the capitalisation, so match it loosely.
    expect(spokenAmount(1250, "TRY", "en-US")).toMatch(/^1,250\.00 Turkish lira$/i);
  });
});

describe("IBAN helpers", () => {
  const iban = "TR330006100519786457841326";
  it("groups in blocks of four", () => {
    expect(formatIban(iban)).toBe("TR33 0006 1005 1978 6457 8413 26");
  });
  it("masks all but the last four digits", () => {
    expect(maskIban(iban)).toBe("TR•• •••• •••• •••• •••• ••13 26");
  });
});
