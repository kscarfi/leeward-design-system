// The plugin reads the same compiled sources as the code: tokens, icons and the component manifest.
import leewardLight from "../../tokens/dist/ts/leeward.light.json";
import leewardDark from "../../tokens/dist/ts/leeward.dark.json";
import businessLight from "../../tokens/dist/ts/business.light.json";
import businessDark from "../../tokens/dist/ts/business.dark.json";
import primitives from "../../tokens/src/primitive/color.json";
import manifest from "../../../components.manifest.json";
import { iconData } from "../../react/src/components/Icon/icons.generated.ts";

export interface Token {
  value: string | number;
  cssVar: string;
  type?: string;
  description?: string;
  ref?: string;
}
export type TokenSet = Record<string, Token>;

/** The four modes of the Leeward collection. Dark files only hold what differs from light. */
export const modes: Array<{ name: string; tokens: TokenSet }> = [
  { name: "Leeward Light", tokens: leewardLight as TokenSet },
  { name: "Leeward Dark", tokens: { ...(leewardLight as TokenSet), ...(leewardDark as TokenSet) } },
  { name: "Business Light", tokens: businessLight as TokenSet },
  { name: "Business Dark", tokens: { ...(businessLight as TokenSet), ...(businessDark as TokenSet) } },
];

export const light = modes[0]!.tokens;

/** Primitive ramps: name -> step -> hex. */
export const ramps: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries((primitives as { color: Record<string, unknown> }).color)
    .filter(([name]) => !name.startsWith("$"))
    .map(([name, steps]) => [name, Object.fromEntries(Object.entries(steps as Record<string, { $value: string }>).filter(([s]) => !s.startsWith("$")).map(([s, t]) => [s, t.$value]))]),
);

export interface ManifestComponent {
  name: string;
  kind: "component" | "pattern";
  purpose: string;
  whenToUse: string[];
  whenNotToUse: string[];
  do: string[];
  dont: string[];
  accessibility: string[];
  sizes: string[];
  variants: Record<string, string[]>;
  props: Array<{ name: string; type: string; required: boolean; description?: string }>;
}
export const components = (manifest as { components: ManifestComponent[] }).components;

export const icons = iconData as Record<string, Record<"linear" | "bold" | "duotone", string>>;
