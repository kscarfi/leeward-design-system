// Starts the published leeward-mcp command and calls every tool over stdio.
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

const client = new Client({ name: "package-smoke", version: "1.0.0" });
await client.connect(new StdioClientTransport({ command: "npx", args: ["leeward-mcp"] }));
const call = async (name, args) => JSON.parse((await client.callTool({ name, arguments: args })).content[0].text);

const { tools } = await client.listTools();
assert.deepEqual(tools.map((t) => t.name).sort(), ["get_component", "get_guidelines", "get_tokens", "search_components", "validate_ui"]);
assert.deepEqual((await call("get_component", { name: "Button" })).variants.shape, ["rounded", "pill"]);
assert.ok((await call("get_tokens", { brand: "business", mode: "dark", category: "radius" })).count > 0);
assert.equal((await call("search_components", { query: "one-time code" })).results[0].name, "OTPInput");
const rules = (await call("validate_ui", { code: '<div style={{ color: "#ff0000" }}><IconButton icon="send" label="Send" /><SheetClose /></div>' })).issues.map((i) => i.rule);
assert.deepEqual(rules.sort(), ["icon-only-money-action", "raw-color"]);
await client.close();
console.log("mcp-server: ok (5 tools)");
