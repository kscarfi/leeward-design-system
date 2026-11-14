/**
 * Leeward — money transfer screen.
 *
 * Flow: recipient → amount → review → SMS one-time code → receipt.
 *
 * Everything the screen needs from the backend goes through `transferApi`
 * below, which is a mock with realistic latency and failure modes. Replace its
 * implementation with real calls; the component only depends on its shape.
 *
 * Mock behaviour worth knowing when testing:
 *   - The valid one-time code is 123456. Three wrong codes cancel the transfer.
 *   - Codes expire after 3 minutes; a new one can be requested after 30 seconds.
 *   - Transfers to Leeward accounts are free; other banks cost a flat fee.
 *   - Money is handled as integer kuruş (1 TRY = 100 kuruş) throughout.
 */
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, ChangeEvent, FormEvent, ReactNode, RefObject } from 'react';

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

/** Integer number of kuruş. Never use floating-point lira for arithmetic. */
type Kurus = number;

interface Account {
  id: string;
  name: string;
  iban: string;
  availableKurus: Kurus;
}

interface Recipient {
  id: string;
  name: string;
  iban: string;
}

type RecipientChoice =
  | { kind: 'saved'; recipient: Recipient }
  | { kind: 'new'; name: string; iban: string; save: boolean };

interface Quote {
  quoteId: string;
  amountKurus: Kurus;
  feeKurus: Kurus;
  totalKurus: Kurus;
}

interface PendingTransfer {
  transferId: string;
  maskedPhone: string;
  otpExpiresAt: number;
  resendAvailableAt: number;
}

interface Receipt {
  reference: string;
  completedAt: number;
  recipientName: string;
  recipientIban: string;
  amountKurus: Kurus;
  feeKurus: Kurus;
  totalKurus: Kurus;
}

type ApiErrorCode =
  | 'NETWORK'
  | 'INSUFFICIENT_FUNDS'
  | 'LIMIT_EXCEEDED'
  | 'QUOTE_EXPIRED'
  | 'OTP_INVALID'
  | 'OTP_EXPIRED'
  | 'OTP_LOCKED'
  | 'RESEND_TOO_SOON';

class ApiError extends Error {
  readonly code: ApiErrorCode;

  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

// ---------------------------------------------------------------------------
// Money & IBAN helpers
// ---------------------------------------------------------------------------

const currencyFormatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' });
const plainAmountFormatter = new Intl.NumberFormat('tr-TR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

function formatTry(kurus: Kurus): string {
  return currencyFormatter.format(kurus / 100);
}

/** Amount without the currency sign, for putting back into the input: "1.234,50". */
function formatAmountInput(kurus: Kurus): string {
  return plainAmountFormatter.format(kurus / 100);
}

const MAX_INTEGER_DIGITS = 12;

/**
 * Parses an amount typed in Turkish notation into kuruş.
 *
 * Accepts "1234", "1234,5", "1.234,56" and, because people paste from other
 * sources, "1234.56". A dot followed by exactly three-digit groups is treated
 * as a thousands separator ("1.500" is 1500), as Turkish users expect.
 * Returns null when the input is not a valid amount.
 */
function parseTryAmount(input: string): Kurus | null {
  const s = input.replace(/[\s₺]/g, '');
  if (s === '') return null;

  let intPart: string;
  let fracPart = '';

  if (s.includes(',')) {
    const parts = s.split(',');
    if (parts.length !== 2) return null;
    [intPart, fracPart] = parts;
    if (intPart.includes('.')) {
      if (!/^\d{1,3}(\.\d{3})+$/.test(intPart)) return null;
      intPart = intPart.replace(/\./g, '');
    }
  } else if (s.includes('.')) {
    if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
      intPart = s.replace(/\./g, '');
    } else if (/^\d+\.\d{1,2}$/.test(s)) {
      [intPart, fracPart] = s.split('.');
    } else {
      return null;
    }
  } else {
    intPart = s;
  }

  if (!/^\d*$/.test(intPart) || !/^\d{0,2}$/.test(fracPart)) return null;
  if (intPart === '' && fracPart === '') return null;
  if (intPart.replace(/^0+/, '').length > MAX_INTEGER_DIGITS) return null;

  return Number(intPart || '0') * 100 + Number(fracPart.padEnd(2, '0'));
}

const TR_IBAN_LENGTH = 26;

function normalizeIban(raw: string): string {
  return raw.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
}

/** "TR330006100519786457841326" → "TR33 0006 1005 1978 6457 8413 26" */
function formatIban(raw: string): string {
  return normalizeIban(raw).replace(/(.{4})(?=.)/g, '$1 ');
}

/** "TR33 0006 …41326" style masking for compact display. */
function maskIban(iban: string): string {
  const n = normalizeIban(iban);
  return `${n.slice(0, 4)} •••• ${n.slice(-4)}`;
}

function ibanMod97(iban: string): number {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const digits = /[A-Z]/.test(ch) ? String(ch.charCodeAt(0) - 55) : ch;
    for (const d of digits) remainder = (remainder * 10 + Number(d)) % 97;
  }
  return remainder;
}

/** Returns a user-facing error message, or null when the IBAN is valid. */
function validateTrIban(raw: string): string | null {
  const iban = normalizeIban(raw);
  if (iban === '') return 'Enter the recipient’s IBAN.';
  if (!iban.startsWith('TR')) return 'Enter a Turkish IBAN. It starts with TR.';
  if (!/^TR\d{24}$/.test(iban)) return 'A Turkish IBAN is TR followed by 24 digits.';
  if (ibanMod97(iban) !== 1) return 'This IBAN isn’t valid. Check it for typos.';
  return null;
}

/** Turkish IBAN layout: TR kk BBBBB R AAAAAAAAAAAAAAAA — bank code is digits 5–9. */
function bankCodeOf(iban: string): string {
  return normalizeIban(iban).slice(4, 9);
}

function validateRecipientName(raw: string): string | null {
  const name = raw.trim().replace(/\s+/g, ' ');
  if (name === '') return 'Enter the recipient’s full name.';
  if (name.length < 3) return 'Enter the recipient’s full name as it appears on their account.';
  if (name.length > 70) return 'Names can be up to 70 characters.';
  if (!/^\p{L}[\p{L}\p{M} .'-]*$/u.test(name)) return 'Use letters only. Spaces, dots, apostrophes and hyphens are fine.';
  return null;
}

// ---------------------------------------------------------------------------
// Mock backend
// ---------------------------------------------------------------------------

const LEEWARD_BANK_CODE = '00999';

const BANK_NAMES: Record<string, string> = {
  [LEEWARD_BANK_CODE]: 'Leeward',
  '00901': 'Anchor Bank',
  '00902': 'Harbor Bank',
  '00903': 'Meridian Bank',
};

function bankNameOf(iban: string): string {
  return BANK_NAMES[bankCodeOf(iban)] ?? 'Other bank';
}

/** Builds a valid Turkish IBAN from a 22-digit BBAN, so mock data passes validation. */
function mockIban(bban: string): string {
  const check = 98 - ibanMod97(`TR00${bban}`);
  return `TR${String(check).padStart(2, '0')}${bban}`;
}

const MOCK_ACCOUNT: Account = {
  id: 'acc_main',
  name: 'Everyday account',
  iban: mockIban('0099900000000004815162'),
  availableKurus: 4_825_075,
};

const MOCK_RECIPIENTS: Recipient[] = [
  { id: 'rcp_1', name: 'Ayşe Yılmaz', iban: mockIban('0099900000000002718281') },
  { id: 'rcp_2', name: 'Mehmet Demir', iban: mockIban('0090100000000003141592') },
  { id: 'rcp_3', name: 'Zeynep Kaya', iban: mockIban('0090200000000001123581') },
  { id: 'rcp_4', name: 'Can Öztürk', iban: mockIban('0090300000000006022140') },
];

const FEE_SCHEDULE = {
  /** Flat fee for transfers to other banks. Leeward-to-Leeward is free. */
  externalFlatKurus: 650,
  perTransferLimitKurus: 25_000_000,
  minimumKurus: 1,
} as const;

const OTP_TTL_MS = 3 * 60_000;
const OTP_RESEND_COOLDOWN_MS = 30_000;
const OTP_MAX_ATTEMPTS = 3;
const MOCK_VALID_OTP = '123456';
const OTP_LENGTH = 6;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function randomId(prefix: string): string {
  const raw =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  return `${prefix}_${raw.replace(/-/g, '').slice(0, 16)}`;
}

interface MockTransferRecord {
  quote: Quote;
  recipientName: string;
  recipientIban: string;
  saveRecipient: boolean;
  attemptsLeft: number;
  otpExpiresAt: number;
  resendAvailableAt: number;
  status: 'awaiting_otp' | 'completed' | 'cancelled';
}

const mockState = {
  account: { ...MOCK_ACCOUNT },
  recipients: [...MOCK_RECIPIENTS],
  quotes: new Map<string, { quote: Quote; iban: string; expiresAt: number }>(),
  transfers: new Map<string, MockTransferRecord>(),
  /** idempotency key → transferId, so a retried "send code" never creates two transfers. */
  idempotency: new Map<string, string>(),
};

function maskedPhone(): string {
  return '+90 5•• ••• •• 47';
}

const transferApi = {
  async getAccount(): Promise<Account> {
    await sleep(350);
    return { ...mockState.account };
  },

  async listRecipients(): Promise<Recipient[]> {
    await sleep(450);
    return [...mockState.recipients];
  },

  async getQuote(input: { iban: string; amountKurus: Kurus }): Promise<Quote> {
    await sleep(500);
    const { amountKurus } = input;
    if (amountKurus > FEE_SCHEDULE.perTransferLimitKurus) {
      throw new ApiError(
        'LIMIT_EXCEEDED',
        `The most you can send in one transfer is ${formatTry(FEE_SCHEDULE.perTransferLimitKurus)}.`,
      );
    }
    const feeKurus = bankCodeOf(input.iban) === LEEWARD_BANK_CODE ? 0 : FEE_SCHEDULE.externalFlatKurus;
    const quote: Quote = {
      quoteId: randomId('qt'),
      amountKurus,
      feeKurus,
      totalKurus: amountKurus + feeKurus,
    };
    if (quote.totalKurus > mockState.account.availableKurus) {
      throw new ApiError(
        'INSUFFICIENT_FUNDS',
        `With the ${formatTry(feeKurus)} fee this comes to ${formatTry(quote.totalKurus)}, which is more than your available balance of ${formatTry(mockState.account.availableKurus)}.`,
      );
    }
    mockState.quotes.set(quote.quoteId, { quote, iban: input.iban, expiresAt: Date.now() + 10 * 60_000 });
    return quote;
  },

  /** Reserves the transfer and sends the one-time code by SMS. */
  async initiateTransfer(input: {
    quoteId: string;
    idempotencyKey: string;
    recipientName: string;
    recipientIban: string;
    saveRecipient: boolean;
  }): Promise<PendingTransfer> {
    await sleep(700);
    const existingId = mockState.idempotency.get(input.idempotencyKey);
    const existing = existingId ? mockState.transfers.get(existingId) : undefined;
    if (existingId && existing && existing.status === 'awaiting_otp') {
      return {
        transferId: existingId,
        maskedPhone: maskedPhone(),
        otpExpiresAt: existing.otpExpiresAt,
        resendAvailableAt: existing.resendAvailableAt,
      };
    }
    const stored = mockState.quotes.get(input.quoteId);
    if (!stored || stored.expiresAt < Date.now()) {
      throw new ApiError('QUOTE_EXPIRED', 'This quote has expired. Review the transfer again.');
    }
    const now = Date.now();
    const transferId = randomId('trf');
    const record: MockTransferRecord = {
      quote: stored.quote,
      recipientName: input.recipientName,
      recipientIban: input.recipientIban,
      saveRecipient: input.saveRecipient,
      attemptsLeft: OTP_MAX_ATTEMPTS,
      otpExpiresAt: now + OTP_TTL_MS,
      resendAvailableAt: now + OTP_RESEND_COOLDOWN_MS,
      status: 'awaiting_otp',
    };
    mockState.transfers.set(transferId, record);
    mockState.idempotency.set(input.idempotencyKey, transferId);
    return {
      transferId,
      maskedPhone: maskedPhone(),
      otpExpiresAt: record.otpExpiresAt,
      resendAvailableAt: record.resendAvailableAt,
    };
  },

  async resendOtp(transferId: string): Promise<Pick<PendingTransfer, 'otpExpiresAt' | 'resendAvailableAt'>> {
    await sleep(500);
    const record = mockState.transfers.get(transferId);
    if (!record || record.status !== 'awaiting_otp') {
      throw new ApiError('OTP_LOCKED', 'This transfer is no longer active.');
    }
    const now = Date.now();
    if (now < record.resendAvailableAt) {
      throw new ApiError('RESEND_TOO_SOON', 'Please wait a moment before requesting a new code.');
    }
    record.otpExpiresAt = now + OTP_TTL_MS;
    record.resendAvailableAt = now + OTP_RESEND_COOLDOWN_MS;
    record.attemptsLeft = OTP_MAX_ATTEMPTS;
    return { otpExpiresAt: record.otpExpiresAt, resendAvailableAt: record.resendAvailableAt };
  },

  async confirmTransfer(transferId: string, code: string): Promise<Receipt> {
    await sleep(800);
    const record = mockState.transfers.get(transferId);
    if (!record || record.status !== 'awaiting_otp') {
      throw new ApiError('OTP_LOCKED', 'This transfer is no longer active.');
    }
    if (Date.now() > record.otpExpiresAt) {
      throw new ApiError('OTP_EXPIRED', 'This code has expired. Request a new one.');
    }
    if (code !== MOCK_VALID_OTP) {
      record.attemptsLeft -= 1;
      if (record.attemptsLeft <= 0) {
        record.status = 'cancelled';
        throw new ApiError('OTP_LOCKED', 'Too many incorrect codes. For your security, this transfer was cancelled.');
      }
      throw new ApiError(
        'OTP_INVALID',
        `That code isn’t right. ${record.attemptsLeft} ${record.attemptsLeft === 1 ? 'attempt' : 'attempts'} left.`,
      );
    }
    record.status = 'completed';
    mockState.account.availableKurus -= record.quote.totalKurus;
    if (record.saveRecipient && !mockState.recipients.some((r) => r.iban === record.recipientIban)) {
      mockState.recipients.push({ id: randomId('rcp'), name: record.recipientName, iban: record.recipientIban });
    }
    return {
      reference: transferId.toUpperCase().replace('TRF_', 'LW-').slice(0, 15),
      completedAt: Date.now(),
      recipientName: record.recipientName,
      recipientIban: record.recipientIban,
      amountKurus: record.quote.amountKurus,
      feeKurus: record.quote.feeKurus,
      totalKurus: record.quote.totalKurus,
    };
  },

  async cancelTransfer(transferId: string): Promise<void> {
    await sleep(200);
    const record = mockState.transfers.get(transferId);
    if (record && record.status === 'awaiting_otp') record.status = 'cancelled';
  },
};

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return 'Something went wrong on our side. Please try again.';
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: unknown }
  | { status: 'success'; data: T };

/** Runs `load` on mount and on `reload()`, ignoring responses that arrive after a newer request. */
function useAsync<T>(load: () => Promise<T>): [AsyncState<T>, () => void] {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    loadRef.current().then(
      (data) => active && setState({ status: 'success', data }),
      (error: unknown) => active && setState({ status: 'error', error }),
    );
    return () => {
      active = false;
    };
  }, [attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return [state, reload];
}

/** Current time, re-rendering every second while `enabled`. */
function useNow(enabled: boolean): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!enabled) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [enabled]);
  return now;
}

/** Guards async callbacks from setting state after the component has gone. */
function useMountedRef() {
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return mounted;
}

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Presentational primitives
// ---------------------------------------------------------------------------

function Spinner({ label }: { label?: string }) {
  return (
    <span className="lw-spinner" role={label ? 'status' : undefined} aria-label={label}>
      <span aria-hidden="true" />
    </span>
  );
}

function Button({
  variant = 'primary',
  busy = false,
  children,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'link'; busy?: boolean }) {
  return (
    <button
      {...rest}
      className={`lw-btn lw-btn--${variant}`}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      type={rest.type ?? 'button'}
    >
      {busy && <Spinner />}
      <span>{children}</span>
    </button>
  );
}

function Alert({ tone = 'error', children }: { tone?: 'error' | 'info'; children: ReactNode }) {
  return (
    <div className={`lw-alert lw-alert--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message: string | null }) {
  if (!message) return null;
  return (
    <p id={id} className="lw-field-error">
      {message}
    </p>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase('tr-TR'))
    .join('');
  return (
    <span className="lw-avatar" aria-hidden="true">
      {initials}
    </span>
  );
}

function StepHeading({ children, headingRef }: { children: ReactNode; headingRef: RefObject<HTMLHeadingElement | null> }) {
  return (
    <h2 className="lw-step-title" ref={headingRef} tabIndex={-1}>
      {children}
    </h2>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — recipient
// ---------------------------------------------------------------------------

interface RecipientStepProps {
  initial: RecipientChoice | null;
  recipients: AsyncState<Recipient[]>;
  onReloadRecipients: () => void;
  ownIban: string | null;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onContinue: (choice: RecipientChoice) => void;
}

function RecipientStep({ initial, recipients, onReloadRecipients, ownIban, headingRef, onContinue }: RecipientStepProps) {
  const ids = useId();
  const [mode, setMode] = useState<'saved' | 'new'>(initial?.kind ?? 'saved');
  const [selectedId, setSelectedId] = useState<string | null>(
    initial?.kind === 'saved' ? initial.recipient.id : null,
  );
  const [name, setName] = useState(initial?.kind === 'new' ? initial.name : '');
  const [iban, setIban] = useState(initial?.kind === 'new' ? formatIban(initial.iban) : '');
  const [save, setSave] = useState(initial?.kind === 'new' ? initial.save : true);
  const [touched, setTouched] = useState({ name: false, iban: false });
  const [submitted, setSubmitted] = useState(false);

  const ibanInputRef = useRef<HTMLInputElement>(null);
  const pendingCaret = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (pendingCaret.current !== null && ibanInputRef.current) {
      ibanInputRef.current.setSelectionRange(pendingCaret.current, pendingCaret.current);
      pendingCaret.current = null;
    }
  }, [iban]);

  const savedList = recipients.status === 'success' ? recipients.data : [];
  const hasSaved = savedList.length > 0;
  const effectiveMode = recipients.status === 'success' && !hasSaved ? 'new' : mode;

  let ibanError = validateTrIban(iban);
  if (!ibanError && ownIban && normalizeIban(iban) === normalizeIban(ownIban)) {
    ibanError = 'This is your own account. Choose a different recipient.';
  }
  const nameError = validateRecipientName(name);
  const matchingSaved = !ibanError ? savedList.find((r) => r.iban === normalizeIban(iban)) : undefined;

  const showNameError = (touched.name || submitted) && nameError;
  const showIbanError = (touched.iban || submitted) && ibanError;
  const savedError = submitted && effectiveMode === 'saved' && !selectedId ? 'Choose who you’re sending money to.' : null;

  function handleIbanChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const caret = input.selectionStart ?? input.value.length;
    // Keep the caret after the same number of significant characters once spaces are re-inserted.
    const significantBeforeCaret = normalizeIban(input.value.slice(0, caret)).length;
    const normalized = normalizeIban(input.value).slice(0, TR_IBAN_LENGTH);
    const formatted = formatIban(normalized);
    let newCaret = 0;
    let seen = 0;
    while (newCaret < formatted.length && seen < significantBeforeCaret) {
      if (formatted[newCaret] !== ' ') seen += 1;
      newCaret += 1;
    }
    if (formatted === iban) {
      // No state change means no re-render, so restore the caret React is about to lose.
      input.value = formatted;
      input.setSelectionRange(newCaret, newCaret);
      return;
    }
    pendingCaret.current = newCaret;
    setIban(formatted);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (effectiveMode === 'saved') {
      const recipient = savedList.find((r) => r.id === selectedId);
      if (recipient) onContinue({ kind: 'saved', recipient });
      return;
    }
    if (nameError || ibanError) {
      // Move focus to the first invalid field so keyboard and screen reader users land on the problem.
      const firstInvalid = nameError ? `${ids}-name` : `${ids}-iban`;
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    if (matchingSaved) {
      onContinue({ kind: 'saved', recipient: matchingSaved });
      return;
    }
    onContinue({
      kind: 'new',
      name: name.trim().replace(/\s+/g, ' '),
      iban: normalizeIban(iban),
      save,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="lw-step">
      <StepHeading headingRef={headingRef}>Who are you sending to?</StepHeading>

      {(recipients.status !== 'success' || hasSaved) && (
        <div className="lw-segmented" role="group" aria-label="Recipient type">
          <button
            type="button"
            aria-pressed={effectiveMode === 'saved'}
            className="lw-segmented__option"
            onClick={() => setMode('saved')}
          >
            Saved recipients
          </button>
          <button
            type="button"
            aria-pressed={effectiveMode === 'new'}
            className="lw-segmented__option"
            onClick={() => setMode('new')}
          >
            New recipient
          </button>
        </div>
      )}

      {effectiveMode === 'saved' && (
        <>
          {recipients.status === 'loading' && (
            <div className="lw-list-skeleton" aria-busy="true" aria-label="Loading saved recipients">
              {[0, 1, 2].map((i) => (
                <div key={i} className="lw-skeleton-row" />
              ))}
            </div>
          )}
          {recipients.status === 'error' && (
            <Alert>
              <p>We couldn’t load your saved recipients.</p>
              <Button variant="link" onClick={onReloadRecipients}>
                Try again
              </Button>
            </Alert>
          )}
          {recipients.status === 'success' && (
            <fieldset className="lw-fieldset" aria-describedby={savedError ? `${ids}-saved-error` : undefined}>
              <legend className="lw-visually-hidden">Saved recipients</legend>
              <ul className="lw-recipient-list">
                {savedList.map((r) => (
                  <li key={r.id}>
                    <label className="lw-recipient" data-selected={selectedId === r.id || undefined}>
                      <input
                        type="radio"
                        name={`${ids}-recipient`}
                        value={r.id}
                        checked={selectedId === r.id}
                        onChange={() => setSelectedId(r.id)}
                        className="lw-visually-hidden"
                      />
                      <Avatar name={r.name} />
                      <span className="lw-recipient__text">
                        <span className="lw-recipient__name">{r.name}</span>
                        <span className="lw-recipient__meta">
                          {bankNameOf(r.iban)} · <span aria-label={`IBAN ending ${r.iban.slice(-4)}`}>{maskIban(r.iban)}</span>
                        </span>
                      </span>
                      <span className="lw-radio-dot" aria-hidden="true" />
                    </label>
                  </li>
                ))}
              </ul>
              <FieldError id={`${ids}-saved-error`} message={savedError} />
            </fieldset>
          )}
        </>
      )}

      {effectiveMode === 'new' && (
        <div className="lw-fields">
          <div className="lw-field">
            <label htmlFor={`${ids}-name`} className="lw-label">
              Full name
            </label>
            <input
              id={`${ids}-name`}
              className="lw-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              autoComplete="name"
              autoCapitalize="words"
              spellCheck={false}
              maxLength={70}
              aria-invalid={showNameError ? true : undefined}
              aria-describedby={`${ids}-name-hint ${showNameError ? `${ids}-name-error` : ''}`}
            />
            <p id={`${ids}-name-hint`} className="lw-hint">
              As it appears on their bank account.
            </p>
            <FieldError id={`${ids}-name-error`} message={showNameError ? nameError : null} />
          </div>

          <div className="lw-field">
            <label htmlFor={`${ids}-iban`} className="lw-label">
              IBAN
            </label>
            <input
              id={`${ids}-iban`}
              ref={ibanInputRef}
              className="lw-input lw-input--mono"
              value={iban}
              onChange={handleIbanChange}
              onBlur={() => setTouched((t) => ({ ...t, iban: true }))}
              placeholder="TR00 0000 0000 0000 0000 0000 00"
              autoComplete="off"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
              aria-invalid={showIbanError ? true : undefined}
              aria-describedby={showIbanError ? `${ids}-iban-error` : `${ids}-iban-hint`}
            />
            {!showIbanError && (
              <p id={`${ids}-iban-hint`} className="lw-hint">
                {!ibanError ? `${bankNameOf(iban)} account` : 'TR followed by 24 digits.'}
              </p>
            )}
            <FieldError id={`${ids}-iban-error`} message={showIbanError ? ibanError : null} />
          </div>

          {matchingSaved ? (
            <Alert tone="info">This IBAN belongs to {matchingSaved.name}, who is already in your saved recipients.</Alert>
          ) : (
            <label className="lw-checkbox">
              <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} />
              <span>Save this recipient for next time</span>
            </label>
          )}
        </div>
      )}

      <div className="lw-actions">
        <Button type="submit" disabled={effectiveMode === 'saved' && recipients.status !== 'success'}>
          Continue
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — amount
// ---------------------------------------------------------------------------

interface AmountStepProps {
  recipientName: string;
  account: AsyncState<Account>;
  onReloadAccount: () => void;
  initialAmount: Kurus | null;
  initialDescription: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onContinue: (amountKurus: Kurus, description: string) => void;
}

const DESCRIPTION_MAX = 140;

function AmountStep({
  recipientName,
  account,
  onReloadAccount,
  initialAmount,
  initialDescription,
  headingRef,
  onBack,
  onContinue,
}: AmountStepProps) {
  const ids = useId();
  const [text, setText] = useState(initialAmount !== null ? formatAmountInput(initialAmount) : '');
  const [description, setDescription] = useState(initialDescription);
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const available = account.status === 'success' ? account.data.availableKurus : null;
  const parsed = parseTryAmount(text);

  let error: string | null = null;
  if (text.trim() === '') error = 'Enter an amount.';
  else if (parsed === null) error = 'Enter an amount like 1.250,00.';
  else if (parsed < FEE_SCHEDULE.minimumKurus) error = 'The amount must be more than ₺0,00.';
  else if (parsed > FEE_SCHEDULE.perTransferLimitKurus)
    error = `The most you can send in one transfer is ${formatTry(FEE_SCHEDULE.perTransferLimitKurus)}.`;
  else if (available !== null && parsed > available)
    error = `That’s more than your available balance of ${formatTry(available)}.`;

  const showError = (touched || submitted) && error;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (error || parsed === null || account.status !== 'success') {
      document.getElementById(`${ids}-amount`)?.focus();
      return;
    }
    onContinue(parsed, description.trim());
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="lw-step">
      <StepHeading headingRef={headingRef}>How much are you sending to {recipientName}?</StepHeading>

      <div className="lw-field">
        <label htmlFor={`${ids}-amount`} className="lw-label">
          Amount
        </label>
        <div className="lw-amount" data-invalid={showError ? true : undefined}>
          <span className="lw-amount__symbol" aria-hidden="true">
            ₺
          </span>
          <input
            id={`${ids}-amount`}
            className="lw-amount__input"
            value={text}
            onChange={(e) => setText(e.target.value.replace(/[^\d.,]/g, ''))}
            onBlur={() => {
              setTouched(true);
              if (parsed !== null) setText(formatAmountInput(parsed));
            }}
            inputMode="decimal"
            autoComplete="off"
            placeholder="0,00"
            aria-invalid={showError ? true : undefined}
            aria-describedby={`${ids}-balance ${showError ? `${ids}-amount-error` : ''}`}
          />
          <span className="lw-amount__code" aria-hidden="true">
            TRY
          </span>
        </div>
        <FieldError id={`${ids}-amount-error`} message={showError ? error : null} />
        <p id={`${ids}-balance`} className="lw-hint">
          {account.status === 'loading' && 'Checking your balance…'}
          {account.status === 'success' && (
            <>
              From {account.data.name} · {formatTry(account.data.availableKurus)} available
            </>
          )}
        </p>
        {account.status === 'error' && (
          <Alert>
            <p>We couldn’t load your balance.</p>
            <Button variant="link" onClick={onReloadAccount}>
              Try again
            </Button>
          </Alert>
        )}
      </div>

      <div className="lw-field">
        <label htmlFor={`${ids}-desc`} className="lw-label">
          Description <span className="lw-optional">(optional)</span>
        </label>
        <input
          id={`${ids}-desc`}
          className="lw-input"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, DESCRIPTION_MAX))}
          maxLength={DESCRIPTION_MAX}
          placeholder="e.g. Rent for November"
          aria-describedby={`${ids}-desc-count`}
        />
        <p id={`${ids}-desc-count`} className="lw-hint lw-hint--end">
          {description.length}/{DESCRIPTION_MAX}
        </p>
      </div>

      <div className="lw-actions">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={account.status !== 'success'}>
          Review transfer
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — review
// ---------------------------------------------------------------------------

interface ReviewStepProps {
  account: Account;
  recipientName: string;
  recipientIban: string;
  isNewRecipient: boolean;
  amountKurus: Kurus;
  description: string;
  notice: string | null;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onEditRecipient: () => void;
  onEditAmount: () => void;
  onCodeSent: (pending: PendingTransfer, quote: Quote) => void;
  onInitiate: (quoteId: string, idempotencyKey: string) => Promise<PendingTransfer>;
}

function ReviewStep({
  account,
  recipientName,
  recipientIban,
  isNewRecipient,
  amountKurus,
  description,
  notice,
  headingRef,
  onEditRecipient,
  onEditAmount,
  onCodeSent,
  onInitiate,
}: ReviewStepProps) {
  const mounted = useMountedRef();
  // One key per review: retrying "Send code" after a timeout can't create a second transfer.
  const [idempotencyKey] = useState(() => randomId('idem'));
  const [quoteState, reloadQuote] = useAsync(() => transferApi.getQuote({ iban: recipientIban, amountKurus }));
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  async function handleSend() {
    if (quoteState.status !== 'success' || sending) return;
    setSending(true);
    setSendError(null);
    try {
      const pending = await onInitiate(quoteState.data.quoteId, idempotencyKey);
      if (mounted.current) onCodeSent(pending, quoteState.data);
    } catch (err) {
      if (!mounted.current) return;
      setSending(false);
      if (err instanceof ApiError && err.code === 'QUOTE_EXPIRED') reloadQuote();
      setSendError(errorMessage(err));
    }
  }

  const quoteError = quoteState.status === 'error' ? quoteState.error : null;
  const fundsProblem =
    quoteError instanceof ApiError && (quoteError.code === 'INSUFFICIENT_FUNDS' || quoteError.code === 'LIMIT_EXCEEDED');

  return (
    <div className="lw-step">
      <StepHeading headingRef={headingRef}>Check your transfer</StepHeading>

      {notice && <Alert>{notice}</Alert>}

      <section className="lw-summary" aria-label="Recipient">
        <div className="lw-summary__head">
          <h3 className="lw-summary__title">To</h3>
          <Button variant="link" onClick={onEditRecipient} disabled={sending} aria-label="Change recipient">
            Change
          </Button>
        </div>
        <div className="lw-summary__party">
          <Avatar name={recipientName} />
          <div>
            <p className="lw-summary__name">
              {recipientName}
              {isNewRecipient && <span className="lw-badge">New</span>}
            </p>
            <p className="lw-summary__meta lw-mono">{formatIban(recipientIban)}</p>
            <p className="lw-summary__meta">{bankNameOf(recipientIban)}</p>
          </div>
        </div>
      </section>

      <section className="lw-summary" aria-label="Amount">
        <div className="lw-summary__head">
          <h3 className="lw-summary__title">Amount</h3>
          <Button variant="link" onClick={onEditAmount} disabled={sending} aria-label="Change amount">
            Change
          </Button>
        </div>
        <dl className="lw-rows">
          <div className="lw-row">
            <dt>They receive</dt>
            <dd>{formatTry(amountKurus)}</dd>
          </div>
          <div className="lw-row">
            <dt>Transfer fee</dt>
            <dd aria-live="polite">
              {quoteState.status === 'loading' && <span className="lw-skeleton-text" aria-label="Calculating fee" />}
              {quoteState.status === 'success' &&
                (quoteState.data.feeKurus === 0 ? 'Free' : formatTry(quoteState.data.feeKurus))}
              {quoteState.status === 'error' && '—'}
            </dd>
          </div>
          <div className="lw-row lw-row--total">
            <dt>Total from your account</dt>
            <dd aria-live="polite">
              {quoteState.status === 'loading' && <span className="lw-skeleton-text" aria-label="Calculating total" />}
              {quoteState.status === 'success' && formatTry(quoteState.data.totalKurus)}
              {quoteState.status === 'error' && '—'}
            </dd>
          </div>
        </dl>
        <p className="lw-summary__meta">
          From {account.name} · <span className="lw-mono">{maskIban(account.iban)}</span>
        </p>
        {description && (
          <p className="lw-summary__meta">
            Description: <span className="lw-quote">{description}</span>
          </p>
        )}
      </section>

      {quoteState.status === 'error' && (
        <Alert>
          <p>{fundsProblem ? errorMessage(quoteError) : 'We couldn’t calculate the fee for this transfer.'}</p>
          {fundsProblem ? (
            <Button variant="link" onClick={onEditAmount}>
              Change amount
            </Button>
          ) : (
            <Button variant="link" onClick={reloadQuote}>
              Try again
            </Button>
          )}
        </Alert>
      )}

      {sendError && <Alert>{sendError}</Alert>}

      <p className="lw-fineprint">
        We’ll text a 6-digit code to your registered phone number to confirm. Transfers to other banks usually
        arrive within minutes.
      </p>

      <div className="lw-actions">
        <Button variant="secondary" onClick={onEditAmount} disabled={sending}>
          Back
        </Button>
        <Button onClick={handleSend} busy={sending} disabled={quoteState.status !== 'success'}>
          {sending ? 'Sending code…' : 'Send confirmation code'}
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — one-time code
// ---------------------------------------------------------------------------

interface OtpStepProps {
  pending: PendingTransfer;
  totalKurus: Kurus;
  recipientName: string;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onPendingChange: (pending: PendingTransfer) => void;
  onConfirmed: (receipt: Receipt) => void;
  onCancelled: (reason: string | null) => void;
}

function OtpStep({
  pending,
  totalKurus,
  recipientName,
  headingRef,
  onPendingChange,
  onConfirmed,
  onCancelled,
}: OtpStepProps) {
  const ids = useId();
  const mounted = useMountedRef();
  const inputRef = useRef<HTMLInputElement>(null);
  const now = useNow(true);
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const expiresIn = pending.otpExpiresAt - now;
  const resendIn = pending.resendAvailableAt - now;
  const expired = expiresIn <= 0;
  const busy = verifying || resending || cancelling;

  async function verify(value: string) {
    if (busy || value.length !== OTP_LENGTH || expired) return;
    setVerifying(true);
    setError(null);
    setInfo(null);
    try {
      const receipt = await transferApi.confirmTransfer(pending.transferId, value);
      if (mounted.current) onConfirmed(receipt);
    } catch (err) {
      if (!mounted.current) return;
      setVerifying(false);
      if (err instanceof ApiError && err.code === 'OTP_LOCKED') {
        onCancelled(err.message);
        return;
      }
      setError(errorMessage(err));
      setCode('');
      // Focus after the input is re-enabled on the next render.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  async function resend() {
    if (busy || resendIn > 0) return;
    setResending(true);
    setError(null);
    setInfo(null);
    try {
      const next = await transferApi.resendOtp(pending.transferId);
      if (!mounted.current) return;
      onPendingChange({ ...pending, ...next });
      setCode('');
      setInfo(`We’ve sent a new code to ${pending.maskedPhone}.`);
      requestAnimationFrame(() => inputRef.current?.focus());
    } catch (err) {
      if (!mounted.current) return;
      if (err instanceof ApiError && err.code === 'OTP_LOCKED') {
        onCancelled(err.message);
        return;
      }
      setError(errorMessage(err));
    } finally {
      if (mounted.current) setResending(false);
    }
  }

  async function cancel() {
    if (busy) return;
    setCancelling(true);
    try {
      await transferApi.cancelTransfer(pending.transferId);
    } catch {
      // The pending transfer expires on its own if this fails; never trap the user on this step.
    }
    if (mounted.current) onCancelled(null);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setCode(digits);
    if (error) setError(null);
    // Submit automatically when the last digit arrives (typed, pasted or autofilled from SMS).
    if (digits.length === OTP_LENGTH && code.length !== OTP_LENGTH) void verify(digits);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (code.length !== OTP_LENGTH) {
      setError(`Enter all ${OTP_LENGTH} digits of the code.`);
      inputRef.current?.focus();
      return;
    }
    void verify(code);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="lw-step">
      <StepHeading headingRef={headingRef}>Enter your confirmation code</StepHeading>
      <p className="lw-lede">
        We sent a 6-digit code to <strong className="lw-nowrap">{pending.maskedPhone}</strong>. Entering it sends{' '}
        <strong>{formatTry(totalKurus)}</strong> to {recipientName}.
      </p>

      <div className="lw-field">
        <label htmlFor={`${ids}-otp`} className="lw-label">
          Confirmation code
        </label>
        <input
          id={`${ids}-otp`}
          ref={inputRef}
          className="lw-input lw-otp"
          value={code}
          onChange={handleChange}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={OTP_LENGTH}
          autoFocus
          disabled={verifying || cancelling || expired}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${ids}-otp-status ${error ? `${ids}-otp-error` : ''}`}
        />
        <FieldError id={`${ids}-otp-error`} message={error} />
        <p id={`${ids}-otp-status`} className="lw-hint">
          {expired ? 'This code has expired.' : <>Code expires in {formatCountdown(expiresIn)}</>}
        </p>
      </div>

      {info && <Alert tone="info">{info}</Alert>}
      {expired && <Alert>Your code has expired. Request a new one to continue.</Alert>}

      <div className="lw-resend">
        {resendIn > 0 ? (
          <span className="lw-hint">Didn’t get it? You can request a new code in {formatCountdown(resendIn)}.</span>
        ) : (
          <Button variant="link" onClick={resend} busy={resending} disabled={verifying || cancelling}>
            Send a new code
          </Button>
        )}
      </div>

      <div className="lw-actions">
        <Button variant="secondary" onClick={cancel} busy={cancelling} disabled={verifying}>
          Cancel transfer
        </Button>
        <Button type="submit" busy={verifying} disabled={expired || resending || cancelling}>
          {verifying ? 'Confirming…' : 'Confirm transfer'}
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Done — receipt
// ---------------------------------------------------------------------------

function DoneStep({
  receipt,
  headingRef,
  onNewTransfer,
}: {
  receipt: Receipt;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onNewTransfer: () => void;
}) {
  return (
    <div className="lw-step lw-done">
      <div className="lw-done__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <StepHeading headingRef={headingRef}>
        {formatTry(receipt.amountKurus)} is on its way to {receipt.recipientName}
      </StepHeading>

      <dl className="lw-rows lw-summary">
        <div className="lw-row">
          <dt>To</dt>
          <dd className="lw-mono">{maskIban(receipt.recipientIban)}</dd>
        </div>
        <div className="lw-row">
          <dt>Amount</dt>
          <dd>{formatTry(receipt.amountKurus)}</dd>
        </div>
        <div className="lw-row">
          <dt>Fee</dt>
          <dd>{receipt.feeKurus === 0 ? 'Free' : formatTry(receipt.feeKurus)}</dd>
        </div>
        <div className="lw-row lw-row--total">
          <dt>Total</dt>
          <dd>{formatTry(receipt.totalKurus)}</dd>
        </div>
        <div className="lw-row">
          <dt>Date</dt>
          <dd>{dateTimeFormatter.format(receipt.completedAt)}</dd>
        </div>
        <div className="lw-row">
          <dt>Reference</dt>
          <dd className="lw-mono">{receipt.reference}</dd>
        </div>
      </dl>

      <div className="lw-actions">
        <Button onClick={onNewTransfer}>Make another transfer</Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

type Step = 'recipient' | 'amount' | 'review' | 'otp' | 'done';

const STEP_ORDER: Exclude<Step, 'done'>[] = ['recipient', 'amount', 'review', 'otp'];
const STEP_LABELS: Record<Exclude<Step, 'done'>, string> = {
  recipient: 'Recipient',
  amount: 'Amount',
  review: 'Review',
  otp: 'Confirm',
};

function recipientNameOf(choice: RecipientChoice): string {
  return choice.kind === 'saved' ? choice.recipient.name : choice.name;
}

function recipientIbanOf(choice: RecipientChoice): string {
  return choice.kind === 'saved' ? choice.recipient.iban : choice.iban;
}

export default function TransferScreen() {
  const [step, setStep] = useState<Step>('recipient');
  const [recipient, setRecipient] = useState<RecipientChoice | null>(null);
  const [amountKurus, setAmountKurus] = useState<Kurus | null>(null);
  const [description, setDescription] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [pending, setPending] = useState<PendingTransfer | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [reviewNotice, setReviewNotice] = useState<string | null>(null);

  const [account, reloadAccount] = useAsync(transferApi.getAccount);
  const [recipients, reloadRecipients] = useAsync(transferApi.listRecipients);

  // Move focus to the new step's heading so screen readers announce the change.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (step !== 'otp') headingRef.current?.focus();
  }, [step]);

  const goTo = (next: Step) => {
    if (next !== 'review') setReviewNotice(null);
    setStep(next);
  };

  const initiate = useCallback(
    (quoteId: string, idempotencyKey: string) => {
      if (!recipient) return Promise.reject(new Error('No recipient'));
      return transferApi.initiateTransfer({
        quoteId,
        idempotencyKey,
        recipientName: recipientNameOf(recipient),
        recipientIban: recipientIbanOf(recipient),
        saveRecipient: recipient.kind === 'new' && recipient.save,
      });
    },
    [recipient],
  );

  function startOver() {
    setRecipient(null);
    setAmountKurus(null);
    setDescription('');
    setQuote(null);
    setPending(null);
    setReceipt(null);
    setReviewNotice(null);
    reloadAccount();
    reloadRecipients();
    setStep('recipient');
  }

  const stepIndex = step === 'done' ? STEP_ORDER.length : STEP_ORDER.indexOf(step);

  let body: ReactNode = null;
  if (step === 'recipient') {
    body = (
      <RecipientStep
        initial={recipient}
        recipients={recipients}
        onReloadRecipients={reloadRecipients}
        ownIban={account.status === 'success' ? account.data.iban : null}
        headingRef={headingRef}
        onContinue={(choice) => {
          setRecipient(choice);
          goTo('amount');
        }}
      />
    );
  } else if (step === 'amount' && recipient) {
    body = (
      <AmountStep
        recipientName={recipientNameOf(recipient)}
        account={account}
        onReloadAccount={reloadAccount}
        initialAmount={amountKurus}
        initialDescription={description}
        headingRef={headingRef}
        onBack={() => goTo('recipient')}
        onContinue={(amount, desc) => {
          setAmountKurus(amount);
          setDescription(desc);
          goTo('review');
        }}
      />
    );
  } else if (step === 'review' && recipient && amountKurus !== null && account.status === 'success') {
    body = (
      <ReviewStep
        account={account.data}
        recipientName={recipientNameOf(recipient)}
        recipientIban={recipientIbanOf(recipient)}
        isNewRecipient={recipient.kind === 'new'}
        amountKurus={amountKurus}
        description={description}
        notice={reviewNotice}
        headingRef={headingRef}
        onEditRecipient={() => goTo('recipient')}
        onEditAmount={() => goTo('amount')}
        onInitiate={initiate}
        onCodeSent={(p, q) => {
          setPending(p);
          setQuote(q);
          goTo('otp');
        }}
      />
    );
  } else if (step === 'otp' && recipient && pending && quote) {
    body = (
      <OtpStep
        pending={pending}
        totalKurus={quote.totalKurus}
        recipientName={recipientNameOf(recipient)}
        headingRef={headingRef}
        onPendingChange={setPending}
        onConfirmed={(r) => {
          setReceipt(r);
          setPending(null);
          goTo('done');
        }}
        onCancelled={(reason) => {
          setPending(null);
          setQuote(null);
          setStep('review');
          setReviewNotice(reason);
        }}
      />
    );
  } else if (step === 'done' && receipt) {
    body = <DoneStep receipt={receipt} headingRef={headingRef} onNewTransfer={startOver} />;
  } else {
    // State and step disagree (should not happen); recover rather than render nothing.
    body = (
      <div className="lw-step">
        <Alert>Something went wrong with this transfer.</Alert>
        <div className="lw-actions">
          <Button onClick={startOver}>Start again</Button>
        </div>
      </div>
    );
  }

  return (
    <main className="lw-screen">
      <style>{STYLES}</style>
      <div className="lw-card">
        <header className="lw-header">
          <p className="lw-brand">Leeward</p>
          <h1 className="lw-title">Send money</h1>
          {step !== 'done' && (
            <nav aria-label="Transfer progress">
              <ol className="lw-progress">
                {STEP_ORDER.map((s, i) => (
                  <li
                    key={s}
                    className="lw-progress__step"
                    data-state={i < stepIndex ? 'done' : i === stepIndex ? 'current' : 'todo'}
                    aria-current={i === stepIndex ? 'step' : undefined}
                  >
                    <span className="lw-progress__bar" aria-hidden="true" />
                    <span className="lw-progress__label">
                      <span className="lw-visually-hidden">
                        Step {i + 1} of {STEP_ORDER.length}:{' '}
                      </span>
                      {STEP_LABELS[s]}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </header>
        {body}
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Styles (scoped by the lw- prefix)
// ---------------------------------------------------------------------------

const STYLES = `
.lw-screen {
  --lw-bg: #eef2f4;
  --lw-surface: #ffffff;
  --lw-surface-2: #f5f8f9;
  --lw-text: #13232b;
  --lw-muted: #5b6b73;
  --lw-border: #d6dfe3;
  --lw-accent: #0d6b6e;
  --lw-accent-hover: #0a5759;
  --lw-accent-soft: #e2f1f1;
  --lw-on-accent: #ffffff;
  --lw-danger: #b42318;
  --lw-danger-soft: #fdecea;
  --lw-info-soft: #e8f1fb;
  --lw-info: #1d4f8c;
  --lw-success: #1a7f4b;
  --lw-focus: #2f80ed;
  --lw-radius: 14px;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 24px 16px;
  background: var(--lw-bg);
  color: var(--lw-text);
  font: 16px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}
@media (prefers-color-scheme: dark) {
  .lw-screen {
    --lw-bg: #0d1518;
    --lw-surface: #152126;
    --lw-surface-2: #1b2a30;
    --lw-text: #e6eef0;
    --lw-muted: #98a9b0;
    --lw-border: #2b3d44;
    --lw-accent: #4fb8b3;
    --lw-accent-hover: #6ccac5;
    --lw-accent-soft: #19393b;
    --lw-on-accent: #06201f;
    --lw-danger: #ff8a80;
    --lw-danger-soft: #3a1c1a;
    --lw-info-soft: #172a40;
    --lw-info: #9cc3f2;
    --lw-success: #5fd39a;
  }
}
.lw-screen *, .lw-screen *::before, .lw-screen *::after { box-sizing: border-box; }
:where(.lw-screen) :where(p, h1, h2, h3, dl, dd, ul, ol) { margin: 0; padding: 0; }
.lw-card {
  max-width: 480px;
  margin: 0 auto;
  background: var(--lw-surface);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.06);
}
@media (max-width: 520px) {
  .lw-screen { padding: 0; background: var(--lw-surface); }
  .lw-card { border-radius: 0; box-shadow: none; padding: 20px 16px 32px; }
}
.lw-header { margin-bottom: 24px; }
.lw-brand { font-size: 13px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--lw-accent); }
.lw-title { font-size: 26px; line-height: 1.2; font-weight: 700; margin-top: 2px; }
.lw-progress { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 18px; list-style: none; }
.lw-progress__step { display: flex; flex-direction: column; gap: 6px; }
.lw-progress__bar { height: 4px; border-radius: 2px; background: var(--lw-border); }
.lw-progress__step[data-state="done"] .lw-progress__bar,
.lw-progress__step[data-state="current"] .lw-progress__bar { background: var(--lw-accent); }
.lw-progress__label { font-size: 12px; color: var(--lw-muted); }
.lw-progress__step[data-state="current"] .lw-progress__label { color: var(--lw-text); font-weight: 600; }

.lw-step { display: flex; flex-direction: column; gap: 18px; }
.lw-step-title { font-size: 20px; line-height: 1.3; font-weight: 650; outline: none; }
.lw-lede { color: var(--lw-muted); }
.lw-lede strong { color: var(--lw-text); }
.lw-nowrap { white-space: nowrap; }

.lw-segmented { display: grid; grid-template-columns: 1fr 1fr; padding: 4px; border-radius: 12px; background: var(--lw-surface-2); border: 1px solid var(--lw-border); }
.lw-segmented__option { appearance: none; border: 0; background: transparent; color: var(--lw-muted); font: inherit; font-size: 15px; font-weight: 600; padding: 10px 8px; border-radius: 9px; cursor: pointer; min-height: 44px; }
.lw-segmented__option[aria-pressed="true"] { background: var(--lw-surface); color: var(--lw-text); box-shadow: 0 1px 3px rgba(0,0,0,.12); }

.lw-fieldset { border: 0; margin: 0; padding: 0; min-width: 0; }
.lw-recipient-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.lw-recipient { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 1px solid var(--lw-border); border-radius: var(--lw-radius); cursor: pointer; min-height: 64px; transition: border-color .15s, background .15s; }
.lw-recipient:hover { border-color: var(--lw-accent); }
.lw-recipient[data-selected] { border-color: var(--lw-accent); background: var(--lw-accent-soft); box-shadow: inset 0 0 0 1px var(--lw-accent); }
.lw-recipient:focus-within { outline: 3px solid var(--lw-focus); outline-offset: 2px; }
.lw-recipient__text { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.lw-recipient__name { font-weight: 600; }
.lw-recipient__meta { font-size: 14px; color: var(--lw-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lw-radio-dot { width: 20px; height: 20px; flex: none; border-radius: 50%; border: 2px solid var(--lw-border); }
.lw-recipient[data-selected] .lw-radio-dot { border-color: var(--lw-accent); background: radial-gradient(var(--lw-accent) 0 45%, transparent 50%); }
.lw-avatar { width: 40px; height: 40px; flex: none; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: var(--lw-accent-soft); color: var(--lw-accent); font-weight: 700; font-size: 15px; }

.lw-list-skeleton { display: flex; flex-direction: column; gap: 8px; }
.lw-skeleton-row { height: 64px; border-radius: var(--lw-radius); background: var(--lw-surface-2); animation: lw-pulse 1.2s ease-in-out infinite; }
.lw-skeleton-text { display: inline-block; width: 72px; height: 1em; vertical-align: middle; border-radius: 4px; background: var(--lw-surface-2); animation: lw-pulse 1.2s ease-in-out infinite; }
@keyframes lw-pulse { 50% { opacity: .5; } }

.lw-fields { display: flex; flex-direction: column; gap: 18px; }
.lw-field { display: flex; flex-direction: column; gap: 6px; }
.lw-label { font-size: 15px; font-weight: 600; }
.lw-optional { font-weight: 400; color: var(--lw-muted); }
.lw-input { width: 100%; min-height: 48px; padding: 12px 14px; border: 1px solid var(--lw-border); border-radius: 12px; background: var(--lw-surface); color: var(--lw-text); font: inherit; }
.lw-input::placeholder, .lw-amount__input::placeholder { color: var(--lw-muted); opacity: .7; }
.lw-input:focus, .lw-amount:focus-within { outline: none; border-color: var(--lw-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--lw-accent) 25%, transparent); }
.lw-input[aria-invalid="true"], .lw-amount[data-invalid] { border-color: var(--lw-danger); }
.lw-input:disabled { opacity: .6; }
.lw-input--mono, .lw-mono { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; letter-spacing: .02em; }
.lw-hint { font-size: 14px; color: var(--lw-muted); }
.lw-hint--end { text-align: right; }
.lw-field-error { font-size: 14px; color: var(--lw-danger); font-weight: 500; }

.lw-amount { display: flex; align-items: center; gap: 8px; padding: 6px 16px; border: 1px solid var(--lw-border); border-radius: 14px; background: var(--lw-surface); }
.lw-amount__symbol { font-size: 28px; font-weight: 600; color: var(--lw-muted); }
.lw-amount__input { flex: 1; min-width: 0; border: 0; outline: none; background: transparent; color: var(--lw-text); font: inherit; font-size: 32px; font-weight: 650; font-variant-numeric: tabular-nums; padding: 8px 0; }
.lw-amount__code { font-size: 14px; font-weight: 600; color: var(--lw-muted); }

.lw-otp { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 28px; letter-spacing: .5em; text-align: center; padding-left: calc(14px + .5em); font-variant-numeric: tabular-nums; }

.lw-checkbox { display: flex; align-items: center; gap: 10px; cursor: pointer; min-height: 44px; }
.lw-checkbox input { width: 20px; height: 20px; accent-color: var(--lw-accent); margin: 0; }

.lw-summary { border: 1px solid var(--lw-border); border-radius: var(--lw-radius); padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.lw-summary__head { display: flex; justify-content: space-between; align-items: center; }
.lw-summary__title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: var(--lw-muted); }
.lw-summary__party { display: flex; gap: 12px; align-items: flex-start; }
.lw-summary__name { font-weight: 600; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.lw-summary__meta { font-size: 14px; color: var(--lw-muted); overflow-wrap: anywhere; }
.lw-quote { color: var(--lw-text); }
.lw-badge { font-size: 12px; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: var(--lw-info-soft); color: var(--lw-info); }
.lw-rows { display: flex; flex-direction: column; gap: 8px; }
.lw-row { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; }
.lw-row dt { color: var(--lw-muted); }
.lw-row dd { font-variant-numeric: tabular-nums; text-align: right; }
.lw-row--total { border-top: 1px solid var(--lw-border); padding-top: 10px; margin-top: 2px; }
.lw-row--total dt { color: var(--lw-text); font-weight: 600; }
.lw-row--total dd { font-size: 20px; font-weight: 700; }
.lw-fineprint { font-size: 14px; color: var(--lw-muted); }

.lw-alert { border-radius: 12px; padding: 12px 14px; font-size: 15px; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
.lw-alert--error { background: var(--lw-danger-soft); color: var(--lw-danger); }
.lw-alert--info { background: var(--lw-info-soft); color: var(--lw-info); }

.lw-resend { min-height: 24px; }
.lw-actions { display: flex; gap: 12px; margin-top: 6px; }
.lw-actions .lw-btn--primary { flex: 1; }
.lw-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font: inherit; font-weight: 600; cursor: pointer; border-radius: 12px; }
.lw-btn:focus-visible { outline: 3px solid var(--lw-focus); outline-offset: 2px; }
.lw-btn:disabled { cursor: not-allowed; }
.lw-btn--primary, .lw-btn--secondary { min-height: 52px; padding: 0 20px; font-size: 16px; }
.lw-btn--primary { border: 0; background: var(--lw-accent); color: var(--lw-on-accent); }
.lw-btn--primary:hover:not(:disabled) { background: var(--lw-accent-hover); }
.lw-btn--primary:disabled { opacity: .5; }
.lw-btn--primary[aria-busy="true"] { opacity: .85; }
.lw-btn--secondary { border: 1px solid var(--lw-border); background: var(--lw-surface); color: var(--lw-text); }
.lw-btn--secondary:hover:not(:disabled) { background: var(--lw-surface-2); }
.lw-btn--secondary:disabled { opacity: .5; }
.lw-btn--link { border: 0; background: none; padding: 4px 2px; min-height: 32px; color: var(--lw-accent); text-decoration: underline; text-underline-offset: 3px; font-size: 15px; }
.lw-btn--link:disabled { color: var(--lw-muted); text-decoration: none; }

.lw-spinner { display: inline-flex; width: 16px; height: 16px; }
.lw-spinner > span { width: 100%; height: 100%; border-radius: 50%; border: 2px solid currentColor; border-right-color: transparent; animation: lw-spin .7s linear infinite; }
@keyframes lw-spin { to { transform: rotate(360deg); } }

.lw-done { align-items: stretch; text-align: left; }
.lw-done__icon { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: color-mix(in srgb, var(--lw-success) 15%, transparent); color: var(--lw-success); }

.lw-visually-hidden { position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

@media (prefers-reduced-motion: reduce) {
  .lw-screen *, .lw-screen *::before, .lw-screen *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition: none !important; }
}
`;
