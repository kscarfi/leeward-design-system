// Leeward MCP server: tokens, components, guidelines and a UI validator for AI agents.
import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { manifest, tokenBrands, tokenData, tokenModes } from "./data.ts";
import { guidelines, topics } from "./guidelines.ts";
import { validateUi } from "./validate.ts";

const CATEGORIES = ["fill", "text", "icon", "border", "focus-ring", "amount", "space", "size", "radius", "type", "elevation", "motion", "layer"] as const;

const json = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }], structuredContent: value as Record<string, unknown> });
const fail = (text: string) => ({ content: [{ type: "text" as const, text }], isError: true });

export function scoreComponent(query: string, c: (typeof manifest.components)[number]): number {
  const words = query.toLowerCase().split(/\W+/).filter((w) => w.length > 1);
  const hay = {
    name: c.name.toLowerCase(),
    purpose: c.purpose.toLowerCase(),
    rest: [...c.do, ...c.dont, ...c.accessibility, ...c.props.map((p) => p.name)].join(" ").toLowerCase(),
  };
  let score = 0;
  for (const w of words) {
    if (hay.name === w) score += 10;
    else if (hay.name.includes(w)) score += 5;
    if (hay.purpose.includes(w)) score += 3;
    if (hay.rest.includes(w)) score += 1;
  }
  return score;
}

export function createServer() {
  const server = new McpServer({ name: "leeward-design-system", version: "0.1.0" });

  server.registerTool(
    "get_tokens",
    {
      description: "List Leeward design tokens (semantic CSS variables) for a brand and mode, optionally filtered by category. Use these instead of raw values. Colors: fill, text, icon, border.",
      inputSchema: z.object({
        brand: z.enum(tokenBrands as [string, ...string[]]).optional().describe("Brand. Defaults to leeward."),
        mode: z.enum(tokenModes as [string, ...string[]]).optional().describe("light or dark. Defaults to light."),
        category: z.enum(CATEGORIES).optional().describe("Token category, for example fill, text or space."),
      }),
    },
    async ({ brand = "leeward", mode = "light", category }) => {
      const all = tokenData[brand]?.[mode];
      if (!all) return fail(`Unknown brand or mode "${brand} ${mode}". Brands: ${tokenBrands.join(", ")}. Modes: ${tokenModes.join(", ")}.`);
      const theme = `${brand} ${mode}`;
      const entries = Object.entries(all)
        .filter(([name]) => !category || name.startsWith(`${category}.`))
        .map(([name, t]) => ({ name, cssVar: t.cssVar, value: t.value, ...(t.description ? { description: t.description } : {}) }));
      return json({ theme, category: category ?? "all", count: entries.length, tokens: entries });
    },
  );

  server.registerTool(
    "get_component",
    {
      description: "Get one Leeward component: import, props with types, variants, do and don't rules, accessibility notes and a correct example.",
      inputSchema: z.object({ name: z.string().describe("Component name, for example Button or AmountDisplay.") }),
    },
    async ({ name }) => {
      const component = manifest.components.find((c) => c.name.toLowerCase() === name.toLowerCase());
      if (!component) {
        const close = manifest.components.map((c) => ({ c, s: scoreComponent(name, c) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 3).map((x) => x.c.name);
        return fail(`No component named "${name}".${close.length ? ` Did you mean: ${close.join(", ")}?` : ""} Use search_components.`);
      }
      return json(component);
    },
  );

  server.registerTool(
    "search_components",
    {
      description: "Find Leeward components for a need, for example \"show an amount\", \"one-time code\" or \"confirm before deleting\".",
      inputSchema: z.object({ query: z.string().describe("What you want to build.") }),
    },
    async ({ query }) => {
      const results = manifest.components
        .map((c) => ({ name: c.name, kind: c.kind, purpose: c.purpose, score: scoreComponent(query, c) }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
      return json({ query, results });
    },
  );

  server.registerTool(
    "get_guidelines",
    {
      description: `Get Leeward design rules for a topic. Topics: ${topics.join(", ")}, or "all".`,
      inputSchema: z.object({ topic: z.string().describe(`One of: ${topics.join(", ")}, all.`) }),
    },
    async ({ topic }) => {
      const key = topic.toLowerCase().trim();
      if (key === "all") return json({ setup: manifest.setup, guidelines });
      const found = guidelines[key] ?? Object.entries(guidelines).find(([k, g]) => k.includes(key) || g.title.toLowerCase().includes(key))?.[1];
      if (!found) return fail(`Unknown topic "${topic}". Topics: ${topics.join(", ")}.`);
      return json(found);
    },
  );

  server.registerTool(
    "validate_ui",
    {
      description: "Check generated React/TSX for raw colors, unknown or primitive tokens, raw spacing, unknown components, missing labels, red amounts, hand-formatted money and em dashes. Returns issues with fixes.",
      inputSchema: z.object({ code: z.string().describe("TSX source of a screen or component.") }),
    },
    async ({ code }) => json(validateUi(code)),
  );

  return server;
}
