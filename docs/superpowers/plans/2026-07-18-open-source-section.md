# Open Source Contributions Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new "Open Source" portfolio section, right after Projects, listing pull requests contributed to repos the author doesn't own.

**Architecture:** New `contributions` data array in `src/constants/index.js`, a new `OpenSource.jsx` component that mirrors `Project.jsx`'s masonry-grid pattern (same motion/styling, different fields), and one new `navLinks` entry — `App.jsx` and `header.jsx` already render every `navLinks` entry generically, so adding the entry is what makes the section appear in both nav and page.

**Tech Stack:** React 18 (functional components), Tailwind CSS, Framer Motion (`driftUp`, `staggerContainer` from `src/utils/motion.js`), Jest + React Testing Library.

## Global Constraints

- Functional components with hooks only — no class components.
- Tailwind utility classes preferred; no new custom CSS files.
- Component data lives in `src/constants/index.js`, not hardcoded in the component.
- No new dependencies.
- Reuse existing assets (`github` icon) and existing style tokens (`styles.pageTitle`) — no new icon assets.

---

## Reference: the spec

Full design at `docs/superpowers/specs/2026-07-18-open-source-section-design.md`. Key data point confirmed with the user — the first (and currently only) contribution:

```js
{
    id: 'monocle-postgres-exporter',
    repo: 'monocle2ai/monocle',
    repoUrl: 'https://github.com/monocle2ai/monocle',
    prTitle: 'Add PostgreSQL span exporter',
    prUrl: 'https://github.com/monocle2ai/monocle/pull/682',
    date: '2026-07',
    status: 'merged',
    tags: ['Python', 'PostgreSQL', 'OpenTelemetry'],
    description: 'Added a PostgreSQL span exporter that writes OpenTelemetry traces directly into a Postgres database, with batch inserts, automatic table creation, and reconnect-and-retry handling.'
}
```

---

### Task 1: Add `contributions` data to constants

**Files:**
- Modify: `src/constants/index.js:815` (immediately after the `projects` array closes, before the `export` line currently at 817)
- Test: `src/components/__tests__/contributions-data.test.jsx` (new file)

**Interfaces:**
- Produces: `contributions` — an array of objects with shape `{ id, repo, repoUrl, prTitle, prUrl, date, status, tags, description }`. Later tasks import this via `import { contributions } from '../../constants'`.

- [ ] **Step 1: Write the failing test**

Create `src/components/__tests__/contributions-data.test.jsx`:

```jsx
import { contributions } from '../../constants';

test('contributions has at least one entry with required fields', () => {
  expect(contributions.length).toBeGreaterThan(0);
  const first = contributions[0];
  expect(first).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      repo: expect.any(String),
      repoUrl: expect.any(String),
      prTitle: expect.any(String),
      prUrl: expect.any(String),
      date: expect.any(String),
      status: expect.stringMatching(/^(merged|open|closed)$/),
      tags: expect.any(Array),
      description: expect.any(String),
    })
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/__tests__/contributions-data.test.jsx`
Expected: FAIL — `contributions` is not exported from `'../../constants'`

- [ ] **Step 3: Add the `contributions` array**

In `src/constants/index.js`, immediately after line 815 (the `]` that closes `projects`), add:

```js

const contributions = [
    {
        id: 'monocle-postgres-exporter',
        repo: 'monocle2ai/monocle',
        repoUrl: 'https://github.com/monocle2ai/monocle',
        prTitle: 'Add PostgreSQL span exporter',
        prUrl: 'https://github.com/monocle2ai/monocle/pull/682',
        date: '2026-07',
        status: 'merged',
        tags: ['Python', 'PostgreSQL', 'OpenTelemetry'],
        description: 'Added a PostgreSQL span exporter that writes OpenTelemetry traces directly into a Postgres database, with batch inserts, automatic table creation, and reconnect-and-retry handling.'
    },
]
```

Then update the final export line (currently `export {navLinks, skillGroups, educations, experiences, publications, certifications, contacts, projects}`) to include `contributions`:

```js
export {navLinks, skillGroups, educations, experiences, publications, certifications, contacts, projects, contributions}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/__tests__/contributions-data.test.jsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/constants/index.js src/components/__tests__/contributions-data.test.jsx
git commit -m "feat: add open source contributions data"
```

---

### Task 2: Create the OpenSource component

**Files:**
- Create: `src/components/OpenSource.jsx`
- Test: `src/components/__tests__/OpenSource.test.jsx`

**Interfaces:**
- Consumes: `contributions` from `../constants` (produced by Task 1) — shape `{ id, repo, repoUrl, prTitle, prUrl, date, status, tags, description }`. Also consumes `github` from `../assets`, `styles` from `../styles`, `driftUp`/`staggerContainer` from `../utils/motion` (all existing exports, same imports `Project.jsx` uses).
- Produces: `export const OpenSource = (props) => ...` — a component accepting `{ id }` prop and rendering a `<section id={props.id}>`, consumed by Task 3's `navLinks` entry as `route: OpenSource`.

- [ ] **Step 1: Write the failing test**

Create `src/components/__tests__/OpenSource.test.jsx` (mirrors `Project.test.jsx`):

```jsx
import { render, screen } from '@testing-library/react';
import { OpenSource } from '../OpenSource';

test('renders OPEN SOURCE heading', () => {
  render(<OpenSource id="open-source" />);
  expect(screen.getByText('OPEN SOURCE')).toBeInTheDocument();
});

test('renders contribution PR title and repo', () => {
  render(<OpenSource id="open-source" />);
  expect(screen.getByText('Add PostgreSQL span exporter')).toBeInTheDocument();
  expect(screen.getByText('monocle2ai/monocle')).toBeInTheDocument();
});

test('renders merged status badge', () => {
  render(<OpenSource id="open-source" />);
  expect(screen.getByText('Merged')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/__tests__/OpenSource.test.jsx`
Expected: FAIL — cannot find module `../OpenSource`

- [ ] **Step 3: Write the component**

Create `src/components/OpenSource.jsx`:

```jsx
import { github } from '../assets';
import { styles } from '../styles';
import { contributions } from '../constants';
import { motion } from 'framer-motion';
import { driftUp, staggerContainer } from '../utils/motion';

const statusConfig = {
  merged: { label: 'Merged', className: 'text-custom-green bg-[rgba(0,214,70,0.08)] border border-[rgba(0,214,70,0.25)]' },
  open:   { label: 'Open',   className: 'text-amber-400 bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)]' },
  closed: { label: 'Closed', className: 'text-gray-600 bg-[#111] border border-[#1a1a1a]' },
};

const ContributionCard = ({ repo, repoUrl, prTitle, prUrl, date, status, tags = [], description, index }) => {
  const badge = statusConfig[status] ?? statusConfig.closed;

  return (
    <motion.div
      variants={driftUp(index * 0.08)}
      className="border border-[#1a1a1a] rounded-lg p-5 hover:border-[#333] transition-colors flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => window.open(repoUrl, '_blank')}
          className="text-xs tracking-[3px] text-gray-600 uppercase opacity-70 hover:opacity-100 transition-opacity"
        >
          {repo}
        </button>
        <button
          onClick={() => window.open(repoUrl, '_blank')}
          className="opacity-40 hover:opacity-100 transition-opacity"
          aria-label="GitHub"
        >
          <img src={github} alt="GitHub" className="w-4 h-4 object-contain" />
        </button>
      </div>

      <button
        onClick={() => window.open(prUrl, '_blank')}
        className="text-white font-bold text-sm leading-snug text-left hover:text-custom-green transition-colors"
      >
        {prTitle} <span className="text-xs align-super">↗</span>
      </button>

      <div className="flex items-center gap-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full tracking-[1px] ${badge.className}`}>
          {badge.label}
        </span>
        <span className="text-gray-700 text-[10px]">{date}</span>
      </div>

      <p className="text-gray-500 text-xs leading-relaxed">{description}</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {tags.map(tag => (
            <span key={tag} className="text-[10px] text-gray-600 bg-[#111] border border-[#1a1a1a] px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const OpenSource = (props) => (
  <section id={props.id} className="bg-custom-dark text-white px-6 lg:px-20 py-20">
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      className="max-w-5xl mx-auto"
    >
      <motion.p variants={driftUp(0)} className="text-xs tracking-[4px] text-custom-green uppercase mb-3">
        — Open Source
      </motion.p>
      <motion.h2
        variants={driftUp(0.05)}
        className={`${styles.pageTitle} mb-14`}
      >
        OPEN SOURCE
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
        {[...contributions]
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((contribution, i) => (
            <ContributionCard key={contribution.id} {...contribution} index={i} />
          ))}
      </div>
    </motion.div>
  </section>
);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/__tests__/OpenSource.test.jsx`
Expected: PASS (all 3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/OpenSource.jsx src/components/__tests__/OpenSource.test.jsx
git commit -m "feat: add OpenSource component"
```

---

### Task 3: Wire the section into navigation

**Files:**
- Modify: `src/constants/index.js:65` (imports) and `:78-82` (navLinks array)
- Test: `src/components/__tests__/header.test.jsx` (extend existing file)

**Interfaces:**
- Consumes: `OpenSource` from `./OpenSource` relative to `src/components/`, i.e. `import { OpenSource } from "../components/OpenSource";` — the named export produced by Task 2.
- Produces: a new `navLinks` entry `{ id: 'open-source', title: 'OPEN SOURCE', route: OpenSource }`, which `App.jsx` and `header.jsx` already consume generically (no changes needed in those files).

- [ ] **Step 1: Write the failing test**

Add to `src/components/__tests__/header.test.jsx`:

```jsx
test('renders OPEN SOURCE nav link', () => {
  render(<Header />);
  expect(screen.getByText('OPEN SOURCE')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/__tests__/header.test.jsx`
Expected: FAIL — cannot find text "OPEN SOURCE"

- [ ] **Step 3: Add the import and navLinks entry**

In `src/constants/index.js`, add the import next to the existing `Project` import (line 65):

```js
import {Project} from "../components/Project";
import {OpenSource} from "../components/OpenSource";
```

Then insert into `navLinks`, immediately after the `projects` entry (after line 82's closing `},`):

```js
    {
        id: 'projects',
        title: 'PROJECTS',
        route: Project
    },
    {
        id: 'open-source',
        title: 'OPEN SOURCE',
        route: OpenSource
    },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/__tests__/header.test.jsx`
Expected: PASS

- [ ] **Step 5: Run the full test suite**

Run: `npx vitest run`
Expected: All tests PASS (no regressions in `home.test.jsx`, `App` rendering, etc.)

- [ ] **Step 6: Commit**

```bash
git add src/constants/index.js src/components/__tests__/header.test.jsx
git commit -m "feat: wire Open Source section into navigation"
```

---

## Out of Scope
(carried from the design spec)
- Filtering/sorting UI (only 1 contribution today; revisit if the list grows large)
- Auto-fetching PR status from GitHub's API (data is entered manually)
- A distinct "featured single item" layout for the current 1-item case
