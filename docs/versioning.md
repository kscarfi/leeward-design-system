# Versioning, release cycle and support

## Versions

All four packages share one version and follow [semantic versioning](https://semver.org):

| Change | Version | Example |
|---|---|---|
| Bug fix, docs, visual fix that keeps the API | Patch: 0.2.0 to 0.2.1 | A focus ring that was clipped |
| New component, prop or token; a deprecation | Minor: 0.2.0 to 0.3.0 | A new `shape` prop |
| Removing or renaming a component, prop or token; changing a default | Major | Removing a deprecated prop |

While the version is below 1.0, a minor version may include a breaking change; it is always listed under "Breaking" in the [changelog](../CHANGELOG.md) with a migration note.

## Release cycle

- Patch releases go out when a fix is ready.
- Minor releases go out when a set of features is done, usually every few weeks.
- Major releases are announced in the changelog and the roadmap at least one minor version ahead.

How to publish: [releasing.md](releasing.md).

## Deprecation

1. The old API keeps working and logs nothing at runtime.
2. The docs and the changelog say what to use instead, and lint flags the old usage where possible.
3. It is removed in the next major version, never sooner than one minor release after the deprecation.

Token renames ship an alias for at least one minor version, as `compat-v1.css` did for v1 token names.

## Browser and platform support

| Platform | Supported |
|---|---|
| Chrome, Edge, Firefox | Last two major versions |
| Safari on macOS and iOS | 17 and later |
| Samsung Internet | Last two major versions |
| React | 19 |
| Node.js (tooling, MCP server, lint) | 20.10 and later |

Components use CSS custom properties, `:focus-visible`, logical properties and subgrid. Older browsers may render without some layout refinements; they are not tested.
