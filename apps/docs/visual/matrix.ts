// Runs every story test (including axe) once per brand and mode. Used by CI.
import { spawnSync } from "node:child_process";

const combos = [
  ["leeward", "light"],
  ["leeward", "dark"],
  ["business", "light"],
  ["business", "dark"],
  ["harbor", "light"],
  ["harbor", "dark"],
] as const;

let failed = 0;
for (const [brand, mode] of combos) {
  console.log(`\n== ${brand} ${mode}`);
  const r = spawnSync("vitest", ["run"], { stdio: "inherit", env: { ...process.env, VITE_LW_BRAND: brand, VITE_LW_MODE: mode }, shell: process.platform === "win32" });
  if (r.status !== 0) failed++;
}
if (failed) {
  console.error(`\n${failed} of ${combos.length} brand and mode runs failed.`);
  process.exit(1);
}
