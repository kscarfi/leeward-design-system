# Writing: voice, tone and terminology

Leeward talks about money the way a calm, competent friend would: short sentences, plain words, the facts first.

## Voice

| We are | So we write | Not |
|---|---|---|
| Clear | "Your money arrives in seconds." | "Transfers are processed in near real time." |
| Honest | "This transfer costs ₺4,50." | "A small fee may apply." |
| Calm | "We could not send this. Your money has not left your account." | "Error! Transaction failed!" |
| Respectful | "Check the IBAN and try again." | "You entered an invalid IBAN." |

## Tone by moment

| Moment | Tone | Example |
|---|---|---|
| Everyday tasks | Brief and neutral | "Send money" |
| Success | Plain, no celebration | "Money sent. Deniz gets ₺250,00 in a few seconds." |
| Errors | Calm, say what happened and what to do next | "We could not reach your bank. Try again in a minute." |
| Risk and security | Direct and specific | "Never share this code. Leeward will never ask for it." |
| Fees and limits | Exact numbers, no softening | "You can send ₺20.000,00 more today." |

## Rules

- Second person, active voice: "You can freeze your card", not "Cards can be frozen".
- Sentence case for everything, including buttons and headings.
- Buttons start with a verb and say the outcome: "Send ₺250", "Freeze card".
- Dialog titles are questions when people decide: "Freeze your card?"
- Errors say what happened, then what to do. Never blame the person.
- Numbers are digits. Amounts are always formatted with `formatAmount()` or AmountDisplay.
- No em dashes. Use a comma, colon or period.
- No hype words: no "seamless", "revolutionary", "magic", "instantly" unless it is literally instant.
- No exclamation marks.

## Microcopy by component

| Component | Rule |
|---|---|
| Button | Verb plus object, two or three words. Put the amount in money actions. |
| TextField, Select | Label is a noun ("Recipient"); hint says format or why we ask. Placeholders are examples, never instructions. |
| Error message | "Enter a valid IBAN. It has 26 characters and starts with TR." |
| Empty state | Say why it is empty and what to do: "No transactions yet. Money you send or receive shows up here." |
| Toast | Past tense, what happened: "Card frozen." |
| Alert | Title says the situation; body says the consequence and next step. |
| Tooltip | One short sentence that adds information the label cannot hold. |

## Terminology

Use these words, in this form, everywhere. When a term changes, change it here first.

| Use (English) | Use (Turkish) | Avoid | Notes |
|---|---|---|---|
| Send money | Para gönder | Transfer funds, remit | The main action. "Transfer" is fine between your own accounts. |
| Move money | Para aktar | Internal transfer | Between your own accounts. |
| Request money | Para iste | Collect | |
| Recipient | Alıcı | Beneficiary, payee | |
| Account | Hesap | Wallet | "Wallet" only for the digital wallet product. |
| Balance | Bakiye | Funds available | |
| Available balance | Kullanılabilir bakiye | | Balance minus pending card payments. |
| Pending | Bekliyor | Processing, in progress | A transaction not yet final. |
| Declined | Reddedildi | Failed, rejected | The bank or merchant refused it. |
| Fee | Ücret | Charge, commission | Always shown, even when zero. |
| Exchange rate | Döviz kuru | FX rate | |
| Statement | Hesap özeti | Report | |
| Freeze card | Kartı dondur | Block, suspend | Temporary and reversible. |
| Cancel card | Kartı iptal et | Close card | Permanent. |
| One-time code | Tek kullanımlık kod | OTP, SMS code | |
| Savings goal | Birikim hedefi | Pot, vault | |
| Spending | Harcamalar | Expenses | |

## Accessibility of copy

- Write link and button text that makes sense on its own: "Download statement", not "Click here".
- Screen reader text in components (for example "IBAN ending in 1 3 2 6") follows the same voice and lives in `utils/messages.ts`, in English and Turkish.
