import assert from "node:assert/strict";
import { test } from "node:test";
import { Client, InMemoryTransport } from "@modelcontextprotocol/client";
import { createServer } from "./server.ts";
import { validateUi } from "./validate.ts";

async function connect() {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = createServer();
  const client = new Client({ name: "test", version: "1.0.0" });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  return client;
}

test("lists the five tools", async () => {
  const client = await connect();
  const { tools } = await client.listTools();
  assert.deepEqual(tools.map((t) => t.name).sort(), ["get_component", "get_guidelines", "get_tokens", "search_components", "validate_ui"]);
});

test("get_tokens filters by theme and category", async () => {
  const client = await connect();
  const result = await client.callTool({ name: "get_tokens", arguments: { brand: "business", mode: "dark", category: "space" } });
  const data = result.structuredContent as { count: number; tokens: Array<{ cssVar: string }> };
  assert.ok(data.count >= 9);
  assert.ok(data.tokens.every((t) => t.cssVar.startsWith("--lw-space-")));
});

test("get_component returns rules and an example", async () => {
  const client = await connect();
  const result = await client.callTool({ name: "get_component", arguments: { name: "amountdisplay" } });
  const data = result.structuredContent as { name: string; dont: string[]; example: string };
  assert.equal(data.name, "AmountDisplay");
  assert.ok(data.dont.some((d) => d.includes("red")));
  assert.match(data.example, /<AmountDisplay/);
});

test("get_component suggests on a miss", async () => {
  const client = await connect();
  const result = await client.callTool({ name: "get_component", arguments: { name: "Modal" } });
  assert.equal(result.isError, true);
});

test("search_components finds the OTP pattern", async () => {
  const client = await connect();
  const result = await client.callTool({ name: "search_components", arguments: { query: "one-time code" } });
  const data = result.structuredContent as { results: Array<{ name: string }> };
  assert.equal(data.results[0]?.name, "OTPInput");
});

test("get_guidelines returns a topic", async () => {
  const client = await connect();
  const result = await client.callTool({ name: "get_guidelines", arguments: { topic: "amounts" } });
  assert.match(JSON.stringify(result.structuredContent), /never red/i);
});

test("validate_ui catches the usual agent mistakes", () => {
  const code = `
    function FeeRow() { return <div style={{ color: "#ff0000", padding: 13 }}><span>₺12.50</span> fee \u2014 no refunds</div>; }
    export function Screen() {
      return (
        <main>
          <TextField />
          <IconButton icon="arrow-up-right" label="Send money" />
          <input type="text" />
          <Text tone="danger" tabular>-85</Text>
          <div style={{ background: "var(--lw-color-indigo-600)" }} />
          <FeeRow />
          <span>{(12.5).toFixed(2)}</span>
        </main>
      );
    }`;
  const { summary, stats } = validateUi(code);
  assert.equal(summary["raw-color"], 1);
  assert.equal(summary["raw-spacing"], 1);
  assert.equal(summary["em-dash"], 1);
  assert.equal(summary["missing-label"], 2);
  assert.equal(summary["icon-only-money-action"], 1);
  assert.equal(summary["red-amount"], 1);
  assert.equal(summary["primitive-token"], 1);
  assert.equal(summary["hand-formatted-money"], 2);
  assert.deepEqual(stats.customComponents, ["FeeRow"]);
});

test("validate_ui accepts inputs wrapped in a label", () => {
  const { summary } = validateUi(`export const A = () => <label><input type="radio" name="r" /> Deniz</label>;`);
  assert.equal(summary["missing-label"], 0);
});

test("validate_ui counts every raw color and CSS spacing in style strings, and skips variables the code defines", () => {
  const code = `
    const css = \`
      :root { --lw-bg: #f4f6f8; --lw-text: #0f1b2d; }
      .card { padding: 16px 20px; color: var(--lw-text); margin: var(--lw-space-md); }
    \`;
    export function Screen() { return <style>{css}</style>; }`;
  const { summary, stats } = validateUi(code);
  assert.equal(summary["raw-color"], 2);
  assert.equal(summary["raw-spacing"], 1);
  assert.equal(summary["unknown-token"], 0);
  assert.deepEqual(stats.customCssVariables, ["--lw-bg", "--lw-text"]);
});

test("validate_ui passes clean Leeward code", () => {
  const code = `
    import { AmountDisplay, Button, TextField } from "@leeward/react";
    export function Screen() {
      return (
        <main style={{ padding: "var(--lw-space-md)" }}>
          <TextField label="Amount" prefix="₺" numeric />
          <AmountDisplay value={250} currency="TRY" locale="tr-TR" direction="outgoing" />
          <Button>Send ₺250</Button>
        </main>
      );
    }`;
  const result = validateUi(code);
  assert.deepEqual(result.issues, []);
  assert.equal(result.stats.leewardComponents, 3);
});
