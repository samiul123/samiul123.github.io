# Skills Section — Tabbed Compact Design

**Date:** 2026-04-13  
**Status:** Approved

## Problem

The Skills section renders all 4 categories stacked vertically (each with `mb-14` gaps and `py-20` section padding), making it one of the tallest sections on the page and requiring significant scrolling.

## Goal

Reduce vertical space to roughly the height of a single category panel while preserving all logos and labels.

## Design

### Layout

- Section heading stays unchanged: eyebrow "— What I Work With" + `SKILLS` h2.
- Below the heading: a tab bar with 4 tabs, one per skill group.
- Only one category panel is visible at a time.
- Default active tab: first tab ("Languages").

### Tab bar

- Tabs: **Languages · Frameworks · Databases · Tools** (shortened from full category titles in `skillGroups`).
- Active tab: green (`text-custom-green`) with a 2px green bottom border.
- Inactive tabs: muted gray, green on hover.
- Border: 1px bottom line under the full tab bar (same `#1a1a1a` shade used elsewhere).
- Overflow: horizontally scrollable on narrow screens (no wrapping).
- Tab label mapping (display name ← `group.title`):
  - `PROGRAMMING LANGUAGES` → `Languages`
  - `FRAMEWORKS & LIBRARIES` → `Frameworks`
  - `DATABASE & CACHING` → `Databases`
  - `TOOLS` → `Tools`

### Skill panel

- Grid layout: `grid-cols-3 sm:grid-cols-4 lg:grid-cols-6` — same as current `SkillCategory`.
- Each cell: existing `SkillCard` component unchanged (32×32 logo + 9px label below).
- Panel height: determined by the tallest category (Languages / Frameworks, 9 items each).

### Animation

- Uses Framer Motion `AnimatePresence` with a `key`-driven remount so the exit/enter cycle fires on every tab switch.
- Enter animation: `opacity 0→1` + `y 8px→0` over ~0.2s ease — consistent with the existing `driftUp` utility.
- Exit animation: `opacity 1→0` over ~0.15s (no translate on exit to avoid layout shift).

## Files to change

| File | Change |
|------|--------|
| `src/components/skills.jsx` | Replace `SkillCategory` stacked rendering with tabbed UI. Add local `useState` for active tab index. Wrap panel in `AnimatePresence`. |
| `src/constants/index.js` | No changes — `skillGroups` data is consumed as-is; tab labels are derived from `group.title` with shortened display names. |

## Out of scope

- No changes to `SkillCard` internals.
- No changes to the section heading or padding (`py-20` on the outer section).
- No changes to `skillGroups` data.
- `ResponsiveSkills.jsx` remains untouched (already fully commented out).
