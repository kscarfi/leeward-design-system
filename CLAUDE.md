# CLAUDE.md

`PROJECT_BRIEF.md` is the single source of truth. Read it fully before any work.

## Working rules

1. Plan first. At the start of each day, write a short plan and wait for Kemal's OK. Do not start the next day without approval.
2. Ask Kemal before deciding: final colors, fonts or type scale; component API naming that affects many components; any dependency outside the brief's tech stack table; anything for LinkedIn or the README headline.
3. Small commits with conventional messages (`feat(tokens): ...`, `fix(button): ...`).
4. WCAG 2.2 AA is non-negotiable. Keyboard reachable, visible focus, accessible name. Never color alone.
5. No hardcoded values in components. If a token is missing, propose one.
6. No fabricated numbers. Every metric comes from `docs/build-log.md` or a script output.
7. Verify, do not assume. Check current official docs before configuring any tool.
8. Copy: clear, short, second person, no em dashes, no hype words. `pnpm check:copy` enforces the em dash rule.
9. Write an ADR in `docs/decisions/` for any decision someone might later ask "why?" about.
10. Update `docs/build-log.md` at the end of every task. Never fill in "Estimated time without AI": ask Kemal. Log AI mistakes honestly.

## Commands

- `pnpm install`
- `pnpm typecheck`
- `pnpm check:copy`
