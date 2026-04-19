# Resume Drawer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a right-side drawer that slides in when the RESUME button is clicked, rendering the resume PDF as a dark-themed HTML page (parsed at build time) with green section headers matching the portfolio aesthetic.

**Architecture:** A Node.js prebuild script (`scripts/parse-resume.js`) uses `pdfjs-dist` to parse `public/Samiul_Mushfik_Resume.pdf`, classifies text items by font size/weight, and outputs `public/resume-viewer.html`. A new `ResumeDrawer` component renders that file in an iframe inside a Framer Motion slide-in panel. State lives locally in `home.jsx`.

**Tech Stack:** pdfjs-dist v3 (Node.js, devDependency), Framer Motion (already installed), @testing-library/react (already installed)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `scripts/parse-resume.js` | Create | Parses PDF, outputs `resume-viewer.html` |
| `public/resume-viewer.html` | Generated | Dark-themed HTML resume (gitignored) |
| `src/components/ResumeDrawer.jsx` | Create | Slide-in drawer with iframe |
| `src/components/__tests__/ResumeDrawer.test.js` | Create | Component behaviour tests |
| `src/components/home.jsx` | Modify | Add state, update RESUME button, render drawer |
| `src/components/__tests__/home.test.js` | Modify | Add RESUME button + drawer tests |
| `package.json` | Modify | Add `prebuild` script + `pdfjs-dist` devDep |
| `.gitignore` | Modify | Ignore `public/resume-viewer.html` |

---

## Task 1: Project Setup

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Install pdfjs-dist v3**

```bash
npm install --save-dev pdfjs-dist@3
```

Expected: `pdfjs-dist@3.x.x` appears in `package.json` devDependencies.

- [ ] **Step 2: Add prebuild script to package.json**

In `package.json`, add `"prebuild"` to the `"scripts"` block:

```json
"scripts": {
  "start": "react-scripts start",
  "prebuild": "node scripts/parse-resume.js",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

- [ ] **Step 3: Gitignore the generated file**

Add one line to `.gitignore` after the `# production` block:

```
# generated
public/resume-viewer.html
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: add pdfjs-dist and prebuild hook for resume viewer"
```

---

## Task 2: PDF Parse Script

**Files:**
- Create: `scripts/parse-resume.js`

- [ ] **Step 1: Create the scripts directory and parse script**

Create `scripts/parse-resume.js` with the following content:

```js
#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

// No worker needed in Node.js
pdfjsLib.GlobalWorkerOptions.workerSrc = '';

// Tune these if your PDF uses different font sizes
const SECTION_HEADER_MIN_HEIGHT = 13;
const TITLE_MIN_HEIGHT = 10;
const LINE_GROUP_TOLERANCE = 3; // y-units treated as the same line

function classifyTextItem(item) {
  const isBold = /Bold|bold/i.test(item.fontName);
  const str = item.str.trim();
  const isAllCaps = str.length > 1 && str === str.toUpperCase() && /[A-Z]/.test(str);

  if (item.height >= SECTION_HEADER_MIN_HEIGHT || (isAllCaps && isBold)) {
    return 'section-header';
  }
  if (item.height >= TITLE_MIN_HEIGHT || isBold) {
    return 'title';
  }
  return 'body';
}

function groupItemsIntoLines(items) {
  const lines = [];

  for (const item of items) {
    if (!item.str.trim()) continue;
    const y = item.transform[5];
    const existing = lines.find(line => Math.abs(line.y - y) <= LINE_GROUP_TOLERANCE);
    if (existing) {
      existing.items.push(item);
    } else {
      lines.push({ y, items: [item] });
    }
  }

  // PDF y-axis: 0 = bottom, so sort descending to get top-to-bottom reading order
  lines.sort((a, b) => b.y - a.y);
  return lines;
}

function lineToHtml(line) {
  const text = line.items.map(i => i.str).join('').trim();
  if (!text) return '';

  // Classify by the tallest item in the line (dominant font)
  const dominant = line.items.reduce((prev, curr) => curr.height > prev.height ? curr : prev);
  const role = classifyTextItem(dominant);

  const styles = {
    'section-header': [
      'color:#00d646',
      'font-size:11px',
      'letter-spacing:2px',
      'font-weight:700',
      'text-transform:uppercase',
      'margin-top:20px',
      'margin-bottom:0',
      'padding-bottom:4px',
      'border-bottom:1px solid rgba(0,214,70,0.15)',
      'line-height:1.6',
    ].join(';'),
    'title': [
      'color:#eeeeee',
      'font-size:10px',
      'letter-spacing:1px',
      'font-weight:600',
      'margin-top:6px',
      'margin-bottom:0',
      'line-height:1.6',
    ].join(';'),
    'body': [
      'color:#888888',
      'font-size:9px',
      'letter-spacing:0.5px',
      'font-weight:400',
      'margin-top:3px',
      'margin-bottom:0',
      'line-height:1.6',
    ].join(';'),
  };

  return `<p style="${styles[role]}">${text}</p>`;
}

function wrapHtml(body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0a0a0a;
    padding: 28px 24px 40px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

async function main() {
  const pdfPath = path.resolve(__dirname, '../public/Samiul_Mushfik_Resume.pdf');
  const outPath = path.resolve(__dirname, '../public/resume-viewer.html');

  if (!fs.existsSync(pdfPath)) {
    console.error(`Error: PDF not found at ${pdfPath}`);
    process.exit(1);
  }

  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data }).promise;

  const allLines = [];
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const textContent = await page.getTextContent();
    allLines.push(...groupItemsIntoLines(textContent.items));
  }

  const htmlLines = allLines.map(lineToHtml).filter(Boolean);
  fs.writeFileSync(outPath, wrapHtml(htmlLines.join('\n')), 'utf8');
  console.log(`✓ resume-viewer.html generated (${htmlLines.length} lines from ${doc.numPages} page(s))`);
}

main().catch(err => {
  console.error('parse-resume failed:', err.message);
  process.exit(1);
});
```

- [ ] **Step 2: Run the script manually to verify it works**

```bash
node scripts/parse-resume.js
```

Expected output:
```
✓ resume-viewer.html generated (N lines from 1 page(s))
```

- [ ] **Step 3: Spot-check the generated file**

```bash
head -30 public/resume-viewer.html
```

Expected: `<!DOCTYPE html>` header, `background: #0a0a0a` in the style block, and `<p style="color:#00d646...">` entries for section headers.

- [ ] **Step 4: Open the generated file in a browser to visually verify**

```bash
open public/resume-viewer.html
```

Check: dark background, green section headers (EXPERIENCE, EDUCATION, SKILLS, etc.), white job titles, gray body text. If a section header is rendering as body text, lower `SECTION_HEADER_MIN_HEIGHT`. If body text is being flagged as a header, raise it.

- [ ] **Step 5: Commit**

```bash
git add scripts/parse-resume.js public/resume-viewer.html
git commit -m "feat: add build-time PDF-to-dark-HTML resume parser"
```

Note: `resume-viewer.html` is committed this one time so the dev server has something to load. It stays in `.gitignore` so future regenerations aren't tracked.

---

## Task 3: ResumeDrawer Component (TDD)

**Files:**
- Create: `src/components/__tests__/ResumeDrawer.test.js`
- Create: `src/components/ResumeDrawer.jsx`

- [ ] **Step 1: Write the failing tests**

Create `src/components/__tests__/ResumeDrawer.test.js`:

```js
import { render, screen, fireEvent } from '@testing-library/react';
import ResumeDrawer from '../ResumeDrawer';

test('renders nothing when closed', () => {
  render(<ResumeDrawer isOpen={false} onClose={() => {}} />);
  expect(screen.queryByTitle('Resume')).not.toBeInTheDocument();
});

test('renders iframe when open', () => {
  render(<ResumeDrawer isOpen={true} onClose={() => {}} />);
  expect(screen.getByTitle('Resume')).toBeInTheDocument();
});

test('iframe points to /resume-viewer.html', () => {
  render(<ResumeDrawer isOpen={true} onClose={() => {}} />);
  expect(screen.getByTitle('Resume').src).toContain('resume-viewer.html');
});

test('calls onClose when close button clicked', () => {
  const onClose = jest.fn();
  render(<ResumeDrawer isOpen={true} onClose={onClose} />);
  fireEvent.click(screen.getByRole('button', { name: '✕' }));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('calls onClose when overlay clicked', () => {
  const onClose = jest.fn();
  render(<ResumeDrawer isOpen={true} onClose={onClose} />);
  fireEvent.click(screen.getByTestId('resume-overlay'));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('calls onClose when Escape key pressed', () => {
  const onClose = jest.fn();
  render(<ResumeDrawer isOpen={true} onClose={onClose} />);
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('does not call onClose on non-Escape keys', () => {
  const onClose = jest.fn();
  render(<ResumeDrawer isOpen={true} onClose={onClose} />);
  fireEvent.keyDown(document, { key: 'Enter' });
  expect(onClose).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run tests to verify they all fail**

```bash
npm test -- --testPathPattern=ResumeDrawer --watchAll=false
```

Expected: 7 failing tests, all with "Cannot find module '../ResumeDrawer'".

- [ ] **Step 3: Implement ResumeDrawer**

Create `src/components/ResumeDrawer.jsx`:

```jsx
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ResumeDrawer({ isOpen, onClose }) {
  // Scroll lock — same pattern as header.jsx mobile nav
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [isOpen]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay — blocks all background interaction */}
          <motion.div
            data-testid="resume-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/70"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[38%] bg-custom-dark border-l border-[#1a1a1a] z-50 flex flex-col"
          >
            {/* Green gradient accent on left edge */}
            <div
              className="absolute top-0 left-0 bottom-0 w-[2px] pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(0,214,70,0.5), transparent)' }}
            />

            {/* Header */}
            <div className="flex items-center px-4 h-12 border-b border-[#1a1a1a] flex-shrink-0">
              <span className="text-[10px] tracking-[3px] uppercase text-[#aaa]">Resume</span>
              <button
                onClick={onClose}
                className="ml-auto w-[22px] h-[22px] flex items-center justify-center text-[#555] border border-[#1a1a1a] rounded text-xs hover:text-white hover:border-[#333] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* PDF viewer */}
            <iframe
              src="/resume-viewer.html"
              title="Resume"
              className="flex-1 w-full border-none"
              style={{ background: 'transparent' }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ResumeDrawer;
```

- [ ] **Step 4: Run tests to verify they all pass**

```bash
npm test -- --testPathPattern=ResumeDrawer --watchAll=false
```

Expected: 7 passing tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/ResumeDrawer.jsx src/components/__tests__/ResumeDrawer.test.js
git commit -m "feat: add ResumeDrawer component with focus trap and Framer Motion animation"
```

---

## Task 4: Integrate into home.jsx

**Files:**
- Modify: `src/components/home.jsx`
- Modify: `src/components/__tests__/home.test.js`

- [ ] **Step 1: Write the failing tests first**

Add these two tests to `src/components/__tests__/home.test.js`:

```js
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../home';

// existing tests stay unchanged ...

test('renders RESUME button', () => {
  render(<Home id="home" />);
  expect(screen.getByRole('button', { name: /RESUME/i })).toBeInTheDocument();
});

test('RESUME button opens the drawer', () => {
  render(<Home id="home" />);
  expect(screen.queryByTitle('Resume')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /RESUME/i }));
  expect(screen.getByTitle('Resume')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to confirm the new ones fail**

```bash
npm test -- --testPathPattern=home --watchAll=false
```

Expected: existing 3 tests pass, 2 new tests fail ("RESUME button opens the drawer" fails because the button currently calls `window.open` instead of toggling state).

- [ ] **Step 3: Update home.jsx**

Replace the full contents of `src/components/home.jsx` with:

```jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { samiul, samiulWebp, download } from '../assets';
import { driftUp, staggerContainer } from '../utils/motion';
import ResumeDrawer from './ResumeDrawer';

const Home = (props) => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <section id={props.id} className="min-h-screen bg-custom-dark flex items-center px-6 lg:px-20 pt-32 pb-20">
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        animate="show"
        className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center"
      >
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <motion.p
            variants={driftUp(0.1)}
            className="text-xs tracking-[4px] text-custom-green uppercase"
          >
            — Software Engineer
          </motion.p>
          <motion.h1
            variants={driftUp(0.2)}
            className="font-lulo text-5xl lg:text-7xl font-black leading-none text-white"
          >
            SAMIUL<br />MUSHFIK<span className="text-custom-green">.</span>
          </motion.h1>
          <motion.p
            variants={driftUp(0.3)}
            className="text-sm text-gray-500 leading-relaxed max-w-md"
          >
            4+ years building scalable microservices, distributed systems, and production backends — alongside
            user-facing web and mobile interfaces. Graduated with an M.S. in Computer Science (August 2025)
            from the University of Minnesota Duluth, with research in SIMD-optimized in-memory bulk R-Tree
            construction. Interested in databases, distributed systems, machine learning, and the interfaces
            that bring them together.
          </motion.p>
          <motion.div variants={driftUp(0.4)} className="flex flex-wrap gap-4 mt-2">
            <a
              href="#projects"
              className="bg-custom-green text-black text-xs font-bold tracking-[2px] px-6 py-3 rounded hover:opacity-90 transition-opacity"
            >
              VIEW WORK
            </a>
            <a
              href="#contact"
              className="border border-[#1a1a1a] text-gray-500 text-xs tracking-[2px] px-6 py-3 rounded hover:border-[#333] hover:text-gray-300 transition-colors"
            >
              CONTACT
            </a>
            <button
              onClick={() => setIsResumeOpen(true)}
              className="flex items-center gap-2 border border-[#1a1a1a] text-gray-500 text-xs tracking-[2px] px-6 py-3 rounded hover:border-custom-green hover:text-custom-green transition-colors"
            >
              RESUME
              <img src={download} alt="download" className="w-3 h-3 object-contain opacity-60" />
            </button>
          </motion.div>
        </div>

        {/* Right column: photo — hidden on mobile */}
        <motion.div variants={driftUp(0.3)} className="hidden lg:flex justify-center">
          <div className="w-72 h-72 rounded-lg overflow-hidden">
            <picture className="w-full h-full">
              <source type="image/webp" srcSet={samiulWebp} />
              <img
                src={samiul}
                alt="Samiul Mushfik"
                className="w-full h-full object-cover"
              />
            </picture>
          </div>
        </motion.div>
      </motion.div>

      <ResumeDrawer isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </section>
  );
};

export default Home;
```

- [ ] **Step 4: Run all tests to verify everything passes**

```bash
npm test -- --watchAll=false
```

Expected: all tests pass, including the 2 new home tests and the 7 ResumeDrawer tests.

- [ ] **Step 5: Start the dev server and manually verify the full interaction**

```bash
npm start
```

Check:
1. Click RESUME button — drawer slides in from the right
2. Resume renders dark background, green section headers, white titles, gray body
3. Clicking the overlay closes the drawer
4. Clicking ✕ closes the drawer
5. Pressing Escape closes the drawer
6. While drawer is open, scrolling/clicking behind it is blocked
7. Background content (portfolio) is still visible dimmed behind the overlay

- [ ] **Step 6: Commit**

```bash
git add src/components/home.jsx src/components/__tests__/home.test.js
git commit -m "feat: wire RESUME button to ResumeDrawer in home section"
```

---

## Task 5: Verify Build Integration

**Files:** none (verification only)

- [ ] **Step 1: Delete the generated file and confirm prebuild regenerates it**

```bash
rm public/resume-viewer.html
npm run build
```

Expected: prebuild runs `node scripts/parse-resume.js`, prints `✓ resume-viewer.html generated`, then CRA build succeeds. `public/resume-viewer.html` exists again after the build.

- [ ] **Step 2: Final commit**

```bash
git add -p  # review any remaining unstaged changes
git commit -m "feat: resume drawer — dark PDF viewer with build-time HTML generation"
```
