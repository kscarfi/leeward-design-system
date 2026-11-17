# 0007. Chromatic for the Storybook showcase

- Status: Accepted
- Date: 2026-11-17

## Context

Kemal wants Leeward listed in the Storybook showcase. The showcase only indexes Storybooks published on Chromatic and crawls them every 24 hours. There is no other way to submit a project. Storybook is already hosted on GitHub Pages (ADR 0006).

## Decision

- `.github/workflows/chromatic.yml` builds Storybook and publishes it to Chromatic with the official `chromaui/action`.
- It runs on release tags and by hand, not on every push. Each publish uses Chromatic snapshots, and the free plan has a monthly limit.
- Chromatic is used only as a host. Every snapshot is accepted automatically. Visual regression stays in our own Playwright job in CI, which compares against committed baselines.
- The project token is a GitHub Actions secret, `CHROMATIC_PROJECT_TOKEN`. It is never written to the repository.

## Consequences

- The showcase shows Leeward as of the last release, not the latest commit. GitHub Pages stays the live, always-current Storybook.
- If snapshot use grows, the workflow can switch to `onlyChanged`, or publish on minor releases only.
