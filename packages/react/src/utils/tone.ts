// Class names for the shared message tones (styles/tone.module.css), used by Alert and Banner.
import toneStyles from "../styles/tone.module.css";

export type MessageTone = "info" | "success" | "warning" | "danger" | "neutral";

const cap = (t: string) => t[0]!.toUpperCase() + t.slice(1);

/** The surface (background, border, text) and icon color classes for a tone. */
export function toneClasses(tone: MessageTone): { surface: string | undefined; icon: string | undefined } {
  return { surface: toneStyles[`surface${cap(tone)}`], icon: toneStyles[`icon${cap(tone)}`] };
}
