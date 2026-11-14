// Loads the manifest and tokens the tools serve. Both are generated and committed in the repo.
import { readFileSync } from "node:fs";
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
  components: ManifestComponent[];
}

export const manifest = JSON.parse(readFileSync(new URL("../../../components.manifest.json", import.meta.url), "utf8")) as Manifest;
export const componentNames = new Set(manifest.components.map((c) => c.name));
// Every capitalized value export of @leeward/react is a valid JSX tag too (List, DialogClose,
// SheetClose, ToastProvider...). Read from the package itself so this list can never drift.
const indexSource = readFileSync(new URL("../../react/src/index.ts", import.meta.url), "utf8");
for (const block of indexSource.matchAll(/export \{([^}]*)\}/g)) {
  for (const raw of block[1]!.split(",")) {
    const name = raw.trim();
    if (/^[A-Z]\w*$/.test(name)) componentNames.add(name);
  }
}

export type TokenEntry = { value: string | number; cssVar: string; type?: string; description?: string; ref?: string };
export const tokenBrands = brands as readonly string[];
export const tokenModes = modes as readonly string[];
export const tokenData = tokens as unknown as Record<string, Record<string, Record<string, TokenEntry>>>;
export const allowedVars = new Set(Object.values(tokenData.leeward!.light!).map((t) => t.cssVar));
