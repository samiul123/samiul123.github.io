# Open Source Contributions Section — Design Spec

**Date:** 2026-07-18
**Status:** Approved

---

## Overview

A new top-level portfolio section, "Open Source", listing pull requests contributed to repositories the author doesn't own. It sits right after Projects in the nav and on the page, and follows the same visual language as `Project.jsx` (masonry card grid, `driftUp`/`staggerContainer` motion, dark card styling). It is a separate section rather than folded into Projects because a contribution's shape (repo you don't own, a PR, a merge/open/closed state) doesn't map onto the existing project-card fields (owned repo, demo URL, live/wip/archived status).

Starts with a single contribution; the grid layout renders correctly with 1 item and needs no changes as more are added later.

---

## Section 1 — Data

### File
`src/constants/index.js`

### New export: `contributions`
```js
const contributions = [
  {
    id: 'slug',
    repo: 'owner/repo',
    repoUrl: 'https://github.com/owner/repo',
    prTitle: 'Fix ...',
    prUrl: 'https://github.com/owner/repo/pull/123',
    date: '2026-01',        // month-year
    status: 'merged',       // merged | open | closed
    tags: ['JavaScript', 'CI'],
    description: 'One-liner on what the PR did and why it mattered.'
  }
]
```
Added alongside the existing `projects` array and included in the final `export { ... }` line at the bottom of the file.

---

## Section 2 — OpenSource Component

### File
`src/components/OpenSource.jsx`

### Structure
Mirrors `Project.jsx`:
- `<section id={props.id}>` wrapper, same padding/background classes as Project (`bg-custom-dark text-white px-6 lg:px-20 py-20`)
- Eyebrow text `— Open Source`, page title `OPEN SOURCE` (same `styles.pageTitle` class)
- Masonry grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start`
- Sorted by `date` descending (same pattern as Project's year sort)

### ContributionCard (internal component)
Same card shell as `ProjectCard` (border, rounded corners, hover border color, `driftUp` stagger), with these fields instead:
- Eyebrow: repo name (`owner/repo`), clicking opens `repoUrl` in new tab (same icon-button pattern as the existing GitHub icon button)
- Title: `prTitle`, clicking opens `prUrl` in new tab (external-link `↗` glyph, same as the existing demo-link button)
- Status badge + date row: badge label/color driven by a `statusConfig` map for PR states:
  | status | label | style |
  |---|---|---|
  | merged | Merged | green (same tokens as Project's `live`) |
  | open | Open | amber (same tokens as Project's `wip`) |
  | closed | Closed | gray (same tokens as Project's `archived`) |
- Description: same style as Project's description text
- Tag chips: same chip style as Project's `skills` chips, sourced from `tags`

No new icon assets needed — reuse the existing `github` asset import for the repo-link icon and the existing `↗` glyph pattern for the PR link.

---

## Section 3 — Integration

### `src/constants/index.js`
- Add `contributions` array (Section 1)
- Add `import { OpenSource } from "../components/OpenSource";`
- Insert into `navLinks`, immediately after the `projects` entry:
```js
{
    id: 'open-source',
    title: 'OPEN SOURCE',
    route: OpenSource
}
```
- Add `contributions` to the final `export { ... }` statement

### No changes to
- `App.jsx` / `header.jsx` — both already render every entry in `navLinks` generically, so the new section appears in nav and on the page automatically
- `Project.jsx` — untouched; contributions are fully separate from projects

---

## Out of Scope
- Filtering/sorting UI (only 1 contribution today; revisit if the list grows large)
- Auto-fetching PR status from GitHub's API (data is entered manually in `constants/index.js`, same as projects)
- A distinct "featured single item" layout — the existing grid handles 1 item fine and avoids throwaway layout work
