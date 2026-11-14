import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AmountDisplay,
  Avatar,
  Badge,
  Button,
  Card,
  Heading,
  Icon,
  IconButton,
  OTPInput,
  RadioGroup,
  Text,
  TextField,
  formatAmount,
  formatIban,
  maskIban,
  useToast,
} from "@leeward/react";

/*
 * Money transfer flow: recipient, amount, review, SMS verification, done.
 *
 * Expects the app root to load "@leeward/react/fonts.css" and
 * "@leeward/react/styles.css", set data-theme, and wrap the tree in
 * <TooltipProvider> and <ToastProvider>.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LOCALE = "tr-TR" as const;
const CURRENCY = "TRY";
const LEEWARD_BANK_CODE = "00829";

const OTP_LENGTH = 6;
const OTP_MAX_ATTEMPTS = 3;
const OTP_RESEND_SECONDS = 30;
const OTP_TTL_SECONDS = 180;

const MIN_AMOUNT_KURUS = 100; // ₺1,00
const MAX_DESCRIPTION_LENGTH = 140;

/** FAST transfers to other banks. Free between Leeward accounts. */
const OTHER_BANK_FEE_KURUS = 650; // ₺6,50

// ---------------------------------------------------------------------------
// IBAN helpers
// ---------------------------------------------------------------------------

const TR_IBAN_LENGTH = 26;

function normalizeIban(input: string): string {
  return input.replace(/\s+/g, "").toUpperCase();
}

/** ISO 13616 mod-97 remainder, computed digit by digit to avoid overflow. */
function ibanRemainder(rearranged: string): number {
  let remainder = 0;
  for (const char of rearranged) {
    const digits = /[A-Z]/.test(char) ? String(char.charCodeAt(0) - 55) : char;
    for (const digit of digits) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder;
}

function isValidIbanChecksum(iban: string): boolean {
  return ibanRemainder(iban.slice(4) + iban.slice(0, 4)) === 1;
}

type IbanError = "empty" | "country" | "characters" | "short" | "long" | "checksum";

function validateIban(input: string): IbanError | null {
  const iban = normalizeIban(input);
  if (iban.length === 0) return "empty";
  if (!iban.startsWith("TR")) return "country";
  if (!/^TR\d+$/.test(iban)) return "characters";
  if (iban.length < TR_IBAN_LENGTH) return "short";
  if (iban.length > TR_IBAN_LENGTH) return "long";
  if (!isValidIbanChecksum(iban)) return "checksum";
  return null;
}

const IBAN_ERROR_COPY: Record<IbanError, string> = {
  empty: "Enter the recipient's IBAN.",
  country: "Leeward sends to Turkish IBANs only. Check that it starts with TR.",
  characters: "An IBAN has TR followed by numbers only. Check it and try again.",
  short: "This IBAN is too short. Check it and try again.",
  long: "This IBAN is too long. Check it and try again.",
  checksum: "This IBAN doesn't look right. Check each digit and try again.",
};

/** Bank code sits in characters 5 to 9 of a Turkish IBAN. */
function bankCodeOf(iban: string): string {
  return normalizeIban(iban).slice(4, 9);
}

const BANK_NAMES: Record<string, string> = {
  [LEEWARD_BANK_CODE]: "Leeward",
  "00010": "Ziraat Bankası",
  "00046": "Akbank",
  "00062": "Garanti BBVA",
  "00064": "İş Bankası",
  "00067": "Yapı Kredi",
  "00111": "QNB",
};

function bankNameOf(iban: string): string {
  return BANK_NAMES[bankCodeOf(iban)] ?? "Another bank";
}

function feeFor(iban: string): number {
  return bankCodeOf(iban) === LEEWARD_BANK_CODE ? 0 : OTHER_BANK_FEE_KURUS;
}

// ---------------------------------------------------------------------------
// Amount helpers. Money is held in integer kuruş to avoid float drift.
// ---------------------------------------------------------------------------

const toLira = (kurus: number): number => kurus / 100;

/** Keep digits and separators, and at most two decimals after a comma. */
function sanitizeAmountInput(raw: string): string {
  const cleaned = raw.replace(/[^\d.,]/g, "");
  const commaIndex = cleaned.indexOf(",");
  if (commaIndex === -1) return cleaned;
  const whole = cleaned.slice(0, commaIndex);
  const fraction = cleaned
    .slice(commaIndex + 1)
    .replace(/[.,]/g, "")
    .slice(0, 2);
  return `${whole},${fraction}`;
}

/**
 * Parse Turkish-style input ("1.250,50") into kuruş. A lone dot followed by
 * one or two digits ("1250.5") is read as a decimal point, since that is what
 * people mean when they type it.
 */
function parseAmountToKurus(input: string): number | null {
  const value = input.trim();
  if (value === "") return null;

  let normalized: string;
  if (value.includes(",")) {
    normalized = value.replace(/\./g, "").replace(",", ".");
  } else if (/^\d+\.\d{1,2}$/.test(value)) {
    normalized = value;
  } else {
    normalized = value.replace(/\./g, "");
  }

  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return null;
  const [whole, fraction = ""] = normalized.split(".");
  const kurus = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(kurus) ? kurus : null;
}

const money = (kurus: number): string => formatAmount(toLira(kurus), CURRENCY, LOCALE);

// ---------------------------------------------------------------------------
// Mock data and API
// ---------------------------------------------------------------------------

/** Builds a valid Turkish IBAN from a bank code and account number. */
function mockIban(bankCode: string, account: string): string {
  const bban = `${bankCode}0${account}`;
  const check = 98 - ibanRemainder(`${bban}TR00`);
  return `TR${String(check).padStart(2, "0")}${bban}`;
}

interface Recipient {
  id: string;
  name: string;
  iban: string;
}

interface SourceAccount {
  name: string;
  iban: string;
  balanceKurus: number;
  dailyLimitKurus: number;
  sentTodayKurus: number;
  phoneLast4: string;
}

const MOCK_ACCOUNT: SourceAccount = {
  name: "Everyday account",
  iban: mockIban(LEEWARD_BANK_CODE, "0000012345678901"),
  balanceKurus: 2_458_035, // ₺24.580,35
  dailyLimitKurus: 5_000_000, // ₺50.000,00
  sentTodayKurus: 1_200_000, // ₺12.000,00
  phoneLast4: "4821",
};

const MOCK_RECIPIENTS: Recipient[] = [
  { id: "r1", name: "Deniz Yılmaz", iban: mockIban(LEEWARD_BANK_CODE, "0000098765432100") },
  { id: "r2", name: "Elif Kaya", iban: mockIban("00062", "0000629384710552") },
  { id: "r3", name: "Mert Demir", iban: mockIban("00046", "0000461029384756") },
  { id: "r4", name: "Zeynep Arslan", iban: mockIban("00064", "0000640012938475") },
];

/** The mock SMS always carries this code. */
const MOCK_OTP = "123456";

const delay = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });

interface TransferDraft {
  recipientName: string;
  iban: string;
  amountKurus: number;
  feeKurus: number;
  description: string;
}

interface OtpChallenge {
  challengeId: string;
  expiresAt: number;
}

type VerifyResult =
  | { ok: true; reference: string }
  | { ok: false; reason: "wrong-code"; attemptsLeft: number }
  | { ok: false; reason: "locked" | "expired" };

const mockApi = {
  async requestOtp(_draft: TransferDraft, signal?: AbortSignal): Promise<OtpChallenge> {
    await delay(700, signal);
    return {
      challengeId: crypto.randomUUID(),
      expiresAt: Date.now() + OTP_TTL_SECONDS * 1000,
    };
  },

  async verifyAndSend(
    challenge: OtpChallenge,
    code: string,
    attemptsUsed: number,
    signal?: AbortSignal,
  ): Promise<VerifyResult> {
    await delay(900, signal);
    if (Date.now() > challenge.expiresAt) return { ok: false, reason: "expired" };
    if (code === MOCK_OTP) {
      return { ok: true, reference: `LW${Date.now().toString(36).toUpperCase()}` };
    }
    const attemptsLeft = OTP_MAX_ATTEMPTS - (attemptsUsed + 1);
    return attemptsLeft > 0
      ? { ok: false, reason: "wrong-code", attemptsLeft }
      : { ok: false, reason: "locked" };
  },
};

const isAbort = (error: unknown) => error instanceof DOMException && error.name === "AbortError";

// ---------------------------------------------------------------------------
// Flow state
// ---------------------------------------------------------------------------

type Step = "recipient" | "amount" | "review" | "verify" | "done";

const STEP_ORDER: Step[] = ["recipient", "amount", "review", "verify"];

const STEP_TITLES: Record<Step, string> = {
  recipient: "Who are you sending to?",
  amount: "How much are you sending?",
  review: "Check your transfer",
  verify: "Enter your code",
  done: "Money sent",
};

const NEW_RECIPIENT = "new";

interface FlowState {
  step: Step;
  recipientChoice: string;
  newName: string;
  newIban: string;
  amountInput: string;
  description: string;
  challenge: OtpChallenge | null;
  reference: string | null;
}

type FlowAction =
  | { type: "go"; step: Step }
  | { type: "back" }
  | { type: "set"; patch: Partial<FlowState> }
  | { type: "challenge"; challenge: OtpChallenge }
  | { type: "sent"; reference: string }
  | { type: "reset" };

const initialState: FlowState = {
  step: "recipient",
  recipientChoice: MOCK_RECIPIENTS[0]?.id ?? NEW_RECIPIENT,
  newName: "",
  newIban: "",
  amountInput: "",
  description: "",
  challenge: null,
  reference: null,
};

function reducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "go":
      return { ...state, step: action.step };
    case "back": {
      const index = STEP_ORDER.indexOf(state.step);
      if (index <= 0) return state;
      // Leaving verification throws away the code that was sent.
      return { ...state, step: STEP_ORDER[index - 1], challenge: null };
    }
    case "set":
      return { ...state, ...action.patch };
    case "challenge":
      return { ...state, challenge: action.challenge, step: "verify" };
    case "sent":
      return { ...state, reference: action.reference, challenge: null, step: "done" };
    case "reset":
      return initialState;
  }
}

// ---------------------------------------------------------------------------
// Layout primitives (token-only styles)
// ---------------------------------------------------------------------------

const styles = {
  screen: {
    minHeight: "100dvh",
    background: "var(--lw-color-bg-canvas)",
    color: "var(--lw-color-text-primary)",
  },
  column: {
    maxWidth: "440px",
    marginInline: "auto",
    paddingInline: "var(--lw-space-md)",
    paddingBlock: "var(--lw-space-md) var(--lw-space-xl)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--lw-space-lg)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "var(--lw-space-xs)",
    minHeight: "44px",
  },
  stack: { display: "flex", flexDirection: "column", gap: "var(--lw-space-lg)" },
  tight: { display: "flex", flexDirection: "column", gap: "var(--lw-space-sm)" },
  inline: { display: "flex", alignItems: "center", gap: "var(--lw-space-sm)" },
  summaryList: { margin: 0, display: "flex", flexDirection: "column", gap: "var(--lw-space-md)" },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: "var(--lw-space-md)",
  },
  summaryValue: { margin: 0, textAlign: "end" },
  divider: {
    border: 0,
    borderBlockStart: "1px solid var(--lw-color-border-subtle)",
    margin: 0,
  },
  alert: {
    display: "flex",
    alignItems: "flex-start",
    gap: "var(--lw-space-xs)",
    padding: "var(--lw-space-sm) var(--lw-space-md)",
    borderRadius: "var(--lw-radius-card)",
    border: "1px solid var(--lw-color-feedback-danger-border)",
    background: "var(--lw-color-feedback-danger-bg)",
    color: "var(--lw-color-feedback-danger-text)",
  },
  focusTarget: { outline: "none" },
} satisfies Record<string, CSSProperties>;

function ErrorNotice({ children }: { children: ReactNode }) {
  return (
    <div role="alert" style={styles.alert}>
      <Icon name="alert-circle" size="sm" />
      <Text as="div" variant="body-sm" tone="danger">
        {children}
      </Text>
    </div>
  );
}

function SummaryRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={styles.summaryRow}>
      <Text as="dt" variant="body-md" tone="secondary">
        {label}
      </Text>
      <dd style={styles.summaryValue}>{children}</dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Seconds left until `target`, ticking once a second. */
function useSecondsUntil(target: number | null): number {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!target) return;
    const id = window.setInterval(() => {
      setTick((t) => t + 1);
      if (Date.now() >= target) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  // Computed during render so the value is right on the first frame.
  return target ? Math.max(0, Math.ceil((target - Date.now()) / 1000)) : 0;
}

/** Aborts in-flight mock requests when the screen unmounts. */
function useAbortOnUnmount() {
  const controllers = useRef(new Set<AbortController>());
  useEffect(() => {
    const active = controllers.current;
    return () => active.forEach((c) => c.abort());
  }, []);
  return useCallback(() => {
    const controller = new AbortController();
    controllers.current.add(controller);
    return {
      signal: controller.signal,
      release: () => controllers.current.delete(controller),
    };
  }, []);
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function TransferScreen() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const toast = useToast();
  const startRequest = useAbortOnUnmount();
  const formId = useId();
  const account = MOCK_ACCOUNT;

  // Move focus to the new heading on every step change so screen reader and
  // keyboard users land at the top of the new content.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.getElementById(`${formId}-title`)?.focus();
  }, [state.step, formId]);

  // -- Derived values -------------------------------------------------------

  const savedRecipient = MOCK_RECIPIENTS.find((r) => r.id === state.recipientChoice);
  const isNewRecipient = state.recipientChoice === NEW_RECIPIENT;
  const recipientName = isNewRecipient ? state.newName.trim() : (savedRecipient?.name ?? "");
  const recipientIban = isNewRecipient ? normalizeIban(state.newIban) : (savedRecipient?.iban ?? "");

  const amountKurus = parseAmountToKurus(state.amountInput);
  const feeKurus = recipientIban ? feeFor(recipientIban) : 0;
  const totalKurus = (amountKurus ?? 0) + feeKurus;
  const dailyRemainingKurus = Math.max(0, account.dailyLimitKurus - account.sentTodayKurus);

  const draft = useMemo<TransferDraft | null>(
    () =>
      amountKurus === null
        ? null
        : {
            recipientName,
            iban: recipientIban,
            amountKurus,
            feeKurus,
            description: state.description.trim(),
          },
    [recipientName, recipientIban, amountKurus, feeKurus, state.description],
  );

  // -- Step 1: recipient ----------------------------------------------------

  const [recipientTouched, setRecipientTouched] = useState(false);

  const nameError = useMemo(() => {
    if (!isNewRecipient) return null;
    const name = state.newName.trim();
    if (name.length === 0) return "Enter the recipient's full name.";
    if (name.length < 3 || !/\s/.test(name)) {
      return "Enter their first and last name, as their bank has it.";
    }
    if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(name)) {
      return "Use letters only. Leave out numbers and symbols.";
    }
    return null;
  }, [isNewRecipient, state.newName]);

  const ibanError = useMemo(() => {
    if (!isNewRecipient) return null;
    const error = validateIban(state.newIban);
    if (error) return IBAN_ERROR_COPY[error];
    if (normalizeIban(state.newIban) === account.iban) {
      return "This is your own account. Enter someone else's IBAN.";
    }
    return null;
  }, [isNewRecipient, state.newIban, account.iban]);

  const submitRecipient = (event: FormEvent) => {
    event.preventDefault();
    setRecipientTouched(true);
    if (nameError || ibanError) {
      // Send focus to the first field that needs fixing.
      const firstInvalid = nameError ? `${formId}-name` : `${formId}-iban`;
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    dispatch({ type: "go", step: "amount" });
  };

  // -- Step 2: amount -------------------------------------------------------

  const [amountTouched, setAmountTouched] = useState(false);

  const amountError = useMemo(() => {
    if (state.amountInput.trim() === "") return "Enter an amount to send.";
    if (amountKurus === null) return "Enter the amount in numbers, for example 1.250,00.";
    if (amountKurus < MIN_AMOUNT_KURUS) return `The smallest amount you can send is ${money(MIN_AMOUNT_KURUS)}.`;
    if (amountKurus + feeKurus > account.balanceKurus) {
      return feeKurus > 0
        ? `You have ${money(account.balanceKurus)}. With the ${money(feeKurus)} fee, the most you can send is ${money(Math.max(0, account.balanceKurus - feeKurus))}.`
        : `You have ${money(account.balanceKurus)}. Enter a smaller amount.`;
    }
    if (amountKurus > dailyRemainingKurus) {
      return `You can send ${money(dailyRemainingKurus)} more today. Enter a smaller amount or try again tomorrow.`;
    }
    return null;
  }, [state.amountInput, amountKurus, feeKurus, account.balanceKurus, dailyRemainingKurus]);

  const submitAmount = (event: FormEvent) => {
    event.preventDefault();
    setAmountTouched(true);
    if (amountError) {
      document.getElementById(`${formId}-amount`)?.focus();
      return;
    }
    // Show the amount back in the same format it will be reviewed in.
    if (amountKurus !== null) {
      const fixed = (amountKurus / 100).toFixed(2).replace(".", ",");
      dispatch({ type: "set", patch: { amountInput: fixed } });
    }
    dispatch({ type: "go", step: "review" });
  };

  // -- Step 3: review, sends the code ---------------------------------------

  const [requestingOtp, setRequestingOtp] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [resendAt, setResendAt] = useState<number | null>(null);

  const requestOtp = useCallback(async () => {
    if (!draft || requestingOtp) return;
    setRequestingOtp(true);
    setRequestError(null);
    const { signal, release } = startRequest();
    try {
      const challenge = await mockApi.requestOtp(draft, signal);
      dispatch({ type: "challenge", challenge });
      setResendAt(Date.now() + OTP_RESEND_SECONDS * 1000);
    } catch (error) {
      if (isAbort(error)) return;
      setRequestError("We couldn't send your code. Check your connection and try again. Nothing left your account.");
    } finally {
      release();
      if (!signal.aborted) setRequestingOtp(false);
    }
  }, [draft, requestingOtp, startRequest]);

  // -- Step 4: verify -------------------------------------------------------

  const [code, setCode] = useState("");
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const submittingRef = useRef(false);

  const resendIn = useSecondsUntil(state.step === "verify" ? resendAt : null);
  const expiresIn = useSecondsUntil(state.step === "verify" ? (state.challenge?.expiresAt ?? null) : null);
  const expired = state.step === "verify" && state.challenge !== null && expiresIn === 0;

  const resetVerification = () => {
    setCode("");
    setAttemptsUsed(0);
    setCodeError(null);
    setLocked(false);
  };

  const verify = async (value: string) => {
    // A ref guards against a double send from onComplete plus a button press.
    if (!state.challenge || !draft || submittingRef.current || locked) return;
    if (value.length !== OTP_LENGTH) {
      setCodeError(`Enter all ${OTP_LENGTH} digits of the code we sent you.`);
      return;
    }
    if (expired) {
      setCodeError("This code has expired. Send a new code to continue. Nothing left your account.");
      return;
    }

    submittingRef.current = true;
    setVerifying(true);
    setCodeError(null);
    const { signal, release } = startRequest();
    try {
      const result = await mockApi.verifyAndSend(state.challenge, value, attemptsUsed, signal);
      if (result.ok) {
        dispatch({ type: "sent", reference: result.reference });
        toast.show({
          title: "Money sent",
          description: `${draft.recipientName} gets ${money(draft.amountKurus)} ${
            draft.feeKurus === 0 ? "in a few seconds" : "within a few minutes"
          }.`,
          tone: "success",
        });
        return;
      }
      if (result.reason === "wrong-code") {
        setAttemptsUsed((n) => n + 1);
        setCodeError(
          `That code doesn't match. Check the SMS and try again. You have ${result.attemptsLeft} ${
            result.attemptsLeft === 1 ? "try" : "tries"
          } left.`,
        );
      } else if (result.reason === "locked") {
        setAttemptsUsed(OTP_MAX_ATTEMPTS);
        setLocked(true);
        setCodeError("That code didn't match 3 times, so we stopped this transfer. Send a new code to try again. Nothing left your account.");
      } else {
        setCodeError("This code has expired. Send a new code to continue. Nothing left your account.");
      }
    } catch (error) {
      if (isAbort(error)) return;
      setCodeError("We couldn't confirm your transfer. Check your connection and try again. Nothing left your account.");
    } finally {
      release();
      submittingRef.current = false;
      if (!signal.aborted) setVerifying(false);
    }
  };

  const resendCode = async () => {
    resetVerification();
    await requestOtp();
  };

  // -- Navigation -----------------------------------------------------------

  const goBack = () => {
    if (state.step === "verify") resetVerification();
    setRequestError(null);
    dispatch({ type: "back" });
  };

  const startOver = () => {
    resetVerification();
    setRecipientTouched(false);
    setAmountTouched(false);
    setRequestError(null);
    setResendAt(null);
    dispatch({ type: "reset" });
  };

  const stepIndex = STEP_ORDER.indexOf(state.step);
  const canGoBack = stepIndex > 0 && !verifying && !requestingOtp;

  // -- Render ---------------------------------------------------------------

  const recipientOptions = [
    ...MOCK_RECIPIENTS.map((r) => ({
      value: r.id,
      label: r.name,
      description: `${bankNameOf(r.iban)}, ${maskIban(r.iban)}`,
    })),
    { value: NEW_RECIPIENT, label: "Someone new", description: "Enter their name and IBAN" },
  ];

  return (
    <main style={styles.screen} aria-labelledby={`${formId}-title`}>
      <div style={styles.column}>
        <header style={styles.header}>
          {canGoBack && <IconButton icon="arrow-left" label="Back" onClick={goBack} />}
          {state.step !== "done" && (
            <Text variant="label-sm" tone="secondary">
              Step {stepIndex + 1} of {STEP_ORDER.length}
            </Text>
          )}
        </header>

        <Heading
          level={1}
          size="lg"
          id={`${formId}-title`}
          tabIndex={-1}
          style={styles.focusTarget}
        >
          {STEP_TITLES[state.step]}
        </Heading>

        {/* Step 1: recipient */}
        {state.step === "recipient" && (
          <form noValidate onSubmit={submitRecipient} style={styles.stack}>
            <RadioGroup
              label="Choose a recipient"
              name="recipient"
              options={recipientOptions}
              value={state.recipientChoice}
              onValueChange={(value) => {
                setRecipientTouched(false);
                dispatch({ type: "set", patch: { recipientChoice: value } });
              }}
            />

            {isNewRecipient && (
              <div style={styles.tight}>
                <TextField
                  id={`${formId}-name`}
                  label="Full name"
                  hint="As it appears on their bank account"
                  autoComplete="off"
                  autoCapitalize="words"
                  maxLength={70}
                  value={state.newName}
                  onChange={(e) => dispatch({ type: "set", patch: { newName: e.target.value } })}
                  error={recipientTouched ? nameError : undefined}
                />
                <TextField
                  id={`${formId}-iban`}
                  label="IBAN"
                  hint="26 characters, starts with TR"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  numeric
                  maxLength={34}
                  value={state.newIban}
                  onChange={(e) =>
                    dispatch({ type: "set", patch: { newIban: e.target.value.toUpperCase() } })
                  }
                  error={recipientTouched ? ibanError : undefined}
                />
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" fullWidth iconEnd="arrow-right">
              Continue
            </Button>
          </form>
        )}

        {/* Step 2: amount */}
        {state.step === "amount" && (
          <form noValidate onSubmit={submitAmount} style={styles.stack}>
            <Card variant="outlined" padding="md">
              <div style={styles.inline}>
                <Avatar name={recipientName} decorative />
                <div>
                  <Text as="p" variant="label-md">
                    {recipientName}
                  </Text>
                  <Text as="p" variant="body-sm" tone="secondary">
                    {bankNameOf(recipientIban)}, {maskIban(recipientIban)}
                  </Text>
                </div>
              </div>
            </Card>

            <div style={styles.tight}>
              <TextField
                id={`${formId}-amount`}
                label="Amount"
                prefix="₺"
                inputMode="decimal"
                numeric
                autoComplete="off"
                autoFocus
                value={state.amountInput}
                onChange={(e) =>
                  dispatch({ type: "set", patch: { amountInput: sanitizeAmountInput(e.target.value) } })
                }
                hint={
                  <>
                    You have {money(account.balanceKurus)} in your {account.name}. You can send{" "}
                    {money(dailyRemainingKurus)} more today.
                  </>
                }
                error={amountTouched ? amountError : undefined}
              />

              <Text as="p" variant="body-md" tone="secondary">
                {feeKurus === 0 ? (
                  <>Fee: {money(0)}. Transfers to Leeward accounts are free and arrive in seconds.</>
                ) : (
                  <>
                    Fee: {money(feeKurus)}. Transfers to {bankNameOf(recipientIban)} go by FAST and
                    usually arrive within minutes.
                  </>
                )}
              </Text>
            </div>

            <TextField
              label="Description"
              optional
              hint="The recipient sees this on their statement"
              maxLength={MAX_DESCRIPTION_LENGTH}
              value={state.description}
              onChange={(e) => dispatch({ type: "set", patch: { description: e.target.value } })}
            />

            <Button type="submit" variant="primary" size="lg" fullWidth iconEnd="arrow-right">
              Review transfer
            </Button>
          </form>
        )}

        {/* Step 3: review */}
        {state.step === "review" && draft && (
          <div style={styles.stack}>
            <Card as="section" variant="elevated" padding="lg" aria-labelledby={`${formId}-to`}>
              <div style={styles.stack}>
                <div style={styles.inline}>
                  <Avatar name={draft.recipientName} size="lg" decorative />
                  <div>
                    <Heading level={2} size="sm" id={`${formId}-to`}>
                      {draft.recipientName}
                    </Heading>
                    <Text as="p" variant="body-sm" tone="secondary">
                      {bankNameOf(draft.iban)}
                    </Text>
                  </div>
                </div>

                <dl style={styles.summaryList}>
                  <SummaryRow label="IBAN">
                    <Text as="span" variant="body-md" tabular>
                      {formatIban(draft.iban)}
                    </Text>
                  </SummaryRow>
                  {draft.description && (
                    <SummaryRow label="Description">
                      <Text as="span" variant="body-md">
                        {draft.description}
                      </Text>
                    </SummaryRow>
                  )}
                  <hr style={styles.divider} />
                  <SummaryRow label="Amount">
                    <AmountDisplay value={toLira(draft.amountKurus)} currency={CURRENCY} locale={LOCALE} direction="neutral" size="md" />
                  </SummaryRow>
                  <SummaryRow label="Fee">
                    <AmountDisplay value={toLira(draft.feeKurus)} currency={CURRENCY} locale={LOCALE} direction="neutral" size="md" />
                  </SummaryRow>
                  <hr style={styles.divider} />
                  <SummaryRow label="Total from your account">
                    <AmountDisplay value={toLira(totalKurus)} currency={CURRENCY} locale={LOCALE} direction="outgoing" size="md" />
                  </SummaryRow>
                </dl>
              </div>
            </Card>

            <div style={styles.inline}>
              <Icon name="clock" size="sm" />
              <Text as="p" variant="body-sm" tone="secondary">
                {draft.feeKurus === 0
                  ? "Your money arrives in seconds."
                  : "Your money usually arrives within minutes."}
              </Text>
            </div>

            {requestError && <ErrorNotice>{requestError}</ErrorNotice>}

            <div style={styles.tight}>
              <Text as="p" variant="body-sm" tone="secondary">
                Next, we'll text a {OTP_LENGTH}-digit code to •••• {account.phoneLast4} to confirm it's you.
              </Text>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                iconStart="arrow-up-right"
                loading={requestingOtp}
                onClick={() => void requestOtp()}
              >
                {`Send ${money(draft.amountKurus)}`}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: verify */}
        {state.step === "verify" && draft && (
          <form
            noValidate
            style={styles.stack}
            onSubmit={(e) => {
              e.preventDefault();
              void verify(code);
            }}
          >
            <Text as="p" variant="body-md" tone="secondary">
              To send {money(draft.amountKurus)} to {draft.recipientName}, enter the code we texted
              you. {money(totalKurus)} leaves your account in total.
            </Text>

            <OTPInput
              label="Verification code"
              length={OTP_LENGTH}
              locale={LOCALE}
              name="otp"
              autoFocus
              value={code}
              onChange={(value) => {
                setCode(value);
                if (codeError && !locked) setCodeError(null);
              }}
              onComplete={(value) => void verify(value)}
              disabled={verifying || locked}
              hint={
                expired
                  ? "This code has expired."
                  : `We sent a code to •••• ${account.phoneLast4}. It works for ${Math.floor(expiresIn / 60)}:${String(expiresIn % 60).padStart(2, "0")} more.`
              }
              error={codeError ?? undefined}
            />

            <div style={styles.inline}>
              {attemptsUsed > 0 && !locked && (
                <Badge tone="warning">
                  {`${OTP_MAX_ATTEMPTS - attemptsUsed} of ${OTP_MAX_ATTEMPTS} tries left`}
                </Badge>
              )}
            </div>

            <div style={styles.tight}>
              {locked || expired ? (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  iconStart="refresh"
                  loading={requestingOtp}
                  onClick={() => void resendCode()}
                >
                  Send a new code
                </Button>
              ) : (
                <>
                  <Button type="submit" variant="primary" size="lg" fullWidth iconStart="lock" loading={verifying}>
                    {`Confirm and send ${money(draft.amountKurus)}`}
                  </Button>
                  <Button
                    variant="ghost"
                    fullWidth
                    disabled={resendIn > 0 || verifying}
                    loading={requestingOtp}
                    onClick={() => void resendCode()}
                  >
                    {resendIn > 0 ? `Send a new code in ${resendIn}s` : "Send a new code"}
                  </Button>
                </>
              )}
              {requestError && <ErrorNotice>{requestError}</ErrorNotice>}
            </div>
          </form>
        )}

        {/* Done */}
        {state.step === "done" && draft && (
          <div style={styles.stack}>
            <Card as="section" variant="elevated" padding="lg" aria-labelledby={`${formId}-receipt`}>
              <div style={styles.stack}>
                <div style={styles.inline}>
                  <Badge tone="success">Sent</Badge>
                  <Text as="p" variant="body-md">
                    {draft.recipientName} gets {money(draft.amountKurus)}{" "}
                    {draft.feeKurus === 0 ? "in a few seconds." : "within a few minutes."}
                  </Text>
                </div>
                <Heading level={2} size="xs" id={`${formId}-receipt`}>
                  Receipt
                </Heading>
                <dl style={styles.summaryList}>
                  <SummaryRow label="To">
                    <Text as="span" variant="body-md">
                      {draft.recipientName}
                    </Text>
                  </SummaryRow>
                  <SummaryRow label="IBAN">
                    <Text as="span" variant="body-md" tabular>
                      {maskIban(draft.iban)}
                    </Text>
                  </SummaryRow>
                  <SummaryRow label="Amount">
                    <AmountDisplay value={toLira(draft.amountKurus)} currency={CURRENCY} locale={LOCALE} direction="neutral" size="md" />
                  </SummaryRow>
                  <SummaryRow label="Fee">
                    <AmountDisplay value={toLira(draft.feeKurus)} currency={CURRENCY} locale={LOCALE} direction="neutral" size="md" />
                  </SummaryRow>
                  <SummaryRow label="Total from your account">
                    <AmountDisplay value={toLira(totalKurus)} currency={CURRENCY} locale={LOCALE} direction="outgoing" size="md" />
                  </SummaryRow>
                  <SummaryRow label="Reference">
                    <Text as="span" variant="body-md" tabular>
                      {state.reference}
                    </Text>
                  </SummaryRow>
                </dl>
              </div>
            </Card>

            <Button variant="primary" size="lg" fullWidth onClick={startOver}>
              Make another transfer
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
