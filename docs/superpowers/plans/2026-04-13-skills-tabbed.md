# Skills Section — Tabbed Compact Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stacked skills categories with a tabbed UI so the section height equals one category panel instead of four.

**Architecture:** A single `Skills` component holds `useState(0)` for the active tab index. A tab bar maps `skillGroups` to buttons. `AnimatePresence` with a keyed `motion.div` produces a fade+slide-up transition on every tab switch. `SkillCard` is unchanged.

**Tech Stack:** React 18, Framer Motion (`AnimatePresence`), Tailwind CSS, `@testing-library/react`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/components/skills.jsx` | Modify | Add `useState`, tab bar, `AnimatePresence` panel; remove `SkillCategory` |
| `src/components/__tests__/skills.test.js` | Modify | Update tests to match new tab-based structure |

---

### Task 1: Update tests for the tabbed structure

**Files:**
- Modify: `src/components/__tests__/skills.test.js`

The existing tests expect the full category titles (`PROGRAMMING LANGUAGES`, `FRAMEWORKS & LIBRARIES`) to be in the DOM and all skill names including `REACT` visible at once. All three need updating.

- [ ] **Step 1: Replace the test file contents**

Open `src/components/__tests__/skills.test.js` and replace everything with:

```js
import { render, screen, fireEvent } from '@testing-library/react';
import Skills from '../skills';

test('renders SKILLS heading', () => {
  render(<Skills id="skills" />);
  expect(screen.getByText('SKILLS')).toBeInTheDocument();
});

test('renders all four tab labels', () => {
  render(<Skills id="skills" />);
  expect(screen.getByRole('button', { name: 'Languages' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Frameworks' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Databases' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Tools' })).toBeInTheDocument();
});

test('Languages tab is active by default and shows language skills', () => {
  render(<Skills id="skills" />);
  expect(screen.getByText('JAVA')).toBeInTheDocument();
  expect(screen.getByText('PYTHON')).toBeInTheDocument();
  // REACT is in Frameworks tab — must not be visible yet
  expect(screen.queryByText('REACT')).not.toBeInTheDocument();
});

test('clicking Frameworks tab shows framework skills', () => {
  render(<Skills id="skills" />);
  fireEvent.click(screen.getByRole('button', { name: 'Frameworks' }));
  expect(screen.getByText('REACT')).toBeInTheDocument();
  expect(screen.getByText('SPRING BOOT')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the tests — confirm they fail**

```bash
npm test -- --watchAll=false --testPathPattern="skills.test"
```

Expected: 3–4 failures. The "Languages tab active" test will fail because React is still visible (stacked layout), and the tab-label tests will fail because buttons don't exist yet.

---

### Task 2: Implement the tabbed Skills component

**Files:**
- Modify: `src/components/skills.jsx`

- [ ] **Step 1: Replace `skills.jsx` with the tabbed implementation**

Replace the full contents of `src/components/skills.jsx` with:

```jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillGroups } from '../constants';
import { driftUp, staggerContainer } from '../utils/motion';

const TAB_LABELS = {
  'PROGRAMMING LANGUAGES': 'Languages',
  'FRAMEWORKS & LIBRARIES': 'Frameworks',
  'DATABASE & CACHING': 'Databases',
  'TOOLS': 'Tools',
};

const SkillCard = ({ name, images, index }) => (
  <motion.div
    variants={driftUp(index * 0.05)}
    whileHover={{ y: -3 }}
    className="flex flex-col items-center gap-2 p-3 border border-[#1a1a1a] rounded-lg bg-[#0e0e0e] hover:border-[#222] transition-colors cursor-default"
  >
    {images && images.length > 0 && (
      <picture className="w-8 h-8">
        {images.filter(img => !img.fallback).map((img, i) => (
          <source key={i} type={img.type} srcSet={img.srcSet} />
        ))}
        <img
          src={(images.find(img => img.fallback) ?? images[images.length - 1])?.srcSet}
          alt={name}
          className="w-8 h-8 object-contain"
        />
      </picture>
    )}
    <span className="text-[9px] tracking-[1px] text-gray-500 text-center">{name}</span>
  </motion.div>
);

const Skills = (props) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id={props.id} className="bg-custom-dark text-white px-6 lg:px-20 py-20">
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-5xl mx-auto"
      >
        <motion.p variants={driftUp(0)} className="text-xs tracking-[4px] text-custom-green uppercase mb-3">
          — What I Work With
        </motion.p>
        <motion.h2
          variants={driftUp(0.05)}
          className="font-lulo text-3xl lg:text-4xl font-black mb-10 text-white"
        >
          SKILLS
        </motion.h2>

        {/* Tab bar */}
        <motion.div
          variants={driftUp(0.1)}
          className="flex border-b border-[#1a1a1a] mb-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {skillGroups.map((group, i) => (
            <button
              key={group.title}
              onClick={() => setActiveTab(i)}
              className={`text-[9px] tracking-[2px] uppercase px-4 py-2 whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeTab === i
                  ? 'text-custom-green border-custom-green'
                  : 'text-gray-600 border-transparent hover:text-gray-400'
              }`}
            >
              {TAB_LABELS[group.title]}
            </button>
          ))}
        </motion.div>

        {/* Active panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <motion.div
              variants={staggerContainer()}
              initial="hidden"
              animate="show"
              className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3"
            >
              {skillGroups[activeTab].items.map((item, i) => (
                <SkillCard key={item.id || item.name} name={item.name} images={item.images} index={i} />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Skills;
```

- [ ] **Step 2: Run the tests — confirm they all pass**

```bash
npm test -- --watchAll=false --testPathPattern="skills.test"
```

Expected output:
```
PASS src/components/__tests__/skills.test.js
  ✓ renders SKILLS heading
  ✓ renders all four tab labels
  ✓ Languages tab is active by default and shows language skills
  ✓ clicking Frameworks tab shows framework skills
```

If a test fails, check:
- `REACT` not in DOM by default → confirm `useState(0)` is the initial state (index 0 = Languages group).
- Tab buttons not found → confirm `TAB_LABELS` keys exactly match `group.title` strings in `src/constants/index.js`.

- [ ] **Step 3: Start the dev server and verify visually**

```bash
npm start
```

Open `http://localhost:3000`, scroll to Skills. Verify:
1. Section is shorter — only one row of cards visible.
2. Four tab buttons appear with green active underline on "Languages".
3. Clicking each tab fades in the correct category's cards with logos intact.
4. On mobile (narrow the browser window) — tab bar scrolls horizontally without wrapping.

- [ ] **Step 4: Commit**

```bash
git add src/components/skills.jsx src/components/__tests__/skills.test.js
git commit -m "feat: replace stacked skills categories with tabbed layout"
```
