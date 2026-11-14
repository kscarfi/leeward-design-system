import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";

/* ============================================================================
 * Types
 * ========================================================================== */

/** Money is always held as an integer number of kuruş (1 TRY = 100 kuruş). */
type Kurus = number;

type Step = "recipient" | "amount" | "review" | "otp" | "done";

interface Recipient {
  id: string;
  name: string;
  /** Normalised IBAN: uppercase, no spaces. */
  iban: string;
}

interface SourceAccount {
  name: string;
  ibanLast4: string;
  balance: Kurus;
}

interface Quote {
  quoteId: string;
  amount: Kurus;
  fee: Kurus;
  total: Kurus;
}

interface OtpChallenge {
  challengeId: string;
  phoneMasked: string;
  expiresAt: number;
  resendAvailableAt: number;
}

type ConfirmResult =
  | { status: "success"; reference: string; completedAt: string }
  | { status: "invalid_code"; attemptsRemaining: number }
  | { status: "expired" }
  | { status: "locked" };

interface Receipt {
  reference: string;
  completedAt: string;
  recipient: Recipient;
  quote: Quote;
}

type Async<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error"; message: string };

/* ============================================================================
 * Configuration & mock data
 * ========================================================================== */

const LEEWARD_BANK_CODE = "00999";
const MIN_TRANSFER: Kurus = 100; // ₺1,00
const MAX_TRANSFER: Kurus = 5_000_000; // ₺50.000,00
const OTP_LENGTH = 6;
const OTP_TTL_MS = 180_000;
const OTP_RESEND_COOLDOWN_MS = 30_000;
const OTP_MAX_ATTEMPTS = 3;

/** Demo only: the mock SMS gateway always "sends" this code. */
const IS_DEMO = true;
const DEMO_OTP = "123456";

const NEW_RECIPIENT = "__new__";

const SOURCE_ACCOUNT: SourceAccount = {
  name: "Everyday Account",
  ibanLast4: "4021",
  balance: 2_435_075, // ₺24.350,75
};

const SAVED_RECIPIENTS: readonly Recipient[] = [
  { id: "r1", name: "Ayşe Yılmaz", iban: "TR870099900000012345678901" },
  { id: "r2", name: "Mehmet Demir", iban: "TR540006200000629876543210" },
  { id: "r3", name: "Zeynep Kaya", iban: "TR770001000000104455667788" },
  { id: "r4", name: "Can Öztürk", iban: "TR440004600000461122334455" },
];

const BANKS: Readonly<Record<string, string>> = {
  [LEEWARD_BANK_CODE]: "Leeward",
  "00010": "Ziraat Bankası",
  "00012": "Halkbank",
  "00015": "VakıfBank",
  "00046": "Akbank",
  "00062": "Garanti BBVA",
  "00064": "İş Bankası",
  "00067": "Yapı Kredi",
  "00111": "QNB",
};

/* ============================================================================
 * Formatting & validation helpers
 * ========================================================================== */

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Istanbul",
});

function formatTry(amount: Kurus): string {
  return currencyFormatter.format(amount / 100);
}

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function normalizeIban(raw: string): string {
  return raw.replace(/\s+/g, "").toUpperCase();
}

function formatIban(raw: string): string {
  return normalizeIban(raw).replace(/(.{4})(?=.)/g, "$1 ");
}

function bankCodeOf(iban: string): string {
  return iban.slice(4, 9);
}

function bankNameOf(iban: string): string {
  return BANKS[bankCodeOf(iban)] ?? "Other bank";
}

function maskIban(iban: string): string {
  return `•••• ${iban.slice(-4)}`;
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toLocaleUpperCase("tr-TR"))
    .join("");
}

/** ISO 13616 mod-97 check, restricted to Turkish IBANs (domestic TRY transfers). */
function validateIban(raw: string): string | null {
  const iban = normalizeIban(raw);
  if (iban === "") return "Enter the recipient's IBAN.";
  if (!iban.startsWith("TR")) return "Only Turkish IBANs (starting with TR) are supported.";
  if (!/^TR\d{24}$/.test(iban)) return "A Turkish IBAN is TR followed by 24 digits.";
  if (iban[9] !== "0") return "This IBAN isn't valid. Please check it and try again.";

  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const digits = /[A-Z]/.test(ch) ? String(ch.charCodeAt(0) - 55) : ch;
    for (const d of digits) remainder = (remainder * 10 + Number(d)) % 97;
  }
  return remainder === 1 ? null : "This IBAN isn't valid. Please check it for typos.";
}

function normalizeName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

function validateName(raw: string): string | null {
  const name = normalizeName(raw);
  if (name === "") return "Enter the recipient's full name.";
  if (name.length < 3) return "Enter the recipient's full name.";
  if (name.length > 70) return "Name must be 70 characters or fewer.";
  if (!/^\p{L}[\p{L} .'-]*$/u.test(name)) return "Name can only contain letters, spaces, apostrophes, dots and hyphens.";
  return null;
}

type AmountParse =
  | { ok: true; amount: Kurus }
  | { ok: false; reason: "empty" | "format" | "decimals" | "too_large" };

function countChar(s: string, c: string): number {
  return s.split(c).length - 1;
}

/**
 * Parses user input into kuruş without floating-point arithmetic.
 * Follows Turkish conventions ("1.250,50") but tolerates "1250.50":
 * - with both separators, the last one is the decimal separator;
 * - a single dot followed by exactly three digits is a thousands separator ("1.000" = 1000);
 * - repeated separators of one kind are thousands separators.
 */
function parseTryAmount(input: string): AmountParse {
  const s = input.replace(/[\s ₺]/g, "").replace(/(TL|TRY)$/i, "");
  if (s === "") return { ok: false, reason: "empty" };
  if (!/^[\d.,]+$/.test(s) || !/\d/.test(s)) return { ok: false, reason: "format" };

  const lastDot = s.lastIndexOf(".");
  const lastComma = s.lastIndexOf(",");
  let decimalSep: "." | "," | null = null;

  if (lastDot >= 0 && lastComma >= 0) {
    decimalSep = lastDot > lastComma ? "." : ",";
  } else if (lastComma >= 0) {
    decimalSep = countChar(s, ",") === 1 ? "," : null;
  } else if (lastDot >= 0) {
    const digitsAfter = s.length - lastDot - 1;
    decimalSep = countChar(s, ".") === 1 && digitsAfter !== 3 ? "." : null;
  }

  let intPart = s;
  let fracPart = "";
  if (decimalSep) {
    const i = s.lastIndexOf(decimalSep);
    intPart = s.slice(0, i);
    fracPart = s.slice(i + 1);
  }
  if (/[.,]/.test(fracPart)) return { ok: false, reason: "format" };
  if (fracPart.length > 2) return { ok: false, reason: "decimals" };

  if (/[.,]/.test(intPart)) {
    const groupSep = intPart.includes(".") ? "." : ",";
    const escaped = groupSep === "." ? "\\." : ",";
    if (!new RegExp(`^\\d{1,3}(${escaped}\\d{3})+$`).test(intPart)) return { ok: false, reason: "format" };
    intPart = intPart.split(groupSep).join("");
  }

  const intDigits = intPart.replace(/^0+(?=\d)/, "") || "0";
  if (intDigits.length > 9) return { ok: false, reason: "too_large" };

  return { ok: true, amount: Number(intDigits) * 100 + Number(fracPart.padEnd(2, "0")) };
}

function validateAmount(input: string, balance: Kurus): { amount: Kurus | null; error: string | null } {
  const parsed = parseTryAmount(input);
  if (!parsed.ok) {
    const messages: Record<typeof parsed.reason, string> = {
      empty: "Enter an amount.",
      format: "Enter a valid amount, for example 1.250,50.",
      decimals: "Amounts can have at most 2 decimal places.",
      too_large: `The maximum per transfer is ${formatTry(MAX_TRANSFER)}.`,
    };
    return { amount: null, error: messages[parsed.reason] };
  }
  const { amount } = parsed;
  if (amount < MIN_TRANSFER) return { amount, error: `The minimum transfer is ${formatTry(MIN_TRANSFER)}.` };
  if (amount > MAX_TRANSFER) return { amount, error: `The maximum per transfer is ${formatTry(MAX_TRANSFER)}.` };
  if (amount > balance) return { amount, error: `This is more than your available balance of ${formatTry(balance)}.` };
  return { amount, error: null };
}

function randomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/* ============================================================================
 * Mock API (stands in for the banking backend)
 * ========================================================================== */

class ApiError extends Error {}

function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const api = (() => {
  const quotes = new Map<string, Quote & { iban: string }>();
  const challenges = new Map<
    string,
    { quoteId: string; code: string; expiresAt: number; resendAvailableAt: number; attempts: number; active: boolean }
  >();
  const completed = new Map<string, ConfirmResult>();

  /** Fee schedule: free between Leeward accounts, tiered FAST/EFT fee otherwise. */
  function feeFor(iban: string, amount: Kurus): Kurus {
    if (bankCodeOf(iban) === LEEWARD_BANK_CODE) return 0;
    return amount <= 1_000_000 ? 525 : 1275; // ₺5,25 up to ₺10.000, then ₺12,75
  }

  return {
    async getQuote(input: { iban: string; amount: Kurus }): Promise<Quote> {
      await wait(600);
      if (validateIban(input.iban) !== null) throw new ApiError("The recipient's IBAN is not valid.");
      if (input.amount < MIN_TRANSFER || input.amount > MAX_TRANSFER) {
        throw new ApiError("This amount is outside your transfer limits.");
      }
      const fee = feeFor(input.iban, input.amount);
      const quote: Quote = { quoteId: randomId(), amount: input.amount, fee, total: input.amount + fee };
      quotes.set(quote.quoteId, { ...quote, iban: input.iban });
      return quote;
    },

    async requestOtp(quoteId: string): Promise<OtpChallenge> {
      await wait(700);
      if (!quotes.has(quoteId)) throw new ApiError("This transfer has expired. Please start again.");
      const now = Date.now();
      for (const c of challenges.values()) {
        if (c.quoteId !== quoteId || !c.active) continue;
        const locked = c.attempts >= OTP_MAX_ATTEMPTS;
        if (!locked && now < c.resendAvailableAt) throw new ApiError("Please wait before requesting another code.");
        c.active = false;
      }
      const challenge = {
        quoteId,
        code: DEMO_OTP,
        expiresAt: now + OTP_TTL_MS,
        resendAvailableAt: now + OTP_RESEND_COOLDOWN_MS,
        attempts: 0,
        active: true,
      };
      const challengeId = randomId();
      challenges.set(challengeId, challenge);
      return {
        challengeId,
        phoneMasked: "+90 5•• ••• •• 47",
        expiresAt: challenge.expiresAt,
        resendAvailableAt: challenge.resendAvailableAt,
      };
    },

    async confirmTransfer(input: { challengeId: string; code: string; idempotencyKey: string }): Promise<ConfirmResult> {
      await wait(900);
      const previous = completed.get(input.idempotencyKey);
      if (previous) return previous;

      const c = challenges.get(input.challengeId);
      if (!c || !c.active || Date.now() >= c.expiresAt) return { status: "expired" };
      if (c.attempts >= OTP_MAX_ATTEMPTS) return { status: "locked" };
      if (input.code !== c.code) {
        c.attempts += 1;
        const attemptsRemaining = OTP_MAX_ATTEMPTS - c.attempts;
        return attemptsRemaining > 0 ? { status: "invalid_code", attemptsRemaining } : { status: "locked" };
      }

      c.active = false;
      const result: ConfirmResult = {
        status: "success",
        reference: `LW${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 90 + 10)}`,
        completedAt: new Date().toISOString(),
      };
      completed.set(input.idempotencyKey, result);
      return result;
    },
  };
})();

/* ============================================================================
 * Hooks
 * ========================================================================== */

function useIsMounted() {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return mounted;
}

function useNow(active: boolean, intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [active, intervalMs]);
  return now;
}

/* ============================================================================
 * Screen
 * ========================================================================== */

const STEP_TITLES: Record<Exclude<Step, "done">, string> = {
  recipient: "Who are you sending to?",
  amount: "How much?",
  review: "Review transfer",
  otp: "Confirm with SMS code",
};
const STEP_ORDER: Exclude<Step, "done">[] = ["recipient", "amount", "review", "otp"];

export default function TransferScreen() {
  // Remounting the flow with a fresh key is the simplest way to guarantee a clean reset.
  const [session, setSession] = useState(0);
  return (
    <div className="lw-transfer">
      <style>{styles}</style>
      <TransferFlow key={session} onRestart={() => setSession((s) => s + 1)} />
    </div>
  );
}

function TransferFlow({ onRestart }: { onRestart: () => void }) {
  const mounted = useIsMounted();
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const [step, setStep] = useState<Step>("recipient");

  // Recipient
  const [selection, setSelection] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newIban, setNewIban] = useState("");
  const [touched, setTouched] = useState({ name: false, iban: false, recipientSubmitted: false, amount: false });

  // Amount
  const [amountInput, setAmountInput] = useState("");

  // Review
  const [quote, setQuote] = useState<Async<Quote>>({ status: "idle" });
  const [idempotencyKey, setIdempotencyKey] = useState<string | null>(null);
  const quoteRequestId = useRef(0);
  const [sendingCode, setSendingCode] = useState(false);
  const [sendCodeError, setSendCodeError] = useState<string | null>(null);

  // OTP
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpLocked, setOtpLocked] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const verifyingRef = useRef(false);
  const [resending, setResending] = useState(false);
  const now = useNow(step === "otp");

  // Done
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  // Move focus to the new step's heading so screen-reader and keyboard users keep their place.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    containerRef.current?.querySelector<HTMLElement>("[data-step-heading]")?.focus();
  }, [step]);

  const nameError = validateName(newName);
  const ibanError = validateIban(newIban);

  const recipient: Recipient | null = useMemo(() => {
    if (selection === NEW_RECIPIENT) {
      if (nameError || ibanError) return null;
      return { id: NEW_RECIPIENT, name: normalizeName(newName), iban: normalizeIban(newIban) };
    }
    return SAVED_RECIPIENTS.find((r) => r.id === selection) ?? null;
  }, [selection, newName, newIban, nameError, ibanError]);

  const amountCheck = validateAmount(amountInput, SOURCE_ACCOUNT.balance);

  const loadQuote = useCallback(
    async (to: Recipient, amount: Kurus) => {
      const requestId = ++quoteRequestId.current;
      setQuote({ status: "loading" });
      setSendCodeError(null);
      try {
        const data = await api.getQuote({ iban: to.iban, amount });
        if (!mounted.current || requestId !== quoteRequestId.current) return;
        setQuote({ status: "ready", data });
        setIdempotencyKey(randomId());
      } catch (error) {
        if (!mounted.current || requestId !== quoteRequestId.current) return;
        setQuote({ status: "error", message: errorMessage(error) });
      }
    },
    [mounted],
  );

  function goBack() {
    if (step === "amount") setStep("recipient");
    else if (step === "review") {
      quoteRequestId.current += 1; // discard any in-flight quote
      setQuote({ status: "idle" });
      setChallenge(null);
      setOtpError(null);
      setOtpLocked(false);
      setStep("amount");
    } else if (step === "otp") {
      // Keep the challenge: the code already sent stays usable if the person comes straight back.
      if (verifyingRef.current) return;
      setOtpCode("");
      setStep("review");
    }
  }

  function submitRecipient(event: FormEvent) {
    event.preventDefault();
    setTouched((t) => ({ ...t, recipientSubmitted: true, name: true, iban: true }));
    if (selection === NEW_RECIPIENT && !ibanError) setNewIban(formatIban(newIban));
    if (recipient) setStep("amount");
  }

  function submitAmount(event: FormEvent) {
    event.preventDefault();
    setTouched((t) => ({ ...t, amount: true }));
    if (!recipient || amountCheck.error || amountCheck.amount === null) return;
    setStep("review");
    void loadQuote(recipient, amountCheck.amount);
  }

  async function sendCode() {
    if (quote.status !== "ready" || sendingCode) return;
    if (challenge && !otpLocked && Date.now() < challenge.expiresAt) {
      setStep("otp");
      return;
    }
    setSendingCode(true);
    setSendCodeError(null);
    try {
      const next = await api.requestOtp(quote.data.quoteId);
      if (!mounted.current) return;
      setChallenge(next);
      setOtpCode("");
      setOtpError(null);
      setOtpLocked(false);
      setStep("otp");
    } catch (error) {
      if (mounted.current) setSendCodeError(errorMessage(error));
    } finally {
      if (mounted.current) setSendingCode(false);
    }
  }

  async function resendCode() {
    if (quote.status !== "ready" || resending || verifyingRef.current) return;
    setResending(true);
    setOtpError(null);
    try {
      const next = await api.requestOtp(quote.data.quoteId);
      if (!mounted.current) return;
      setChallenge(next);
      setOtpCode("");
      setOtpLocked(false);
    } catch (error) {
      if (mounted.current) setOtpError(errorMessage(error));
    } finally {
      if (mounted.current) setResending(false);
    }
  }

  async function verify(code: string) {
    if (!challenge || !recipient || quote.status !== "ready" || !idempotencyKey) return;
    if (verifyingRef.current || code.length !== OTP_LENGTH || otpLocked || now >= challenge.expiresAt) return;

    verifyingRef.current = true;
    setVerifying(true);
    setOtpError(null);
    try {
      const result = await api.confirmTransfer({ challengeId: challenge.challengeId, code, idempotencyKey });
      if (!mounted.current) return;
      switch (result.status) {
        case "success":
          setReceipt({ reference: result.reference, completedAt: result.completedAt, recipient, quote: quote.data });
          setStep("done");
          break;
        case "invalid_code":
          setOtpCode("");
          setOtpError(
            `That code isn't right. You have ${result.attemptsRemaining} ${
              result.attemptsRemaining === 1 ? "attempt" : "attempts"
            } left.`,
          );
          break;
        case "expired":
          setOtpError("This code has expired. Request a new one to continue.");
          setChallenge((c) => (c ? { ...c, expiresAt: 0 } : c));
          break;
        case "locked":
          setOtpCode("");
          setOtpLocked(true);
          setOtpError("Too many incorrect attempts. Request a new code to continue.");
          break;
      }
    } catch (error) {
      // The idempotency key makes it safe to retry: the transfer can never be executed twice.
      if (mounted.current) setOtpError(errorMessage(error));
    } finally {
      verifyingRef.current = false;
      if (mounted.current) setVerifying(false);
    }
  }

  function onOtpChange(event: ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH);
    setOtpCode(digits);
    if (otpError && !otpLocked) setOtpError(null);
    if (digits.length === OTP_LENGTH) void verify(digits);
  }

  const stepIndex = step === "done" ? STEP_ORDER.length : STEP_ORDER.indexOf(step);
  const canGoBack = step === "amount" || step === "review" || (step === "otp" && !verifying);

  return (
    <div className="lw-card" ref={containerRef}>
      {step !== "done" && (
        <header className="lw-header">
          <div className="lw-header-row">
            {canGoBack ? (
              <button type="button" className="lw-icon-button" onClick={goBack} aria-label="Back">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            ) : (
              <span className="lw-icon-spacer" aria-hidden="true" />
            )}
            <span className="lw-eyebrow">Send money</span>
            <span className="lw-step-count">
              Step {stepIndex + 1} of {STEP_ORDER.length}
            </span>
          </div>
          <div className="lw-progress" aria-hidden="true">
            <div className="lw-progress-bar" style={{ width: `${((stepIndex + 1) / STEP_ORDER.length) * 100}%` }} />
          </div>
          <h1 className="lw-title" tabIndex={-1} data-step-heading>
            {STEP_TITLES[step]}
          </h1>
        </header>
      )}

      {step === "recipient" && (
        <RecipientStep
          selection={selection}
          onSelect={(id) => {
            setSelection(id);
            setTouched((t) => ({ ...t, recipientSubmitted: false }));
          }}
          name={newName}
          iban={newIban}
          onNameChange={setNewName}
          onIbanChange={(value) => setNewIban(value.toUpperCase().replace(/[^A-Z0-9 ]/g, ""))}
          onNameBlur={() => setTouched((t) => ({ ...t, name: true }))}
          onIbanBlur={() => {
            setTouched((t) => ({ ...t, iban: true }));
            if (newIban.trim()) setNewIban(formatIban(newIban));
          }}
          nameError={touched.name ? nameError : null}
          ibanError={touched.iban ? ibanError : null}
          selectionError={touched.recipientSubmitted && selection === null ? "Choose a recipient or add a new one." : null}
          onSubmit={submitRecipient}
        />
      )}

      {step === "amount" && recipient && (
        <AmountStep
          recipient={recipient}
          value={amountInput}
          onChange={setAmountInput}
          onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
          preview={amountCheck.amount}
          error={touched.amount ? amountCheck.error : null}
          onSubmit={submitAmount}
        />
      )}

      {step === "review" && recipient && (
        <ReviewStep
          recipient={recipient}
          quote={quote}
          onRetry={() => amountCheck.amount !== null && void loadQuote(recipient, amountCheck.amount)}
          onChangeAmount={goBack}
          onConfirm={sendCode}
          sending={sendingCode}
          error={sendCodeError}
        />
      )}

      {step === "otp" && challenge && quote.status === "ready" && (
        <OtpStep
          challenge={challenge}
          total={quote.data.total}
          code={otpCode}
          onChange={onOtpChange}
          onSubmit={(event) => {
            event.preventDefault();
            void verify(otpCode);
          }}
          onResend={resendCode}
          now={now}
          verifying={verifying}
          resending={resending}
          locked={otpLocked}
          error={otpError}
        />
      )}

      {step === "done" && receipt && <SuccessStep receipt={receipt} onRestart={onRestart} />}
    </div>
  );
}

/* ============================================================================
 * Step 1 — Recipient
 * ========================================================================== */

function RecipientStep(props: {
  selection: string | null;
  onSelect: (id: string) => void;
  name: string;
  iban: string;
  onNameChange: (value: string) => void;
  onIbanChange: (value: string) => void;
  onNameBlur: () => void;
  onIbanBlur: () => void;
  nameError: string | null;
  ibanError: string | null;
  selectionError: string | null;
  onSubmit: (event: FormEvent) => void;
}) {
  const groupName = useId();
  const errorId = useId();
  const isNew = props.selection === NEW_RECIPIENT;
  const detectedBank = isNew && validateIban(props.iban) === null ? bankNameOf(normalizeIban(props.iban)) : null;

  return (
    <form className="lw-body" onSubmit={props.onSubmit} noValidate>
      <fieldset className="lw-fieldset" aria-describedby={props.selectionError ? errorId : undefined}>
        <legend className="lw-label">Saved recipients</legend>
        <div className="lw-options">
          {SAVED_RECIPIENTS.map((r) => (
            <label key={r.id} className="lw-option">
              <input
                type="radio"
                name={groupName}
                value={r.id}
                checked={props.selection === r.id}
                onChange={() => props.onSelect(r.id)}
              />
              <span className="lw-avatar" aria-hidden="true">
                {initialsOf(r.name)}
              </span>
              <span className="lw-option-text">
                <span className="lw-option-title">{r.name}</span>
                <span className="lw-option-sub">
                  {bankNameOf(r.iban)} · <span aria-label={`IBAN ending ${r.iban.slice(-4)}`}>{maskIban(r.iban)}</span>
                </span>
              </span>
            </label>
          ))}
          <label className="lw-option">
            <input
              type="radio"
              name={groupName}
              value={NEW_RECIPIENT}
              checked={isNew}
              onChange={() => props.onSelect(NEW_RECIPIENT)}
            />
            <span className="lw-avatar lw-avatar-new" aria-hidden="true">
              +
            </span>
            <span className="lw-option-text">
              <span className="lw-option-title">New recipient</span>
              <span className="lw-option-sub">Send to any Turkish IBAN</span>
            </span>
          </label>
        </div>
      </fieldset>

      {props.selectionError && (
        <p id={errorId} className="lw-error" role="alert">
          {props.selectionError}
        </p>
      )}

      {isNew && (
        <div className="lw-new-recipient">
          <Field label="Full name" hint="As it appears on the recipient's account" error={props.nameError}>
            {(fieldProps) => (
              <input
                {...fieldProps}
                className="lw-input"
                type="text"
                autoComplete="name"
                autoCapitalize="words"
                spellCheck={false}
                maxLength={70}
                value={props.name}
                onChange={(e) => props.onNameChange(e.target.value)}
                onBlur={props.onNameBlur}
              />
            )}
          </Field>
          <Field label="IBAN" hint={detectedBank ? `Bank: ${detectedBank}` : "TR followed by 24 digits"} error={props.ibanError}>
            {(fieldProps) => (
              <input
                {...fieldProps}
                className="lw-input lw-mono"
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={40}
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                value={props.iban}
                onChange={(e) => props.onIbanChange(e.target.value)}
                onBlur={props.onIbanBlur}
              />
            )}
          </Field>
        </div>
      )}

      <div className="lw-actions">
        <button type="submit" className="lw-button lw-button-primary">
          Continue
        </button>
      </div>
    </form>
  );
}

/* ============================================================================
 * Step 2 — Amount
 * ========================================================================== */

function AmountStep(props: {
  recipient: Recipient;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  preview: Kurus | null;
  error: string | null;
  onSubmit: (event: FormEvent) => void;
}) {
  const inputId = useId();
  const hintId = useId();
  const errorId = useId();

  return (
    <form className="lw-body" onSubmit={props.onSubmit} noValidate>
      <RecipientSummary recipient={props.recipient} />

      <div className="lw-amount-field">
        <label htmlFor={inputId} className="lw-label">
          Amount (TRY)
        </label>
        <div className={`lw-amount-wrap${props.error ? " lw-invalid" : ""}`}>
          <span className="lw-currency" aria-hidden="true">
            ₺
          </span>
          <input
            id={inputId}
            className="lw-amount-input"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0,00"
            maxLength={16}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value.replace(/[^\d.,]/g, ""))}
            onBlur={props.onBlur}
            aria-invalid={props.error ? true : undefined}
            aria-describedby={`${hintId}${props.error ? ` ${errorId}` : ""}`}
          />
        </div>
        <p id={hintId} className="lw-hint" aria-live="polite">
          {props.preview !== null && props.value.trim() !== "" ? (
            <>
              You're sending <strong>{formatTry(props.preview)}</strong> ·{" "}
            </>
          ) : null}
          Available: {formatTry(SOURCE_ACCOUNT.balance)}
        </p>
        {props.error && (
          <p id={errorId} className="lw-error" role="alert">
            {props.error}
          </p>
        )}
      </div>

      <p className="lw-note">
        Fees are shown before you confirm. Transfers to other Leeward customers are free.
      </p>

      <div className="lw-actions">
        <button type="submit" className="lw-button lw-button-primary">
          Review transfer
        </button>
      </div>
    </form>
  );
}

/* ============================================================================
 * Step 3 — Review
 * ========================================================================== */

function ReviewStep(props: {
  recipient: Recipient;
  quote: Async<Quote>;
  onRetry: () => void;
  onChangeAmount: () => void;
  onConfirm: () => void;
  sending: boolean;
  error: string | null;
}) {
  const { recipient, quote } = props;
  const isInternal = bankCodeOf(recipient.iban) === LEEWARD_BANK_CODE;
  const insufficient = quote.status === "ready" && quote.data.total > SOURCE_ACCOUNT.balance;

  return (
    <div className="lw-body">
      <dl className="lw-summary">
        <SummaryRow label="To">
          <span className="lw-strong">{recipient.name}</span>
          <span className="lw-sub">{bankNameOf(recipient.iban)}</span>
          <span className="lw-sub lw-mono">{formatIban(recipient.iban)}</span>
        </SummaryRow>
        <SummaryRow label="From">
          <span className="lw-strong">{SOURCE_ACCOUNT.name}</span>
          <span className="lw-sub">Leeward · •••• {SOURCE_ACCOUNT.ibanLast4}</span>
        </SummaryRow>
      </dl>

      <div className="lw-breakdown" aria-busy={quote.status === "loading"}>
        {quote.status === "loading" && (
          <p className="lw-loading" role="status">
            <Spinner /> Calculating fee…
          </p>
        )}

        {quote.status === "error" && (
          <div className="lw-banner lw-banner-error" role="alert">
            <p>{quote.message}</p>
            <button type="button" className="lw-link-button" onClick={props.onRetry}>
              Try again
            </button>
          </div>
        )}

        {quote.status === "ready" && (
          <dl className="lw-summary lw-summary-money">
            <SummaryRow label="Amount">{formatTry(quote.data.amount)}</SummaryRow>
            <SummaryRow label="Fee">{quote.data.fee === 0 ? "Free" : formatTry(quote.data.fee)}</SummaryRow>
            <SummaryRow label="Total from your account" emphasis>
              {formatTry(quote.data.total)}
            </SummaryRow>
            {!insufficient && (
              <SummaryRow label="Balance after">{formatTry(SOURCE_ACCOUNT.balance - quote.data.total)}</SummaryRow>
            )}
          </dl>
        )}
      </div>

      {insufficient && quote.status === "ready" && (
        <div className="lw-banner lw-banner-error" role="alert">
          <p>
            With the {formatTry(quote.data.fee)} fee, this transfer is more than your available balance of{" "}
            {formatTry(SOURCE_ACCOUNT.balance)}.
          </p>
          <button type="button" className="lw-link-button" onClick={props.onChangeAmount}>
            Change amount
          </button>
        </div>
      )}

      <p className="lw-note">
        {isInternal
          ? "Transfers between Leeward accounts arrive instantly."
          : "Sent via FAST. Most transfers arrive within seconds, 24/7."}{" "}
        Check the details carefully — transfers can't be cancelled once sent.
      </p>

      {props.error && (
        <p className="lw-error" role="alert">
          {props.error}
        </p>
      )}

      <div className="lw-actions">
        <button
          type="button"
          className="lw-button lw-button-primary"
          onClick={props.onConfirm}
          disabled={quote.status !== "ready" || insufficient || props.sending}
        >
          {props.sending ? (
            <>
              <Spinner /> Sending code…
            </>
          ) : (
            "Confirm and send code"
          )}
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
 * Step 4 — One-time code
 * ========================================================================== */

function OtpStep(props: {
  challenge: OtpChallenge;
  total: Kurus;
  code: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent) => void;
  onResend: () => void;
  now: number;
  verifying: boolean;
  resending: boolean;
  locked: boolean;
  error: string | null;
}) {
  const inputId = useId();
  const hintId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const expiresIn = props.challenge.expiresAt - props.now;
  const resendIn = props.challenge.resendAvailableAt - props.now;
  const expired = expiresIn <= 0;
  const blocked = expired || props.locked;
  const canResend = (resendIn <= 0 || blocked) && !props.resending && !props.verifying;

  // Refocus the code input whenever a fresh code is issued or a wrong one is cleared.
  useEffect(() => {
    if (!blocked) inputRef.current?.focus({ preventScroll: true });
  }, [props.challenge.challengeId, props.error, blocked]);

  const errorText = props.error ?? (expired ? "This code has expired. Request a new one to continue." : null);

  return (
    <form className="lw-body" onSubmit={props.onSubmit} noValidate>
      <p className="lw-lead">
        We sent a {OTP_LENGTH}-digit code to <strong className="lw-nowrap">{props.challenge.phoneMasked}</strong>.
        Enter it to send <strong className="lw-nowrap">{formatTry(props.total)}</strong>.
      </p>

      <div>
        <label htmlFor={inputId} className="lw-label">
          One-time code
        </label>
        <input
          ref={inputRef}
          id={inputId}
          className={`lw-input lw-otp${errorText ? " lw-invalid" : ""}`}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={OTP_LENGTH}
          placeholder={"•".repeat(OTP_LENGTH)}
          value={props.code}
          onChange={props.onChange}
          disabled={props.verifying || blocked}
          aria-invalid={errorText ? true : undefined}
          aria-describedby={`${hintId}${errorText ? ` ${errorId}` : ""}`}
        />
        <p id={hintId} className="lw-hint">
          {expired ? "Code expired" : `Code expires in ${formatCountdown(expiresIn)}`}
          {IS_DEMO && <span className="lw-demo"> · Demo code: {DEMO_OTP}</span>}
        </p>
        {errorText && (
          <p id={errorId} className="lw-error" role="alert">
            {errorText}
          </p>
        )}
      </div>

      <p className="lw-note">
        Leeward will never call you to ask for this code. Don't share it with anyone.
      </p>

      <div className="lw-actions">
        <button
          type="submit"
          className="lw-button lw-button-primary"
          disabled={props.verifying || blocked || props.code.length !== OTP_LENGTH}
        >
          {props.verifying ? (
            <>
              <Spinner /> Sending money…
            </>
          ) : (
            `Send ${formatTry(props.total)}`
          )}
        </button>
        <button type="button" className="lw-button lw-button-secondary" onClick={props.onResend} disabled={!canResend}>
          {props.resending ? "Sending new code…" : canResend ? "Resend code" : `Resend code in ${formatCountdown(resendIn)}`}
        </button>
      </div>
    </form>
  );
}

/* ============================================================================
 * Done
 * ========================================================================== */

function SuccessStep({ receipt, onRestart }: { receipt: Receipt; onRestart: () => void }) {
  return (
    <div className="lw-body lw-success">
      <div className="lw-success-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="32" height="32">
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="lw-title lw-center" tabIndex={-1} data-step-heading>
        {formatTry(receipt.quote.amount)} sent to {receipt.recipient.name}
      </h1>
      <p className="lw-hint lw-center">{dateFormatter.format(new Date(receipt.completedAt))}</p>

      <dl className="lw-summary">
        <SummaryRow label="Recipient">
          <span className="lw-strong">{receipt.recipient.name}</span>
          <span className="lw-sub lw-mono">{formatIban(receipt.recipient.iban)}</span>
        </SummaryRow>
        <SummaryRow label="Fee">{receipt.quote.fee === 0 ? "Free" : formatTry(receipt.quote.fee)}</SummaryRow>
        <SummaryRow label="Total debited" emphasis>
          {formatTry(receipt.quote.total)}
        </SummaryRow>
        <SummaryRow label="Reference">
          <span className="lw-mono">{receipt.reference}</span>
        </SummaryRow>
      </dl>

      <div className="lw-actions">
        <button type="button" className="lw-button lw-button-primary" onClick={onRestart}>
          Make another transfer
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
 * Shared building blocks
 * ========================================================================== */

interface FieldControlProps {
  id: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string;
}

function Field(props: {
  label: string;
  hint?: string;
  error: string | null;
  children: (controlProps: FieldControlProps) => ReactNode;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  return (
    <div className="lw-field">
      <label htmlFor={id} className="lw-label">
        {props.label}
      </label>
      {props.children({
        id,
        "aria-invalid": props.error ? true : undefined,
        "aria-describedby": [props.hint ? hintId : null, props.error ? errorId : null].filter(Boolean).join(" "),
      })}
      {props.hint && (
        <p id={hintId} className="lw-hint">
          {props.hint}
        </p>
      )}
      {props.error && (
        <p id={errorId} className="lw-error" role="alert">
          {props.error}
        </p>
      )}
    </div>
  );
}

function SummaryRow({ label, children, emphasis }: { label: string; children: ReactNode; emphasis?: boolean }) {
  return (
    <div className={`lw-row${emphasis ? " lw-row-emphasis" : ""}`}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function RecipientSummary({ recipient }: { recipient: Recipient }) {
  return (
    <div className="lw-recipient-chip">
      <span className="lw-avatar" aria-hidden="true">
        {initialsOf(recipient.name)}
      </span>
      <span className="lw-option-text">
        <span className="lw-option-title">To {recipient.name}</span>
        <span className="lw-option-sub">
          {bankNameOf(recipient.iban)} · {maskIban(recipient.iban)}
        </span>
      </span>
    </div>
  );
}

function Spinner() {
  return <span className="lw-spinner" aria-hidden="true" />;
}

/* ============================================================================
 * Styles (scoped under .lw-transfer)
 * ========================================================================== */

const styles = `
.lw-transfer {
  --lw-bg: #f4f6f8;
  --lw-surface: #ffffff;
  --lw-text: #0f1b2d;
  --lw-muted: #5b6878;
  --lw-border: #d8dee6;
  --lw-primary: #0b5c74;
  --lw-primary-hover: #094a5e;
  --lw-primary-soft: #e3f1f5;
  --lw-error: #b42318;
  --lw-error-soft: #fdecea;
  --lw-success: #137a4b;
  --lw-success-soft: #e3f5ec;
  --lw-focus: 0 0 0 3px rgba(11, 92, 116, 0.35);
  --lw-radius: 14px;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: var(--lw-text);
  background: var(--lw-bg);
  min-height: 100%;
  padding: 24px 16px;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}
.lw-transfer *, .lw-transfer *::before, .lw-transfer *::after { box-sizing: border-box; }
.lw-transfer :focus-visible { outline: none; box-shadow: var(--lw-focus); }

.lw-card {
  max-width: 440px; margin: 0 auto; background: var(--lw-surface);
  border-radius: 20px; box-shadow: 0 1px 2px rgba(15,27,45,.06), 0 8px 24px rgba(15,27,45,.06);
  overflow: hidden;
}
.lw-header { padding: 16px 20px 0; }
.lw-header-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.lw-eyebrow { font-size: 14px; font-weight: 600; color: var(--lw-muted); }
.lw-step-count { font-size: 13px; color: var(--lw-muted); min-width: 40px; text-align: right; }
.lw-icon-button, .lw-icon-spacer { width: 40px; height: 40px; flex: none; }
.lw-icon-button {
  display: inline-flex; align-items: center; justify-content: center;
  border: none; background: transparent; color: var(--lw-text); border-radius: 50%; cursor: pointer;
  margin-left: -8px;
}
.lw-icon-button:hover { background: var(--lw-bg); }
.lw-progress { height: 4px; background: var(--lw-bg); border-radius: 2px; margin: 12px 0 20px; overflow: hidden; }
.lw-progress-bar { height: 100%; background: var(--lw-primary); border-radius: 2px; transition: width .25s ease; }
.lw-title { font-size: 22px; line-height: 1.25; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
.lw-title:focus { outline: none; box-shadow: none; }
.lw-center { text-align: center; }

.lw-body { padding: 20px; display: flex; flex-direction: column; gap: 20px; }
.lw-lead { margin: 0; font-size: 15px; line-height: 1.5; color: var(--lw-muted); }
.lw-lead strong { color: var(--lw-text); }
.lw-nowrap { white-space: nowrap; }

.lw-fieldset { border: none; margin: 0; padding: 0; min-width: 0; }
.lw-label { display: block; font-size: 14px; font-weight: 600; margin: 0 0 8px; padding: 0; }
.lw-hint { font-size: 13px; color: var(--lw-muted); margin: 6px 0 0; line-height: 1.4; }
.lw-hint strong { color: var(--lw-text); }
.lw-error { font-size: 13px; color: var(--lw-error); margin: 6px 0 0; line-height: 1.4; font-weight: 500; }
.lw-note { font-size: 13px; color: var(--lw-muted); margin: 0; line-height: 1.5; }
.lw-demo { color: var(--lw-primary); font-weight: 600; }

.lw-options { display: flex; flex-direction: column; gap: 8px; }
.lw-option {
  position: relative; display: flex; align-items: center; gap: 12px; padding: 12px 14px;
  border: 1.5px solid var(--lw-border); border-radius: var(--lw-radius); cursor: pointer;
  transition: border-color .15s, background-color .15s;
}
.lw-option:hover { border-color: #b4c0cc; }
.lw-option input { position: absolute; opacity: 0; width: 1px; height: 1px; pointer-events: none; }
.lw-option:has(input:checked) { border-color: var(--lw-primary); background: var(--lw-primary-soft); }
.lw-option:has(input:focus-visible) { box-shadow: var(--lw-focus); }
.lw-avatar {
  width: 40px; height: 40px; flex: none; border-radius: 50%; background: var(--lw-primary-soft);
  color: var(--lw-primary); display: inline-flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px;
}
.lw-avatar-new { background: var(--lw-bg); color: var(--lw-text); font-size: 20px; font-weight: 500; }
.lw-option-text { display: flex; flex-direction: column; min-width: 0; }
.lw-option-title { font-weight: 600; font-size: 15px; }
.lw-option-sub { font-size: 13px; color: var(--lw-muted); }

.lw-new-recipient { display: flex; flex-direction: column; gap: 16px; padding-top: 4px; }
.lw-field { display: flex; flex-direction: column; }
.lw-input {
  width: 100%; height: 48px; padding: 0 14px; font: inherit; font-size: 16px; color: var(--lw-text);
  border: 1.5px solid var(--lw-border); border-radius: 12px; background: var(--lw-surface);
  transition: border-color .15s;
}
.lw-input:focus { border-color: var(--lw-primary); outline: none; box-shadow: var(--lw-focus); }
.lw-input[aria-invalid="true"], .lw-invalid { border-color: var(--lw-error); }
.lw-input:disabled { background: var(--lw-bg); color: var(--lw-muted); }
.lw-mono { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 0.95em; letter-spacing: 0.02em; }

.lw-recipient-chip { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--lw-bg); border-radius: var(--lw-radius); }
.lw-amount-wrap {
  display: flex; align-items: center; gap: 6px; border-bottom: 2px solid var(--lw-border); padding: 4px 0;
  transition: border-color .15s;
}
.lw-amount-wrap:focus-within { border-color: var(--lw-primary); }
.lw-amount-wrap.lw-invalid { border-color: var(--lw-error); }
.lw-currency { font-size: 32px; font-weight: 600; color: var(--lw-muted); }
.lw-amount-input {
  flex: 1; min-width: 0; border: none; background: transparent; font: inherit; font-size: 36px; font-weight: 700;
  color: var(--lw-text); padding: 4px 0; font-variant-numeric: tabular-nums;
}
.lw-amount-input:focus { outline: none; box-shadow: none; }

.lw-summary { margin: 0; display: flex; flex-direction: column; }
.lw-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--lw-bg); }
.lw-row:last-child { border-bottom: none; }
.lw-row dt { font-size: 14px; color: var(--lw-muted); flex: none; }
.lw-row dd { margin: 0; text-align: right; display: flex; flex-direction: column; gap: 2px; font-size: 15px; font-variant-numeric: tabular-nums; min-width: 0; overflow-wrap: anywhere; }
.lw-row-emphasis dt { color: var(--lw-text); font-weight: 600; }
.lw-row-emphasis dd { font-size: 18px; font-weight: 700; }
.lw-strong { font-weight: 600; }
.lw-sub { font-size: 13px; color: var(--lw-muted); }
.lw-breakdown { background: var(--lw-bg); border-radius: var(--lw-radius); padding: 4px 16px; min-height: 64px; display: flex; flex-direction: column; justify-content: center; }
.lw-breakdown .lw-row { border-bottom-color: var(--lw-border); }
.lw-breakdown .lw-row:last-child { border-bottom: none; }
.lw-loading { display: flex; align-items: center; gap: 10px; margin: 0; color: var(--lw-muted); font-size: 14px; padding: 12px 0; }

.lw-banner { border-radius: 12px; padding: 12px 14px; font-size: 14px; line-height: 1.45; }
.lw-banner p { margin: 0; }
.lw-banner-error { background: var(--lw-error-soft); color: var(--lw-error); }
.lw-breakdown .lw-banner { margin: 12px 0; }
.lw-link-button { margin-top: 6px; padding: 0; border: none; background: none; color: inherit; font: inherit; font-weight: 600; text-decoration: underline; cursor: pointer; }

.lw-otp { height: 56px; font-size: 24px; letter-spacing: 0.5em; text-align: center; font-variant-numeric: tabular-nums; padding-left: calc(14px + 0.5em); }

.lw-actions { display: flex; flex-direction: column; gap: 10px; padding-top: 4px; }
.lw-button {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 52px; padding: 0 20px;
  border-radius: 999px; font: inherit; font-size: 16px; font-weight: 600; cursor: pointer; border: none;
  transition: background-color .15s, opacity .15s;
}
.lw-button:disabled { cursor: not-allowed; opacity: 0.5; }
.lw-button-primary { background: var(--lw-primary); color: #fff; }
.lw-button-primary:not(:disabled):hover { background: var(--lw-primary-hover); }
.lw-button-secondary { background: transparent; color: var(--lw-primary); }
.lw-button-secondary:not(:disabled):hover { background: var(--lw-primary-soft); }
.lw-button-secondary:disabled { color: var(--lw-muted); opacity: 1; }

.lw-spinner {
  width: 16px; height: 16px; border-radius: 50%; border: 2px solid currentColor; border-right-color: transparent;
  display: inline-block; animation: lw-spin .7s linear infinite;
}
@keyframes lw-spin { to { transform: rotate(360deg); } }

.lw-success { align-items: stretch; padding-top: 32px; }
.lw-success-icon {
  width: 64px; height: 64px; margin: 0 auto; border-radius: 50%; background: var(--lw-success-soft);
  color: var(--lw-success); display: flex; align-items: center; justify-content: center;
}
.lw-success .lw-title { margin-top: -4px; }
.lw-success .lw-hint { margin-top: -14px; }

@media (prefers-reduced-motion: reduce) {
  .lw-transfer *, .lw-transfer *::before, .lw-transfer *::after { transition: none !important; animation-duration: 1.5s !important; }
}
`;
