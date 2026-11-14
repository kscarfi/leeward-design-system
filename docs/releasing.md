# Releasing

The four packages share one version and are published together by [`.github/workflows/release.yml`](../.github/workflows/release.yml) when a tag such as `v0.2.0` is pushed. Publishing uses npm trusted publishing: no npm token is stored in GitHub, and each version gets a provenance statement on npm.

## One-time setup on npmjs.com

For each package (`@leeward/tokens`, `@leeward/react`, `@leeward/lint`, `@leeward/mcp-server`):

1. Open the package on npmjs.com, then **Settings**, then **Trusted publishing**.
2. Choose **GitHub Actions** and fill in:
   - Organization or user: `kscarfi`
   - Repository: `leeward-design-system`
   - Workflow filename: `release.yml`
3. Allow the `npm publish` action, then save.

npm only checks these fields when a publish runs, and a new configuration must be used within 2 days.

## Each release

1. Set the same version in the four `packages/*/package.json` files and add it to [CHANGELOG.md](../CHANGELOG.md).
2. Run the checks locally, including `pnpm smoke:packages`.
3. Commit, then tag and push:

```bash
git tag v0.2.0 && git push origin v0.2.0
```

The workflow checks that the tag matches every package version, runs the type checks, unit tests and the clean-install smoke test, then publishes tokens, react, lint and mcp-server in that order. Versions already on npm are skipped, so a failed run can be repeated.

After it finishes, `pnpm smoke:packages --registry` installs the published versions from npm and runs the same checks.
