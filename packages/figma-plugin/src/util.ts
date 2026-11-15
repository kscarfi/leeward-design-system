// Small helpers shared by every builder.

/** "1rem" -> 16, "12px" -> 12, "clamp(2.5rem, ..., 3.625rem)" -> the largest value (desktop). */
export function px(value: string | number): number {
  if (typeof value === "number") return value;
  const clamp = value.match(/^clamp\(([^,]+),.*,\s*([^)]+)\)$/);
  if (clamp) return px(clamp[2]!.trim());
  if (value.endsWith("rem")) return parseFloat(value) * 16;
  if (value.endsWith("px")) return parseFloat(value);
  if (value.endsWith("em")) return parseFloat(value);
  return parseFloat(value) || 0;
}

export function rgba(color: string): RGBA {
  const c = color.trim();
  if (c.startsWith("#")) {
    const h = c.slice(1);
    const full = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
    const n = (i: number) => parseInt(full.slice(i, i + 2), 16) / 255;
    return { r: n(0), g: n(2), b: n(4), a: full.length === 8 ? n(6) : 1 };
  }
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const [r, g, b, a = "1"] = m[1]!.split(",").map((s) => s.trim());
    return { r: Number(r) / 255, g: Number(g) / 255, b: Number(b) / 255, a: Number(a) };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

/** Token name to Figma variable name: "fill.primary.default" -> "fill/primary/default". */
export const varName = (token: string) => token.replace(/\./g, "/");

/** A list of errors collected while building, shown in the report at the end. */
export const problems: string[] = [];

export async function step<T>(label: string, run: () => Promise<T> | T): Promise<T | undefined> {
  try {
    console.log(`Leeward: ${label}`);
    figma.notify(`Leeward: ${label}…`, { timeout: 1500 });
    return await run();
  } catch (error) {
    console.error(`Leeward: ${label} failed`, error);
    problems.push(`${label}: ${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }
}
