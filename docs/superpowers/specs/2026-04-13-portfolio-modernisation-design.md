# Portfolio Modernisation — Design Spec
**Date:** 2026-04-13  
**Status:** Approved  

---

## Overview

Redesign the portfolio (samiul123.github.io) from a background-image-heavy dark theme to a clean **Dark Minimal** aesthetic with **Smooth Fade & Drift** animations throughout. The goal is a more modern, formal presentation that still reflects the existing green-accent brand identity.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Visual direction | Dark Minimal | Pure black bg, no background images, crisp typography |
| Animation style | Smooth Fade & Drift | Polished, professional, never distracting |
| Hero layout | Split — Text left, Photo right | Personal yet formal; shows the person behind the work |
| Section layout | Timeline (Experience/Education), Bordered Cards (Skills), Ruled rows (Publications/Certs) | Each style matches the content type |

---

## Color & Typography

- **Background:** `#0a0a0a` (pure black) — replaces all section background images
- **Surface:** `#0e0e0e` / `#111` for cards and panels
- **Border:** `#1a1a1a` (subtle) — only structural borders, no decorative ones
- **Accent:** `#3ddc84` (existing green) — kept for dots, active states, CTAs, eyebrow labels
- **Text primary:** `#ffffff`
- **Text secondary:** `#555` / `#666`
- **Fonts:** Lulo (headings, kept), Poppins (body, kept) — no new fonts

---

## Animation Spec (Framer Motion)

All animations use the existing `fadeIn` / `staggerContainer` utilities in `src/utils/motion.js`, extended as needed.

| Trigger | Behaviour |
|---|---|
| Page load | Hero elements drift up 20px and fade in sequentially: eyebrow → name → subtitle → CTAs, 0.15s apart |
| Scroll into view | `whileInView` with `once: true`, `amount: 0.2`. Section title first, then children stagger 0.1s apart |
| Timeline items | Each dot + row fades up in sequence, giving a "building" feel |
| Skill cards | Stagger-fade left-to-right across the grid |
| Nav scroll | Backdrop blur fades in when scrolled past hero height |
| Hover | Cards: `y: -3` lift. Nav links: green underline slides in from left |

---

## Section-by-Section Changes

### Hero / Home — **Full Redesign**
- **Layout:** Two-column split. Left column: eyebrow label (`— SOFTWARE ENGINEER`), large name (`SAMIUL MUSHFIK.`), subtitle, two CTAs (`VIEW WORK` solid green, `CONTACT` ghost). Right column: photo in a green-ringed circle (`border: 1.5px solid #3ddc84; border-radius: 50%`).
- **Background:** Pure black — remove `<Background>` image component.
- **Animation:** Load-time fade & drift for each hero element in sequence.
- **File:** `src/components/home.jsx`

### Header / Nav — **Refine**
- Sticky positioning with `position: fixed`.
- Transparent at top; gets `backdrop-filter: blur(12px)` + `background: rgba(10,10,10,0.8)` on scroll past hero.
- Active nav link: green underline that slides in from left.
- Mobile slide-in menu: keep existing spring animation, update colours to match dark minimal.
- **File:** `src/components/header.jsx`

### Skills — **Full Redesign**
- Remove current `ResponsiveSkills` / carousel approach.
- New layout: grouped sections per category. Each category has a label and a grid of bordered cards.
- Each skill card: icon + name, `border: 1px solid #1a1a1a`, hover lifts to `#222` border.
- On scroll: cards stagger-fade in across the grid.
- **File:** `src/components/skills.jsx`

### Projects — **Refine**
- Keep the expand-on-click fan layout — it is distinctive and working.
- Remove `<Background>` image component; replace section bg with `#0a0a0a`.
- Active card: green border instead of background overlay.
- Fade-in animation on scroll for the card group.
- **File:** `src/components/Project.jsx`

### Experience — **Full Redesign**
- Vertical timeline component: single left-side line (`#1a1a1a`), green filled dot per item.
- Each item: company logo (small), role title, company name in green, date range.
- Animate each item in sequence on scroll.
- **File:** `src/components/experience.jsx`

### Education — **Full Redesign**
- Reuse the same timeline component built for Experience.
- Fields: institution name, degree, major, date range, institution logo.
- **File:** `src/components/education.jsx`

### Publications — **Refine**
- Ruled row layout: thin `#181818` bottom border between items.
- Fields: title (white, bold), conference (green, small), date, external link arrow.
- Remove background image.
- **File:** `src/components/publication.jsx`

### Certifications — **Refine**
- Bordered card grid (2–3 columns).
- Each card: issuer logo, cert title, issue date, credential link button.
- Remove background image.
- **File:** `src/components/Certification.jsx`

### Contact — **Refine**
- Keep EmailJS form and reCAPTCHA.
- Dark input fields (`background: #111`, `border: 1px solid #1a1a1a`), green focus ring on active.
- Submit button: solid green.
- Social icons row below the form.
- Remove background image.
- **File:** `src/components/Contact.jsx`

### Footer — **Refine**
- Thin `#1a1a1a` top border.
- Single line: `SAMIUL MUSHFIK` + green dot + `© 2026`.
- Remove background image.
- **File:** `src/components/footer.jsx`

---

## Shared / Utility Changes

- **`src/utils/motion.js`** — add `driftUp` variant (fade + `y: 20 → 0`) and add default parameter `staggerChildren = 0.1` to `staggerContainer` so it can be used without arguments.
- **`src/styles/index.js`** — update `pageTitle` style to match new typography scale.
- **`src/App.js`** — remove `<Background>` from top-level wrapper; each section manages its own (now plain) background.
- **`src/components/Background.jsx`** — no longer used at section level; can be kept or removed at end of implementation.

---

## Out of Scope

- No new npm packages — Framer Motion already installed, Tailwind already installed.
- No changes to data in `src/constants/index.js` (content stays the same).
- No changes to routing or nav link structure.
- No changes to EmailJS or reCAPTCHA integration logic.
- Photo for hero split layout: use existing `samiul` / `samiulWebp` assets already in `src/assets`.

---

## Success Criteria

- All 10 sections render on pure black background with no background images.
- Every section animates in on scroll with fade & drift (no section is static).
- Hero shows split layout with photo visible at `lg` breakpoint and above; photo is hidden on `sm`/`md` (text column goes full width).
- Timeline renders correctly for both Experience and Education.
- `npm run build` exits 0 with no new warnings.
- Site is responsive at `sm`, `md`, `lg`, `xl` breakpoints.
