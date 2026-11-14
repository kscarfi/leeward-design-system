// Writes dist/styles.css for npm: the token import, the base styles, then every component's CSS,
// so one import styles the whole library. Also copies fonts.css.
import { copyFileSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const dist = new URL("../dist/", import.meta.url);
const tokenImport = '@import "@leeward/tokens/css";';
const base = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8");
if (!base.includes(tokenImport)) throw new Error("global.css must import @leeward/tokens/css");
const components = readFileSync(new URL("components.css", dist), "utf8");

writeFileSync(
  new URL("styles.css", dist),
  `${tokenImport}\n\n/* Base styles */\n${base.replace(tokenImport, "").trim()}\n\n/* Components */\n${components.trim()}\n`,
);
rmSync(new URL("components.css", dist));
copyFileSync(new URL("../src/styles/fonts.css", import.meta.url), new URL("fonts.css", dist));
console.log("Wrote dist/styles.css and dist/fonts.css.");
