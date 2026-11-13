# 0002. Monorepo tooling

- Status: Accepted
- Date: 2026-11-13
- Deciders: Kemal Salih Carfi

## Context

The project ships several packages that depend on each other: tokens feed components, components and tokens feed the manifest and the MCP server, and apps consume all of them. They need to change together in one pull request and one CI run.

## Decision

- **pnpm workspaces**, as set in the brief. Workspace globs live in `pnpm-workspace.yaml` (`packages/*`, `apps/*`).
- **pnpm 12.18.0**, pinned with the `packageManager` field in the root `package.json`. CI reads the same field through `pnpm/action-setup`, so local and CI use one version.
- **Node.js 24**, pinned in `.nvmrc`. CI reads it with `node-version-file`.
- **TypeScript 6.0.3**, strict mode, one shared `tsconfig.base.json`. Each package extends it. Day 1 started on 7.0.2; see the update below.
- No task runner (Turborepo, Nx) for now. `pnpm -r` is enough for seven packages. Revisit if CI time becomes a problem.
- Scripts in `scripts/` are TypeScript run directly by Node 24 (type stripping), with no build step.

## Notes from checking the docs

- TypeScript 7 is the native Go port. It makes `strict` the default, removes `baseUrl` and `moduleResolution: node`, and defaults `types` to `[]`. Our base config sets `moduleResolution: bundler` and opts into `types: ["node"]` only where needed.
- Tools that use the TypeScript compiler API (typescript-eslint, Storybook docgen) may need a compatible TypeScript version. This is checked on the day each tool is added. If one needs it, we add a scoped older TypeScript for that tool only and record it here.
- pnpm 12 reads most settings from `pnpm-workspace.yaml`. `.npmrc` keeps only auth and registry settings.

## Consequences

- One install, one lockfile, one CI job.
- Contributors need Corepack (`corepack enable pnpm`) or pnpm 12 installed.
- TypeScript 7 is new. Tooling compatibility is the main risk and is watched on Days 3 and 5.

## Update, 2026-11-13: TypeScript 7 to 6.0

typescript-eslint 8.72 declares `typescript: ">=4.8.4 <6.1.0"` as a peer dependency, because TypeScript 7 (the Go port) does not yet expose the compiler API that lint tools use. ESLint with type-aware rules is part of the brief, so the repo moved to TypeScript 6.0.3, the last JavaScript release, which every tool supports. Moving back to 7 is a one-line change once typescript-eslint supports it.
