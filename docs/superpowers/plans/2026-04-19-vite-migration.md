# Vite Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Create React App (`react-scripts`) with Vite and replace Jest with Vitest, resolving ESM compatibility issues and modernising the toolchain.

**Architecture:** Vite takes over as the dev server and bundler via `vite.config.js`. Vitest replaces Jest, reading from `vitest.config.js` with jsdom environment and the existing `src/setupTests.js`. The entry point moves from `src/index.js` to `src/main.jsx` and `public/index.html` moves to the project root with a module script tag added.

**Tech Stack:** Vite 5, @vitejs/plugin-react, Vitest, jsdom, @vitest/coverage-v8, Tailwind CSS v3, Framer Motion v12, React 18

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `package.json` | Modify | Update scripts and deps |
| `vite.config.js` | Create | Vite bundler config |
| `vitest.config.js` | Create | Vitest test runner config |
| `index.html` | Create (from `public/index.html`) | Root entry HTML for Vite |
| `public/index.html` | Delete | Replaced by root `index.html` |
| `src/main.jsx` | Create (from `src/index.js`) | App entry point |
| `src/index.js` | Delete | Replaced by `src/main.jsx` |
| `src/reportWebVitals.js` | Delete | CRA-specific, not used with Vite |
| `tailwind.config.js` | Modify | Convert CJS to ESM |
| `postcss.config.js` | Modify | Convert CJS to ESM |
| `.env` | Modify | Rename `REACT_APP_` → `VITE_` |
| `src/components/Contact.jsx` | Modify | `process.env.REACT_APP_*` → `import.meta.env.VITE_*` |
| `src/components/__tests__/ResumeDrawer.test.js` | Modify | `jest.fn()` → `vi.fn()` |

---

## Task 1: Update package.json and install packages

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update scripts and remove CRA-specific config in package.json**

Replace the `scripts`, `overrides`, and `eslintConfig` sections. The full updated sections:

```json
"scripts": {
  "start": "vite",
  "build": "vite build",
  "test": "vitest run",
  "test:watch": "vitest",
  "lint": "eslint src",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
},
```

Remove the entire `overrides` block (it only covered `@svgr/webpack` and `postcss`, both being removed or no longer needing override):

```json
// DELETE this block entirely:
"overrides": {
  "@svgr/webpack": "$@svgr/webpack",
  "postcss": "$postcss"
},
```

- [ ] **Step 2: Install new dev dependencies**

```bash
npm install --save-dev vite @vitejs/plugin-react vitest @vitest/coverage-v8 jsdom eslint eslint-config-react-app @babel/core @babel/eslint-parser eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-testing-library
```

- [ ] **Step 3: Uninstall removed packages**

```bash
npm uninstall react-scripts @babel/plugin-proposal-private-property-in-object @svgr/webpack
npm uninstall --save web-vitals
```

- [ ] **Step 4: Verify package.json looks correct**

Run: `cat package.json`

Expected: `react-scripts`, `web-vitals`, `@svgr/webpack`, `@babel/plugin-proposal-private-property-in-object` are gone. `vite`, `@vitejs/plugin-react`, `vitest`, `jsdom` are present in devDependencies. Scripts point to `vite` instead of `react-scripts`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: replace react-scripts with vite and jest with vitest"
```

---

## Task 2: Create vite.config.js

**Files:**
- Create: `vite.config.js`

- [ ] **Step 1: Create vite.config.js**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add vite.config.js
git commit -m "chore: add vite.config.js"
```

---

## Task 3: Create vitest.config.js

**Files:**
- Create: `vitest.config.js`

- [ ] **Step 1: Create vitest.config.js**

```js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/setupTests.js'],
  },
});
```

`globals: true` makes `describe`, `it`, `expect`, `vi`, etc. available without imports — matching Jest's behaviour. `setupFiles` loads `src/setupTests.js` before each test file (jest-dom matchers and IntersectionObserver mock).

- [ ] **Step 2: Commit**

```bash
git add vitest.config.js
git commit -m "chore: add vitest.config.js"
```

---

## Task 4: Migrate index.html to project root

**Files:**
- Create: `index.html`
- Delete: `public/index.html`

- [ ] **Step 1: Create root index.html**

Vite requires the HTML entry point at the project root. Create `index.html` with the module script tag pointing to the new entry file:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Samiul Mushfik — Portfolio" />
    <link rel="apple-touch-icon" href="/logo.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>Samiul | Portfolio</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

Note: `%PUBLIC_URL%` is removed. In Vite, `/` references the `public/` folder root directly.

- [ ] **Step 2: Delete public/index.html**

```bash
rm public/index.html
```

- [ ] **Step 3: Commit**

```bash
git add index.html public/index.html
git commit -m "chore: move index.html to project root for vite"
```

---

## Task 5: Create src/main.jsx and delete CRA entry files

**Files:**
- Create: `src/main.jsx`
- Delete: `src/index.js`
- Delete: `src/reportWebVitals.js`

- [ ] **Step 1: Create src/main.jsx**

This is `src/index.js` without the `reportWebVitals` import and call:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 2: Delete CRA-specific entry files**

```bash
rm src/index.js src/reportWebVitals.js
```

- [ ] **Step 3: Commit**

```bash
git add src/main.jsx src/index.js src/reportWebVitals.js
git commit -m "chore: replace src/index.js with src/main.jsx, remove reportWebVitals"
```

---

## Task 6: Convert config files to ESM

**Files:**
- Modify: `tailwind.config.js`
- Modify: `postcss.config.js`

- [ ] **Step 1: Update tailwind.config.js**

Vite is ESM-first; config files must use `export default` instead of `module.exports`. Also add `./index.html` to `content` since Tailwind now needs to scan the root HTML file:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-gray': "#333b50",
        'custom-green': '#00d646',
        'custom-green-v2': '#4CAF51',
        'custom-dark': '#0a0a0a',
      },
      fontFamily: {
        lulo: ['Lulo', 'sans-serif'],
      },
      screens: {
        'max-md': {'max': '1023px'}
      }
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Update postcss.config.js**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.js postcss.config.js
git commit -m "chore: convert tailwind and postcss configs to ESM"
```

---

## Task 7: Update environment variables

**Files:**
- Modify: `.env`
- Modify: `src/components/Contact.jsx`

- [ ] **Step 1: Update .env**

Vite uses `VITE_` prefix instead of `REACT_APP_`. Replace the entire `.env` content:

```
VITE_EMAIL_JS_PUBLIC_KEY='eIw2lTKpub8A4EF_M'
VITE_EMAIL_JS_SERVICE_ID='contact_service'
VITE_EMAIL_JS_TEMPLATE_ID='contact_form'
```

- [ ] **Step 2: Update Contact.jsx**

Replace all three `process.env.REACT_APP_*` references in `src/components/Contact.jsx`:

Line 62: `process.env.REACT_APP_EMAIL_JS_SERVICE_ID` → `import.meta.env.VITE_EMAIL_JS_SERVICE_ID`
Line 63: `process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID` → `import.meta.env.VITE_EMAIL_JS_TEMPLATE_ID`
Line 71: `process.env.REACT_APP_EMAIL_JS_PUBLIC_KEY` → `import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY`

The updated `emailjs.send` call:

```js
emailjs.send(
    import.meta.env.VITE_EMAIL_JS_SERVICE_ID,
    import.meta.env.VITE_EMAIL_JS_TEMPLATE_ID,
    {
        from_name: sanitizedForm.name,
        from_email: sanitizedForm.email,
        message: sanitizedForm.message,
        "g-recaptcha-response": token
    },
    {
        publicKey: import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY
    }
)
```

- [ ] **Step 3: Commit**

```bash
git add .env src/components/Contact.jsx
git commit -m "chore: update env vars from REACT_APP_ to VITE_ prefix"
```

---

## Task 8: Update test files for Vitest

**Files:**
- Modify: `src/components/__tests__/ResumeDrawer.test.js`

- [ ] **Step 1: Replace jest.fn() with vi.fn() in ResumeDrawer.test.js**

Line 5 currently reads:
```js
const onClose = jest.fn();
```

Change to:
```js
const onClose = vi.fn();
```

`vi` is available as a global because `globals: true` is set in `vitest.config.js` — no import needed.

- [ ] **Step 2: Commit**

```bash
git add src/components/__tests__/ResumeDrawer.test.js
git commit -m "chore: replace jest.fn() with vi.fn() for vitest compatibility"
```

---

## Task 9: Verify dev server, tests, and build

- [ ] **Step 1: Run the test suite**

```bash
npm test
```

Expected: All test suites pass, 0 failures. The `useInView is not a function` error from framer-motion should be gone since Vitest handles ESM natively.

If any test fails, read the error carefully. Common issues:
- `vi is not defined` → check `globals: true` is set in `vitest.config.js`
- `Cannot find module` → check the import path is correct in the test file
- `jest is not defined` → search remaining `jest.*` references: `grep -r "jest\." src --include="*.test.js"`

- [ ] **Step 2: Start the dev server**

```bash
npm start
```

Expected: Vite starts, outputs something like:
```
  VITE v5.x.x  ready in Xms
  ➜  Local:   http://localhost:5173/
```

Open `http://localhost:5173` and verify the portfolio loads correctly. Check the browser console for errors.

- [ ] **Step 3: Run a production build**

```bash
npm run build
```

Expected: Vite builds successfully, outputs files to `build/`. No errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: verify vite migration complete"
```
