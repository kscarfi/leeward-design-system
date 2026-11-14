// Loads the manifest and tokens the tools serve. Both are generated, committed in the repo and shipped in the package.
import { existsSync, readFileSync } from "node:fs";
import { brands, modes, tokens } from "@leeward/tokens";

export interface ManifestProp {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  values?: string[];
}

export interface ManifestComponent {
  name: string;
  kind: "component" | "pattern";
  import: string;
  purpose: string;
  props: ManifestProp[];
  variants: Record<string, string[]>;
  whenToUse: string[];
  whenNotToUse: string[];
  contentGuidelines: string[];
  sizes: string[];
  do: string[];
  dont: string[];
  accessibility: string[];
  keyboard: string[];
  example: string;
}

export interface Manifest {
  name: string;
  package: string;
  setup: string[];
  icons: string[];
  exports: string[];
  components: ManifestComponent[];
}

// The published package carries its own copy of the manifest; in the repo it is read from the root.
const manifestUrl = [new URL("../components.manifest.json", import.meta.url), new URL("../../../components.manifest.json", import.meta.url)].find((url) => existsSync(url));
if (!manifestUrl) throw new Error("components.manifest.json not found. Run pnpm build:agent.");
export const manifest = JSON.parse(readFileSync(manifestUrl, "utf8")) as Manifest;
// Every component name plus every other capitalized export (List, DialogClose, SheetClose,
// ToastProvider...) is a valid JSX tag. The manifest lists them, read from the package source.
export const componentNames = new Set([...manifest.components.map((c) => c.name), ...manifest.exports]);

export type TokenEntry = { value: string | number; cssVar: string; type?: string; description?: string; ref?: string };
export const tokenBrands = brands as readonly string[];
export const tokenModes = modes as readonly string[];
export const tokenData = tokens as unknown as Record<string, Record<string, Record<string, TokenEntry>>>;
export const allowedVars = new Set(Object.values(tokenData.leeward!.light!).map((t) => t.cssVar));
