/**
 * TransferScreen: send Turkish lira to a saved or new recipient.
 *
 * Flow: Recipient, Amount, Review, Confirm (SMS one-time code), then a receipt.
 *
 * Expects the app root to load the Leeward styles and set the theme:
 *   import "@leeward/react/fonts.css";
 *   import "@leeward/react/styles.css";
 *   <div data-brand="leeward" data-theme="light">...</div>
 *
 * Mock data:
 *   - The one-time code is 123456. Any other code counts as a wrong try (3 tries per code).
 *   - A valid new IBAN to try: TR33 0006 1005 1978 6457 8413 26.
 *   - Transfers between Leeward accounts are free. Other banks cost ₺6,50.
 */
import {
  type FormEvent,
  type ReactNode,
  type CSSProperties,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Alert,
  AmountDisplay,
  AmountInput,
  Avatar,
  Button,
  Card,
  Checkbox,
  Divider,
  EmptyState,
  Heading,
  Icon,
  List,
  ListItem,
  OTPInput,
  SegmentedControl,
  Skeleton,
  Stepper,
  Text,
  TextField,
  formatIban,
  maskIban,
} from "@leeward/react";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type Recipient = {
  id: string;
  name: string;
  /** Normalized: uppercase, no spaces. */
  iban: string;
  bankName: string;
  isLeeward: boolean;
};

type Account = {
  name: string;
  iban: string;
  /** Available balance in kuruş, so money math stays in integers. */
  balanceKurus: number;
  /** Masked phone number the SMS code goes to. */
  maskedPhone: string;
};

type Step = "recipient" | "amount" | "review" | "verify" | "done";

type RecipientsState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; recipients: Recipient[] };

type CodeSession = { transferId: string; resendAvailableAt: number };

type ConfirmResult =
  | { status: "sent"; reference: string; sentAt: number }
  | { status: "wrong-code"; attemptsLeft: number }
  | { status: "locked" }
  | { status: "expired" };

export type TransferScreenProps = {
  /** Called when the person leaves the flow, from the close button or the receipt. */
  onClose?: () => void;
};

/* -------------------------------------------------------------------------- */
/* Constants and mock data                                                    */
/* -------------------------------------------------------------------------- */

const CURRENCY = "TRY";
const LOCALE = "tr-TR";
const IBAN_LENGTH_TR = 26;
const LEEWARD_BANK_CODE = "00829";
const OTHER_BANK_FEE_KURUS = 650;
const MIN_AMOUNT_KURUS = 100;
const DESCRIPTION_MAX_LENGTH = 140;
const CODE_LENGTH = 6;
const CODE_TTL_MS = 3 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_CODE_ATTEMPTS = 3;

const STEP_NAMES = ["Recipient", "Amount", "Review", "Confirm"];
const STEP_INDEX: Record<Exclude<Step, "done">, number> = {
  recipient: 0,
  amount: 1,
  review: 2,
  verify: 3,
};

/** Bank codes are digits 5 to 9 of a Turkish IBAN. */
const BANKS_BY_CODE: Record<string, string> = {
  [LEEWARD_BANK_CODE]: "Leeward",
  "00010": "Ziraat Bankası",
  "00046": "Akbank",
  "00062": "Garanti BBVA",
  "00064": "Türkiye İş Bankası",
  "00067": "Yapı Kredi",
};

const MOCK_ACCOUNT: Account = {
  name: "Main account",
  iban: "TR120082900000000045712388",
  balanceKurus: 2_458_035,
  maskedPhone: "•••• 4821",
};

const MOCK_RECIPIENTS: Recipient[] = [
  { id: "r1", name: "Deniz Yılmaz", iban: "TR720082900000000011904577", bankName: "Leeward", isLeeward: true },
  { id: "r2", name: "Ayşe Kaya", iban: "TR330006200001298745630012", bankName: "Garanti BBVA", isLeeward: false },
  { id: "r3", name: "Mehmet Demir", iban: "TR670006400000883412075566", bankName: "Türkiye İş Bankası", isLeeward: false },
  { id: "r4", name: "Elif Şahin", iban: "TR130004600007710345982201", bankName: "Akbank", isLeeward: false },
  { id: "r5", name: "Can Öztürk", iban: "TR740006700000569021347789", bankName: "Yapı Kredi", isLeeward: false },
];

const MOCK_VALID_CODE = "123456";

/* -------------------------------------------------------------------------- */
/* Mock API                                                                   */
/* -------------------------------------------------------------------------- */

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

type MockCodeSession = {
  code: string;
  expiresAt: number;
  attemptsLeft: number;
  result?: ConfirmResult;
};

const mockSessions = new Map<string, MockCodeSession>();

const mockApi = {
  async fetchRecipients(signal?: AbortSignal): Promise<Recipient[]> {
    await wait(700, signal);
    return MOCK_RECIPIENTS.map((recipient) => ({ ...recipient }));
  },

  /** Sends a new SMS code for a transfer. A new code replaces the old one. */
  async requestCode(transferId: string, signal?: AbortSignal): Promise<void> {
    await wait(600, signal);
    const existing = mockSessions.get(transferId);
    if (existing?.result?.status === "sent") return;
    mockSessions.set(transferId, {
      code: MOCK_VALID_CODE,
      expiresAt: Date.now() + CODE_TTL_MS,
      attemptsLeft: MAX_CODE_ATTEMPTS,
    });
  },

  /**
   * Checks the code and sends the money. `transferId` is the idempotency key:
   * repeating a call for a sent transfer returns the same result and never sends twice.
   */
  async confirmTransfer(transferId: string, code: string, signal?: AbortSignal): Promise<ConfirmResult> {
    await wait(900, signal);
    const session = mockSessions.get(transferId);
    if (!session) return { status: "expired" };
    if (session.result?.status === "sent") return session.result;
    if (session.attemptsLeft <= 0) return { status: "locked" };
    if (Date.now() > session.expiresAt) return { status: "expired" };

    if (code !== session.code) {
      session.attemptsLeft -= 1;
      return session.attemptsLeft > 0 ? { status: "wrong-code", attemptsLeft: session.attemptsLeft } : { status: "locked" };
    }

    const result: ConfirmResult = {
      status: "sent",
      reference: `LW${transferId.replace(/-/g, "").slice(0, 10).toUpperCase()}`,
      sentAt: Date.now(),
    };
    session.result = result;
    return result;
  },
};

/* -------------------------------------------------------------------------- */
/* Money and IBAN helpers                                                     */
/* -------------------------------------------------------------------------- */

const toKurus = (lira: number): number => Math.round(lira * 100);
const toLira = (kurus: number): number => kurus / 100;

function feeKurusFor(recipient: Recipient): number {
  return recipient.isLeeward ? 0 : OTHER_BANK_FEE_KURUS;
}

function normalizeIban(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

/** ISO 13616 mod 97 check: move the first four characters to the end, letters become 10 to 35. */
function hasValidChecksum(iban: string): boolean {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const char of rearranged) {
    const digits = /[A-Z]/.test(char) ? String(char.charCodeAt(0) - 55) : char;
    for (const digit of digits) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }
  return remainder === 1;
}

function validateIban(raw: string, ownIban: string): string | undefined {
  const iban = normalizeIban(raw);
  if (iban.length === 0) return "Enter the IBAN of the person you are paying.";
  if (!iban.startsWith("TR")) return "Turkish IBANs start with TR. Check it and try again.";
  if (!/^TR\d+$/.test(iban)) return "After TR, an IBAN has only numbers. Check it and try again.";
  if (iban.length < IBAN_LENGTH_TR) return "This IBAN is too short. Check it and try again.";
  if (iban.length > IBAN_LENGTH_TR) return "This IBAN is too long. Check it and try again.";
  if (!hasValidChecksum(iban)) return "This IBAN has a typo somewhere. Check each number and try again.";
  if (iban === ownIban) return "This is your own account. Enter the IBAN of the person you are paying.";
  return undefined;
}

function validateName(raw: string): string | undefined {
  const name = raw.trim().replace(/\s+/g, " ");
  if (name.length === 0) return "Enter the full name of the person you are paying.";
  if (!/^[\p{L}][\p{L}' .-]*$/u.test(name)) return "Use letters only. Check the name and try again.";
  if (name.split(" ").length < 2) return "Enter their first and last name, as their bank has it.";
  return undefined;
}

function bankFromIban(iban: string): { bankName: string; isLeeward: boolean } {
  const code = iban.slice(4, 9);
  return { bankName: BANKS_BY_CODE[code] ?? "Another bank", isLeeward: code === LEEWARD_BANK_CODE };
}

function createTransferId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function arrivalCopy(recipient: Recipient): string {
  return recipient.isLeeward ? "In seconds" : "In a few minutes";
}

/* -------------------------------------------------------------------------- */
/* Hooks                                                                      */
/* -------------------------------------------------------------------------- */

function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Current time, ticking every second while `active`. */
function useNow(active: boolean): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [active]);
  return now;
}

/** One AbortController per component, aborted on unmount. */
function useAbortSignal(): () => AbortSignal {
  const controllers = useRef(new Set<AbortController>());
  useEffect(() => {
    const active = controllers.current;
    return () => {
      active.forEach((controller) => controller.abort());
      active.clear();
    };
  }, []);
  return useCallback(() => {
    const controller = new AbortController();
    controllers.current.add(controller);
    return controller.signal;
  }, []);
}

/* -------------------------------------------------------------------------- */
/* Layout                                                                     */
/* -------------------------------------------------------------------------- */

const styles = {
  page: {
    minHeight: "100%",
    background: "var(--lw-fill-surface-canvas)",
    color: "var(--lw-text-default)",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--lw-space-lg)",
    maxWidth: "var(--lw-size-content-sm)",
    marginInline: "auto",
    paddingBlock: "var(--lw-space-lg) var(--lw-space-xl)",
    paddingInline: "var(--lw-space-md)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--lw-space-sm)",
    minHeight: "var(--lw-size-control-md)",
  },
  section: { display: "flex", flexDirection: "column", gap: "var(--lw-space-lg)" },
  group: { display: "flex", flexDirection: "column", gap: "var(--lw-space-sm)" },
  actions: { display: "flex", flexDirection: "column", gap: "var(--lw-space-sm)" },
  summaryList: { display: "flex", flexDirection: "column", gap: "var(--lw-space-sm)", margin: "var(--lw-space-none)" },
  summaryRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: "var(--lw-space-md)",
  },
  summaryValue: { margin: "var(--lw-space-none)", textAlign: "end", overflowWrap: "anywhere" },
  centered: { display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--lw-space-sm)", textAlign: "center" },
  skeletonRow: { display: "flex", alignItems: "center", gap: "var(--lw-space-sm)", padding: "var(--lw-space-sm) var(--lw-space-md)" },
  skeletonText: { flex: 1 },
} satisfies Record<string, CSSProperties>;

const STEP_HEADING_ID = "transfer-step-heading";

/* -------------------------------------------------------------------------- */
/* Shared pieces                                                              */
/* -------------------------------------------------------------------------- */

function StepHeading({ children, description }: { children: ReactNode; description?: ReactNode }) {
  return (
    <div style={styles.group}>
      <Heading level={2} size="h3" id={STEP_HEADING_ID} tabIndex={-1}>
        {children}
      </Heading>
      {description ? <Text tone="secondary">{description}</Text> : null}
    </div>
  );
}

function SummaryRow({ label, children, emphasis = false }: { label: string; children: ReactNode; emphasis?: boolean }) {
  return (
    <div style={styles.summaryRow}>
      <Text as="dt" variant={emphasis ? "label-lg" : "body-md"} tone={emphasis ? "primary" : "secondary"}>
        {label}
      </Text>
      <Text as="dd" variant={emphasis ? "label-lg" : "body-md"} style={styles.summaryValue}>
        {children}
      </Text>
    </div>
  );
}

function Money({ kurus, direction = "neutral", size = "md" }: { kurus: number; direction?: "outgoing" | "neutral"; size?: "sm" | "md" | "lg" }) {
  return <AmountDisplay value={toLira(kurus)} currency={CURRENCY} locale={LOCALE} direction={direction} size={size} />;
}

function FeeValue({ recipient }: { recipient: Recipient }) {
  const feeKurus = feeKurusFor(recipient);
  return (
    <>
      <Money kurus={feeKurus} />
      {feeKurus === 0 ? (
        <Text as="span" variant="caption" tone="secondary" style={{ display: "block" }}>
          Free between Leeward accounts
        </Text>
      ) : null}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 1: Recipient                                                          */
/* -------------------------------------------------------------------------- */

type RecipientMode = "saved" | "new";

type NewRecipientDraft = { name: string; iban: string; save: boolean };

function RecipientStep({
  recipientsState,
  onRetry,
  onChoose,
  account,
  draft,
  onDraftChange,
}: {
  recipientsState: RecipientsState;
  onRetry: () => void;
  onChoose: (recipient: Recipient, saveAsNew: boolean) => void;
  account: Account;
  draft: NewRecipientDraft;
  onDraftChange: (draft: NewRecipientDraft) => void;
}) {
  const [mode, setMode] = useState<RecipientMode>(() => (draft.name || draft.iban ? "new" : "saved"));
  const [query, setQuery] = useState("");
  const [touched, setTouched] = useState({ name: false, iban: false });
  const [submitted, setSubmitted] = useState(false);
  const fieldId = useId();
  const nameId = `${fieldId}-name`;
  const ibanId = `${fieldId}-iban`;

  const nameError = submitted || touched.name ? validateName(draft.name) : undefined;
  const ibanError = submitted || touched.iban ? validateIban(draft.iban, account.iban) : undefined;

  const filtered = useMemo(() => {
    if (recipientsState.status !== "ready") return [];
    const needle = query.trim().toLocaleLowerCase(LOCALE);
    if (!needle) return recipientsState.recipients;
    const ibanNeedle = normalizeIban(needle);
    return recipientsState.recipients.filter(
      (recipient) =>
        recipient.name.toLocaleLowerCase(LOCALE).includes(needle) ||
        recipient.bankName.toLocaleLowerCase(LOCALE).includes(needle) ||
        (ibanNeedle.length >= 4 && recipient.iban.includes(ibanNeedle)),
    );
  }, [recipientsState, query]);

  function handleNewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const nextNameError = validateName(draft.name);
    const nextIbanError = validateIban(draft.iban, account.iban);
    if (nextNameError || nextIbanError) {
      document.getElementById(nextNameError ? nameId : ibanId)?.focus();
      return;
    }

    const iban = normalizeIban(draft.iban);
    const existing = recipientsState.status === "ready" ? recipientsState.recipients.find((r) => r.iban === iban) : undefined;
    if (existing) {
      onChoose(existing, false);
      return;
    }
    const name = draft.name.trim().replace(/\s+/g, " ");
    onChoose({ id: `new-${iban}`, name, iban, ...bankFromIban(iban) }, draft.save);
  }

  return (
    <section style={styles.section} aria-labelledby={STEP_HEADING_ID}>
      <StepHeading>Who are you paying?</StepHeading>

      <SegmentedControl
        label="Recipient type"
        value={mode}
        onValueChange={(value) => setMode(value as RecipientMode)}
        fullWidth
        options={[
          { value: "saved", label: "Saved" },
          { value: "new", label: "New" },
        ]}
      />

      {mode === "saved" ? (
        <SavedRecipients
          state={recipientsState}
          recipients={filtered}
          query={query}
          onQueryChange={setQuery}
          onRetry={onRetry}
          onChoose={(recipient) => onChoose(recipient, false)}
          onAddNew={() => setMode("new")}
        />
      ) : (
        <form noValidate onSubmit={handleNewSubmit} style={styles.section}>
          <div style={styles.group}>
            <TextField
              id={nameId}
              label="Full name"
              hint="First and last name, as their bank has it"
              autoComplete="off"
              autoCapitalize="words"
              value={draft.name}
              onChange={(event) => onDraftChange({ ...draft, name: event.target.value })}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              {...(nameError ? { error: nameError } : {})}
            />
            <TextField
              id={ibanId}
              label="IBAN"
              hint="26 characters, starts with TR"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              numeric
              value={draft.iban}
              onChange={(event) => onDraftChange({ ...draft, iban: event.target.value.toUpperCase() })}
              onBlur={() => {
                setTouched((t) => ({ ...t, iban: true }));
                const iban = normalizeIban(draft.iban);
                if (iban.length === IBAN_LENGTH_TR) onDraftChange({ ...draft, iban: formatIban(iban) });
              }}
              {...(ibanError ? { error: ibanError } : {})}
            />
            <Checkbox
              label="Save this person as a recipient"
              checked={draft.save}
              onCheckedChange={(checked) => onDraftChange({ ...draft, save: checked === true })}
            />
          </div>
          <Button type="submit" variant="primary" size="lg" fullWidth>
            Continue
          </Button>
        </form>
      )}
    </section>
  );
}

function SavedRecipients({
  state,
  recipients,
  query,
  onQueryChange,
  onRetry,
  onChoose,
  onAddNew,
}: {
  state: RecipientsState;
  recipients: Recipient[];
  query: string;
  onQueryChange: (query: string) => void;
  onRetry: () => void;
  onChoose: (recipient: Recipient) => void;
  onAddNew: () => void;
}) {
  if (state.status === "loading") {
    return (
      <Card variant="outlined" padding="none">
        <div role="status" aria-busy="true" aria-label="Loading your recipients">
          {[0, 1, 2].map((row) => (
            <div key={row} style={styles.skeletonRow}>
              <Skeleton shape="circle" width="var(--lw-size-avatar-md)" height="var(--lw-size-avatar-md)" />
              <div style={styles.skeletonText}>
                <Skeleton lines={2} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (state.status === "error") {
    return (
      <Alert
        tone="danger"
        title="We could not load your recipients"
        actions={
          <Button size="sm" variant="secondary" iconStart="refresh" onClick={onRetry}>
            Try again
          </Button>
        }
      >
        Check your connection and try again. You can also pay someone new with their IBAN.
      </Alert>
    );
  }

  if (state.recipients.length === 0) {
    return (
      <EmptyState
        icon="users"
        title="No saved recipients yet"
        description="Pay someone new with their name and IBAN. You can save them for next time."
        headingLevel={3}
        action={
          <Button variant="secondary" iconStart="user-plus" onClick={onAddNew}>
            Add a new recipient
          </Button>
        }
      />
    );
  }

  return (
    <div style={styles.group}>
      <TextField
        label="Search recipients"
        type="search"
        autoComplete="off"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      {recipients.length === 0 ? (
        <EmptyState
          icon="search"
          title="No recipients match your search"
          description="Check the spelling, or pay someone new with their IBAN."
          headingLevel={3}
          action={
            <Button variant="secondary" iconStart="user-plus" onClick={onAddNew}>
              Add a new recipient
            </Button>
          }
        />
      ) : (
        <Card variant="outlined" padding="none">
          <List aria-label="Saved recipients">
            {recipients.map((recipient) => (
              <ListItem
                key={recipient.id}
                title={recipient.name}
                description={`${recipient.bankName} · ${maskIban(recipient.iban)}`}
                leading={<Avatar name={recipient.name} decorative />}
                onClick={() => onChoose(recipient)}
                chevron
              />
            ))}
          </List>
        </Card>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 2: Amount                                                             */
/* -------------------------------------------------------------------------- */

function amountError(amountKurus: number | null, maxKurus: number, feeKurus: number): ReactNode | undefined {
  if (amountKurus === null) return "Enter the amount you want to send.";
  if (amountKurus < MIN_AMOUNT_KURUS) {
    return (
      <>
        The smallest amount you can send is <Money kurus={MIN_AMOUNT_KURUS} size="sm" />.
      </>
    );
  }
  if (amountKurus > maxKurus) {
    return (
      <>
        This is more than you have. You can send up to <Money kurus={maxKurus} size="sm" />
        {feeKurus > 0 ? " after the fee." : "."}
      </>
    );
  }
  return undefined;
}

function AmountStep({
  recipient,
  account,
  amount,
  onAmountChange,
  description,
  onDescriptionChange,
  onChangeRecipient,
  onContinue,
}: {
  recipient: Recipient;
  account: Account;
  amount: number | null;
  onAmountChange: (amount: number | null) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  onChangeRecipient: () => void;
  onContinue: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const amountId = useId();
  const feeKurus = feeKurusFor(recipient);
  const maxKurus = Math.max(0, account.balanceKurus - feeKurus);
  const amountKurus = amount === null ? null : toKurus(amount);
  const error = submitted ? amountError(amountKurus, maxKurus, feeKurus) : undefined;
  const totalKurus = (amountKurus ?? 0) + feeKurus;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (amountError(amountKurus, maxKurus, feeKurus)) {
      document.getElementById(amountId)?.focus();
      return;
    }
    onContinue();
  }

  return (
    <section style={styles.section} aria-labelledby={STEP_HEADING_ID}>
      <StepHeading>How much are you sending?</StepHeading>

      <Card variant="outlined" padding="none">
        <List aria-label="Recipient">
          <ListItem
            title={recipient.name}
            description={`${recipient.bankName} · ${maskIban(recipient.iban)}`}
            leading={<Avatar name={recipient.name} decorative />}
            trailing={
              <Button size="sm" variant="ghost" onClick={onChangeRecipient} aria-label={`Change recipient, currently ${recipient.name}`}>
                Change
              </Button>
            }
          />
        </List>
      </Card>

      <form noValidate onSubmit={handleSubmit} style={styles.section}>
        <div style={styles.group}>
          <AmountInput
            id={amountId}
            label="Amount"
            currency={CURRENCY}
            locale={LOCALE}
            value={amount}
            onValueChange={onAmountChange}
            min={toLira(MIN_AMOUNT_KURUS)}
            max={toLira(maxKurus)}
            hint={
              <>
                Available: <Money kurus={account.balanceKurus} size="sm" />
              </>
            }
            {...(error ? { error } : {})}
          />
          <TextField
            label="Description"
            optional
            hint="Shown to the recipient on their statement"
            maxLength={DESCRIPTION_MAX_LENGTH}
            autoComplete="off"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
          />
        </div>

        <Card variant="filled" padding="md">
          <dl style={styles.summaryList} aria-label="Cost of this transfer">
            <SummaryRow label="Fee">
              <FeeValue recipient={recipient} />
            </SummaryRow>
            <SummaryRow label="Total from your account" emphasis>
              <Money kurus={totalKurus} />
            </SummaryRow>
          </dl>
        </Card>

        <Button type="submit" variant="primary" size="lg" fullWidth>
          Review transfer
        </Button>
      </form>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 3: Review                                                             */
/* -------------------------------------------------------------------------- */

function ReviewStep({
  recipient,
  account,
  amountKurus,
  description,
  requesting,
  requestFailed,
  onConfirm,
}: {
  recipient: Recipient;
  account: Account;
  amountKurus: number;
  description: string;
  requesting: boolean;
  requestFailed: boolean;
  onConfirm: () => void;
}) {
  const feeKurus = feeKurusFor(recipient);

  return (
    <section style={styles.section} aria-labelledby={STEP_HEADING_ID}>
      <StepHeading description="Check the details. Money sent to the wrong IBAN can be hard to get back.">
        Check your transfer
      </StepHeading>

      <Card as="section" variant="outlined" padding="lg" aria-label="Transfer details">
        <div style={styles.section}>
          <dl style={styles.summaryList}>
            <SummaryRow label="To">{recipient.name}</SummaryRow>
            <SummaryRow label="IBAN">
              <Text as="span" variant="code" tabular>
                {formatIban(recipient.iban)}
              </Text>
            </SummaryRow>
            <SummaryRow label="Bank">{recipient.bankName}</SummaryRow>
            <SummaryRow label="From">
              {account.name}, {maskIban(account.iban)}
            </SummaryRow>
            {description.trim() ? <SummaryRow label="Description">{description.trim()}</SummaryRow> : null}
            <SummaryRow label="Arrives">{arrivalCopy(recipient)}</SummaryRow>
          </dl>
          <Divider />
          <dl style={styles.summaryList}>
            <SummaryRow label="Amount">
              <Money kurus={amountKurus} />
            </SummaryRow>
            <SummaryRow label="Fee">
              <FeeValue recipient={recipient} />
            </SummaryRow>
            <SummaryRow label="Total from your account" emphasis>
              <Money kurus={amountKurus + feeKurus} direction="outgoing" />
            </SummaryRow>
          </dl>
        </div>
      </Card>

      {requestFailed ? (
        <Alert tone="danger" title="We could not send your code">
          Nothing left your account. Check your connection and try again.
        </Alert>
      ) : null}

      <div style={styles.actions}>
        <Button variant="primary" size="lg" fullWidth iconStart="smartphone" loading={requesting} onClick={onConfirm}>
          Send code by SMS
        </Button>
        <Text variant="body-sm" tone="secondary" style={{ textAlign: "center" }}>
          We text a 6-digit code to {account.maskedPhone} to confirm it is you.
        </Text>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 4: Verify                                                             */
/* -------------------------------------------------------------------------- */

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function VerifyStep({
  recipient,
  account,
  totalKurus,
  session,
  onResend,
  resending,
  resendFailed,
  onConfirm,
}: {
  recipient: Recipient;
  account: Account;
  totalKurus: number;
  session: CodeSession;
  onResend: () => Promise<boolean>;
  resending: boolean;
  resendFailed: boolean;
  onConfirm: (code: string) => Promise<ConfirmResult | "failed">;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [locked, setLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const submittingRef = useRef(false);
  const otpId = useId();

  // Tick only while the resend cooldown runs.
  const now = useNow(session.resendAvailableAt > Date.now());
  const resendInMs = session.resendAvailableAt - now;

  async function submit(value: string) {
    if (submittingRef.current || locked) return;
    if (value.length < CODE_LENGTH) {
      setError(`Enter all ${CODE_LENGTH} digits of the code.`);
      document.getElementById(otpId)?.focus();
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    setError(undefined);
    setSendFailed(false);
    try {
      const result = await onConfirm(value);
      if (result === "failed") {
        setSendFailed(true);
        return;
      }
      switch (result.status) {
        case "sent":
          return;
        case "wrong-code":
          setError(
            `This code does not match. Check the SMS and try again. ${result.attemptsLeft} ${
              result.attemptsLeft === 1 ? "try" : "tries"
            } left.`,
          );
          return;
        case "expired":
          setError("This code has expired. Send a new code and try again.");
          return;
        case "locked":
          setLocked(true);
          return;
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  async function resend() {
    const ok = await onResend();
    if (ok) {
      setCode("");
      setError(undefined);
      setLocked(false);
      setSendFailed(false);
      document.getElementById(otpId)?.focus();
    }
  }

  return (
    <section style={styles.section} aria-labelledby={STEP_HEADING_ID}>
      <StepHeading
        description={
          <>
            You are sending <Money kurus={totalKurus} size="sm" /> to {recipient.name}, fee included.
          </>
        }
      >
        Enter your code
      </StepHeading>

      <form
        noValidate
        style={styles.section}
        onSubmit={(event) => {
          event.preventDefault();
          void submit(code);
        }}
      >
        <OTPInput
          id={otpId}
          label="Verification code"
          length={CODE_LENGTH}
          locale={LOCALE}
          hint={`We sent a code to ${account.maskedPhone}. It expires in 3 minutes.`}
          value={code}
          onChange={(value) => {
            setCode(value);
            if (error) setError(undefined);
          }}
          onComplete={(value) => void submit(value)}
          disabled={locked}
          autoFocus
          {...(error ? { error } : {})}
        />

        {locked ? (
          <Alert tone="danger" live="alert" title="Too many wrong codes">
            Nothing left your account. Send a new code to try again.
          </Alert>
        ) : null}

        {sendFailed ? (
          <Alert tone="danger" live="alert" title="We could not send your money">
            Nothing left your account. Check your connection and try again.
          </Alert>
        ) : null}

        {resendFailed ? (
          <Alert tone="danger" title="We could not send a new code">
            Check your connection and try again.
          </Alert>
        ) : null}

        <div style={styles.actions}>
          <Button type="submit" variant="primary" size="xl" fullWidth iconStart="send" loading={submitting} disabled={locked}>
            Confirm and send
          </Button>
          <Button
            type="button"
            variant="ghost"
            fullWidth
            iconStart="refresh"
            loading={resending}
            disabled={submitting || resendInMs > 0}
            onClick={() => void resend()}
          >
            {resendInMs > 0 ? `Send a new code in ${formatCountdown(resendInMs)}` : "Send a new code"}
          </Button>
        </div>
      </form>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Done                                                                       */
/* -------------------------------------------------------------------------- */

function DoneStep({
  recipient,
  totalKurus,
  amountKurus,
  reference,
  sentAt,
  saved,
  onSendAnother,
  onClose,
}: {
  recipient: Recipient;
  totalKurus: number;
  amountKurus: number;
  reference: string;
  sentAt: number;
  saved: boolean;
  onSendAnother: () => void;
  onClose?: () => void;
}) {
  const sentAtLabel = new Intl.DateTimeFormat(LOCALE, { dateStyle: "long", timeStyle: "short" }).format(sentAt);

  return (
    <section style={styles.section} aria-labelledby={STEP_HEADING_ID}>
      <div style={styles.centered}>
        <Text as="span" tone="success">
          <Icon name="check-circle" size="xl" weight="bold" />
        </Text>
        <Heading level={2} size="h3" id={STEP_HEADING_ID} tabIndex={-1}>
          Money sent
        </Heading>
        <Text tone="secondary">
          {recipient.name} gets <Money kurus={amountKurus} size="sm" /> {arrivalCopy(recipient).toLocaleLowerCase(LOCALE)}.
        </Text>
      </div>

      <Card as="section" variant="outlined" padding="lg" aria-label="Receipt">
        <dl style={styles.summaryList}>
          <SummaryRow label="To">{recipient.name}</SummaryRow>
          <SummaryRow label="Sent">{sentAtLabel}</SummaryRow>
          <SummaryRow label="Reference">
            <Text as="span" variant="code">
              {reference}
            </Text>
          </SummaryRow>
          <SummaryRow label="Total from your account" emphasis>
            <Money kurus={totalKurus} direction="outgoing" />
          </SummaryRow>
        </dl>
      </Card>

      {saved ? (
        <Alert tone="success" title="Recipient saved">
          {recipient.name} is in your saved recipients for next time.
        </Alert>
      ) : null}

      <div style={styles.actions}>
        <Button variant="primary" size="lg" fullWidth iconStart="send" onClick={onSendAnother}>
          Send another transfer
        </Button>
        {onClose ? (
          <Button variant="secondary" size="lg" fullWidth onClick={onClose}>
            Done
          </Button>
        ) : null}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */

const EMPTY_DRAFT: NewRecipientDraft = { name: "", iban: "", save: false };

export default function TransferScreen({ onClose }: TransferScreenProps) {
  const isWide = useMediaQuery("(min-width: 640px)");
  const nextSignal = useAbortSignal();

  const [account, setAccount] = useState<Account>(MOCK_ACCOUNT);
  const [recipientsState, setRecipientsState] = useState<RecipientsState>({ status: "loading" });

  const [step, setStep] = useState<Step>("recipient");
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [saveRecipient, setSaveRecipient] = useState(false);
  const [draft, setDraft] = useState<NewRecipientDraft>(EMPTY_DRAFT);
  const [amount, setAmount] = useState<number | null>(null);
  const [description, setDescription] = useState("");

  const [session, setSession] = useState<CodeSession | null>(null);
  const [requestingCode, setRequestingCode] = useState(false);
  const [requestFailed, setRequestFailed] = useState(false);
  const [receipt, setReceipt] = useState<{ reference: string; sentAt: number; saved: boolean } | null>(null);

  const loadRecipients = useCallback(async () => {
    setRecipientsState({ status: "loading" });
    try {
      const recipients = await mockApi.fetchRecipients(nextSignal());
      setRecipientsState({ status: "ready", recipients });
    } catch (error) {
      if (!isAbortError(error)) setRecipientsState({ status: "error" });
    }
  }, [nextSignal]);

  useEffect(() => {
    void loadRecipients();
  }, [loadRecipients]);

  // Move focus to the new step heading so keyboard and screen reader users start at the top.
  // The verify step focuses the code field instead.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (step !== "verify") document.getElementById(STEP_HEADING_ID)?.focus();
  }, [step]);

  const amountKurus = amount === null ? 0 : toKurus(amount);
  const feeKurus = recipient ? feeKurusFor(recipient) : 0;
  const totalKurus = amountKurus + feeKurus;

  async function requestCode(transferId: string): Promise<boolean> {
    try {
      await mockApi.requestCode(transferId, nextSignal());
      setSession({ transferId, resendAvailableAt: Date.now() + RESEND_COOLDOWN_MS });
      return true;
    } catch (error) {
      if (isAbortError(error)) return false;
      throw error;
    }
  }

  async function handleReviewConfirm() {
    if (requestingCode) return;
    setRequestingCode(true);
    setRequestFailed(false);
    try {
      // A new transfer id per review keeps a stale code from confirming changed details.
      if (await requestCode(createTransferId())) setStep("verify");
    } catch {
      setRequestFailed(true);
    } finally {
      setRequestingCode(false);
    }
  }

  const [resending, setResending] = useState(false);
  const [resendFailed, setResendFailed] = useState(false);

  async function handleResend(): Promise<boolean> {
    if (!session || resending) return false;
    setResending(true);
    setResendFailed(false);
    try {
      return await requestCode(session.transferId);
    } catch {
      setResendFailed(true);
      return false;
    } finally {
      setResending(false);
    }
  }

  async function handleConfirm(code: string): Promise<ConfirmResult | "failed"> {
    if (!session || !recipient) return "failed";
    try {
      const result = await mockApi.confirmTransfer(session.transferId, code, nextSignal());
      if (result.status === "sent") {
        const saved = saveRecipient && recipient.id.startsWith("new-");
        if (saved && recipientsState.status === "ready") {
          setRecipientsState({
            status: "ready",
            recipients: [{ ...recipient, id: `saved-${recipient.iban}` }, ...recipientsState.recipients],
          });
        }
        setAccount((current) => ({ ...current, balanceKurus: current.balanceKurus - totalKurus }));
        setReceipt({ reference: result.reference, sentAt: result.sentAt, saved });
        setSession(null);
        setStep("done");
      }
      return result;
    } catch {
      // Aborts and network failures both mean nothing was sent.
      return "failed";
    }
  }

  function goBack() {
    switch (step) {
      case "amount":
        setStep("recipient");
        break;
      case "review":
        setRequestFailed(false);
        setStep("amount");
        break;
      case "verify":
        // Leaving the code step voids the code: details may change before the next try.
        setSession(null);
        setResendFailed(false);
        setStep("review");
        break;
      default:
        break;
    }
  }

  function startOver() {
    setRecipient(null);
    setSaveRecipient(false);
    setDraft(EMPTY_DRAFT);
    setAmount(null);
    setDescription("");
    setReceipt(null);
    setStep("recipient");
  }

  const canGoBack = step === "amount" || step === "review" || step === "verify";

  return (
    <main style={styles.page}>
      <div style={styles.column}>
        <header style={styles.header}>
          {canGoBack ? (
            <Button variant="ghost" iconStart="arrow-left" onClick={goBack}>
              Back
            </Button>
          ) : (
            <span />
          )}
          {onClose && step !== "done" ? (
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          ) : null}
        </header>

        <Heading level={1} size="title-md">
          Send money
        </Heading>

        {step !== "done" ? (
          <Stepper
            steps={STEP_NAMES}
            current={STEP_INDEX[step]}
            variant={isWide ? "full" : "compact"}
            label="Transfer progress"
          />
        ) : null}

        {step === "recipient" ? (
          <RecipientStep
            recipientsState={recipientsState}
            onRetry={() => void loadRecipients()}
            account={account}
            draft={draft}
            onDraftChange={setDraft}
            onChoose={(chosen, save) => {
              setRecipient(chosen);
              setSaveRecipient(save);
              setStep("amount");
            }}
          />
        ) : null}

        {step === "amount" && recipient ? (
          <AmountStep
            recipient={recipient}
            account={account}
            amount={amount}
            onAmountChange={setAmount}
            description={description}
            onDescriptionChange={setDescription}
            onChangeRecipient={() => setStep("recipient")}
            onContinue={() => setStep("review")}
          />
        ) : null}

        {step === "review" && recipient ? (
          <ReviewStep
            recipient={recipient}
            account={account}
            amountKurus={amountKurus}
            description={description}
            requesting={requestingCode}
            requestFailed={requestFailed}
            onConfirm={() => void handleReviewConfirm()}
          />
        ) : null}

        {step === "verify" && recipient && session ? (
          <VerifyStep
            key={session.transferId}
            recipient={recipient}
            account={account}
            totalKurus={totalKurus}
            session={session}
            onResend={handleResend}
            resending={resending}
            resendFailed={resendFailed}
            onConfirm={handleConfirm}
          />
        ) : null}

        {step === "done" && recipient && receipt ? (
          <DoneStep
            recipient={recipient}
            amountKurus={amountKurus}
            totalKurus={totalKurus}
            reference={receipt.reference}
            sentAt={receipt.sentAt}
            saved={receipt.saved}
            onSendAnother={startOver}
            {...(onClose ? { onClose } : {})}
          />
        ) : null}
      </div>
    </main>
  );
}
