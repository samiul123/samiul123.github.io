# Resume Drawer — Design Spec

**Date:** 2026-04-17
**Status:** Approved

---

## Overview

When the RESUME button on the home section is clicked, a drawer slides in from the right showing a dark-themed, portfolio-styled view of the resume. The resume content is parsed from the existing PDF at build time and rendered as a styled HTML page inside an iframe. The original PDF remains available for download via the browser's native iframe controls.

---

## Section 1 — Build Script

### File
`scripts/parse-resume.js`

### Purpose
Parses `public/Samiul_Mushfik_Resume.pdf` using `pdfjs-dist` and generates `public/resume-viewer.html` — a self-contained dark HTML file that mirrors the PDF content in the portfolio's color scheme.

### Dependency
- `pdfjs-dist` added to `devDependencies` in `package.json`

### Heuristics for text classification
Each text item extracted from the PDF has a font size and font name. Classification rules:

| Condition | Role | Color |
|---|---|---|
| Font size ≥ 14pt OR all-caps AND bold | Section header | `#00d646` (custom-green) |
| Font size between thresholds OR bold (not section header) | Job title / subsection | `#eeeeee` (white) |
| Everything else | Body text | `#888888` (muted gray) |

Thresholds are constants at the top of the script, easy to tune if the PDF layout changes.

### Output: `public/resume-viewer.html`
- Background: `#0a0a0a`
- Font: system sans-serif (matches portfolio body font)
- Self-contained — no external CSS or JS dependencies
- Scrollable if content exceeds viewport height
- Gitignored (generated artifact, not committed)

### Build integration
`package.json` gets a `"prebuild"` script:
```json
"prebuild": "node scripts/parse-resume.js"
```
This runs automatically before `npm run build` and therefore before `npm run deploy`. No manual step required when updating the PDF.

---

## Section 2 — ResumeDrawer Component

### File
`src/components/ResumeDrawer.jsx`

### Props
```js
{ isOpen: bool, onClose: fn }
```

### Structure
```
<AnimatePresence>
  overlay div         // blocks all background interaction
  motion.div (drawer) // slides in from right
    drawer header     // "RESUME" label + ✕ button
    iframe            // src="/resume-viewer.html"
</AnimatePresence>
```

### Overlay
- Full-screen fixed `div`, `z-index: 40`
- Background: `rgba(0, 0, 0, 0.72)`
- `pointer-events: all` — blocks all clicks on the portfolio behind the drawer
- `onClick` → `onClose()`

### Drawer panel
- Fixed, right-anchored, `width: 38%`, full viewport height
- Background: `#0a0a0a` (`bg-custom-dark`)
- Left border: `1px solid #1a1a1a`
- Green accent: 2px left-edge gradient, `#00d646` → transparent (top to bottom), `opacity: 0.5`
- `z-index: 50`
- Framer Motion animation: `x` from `"100%"` → `"0%"`, spring stiffness 300 / damping 30 (same as existing mobile nav)

### Drawer header
- Height: 48px, background `#0a0a0a`, bottom border `1px solid #1a1a1a`
- Left: "RESUME" label — `text-xs tracking-[3px] uppercase text-[#aaa]`
- Right: ✕ close button — 22×22px, `border border-[#1a1a1a]`, `text-[#555]`, hover → `text-white border-[#333]`

### iframe
- `src="/resume-viewer.html"`
- Fills remaining height (`flex: 1`)
- `border: none`, `width: 100%`
- Background transparent (generated HTML provides its own `#0a0a0a` background)

### Focus trap / scroll lock
- `useEffect` on `isOpen`:
  - `document.body.classList.add('no-scroll')` when open (existing class in `index.css`)
  - Removed on close / unmount
- Escape key listener via `useEffect` → calls `onClose()`

---

## Section 3 — Integration

### `src/components/home.jsx`
- Add `const [isResumeOpen, setIsResumeOpen] = useState(false)`
- Change RESUME button `onClick`: `window.open('/resume.html')` → `setIsResumeOpen(true)`
- Render `<ResumeDrawer isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />` at the bottom of the section's JSX

### `package.json`
- Add `"prebuild": "node scripts/parse-resume.js"` to `scripts`
- Add `pdfjs-dist` to `devDependencies`

### `.gitignore`
- Add `public/resume-viewer.html`

### No changes to
- `App.js`
- `header.jsx`
- `src/constants/index.js`
- Any other component

---

## Out of Scope
- Resume link in the header nav (not requested)
- Mobile-specific drawer sizing (38% may be narrow on small screens — can be addressed in a follow-up)
- Printing from the drawer (browser's native iframe print works as-is)
