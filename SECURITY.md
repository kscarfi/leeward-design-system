# Security policy

## Supported versions

Only the latest minor version of the `@leeward/*` packages receives fixes.

## Report a vulnerability

Do not open a public issue. Use GitHub's [private vulnerability reporting](https://github.com/kscarfi/leeward-design-system/security/advisories/new) for this repository, or contact the maintainer through [kscarfi.com](https://kscarfi.com).

Please include the package and version, a description, steps to reproduce and the impact. You will get an answer within 7 days.

## Supply chain

- Packages are published from GitHub Actions with npm trusted publishing: no npm token is stored, and every version carries a provenance statement that links it to the commit and workflow that built it.
- Dependencies are pinned in `pnpm-lock.yaml`, and the lockfile is checked against pnpm's supply-chain policies on install.
