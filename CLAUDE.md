# Portfolio v2 — Claude Instructions

## Project Overview
Personal portfolio website built with React 18, Tailwind CSS, and Framer Motion.
Deployed to GitHub Pages at https://samiul123.github.io.

## Tech Stack
- **Framework:** React 18 (Create React App)
- **Styling:** Tailwind CSS v3 + custom CSS in `src/styles/` and `src/index.css`
- **Animations:** Framer Motion
- **Routing:** React Router DOM v6
- **Icons:** React Icons
- **Email:** EmailJS browser SDK
- **Deployment:** gh-pages (`npm run deploy`)

## Project Structure
```
src/
├── components/    # React components
├── constants/     # Data/config (projects, skills, etc.)
├── assets/        # Images, icons
├── styles/        # Component-specific CSS
├── utils/         # Helper functions
├── fonts/         # Custom fonts
└── App.js         # Root component with routing
```

## Common Commands
```bash
npm start          # Dev server (localhost:3000)
npm run build      # Production build
npm run deploy     # Build + deploy to GitHub Pages
npm test           # Run tests
```

## Conventions
- Use functional components with hooks only — no class components
- Tailwind utility classes preferred over custom CSS; add custom CSS only when Tailwind is insufficient
- Images should be in WebP format where possible (see convert-images.sh)
- Keep component data/content in `src/constants/` — not hardcoded in components
- Do not eject from CRA

## What to Avoid
- Do not install additional heavy dependencies without checking bundle size impact
- Do not modify `build/` — it is generated
- Do not touch `src/reportWebVitals.js` or `src/setupTests.js` unless specifically asked
