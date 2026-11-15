# 0006. Storybook on GitHub Pages

- Status: Accepted
- Date: 2026-11-15

## Context

The brief left docs hosting open between Netlify and GitHub Pages. Storybook only ran locally, so the Figma Community file and the README had no live docs to link to. Kemal asked for a free option.

## Decision

- Storybook is published to GitHub Pages from `.github/workflows/storybook.yml` on every push to main, and can be run by hand.
- Pages uses "GitHub Actions" as its source: the workflow builds `apps/docs/storybook-static` and deploys it with `actions/upload-pages-artifact` and `actions/deploy-pages`. Nothing is committed to a `gh-pages` branch.
- GitHub Pages is free for public repositories and needs no account beyond GitHub. Netlify would add a second account and a token for the same result.

## Consequences

- The live docs always match main, not the last npm release.
- The site lives at `kscarfi.github.io/leeward-design-system`. A custom domain can be added later in the Pages settings without changing the workflow.
- Storybook builds with relative paths, so it works under the repository subpath.
