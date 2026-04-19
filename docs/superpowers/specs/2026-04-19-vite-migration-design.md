# Vite Migration Design

**Date:** 2026-04-19
**Status:** Approved

## Overview

Migrate the portfolio from Create React App (`react-scripts`) to Vite, replacing Jest with Vitest. This resolves persistent ESM compatibility issues (e.g. `framer-motion` v12's `useInView`) and modernises the toolchain.

## Tooling Replacements

| CRA piece | Replacement |
|---|---|
| `react-scripts` | `vite` + `@vitejs/plugin-react` |
| Jest | `vitest` + `@vitest/coverage-v8` |
| `react-scripts test` | `vitest run` |
| `react-scripts build` | `vite build` |
| `react-scripts start` | `vite` |
| `@babel/plugin-proposal-private-property-in-object` | removed (esbuild handles this) |
| `@svgr/webpack` | removed (SVGs imported as URLs, no React component syntax used) |
| `web-vitals` + `reportWebVitals.js` | removed (CRA-specific) |

## File Changes

### New files
- `vite.config.js` — Vite config with `@vitejs/plugin-react`, `build.outDir: 'build'`, `base: '/'`
- `vitest.config.js` — Vitest config with `environment: 'jsdom'`, `setupFiles: ['src/setupTests.js']`, `globals: true`

### Moved / renamed
- `public/index.html` → `index.html` (root) — Vite requires the HTML entry at root. Remove `%PUBLIC_URL%` references; add `<script type="module" src="/src/main.jsx">` tag.
- `src/index.js` → `src/main.jsx` — rename to match Vite convention (JSX in entry point).

### Deleted
- `src/reportWebVitals.js` — CRA-specific, not used with Vite
- `src/index.js` reference to `reportWebVitals` removed when renaming to `main.jsx`

### Updated
- `package.json` — replace scripts and deps (see below)
- `.env` — rename all `REACT_APP_` prefixes to `VITE_`
- `src/components/Contact.jsx` — replace `process.env.REACT_APP_*` with `import.meta.env.VITE_*` (3 occurrences)
- `tailwind.config.js` — convert `module.exports` to `export default`
- `postcss.config.js` — convert `module.exports` to `export default`

## Package.json Changes

### Scripts
```json
"start":      "vite",
"build":      "vite build",
"test":       "vitest run",
"test:watch": "vitest",
"lint":       "eslint src",
"predeploy":  "npm run build",
"deploy":     "gh-pages -d build"
```

### Added devDependencies
- `vite`
- `@vitejs/plugin-react`
- `vitest`
- `@vitest/coverage-v8`
- `jsdom` (Vitest requires explicit install)

### Removed
- `react-scripts` (from dependencies)
- `web-vitals` (from dependencies)
- `@babel/plugin-proposal-private-property-in-object` (from devDependencies)
- `@svgr/webpack` (from devDependencies)
- `overrides` block (was only needed for `@svgr/webpack` and `postcss`)
- `eject` script (CRA-specific, not applicable to Vite)

## Test Changes

Vitest is Jest-compatible. Minimal changes required:

- `src/components/__tests__/ResumeDrawer.test.js` line 5: `jest.fn()` → `vi.fn()`
- `src/setupTests.js` — unchanged (jest-dom import and IntersectionObserver mock both work with Vitest)
- All other test files — no changes needed

## Deployment

No change to the deploy workflow. Vite defaults to `dist/` for output but is configured to use `build/` via `vite.config.js` so the existing `gh-pages -d build` script works unchanged.

GitHub Pages base path is `/` (site is at root domain `samiul123.github.io`, not a subpath).

## Environment Variables

| Old (CRA) | New (Vite) |
|---|---|
| `REACT_APP_EMAIL_JS_SERVICE_ID` | `VITE_EMAIL_JS_SERVICE_ID` |
| `REACT_APP_EMAIL_JS_TEMPLATE_ID` | `VITE_EMAIL_JS_TEMPLATE_ID` |
| `REACT_APP_EMAIL_JS_PUBLIC_KEY` | `VITE_EMAIL_JS_PUBLIC_KEY` |

Access pattern changes from `process.env.REACT_APP_*` to `import.meta.env.VITE_*`.
