#!/usr/bin/env node
// Entry point: serves the Leeward MCP server over stdio.
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createServer } from "./server.ts";

serveStdio(createServer, { onerror: (error) => console.error(error) });
