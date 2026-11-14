// Runs in a clean project with the packed packages installed from tarballs.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { brands, tokens } from "@leeward/tokens";
import { generatePartnerTheme, rampsFromPrimitives } from "@leeward/tokens/partner";

const require = createRequire(import.meta.url);
assert.deepEqual([...brands], ["leeward", "business"]);
assert.equal(tokens.leeward.light["fill.primary.default"].cssVar, "--lw-fill-primary-default");
assert.equal(require("@leeward/tokens/tokens.json")["text.default"].cssVar, "--lw-text-default");
assert.match(require.resolve("@leeward/tokens/css"), /dist\/css\/tokens\.css$/);

const theme = generatePartnerTheme({ name: "acme", seed: "#0E7490", ramps: rampsFromPrimitives(require("@leeward/tokens/primitives.json")) });
assert.ok(theme.results.length > 600, "partner theme checks every required pair");
assert.equal(theme.failures.length, 0);
console.log(`tokens: ok (${theme.results.length} partner pairs, 0 failures)`);
