# Portfolio Modernisation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio from a background-image-heavy dark theme to a Dark Minimal aesthetic with Smooth Fade & Drift animations throughout.

**Architecture:** All section background images are removed; every section gets a pure `#0a0a0a` background managed by Tailwind. A new shared `Timeline` component handles both Experience and Education. A `driftUp` animation variant is added to `motion.js` and applied via Framer Motion's `whileInView` across all sections.

**Tech Stack:** React 18, Framer Motion 11, Tailwind CSS 3, @testing-library/react

**Spec:** `docs/superpowers/specs/2026-04-13-portfolio-modernisation-design.md`

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `tailwind.config.js` | Add `custom-dark` colour token |
| Modify | `src/utils/motion.js` | Add `driftUp` variant, add default param to `staggerContainer` |
| Modify | `src/styles/index.js` | Remove stale `z-10` from `pageTitle`, add `sectionLabel` helper |
| Modify | `src/App.js` | Remove `Background` + hero wrapper, unified nav.route map |
| Modify | `src/components/home.jsx` | Split hero: text left, photo right |
| Modify | `src/components/header.jsx` | Fixed position, scroll backdrop blur, green underline indicator |
| **Create** | `src/components/Timeline.jsx` | Shared vertical timeline (Experience + Education) |
| Modify | `src/components/experience.jsx` | Use `Timeline`, keep resume download button |
| Modify | `src/components/education.jsx` | Use `Timeline`, remove `education.css` import |
| Modify | `src/components/skills.jsx` | Card grid per category, remove slideshow |
| Modify | `src/components/Project.jsx` | Remove `Background`, dark bg, green active border |
| Modify | `src/components/publication.jsx` | Ruled rows, remove `Background` |
| Modify | `src/components/Certification.jsx` | Card grid, remove slideshow + `Background` |
| Modify | `src/components/Contact.jsx` | Dark inputs, green focus ring, `#0a0a0a` bg |
| Modify | `src/components/footer.jsx` | Thin-bordered minimal footer |

---

## Task 1: Add `custom-dark` Tailwind token

**Files:**
- Modify: `tailwind.config.js`

- [ ] **Step 1: Write the failing test**

  Create `src/components/__tests__/tailwind.test.js`:

  ```js
  // Smoke test: verifies the config file can be required without throwing.
  // Tailwind colour tokens are validated by the build; this just guards against syntax errors.
  test('tailwind config loads without error', () => {
    expect(() => require('../../../tailwind.config.js')).not.toThrow();
  });
  ```

- [ ] **Step 2: Run test to confirm it passes (config already exists)**

  ```bash
  npm test -- --testPathPattern=tailwind --watchAll=false
  ```

  Expected: PASS

- [ ] **Step 3: Add `custom-dark` colour to `tailwind.config.js`**

  Open `tailwind.config.js`. Replace the `colors` block:

  ```js
  colors: {
    'custom-gray': "#333b50",
    'custom-green': '#00d646',
    'custom-green-v2': '#4CAF51',
    'custom-dark': '#0a0a0a',
  },
  ```

- [ ] **Step 4: Re-run test to confirm still passes**

  ```bash
  npm test -- --testPathPattern=tailwind --watchAll=false
  ```

  Expected: PASS

- [ ] **Step 5: Commit**

  ```bash
  git add tailwind.config.js src/components/__tests__/tailwind.test.js
  git commit -m "feat: add custom-dark colour token to tailwind config"
  ```

---

## Task 2: Extend motion utilities

**Files:**
- Modify: `src/utils/motion.js`
- Test: `src/components/__tests__/motion.test.js`

- [ ] **Step 1: Write the failing test**

  Create `src/components/__tests__/motion.test.js`:

  ```js
  import { driftUp, staggerContainer } from '../../utils/motion';

  test('driftUp returns hidden state with y:20 and opacity:0', () => {
    const variant = driftUp();
    expect(variant.hidden.opacity).toBe(0);
    expect(variant.hidden.y).toBe(20);
  });

  test('driftUp show state has correct delay', () => {
    const variant = driftUp(0.3);
    expect(variant.show.transition.delay).toBe(0.3);
  });

  test('staggerContainer works with no arguments', () => {
    const result = staggerContainer();
    expect(result.show.transition.staggerChildren).toBe(0.1);
  });

  test('staggerContainer accepts custom stagger value', () => {
    const result = staggerContainer(0.2);
    expect(result.show.transition.staggerChildren).toBe(0.2);
  });
  ```

- [ ] **Step 2: Run test to confirm it fails**

  ```bash
  npm test -- --testPathPattern=motion --watchAll=false
  ```

  Expected: FAIL — `driftUp is not a function` and `staggerContainer()` TypeError.

- [ ] **Step 3: Add `driftUp` and update `staggerContainer` in `src/utils/motion.js`**

  Add `driftUp` at the top of the file (after any existing imports):

  ```js
  export const driftUp = (delay = 0, duration = 0.6) => ({
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'tween', ease: 'easeOut', delay, duration },
    },
  });
  ```

  Update `staggerContainer` signature to add a default value:

  ```js
  export const staggerContainer = (staggerChildren = 0.1, delayChildren) => {
    return {
      hidden: {},
      show: {
        transition: {
          staggerChildren: staggerChildren,
          delayChildren: delayChildren || 0,
        },
      },
    };
  };
  ```

- [ ] **Step 4: Run tests to confirm they pass**

  ```bash
  npm test -- --testPathPattern=motion --watchAll=false
  ```

  Expected: PASS — 4 tests.

- [ ] **Step 5: Commit**

  ```bash
  git add src/utils/motion.js src/components/__tests__/motion.test.js
  git commit -m "feat: add driftUp animation variant, default staggerContainer param"
  ```

---

## Task 3: Update shared styles and App.js

**Files:**
- Modify: `src/styles/index.js`
- Modify: `src/App.js`

- [ ] **Step 1: Add `scroll-padding-top` to `src/index.css`**

  Open `src/index.css` and add at the top (before existing rules):

  ```css
  html {
    scroll-padding-top: 80px;
  }
  ```

  This prevents fixed-header overlap when clicking nav anchor links.

- [ ] **Step 2: Update `src/styles/index.js`**

  Replace the entire file content:

  ```js
  export const styles = {
    pageTitle: 'font-lulo lg:text-4xl text-3xl font-black tracking-tight',
    innerWidth: '2xl:max-w-[1280px] w-full',
    sectionLabel: 'text-xs tracking-[4px] text-custom-green uppercase mb-3',
  };
  ```

- [ ] **Step 3: Update `src/App.js`**

  Replace the entire file content:

  ```jsx
  import './App.css';
  import Header from './components/header';
  import { Footer } from './components/footer';
  import { navLinks } from './constants';
  import React from 'react';

  function App() {
    return (
      <div className="bg-custom-dark w-full">
        <Header />
        {navLinks.map(nav => {
          if (nav.route) {
            return <nav.route key={nav.id} id={nav.id} />;
          }
          return null;
        })}
        <Footer />
      </div>
    );
  }

  export default App;
  ```

- [ ] **Step 4: Run the existing App test to confirm it still passes**

  ```bash
  npm test -- --testPathPattern=App.test --watchAll=false
  ```

  Expected: PASS

- [ ] **Step 5: Commit**

  ```bash
  git add src/index.css src/styles/index.js src/App.js
  git commit -m "refactor: remove Background wrapper from App, add scroll-padding-top, unify section rendering"
  ```

---

## Task 4: Redesign Hero section

**Files:**
- Modify: `src/components/home.jsx`
- Test: `src/components/__tests__/home.test.js`

- [ ] **Step 1: Write the failing test**

  Create `src/components/__tests__/home.test.js`:

  ```js
  import { render, screen } from '@testing-library/react';
  import Home from '../home';

  test('renders name', () => {
    render(<Home id="home" />);
    expect(screen.getByText(/SAMIUL/)).toBeInTheDocument();
    expect(screen.getByText(/MUSHFIK/)).toBeInTheDocument();
  });

  test('renders photo', () => {
    render(<Home id="home" />);
    expect(screen.getByAltText('Samiul Mushfik')).toBeInTheDocument();
  });

  test('renders CTA links', () => {
    render(<Home id="home" />);
    expect(screen.getByText('VIEW WORK')).toBeInTheDocument();
    expect(screen.getByText('CONTACT')).toBeInTheDocument();
  });
  ```

- [ ] **Step 2: Run test to confirm it fails**

  ```bash
  npm test -- --testPathPattern=home.test --watchAll=false
  ```

  Expected: FAIL — photo alt text not found, CTA text not found.

- [ ] **Step 3: Replace `src/components/home.jsx`**

  ```jsx
  import { motion } from 'framer-motion';
  import { samiul, samiulWebp } from '../assets';
  import { driftUp, staggerContainer } from '../utils/motion';

  const Home = (props) => (
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
            className="text-sm tracking-[3px] text-gray-500 uppercase"
          >
            Data Science Enthusiast
          </motion.p>
          <motion.div variants={driftUp(0.4)} className="flex gap-4 mt-2">
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
          </motion.div>
        </div>

        {/* Right column: photo — hidden on mobile */}
        <motion.div variants={driftUp(0.3)} className="hidden lg:flex justify-center">
          <div className="w-72 h-72 rounded-full border-[1.5px] border-custom-green overflow-hidden">
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
    </section>
  );

  export default Home;
  ```

- [ ] **Step 4: Run test to confirm it passes**

  ```bash
  npm test -- --testPathPattern=home.test --watchAll=false
  ```

  Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/home.jsx src/components/__tests__/home.test.js
  git commit -m "feat: redesign hero section — split layout with photo, fade & drift animations"
  ```

---

## Task 5: Refine Header / Nav

**Files:**
- Modify: `src/components/header.jsx`
- Test: `src/components/__tests__/header.test.js`

- [ ] **Step 1: Write the failing test**

  Create `src/components/__tests__/header.test.js`:

  ```js
  import { render, screen } from '@testing-library/react';
  import Header from '../header';

  test('renders all nav links', () => {
    render(<Header />);
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
  });

  test('renders logo', () => {
    render(<Header />);
    // WebsiteLogo renders an img or svg — confirm header element exists
    expect(document.querySelector('header')).toBeInTheDocument();
  });
  ```

- [ ] **Step 2: Run test to confirm it passes (header already renders)**

  ```bash
  npm test -- --testPathPattern=header.test --watchAll=false
  ```

  Expected: PASS (baseline established before changes).

- [ ] **Step 3: Replace `src/components/header.jsx`**

  ```jsx
  import { useEffect, useState } from 'react';
  import { menu, close } from '../assets';
  import { navLinks } from '../constants';
  import { motion } from 'framer-motion';
  import { WebsiteLogo } from './WebsiteLogo';

  function Header() {
    const [activeMenu, setActiveMenu] = useState('home');
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 80);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
      if (menuOpen) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
      return () => document.body.classList.remove('no-scroll');
    }, [menuOpen]);

    return (
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 lg:px-20 py-5 transition-all duration-300 ${
          scrolled
            ? 'bg-custom-dark/90 backdrop-blur-md border-b border-[#1a1a1a]'
            : 'bg-transparent'
        }`}
      >
        <WebsiteLogo
          className="h-10 cursor-pointer"
          onClick={() => {
            setActiveMenu('home');
            window.scrollTo(0, 0);
          }}
        />

        {/* Mobile toggle */}
        <div className="fixed top-5 right-5 z-50 lg:hidden">
          <motion.button
            animate={{ rotate: menuOpen ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white"
          >
            <img src={menuOpen ? close : menu} alt="menu" className="w-7 h-7" />
          </motion.button>
        </div>

        {/* Desktop nav */}
        {window.innerWidth >= 1024 && (
          <nav>
            <ul className="flex flex-row items-center gap-1">
              {navLinks.map(nav => (
                <li
                  key={nav.id}
                  className="relative cursor-pointer"
                  onClick={() => {
                    setActiveMenu(nav.id);
                    setMenuOpen(false);
                  }}
                >
                  <a
                    href={`#${nav.id}`}
                    className={`block px-3 py-2 text-xs tracking-[2px] transition-colors duration-300 ${
                      activeMenu === nav.id ? 'text-white' : 'text-gray-500'
                    } hover:text-white`}
                  >
                    {nav.title}
                  </a>
                  {activeMenu === nav.id && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-[1px] bg-custom-green"
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Mobile nav */}
        {window.innerWidth < 1024 && (
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: menuOpen ? '0%' : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`${menuOpen ? 'flex' : 'hidden'} flex-col fixed top-0 left-0 w-full bg-custom-dark border-r border-[#1a1a1a] p-8 z-40 min-h-screen`}
          >
            <ul className="flex flex-col gap-6 mt-20">
              {navLinks.map(nav => (
                <li
                  key={nav.id}
                  className={`cursor-pointer text-sm tracking-[2px] transition-colors duration-300 ${
                    activeMenu === nav.id ? 'text-custom-green' : 'text-gray-500'
                  } hover:text-white`}
                  onClick={() => {
                    setActiveMenu(nav.id);
                    setMenuOpen(false);
                  }}
                >
                  <a href={`#${nav.id}`} className="block">
                    {nav.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </header>
    );
  }

  export default Header;
  ```

- [ ] **Step 4: Run test to confirm it still passes**

  ```bash
  npm test -- --testPathPattern=header.test --watchAll=false
  ```

  Expected: PASS

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/header.jsx src/components/__tests__/header.test.js
  git commit -m "feat: fixed header with scroll backdrop blur and green active underline"
  ```

---

## Task 6: Create shared Timeline component

**Files:**
- Create: `src/components/Timeline.jsx`
- Test: `src/components/__tests__/Timeline.test.js`

- [ ] **Step 1: Write the failing test**

  Create `src/components/__tests__/Timeline.test.js`:

  ```js
  import { render, screen } from '@testing-library/react';
  import Timeline from '../Timeline';

  const items = [
    { title: 'Software Engineer', subtitle: 'Acme Corp', date: '2022–2023' },
    { title: 'Junior Developer', subtitle: 'Beta Inc', date: '2020–2022' },
  ];

  test('renders section title', () => {
    render(<Timeline items={items} label="Career" title="EXPERIENCE" id="experiences" />);
    expect(screen.getByText('EXPERIENCE')).toBeInTheDocument();
  });

  test('renders all item titles', () => {
    render(<Timeline items={items} label="Career" title="EXPERIENCE" id="experiences" />);
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Junior Developer')).toBeInTheDocument();
  });

  test('renders all subtitles in green', () => {
    render(<Timeline items={items} label="Career" title="EXPERIENCE" id="experiences" />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Beta Inc')).toBeInTheDocument();
  });

  test('renders dates', () => {
    render(<Timeline items={items} label="Career" title="EXPERIENCE" id="experiences" />);
    expect(screen.getByText('2022–2023')).toBeInTheDocument();
  });
  ```

- [ ] **Step 2: Run test to confirm it fails**

  ```bash
  npm test -- --testPathPattern=Timeline.test --watchAll=false
  ```

  Expected: FAIL — `Timeline` module not found.

- [ ] **Step 3: Create `src/components/Timeline.jsx`**

  ```jsx
  import { Fragment } from 'react';
  import { motion } from 'framer-motion';
  import { driftUp, staggerContainer } from '../utils/motion';

  const TimelineItem = ({ title, subtitle, meta, date, images, index }) => (
    <motion.div
      variants={driftUp(index * 0.12)}
      className="relative pl-10 pb-12 last:pb-0"
    >
      {/* Vertical connecting line */}
      <div className="absolute left-[3px] top-2 bottom-0 w-px bg-[#1a1a1a]" />
      {/* Dot */}
      <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-custom-green ring-2 ring-custom-dark" />

      <div className="flex items-start gap-4">
        {images && (
          <picture className="w-8 h-8 flex-shrink-0 mt-0.5">
            {images.map((img, i) => (
              <Fragment key={i}>
                <source type={img.type} srcSet={img.srcSet} />
                {img.fallback && (
                  <img
                    src={img.srcSet}
                    alt={subtitle}
                    className="w-8 h-8 object-contain opacity-70"
                  />
                )}
              </Fragment>
            ))}
          </picture>
        )}
        <div>
          <h3 className="text-white font-bold text-sm tracking-wide">{title}</h3>
          <p className="text-custom-green text-xs tracking-[2px] uppercase mt-1">{subtitle}</p>
          <p className="text-gray-600 text-xs mt-1">{date}</p>
          {meta && <p className="text-gray-500 text-xs mt-0.5">{meta}</p>}
        </div>
      </div>
    </motion.div>
  );

  const Timeline = ({ items, label, title, id }) => (
    <section id={id} className="bg-custom-dark text-white px-6 lg:px-20 py-20">
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        <motion.p
          variants={driftUp(0)}
          className="text-xs tracking-[4px] text-custom-green uppercase mb-3"
        >
          — {label}
        </motion.p>
        <motion.h2
          variants={driftUp(0.05)}
          className="font-lulo text-3xl lg:text-4xl font-black mb-14 text-white"
        >
          {title}
        </motion.h2>
        <div className="relative">
          {items.map((item, i) => (
            <TimelineItem key={i} {...item} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );

  export default Timeline;
  ```

- [ ] **Step 4: Run tests to confirm they pass**

  ```bash
  npm test -- --testPathPattern=Timeline.test --watchAll=false
  ```

  Expected: PASS — 4 tests.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/Timeline.jsx src/components/__tests__/Timeline.test.js
  git commit -m "feat: create shared Timeline component for Experience and Education"
  ```

---

## Task 7: Redesign Experience section

**Files:**
- Modify: `src/components/experience.jsx`
- Test: `src/components/__tests__/experience.test.js`

- [ ] **Step 1: Write the failing test**

  Create `src/components/__tests__/experience.test.js`:

  ```js
  import { render, screen } from '@testing-library/react';
  import { Experience } from '../experience';

  test('renders EXPERIENCE heading', () => {
    render(<Experience id="experiences" />);
    expect(screen.getByText('EXPERIENCE')).toBeInTheDocument();
  });

  test('renders all company names', () => {
    render(<Experience id="experiences" />);
    expect(screen.getByText('Stibo DX')).toBeInTheDocument();
    expect(screen.getByText('Kona Software Lab Ltd.')).toBeInTheDocument();
  });

  test('renders resume button', () => {
    render(<Experience id="experiences" />);
    expect(screen.getByText('MY RESUME')).toBeInTheDocument();
  });
  ```

- [ ] **Step 2: Run test to confirm it fails**

  ```bash
  npm test -- --testPathPattern=experience.test --watchAll=false
  ```

  Expected: FAIL — heading/company text not found in new structure.

- [ ] **Step 3: Replace `src/components/experience.jsx`**

  ```jsx
  import { motion } from 'framer-motion';
  import { experiences } from '../constants';
  import { download, resume, resumeWebp } from '../assets';
  import Timeline from './Timeline';
  import { driftUp } from '../utils/motion';

  export const Experience = (props) => {
    const items = experiences.map(exp => ({
      title: exp.title,
      subtitle: exp.company,
      date: exp.date,
      images: exp.images,
    }));

    return (
      <div id={props.id}>
        <Timeline items={items} label="Career" title="EXPERIENCE" />
        <div className="bg-custom-dark pb-16 px-6 lg:px-20 flex justify-center">
          <motion.button
            variants={driftUp(0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            onClick={() => window.open('/resume.html')}
            className="flex items-center gap-3 border border-[#1a1a1a] text-gray-400 text-xs tracking-[2px] px-6 py-3 rounded hover:border-custom-green hover:text-custom-green transition-colors"
          >
            MY RESUME
            <img src={download} alt="download" className="w-4 h-4 object-contain opacity-60" />
          </motion.button>
        </div>
      </div>
    );
  };
  ```

- [ ] **Step 4: Run tests to confirm they pass**

  ```bash
  npm test -- --testPathPattern=experience.test --watchAll=false
  ```

  Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/experience.jsx src/components/__tests__/experience.test.js
  git commit -m "feat: redesign Experience section using Timeline component"
  ```

---

## Task 8: Redesign Education section

**Files:**
- Modify: `src/components/education.jsx`
- Test: `src/components/__tests__/education.test.js`

- [ ] **Step 1: Write the failing test**

  Create `src/components/__tests__/education.test.js`:

  ```js
  import { render, screen } from '@testing-library/react';
  import { Education } from '../education';

  test('renders EDUCATION heading', () => {
    render(<Education id="education" />);
    expect(screen.getByText('EDUCATION')).toBeInTheDocument();
  });

  test('renders institution names', () => {
    render(<Education id="education" />);
    expect(screen.getByText('University of Minnesota - Duluth')).toBeInTheDocument();
    expect(screen.getByText('Bangladesh University of Engineering and Technology')).toBeInTheDocument();
  });

  test('renders degree names', () => {
    render(<Education id="education" />);
    expect(screen.getByText('Master of Science')).toBeInTheDocument();
    expect(screen.getByText('Bachelor of Science')).toBeInTheDocument();
  });
  ```

- [ ] **Step 2: Run test to confirm it fails**

  ```bash
  npm test -- --testPathPattern=education.test --watchAll=false
  ```

  Expected: FAIL

- [ ] **Step 3: Replace `src/components/education.jsx`**

  ```jsx
  import { educations } from '../constants';
  import Timeline from './Timeline';

  export const Education = (props) => {
    const items = educations.map(edu => ({
      title: edu.institution,
      subtitle: edu.degree,
      date: edu.date,
      meta: edu.major,
      images: edu.images,
    }));

    return (
      <div id={props.id}>
        <Timeline items={items} label="Academic" title="EDUCATION" />
      </div>
    );
  };
  ```

- [ ] **Step 4: Delete the now-unused CSS import**

  The file `src/styles/education.css` is no longer imported. It can remain on disk (safe), but the import is gone from the new file.

- [ ] **Step 5: Run tests to confirm they pass**

  ```bash
  npm test -- --testPathPattern=education.test --watchAll=false
  ```

  Expected: PASS — 3 tests.

- [ ] **Step 6: Commit**

  ```bash
  git add src/components/education.jsx src/components/__tests__/education.test.js
  git commit -m "feat: redesign Education section using shared Timeline component"
  ```

---

## Task 9: Redesign Skills section

**Files:**
- Modify: `src/components/skills.jsx`
- Test: `src/components/__tests__/skills.test.js`

- [ ] **Step 1: Write the failing test**

  Create `src/components/__tests__/skills.test.js`:

  ```js
  import { render, screen } from '@testing-library/react';
  import Skills from '../skills';

  test('renders SKILLS heading', () => {
    render(<Skills id="skills" />);
    expect(screen.getByText('SKILLS')).toBeInTheDocument();
  });

  test('renders skill group titles', () => {
    render(<Skills id="skills" />);
    expect(screen.getByText('PROGRAMMING LANGUAGES')).toBeInTheDocument();
    expect(screen.getByText('FRAMEWORKS & LIBRARIES')).toBeInTheDocument();
  });

  test('renders individual skill names', () => {
    render(<Skills id="skills" />);
    expect(screen.getByText('JAVA')).toBeInTheDocument();
    expect(screen.getByText('PYTHON')).toBeInTheDocument();
    expect(screen.getByText('REACT')).toBeInTheDocument();
  });
  ```

- [ ] **Step 2: Run test to confirm it fails**

  ```bash
  npm test -- --testPathPattern=skills.test --watchAll=false
  ```

  Expected: FAIL

- [ ] **Step 3: Replace `src/components/skills.jsx`**

  ```jsx
  import { Fragment } from 'react';
  import { motion } from 'framer-motion';
  import { skillGroups } from '../constants';
  import { driftUp, staggerContainer } from '../utils/motion';

  const SkillCard = ({ name, images, index }) => (
    <motion.div
      variants={driftUp(index * 0.05)}
      whileHover={{ y: -3 }}
      className="flex flex-col items-center gap-2 p-3 border border-[#1a1a1a] rounded-lg bg-[#0e0e0e] hover:border-[#333] transition-colors cursor-default"
    >
      <picture className="w-8 h-8">
        {images.map((img, i) => (
          <Fragment key={i}>
            <source type={img.type} srcSet={img.srcSet} />
            {img.fallback && (
              <img src={img.srcSet} alt={name} className="w-8 h-8 object-contain" />
            )}
          </Fragment>
        ))}
      </picture>
      <span className="text-[9px] tracking-[1px] text-gray-500 text-center">{name}</span>
    </motion.div>
  );

  const SkillCategory = ({ title, items }) => (
    <motion.div
      variants={staggerContainer()}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="mb-14"
    >
      <motion.p variants={driftUp(0)} className="text-xs tracking-[3px] text-custom-green uppercase mb-5">
        — {title}
      </motion.p>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {items.map((item, i) => (
          <SkillCard key={item.id} name={item.name} images={item.images} index={i} />
        ))}
      </div>
    </motion.div>
  );

  const Skills = (props) => (
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
          className="font-lulo text-3xl lg:text-4xl font-black mb-14 text-white"
        >
          SKILLS
        </motion.h2>
        {skillGroups.map(group => (
          <SkillCategory key={group.title} title={group.title} items={group.items} />
        ))}
      </motion.div>
    </section>
  );

  export default Skills;
  ```

- [ ] **Step 4: Run tests to confirm they pass**

  ```bash
  npm test -- --testPathPattern=skills.test --watchAll=false
  ```

  Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/skills.jsx src/components/__tests__/skills.test.js
  git commit -m "feat: redesign Skills section — card grid by category, remove slideshow"
  ```

---

## Task 10: Refine Projects section

**Files:**
- Modify: `src/components/Project.jsx`
- Test: `src/components/__tests__/Project.test.js`

- [ ] **Step 1: Write the failing test**

  Create `src/components/__tests__/Project.test.js`:

  ```js
  import { render, screen } from '@testing-library/react';
  import { Project } from '../Project';

  test('renders PROJECTS heading', () => {
    render(<Project id="projects" />);
    expect(screen.getByText('PROJECTS')).toBeInTheDocument();
  });

  test('renders project titles', () => {
    render(<Project id="projects" />);
    expect(screen.getByText('MindQuest')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
  });
  ```

- [ ] **Step 2: Run test to establish baseline**

  ```bash
  npm test -- --testPathPattern=Project.test --watchAll=false
  ```

  Expected: PASS (baseline before changes).

- [ ] **Step 3: Remove `Background` import and usage, update section background**

  In `src/components/Project.jsx`:

  Remove the import line:
  ```js
  import {projectBg, github, show, hide, projectWebp} from "../assets";
  ```
  Replace with (keeping only what's needed):
  ```js
  import { github, show } from "../assets";
  ```

  Remove the `images` state array (lines with `projectBg`, `projectWebp`).

  Remove `<Background images={images}/>` from the JSX.

  Update the outer section `className` — replace `bg-cover` and any implicit background:
  ```jsx
  className="p-10 h-auto bg-custom-dark text-white flex flex-col items-center justify-center space-y-10"
  ```

- [ ] **Step 2: Add green border to active card, fix `staggerContainer` call**

  In `ProjectCard`, update the motion.div `className` to add a green border when active:

  ```jsx
  className={`relative ${
    active === id ? 'lg:flex-[3] flex-[10] ring-1 ring-custom-green' : 'lg:flex-[1] flex-[1]'
  } flex items-center justify-center h-[420px] cursor-pointer rounded-b-[24px] overflow-hidden`}
  ```

  In the `Project` component, fix the staggerContainer call (it was missing parentheses):

  ```jsx
  variants={staggerContainer()}
  ```

  Update the active card overlay from `bg-custom-gray` to dark:

  ```jsx
  className="absolute bottom-0 p-8 justify-start w-full flex-col rounded-b-[24px] bg-custom-dark/90 z-10"
  ```

- [ ] **Step 6: Re-run test to confirm it still passes after changes**

  ```bash
  npm test -- --testPathPattern=Project.test --watchAll=false
  ```

  Expected: PASS

- [ ] **Step 7: Commit**

  ```bash
  git add src/components/Project.jsx src/components/__tests__/Project.test.js
  git commit -m "refactor: remove Background from Projects, dark bg, green active border"
  ```

---

## Task 11: Refine Publications section

**Files:**
- Modify: `src/components/publication.jsx`
- Test: `src/components/__tests__/publication.test.js`

- [ ] **Step 1: Write the failing test**

  Create `src/components/__tests__/publication.test.js`:

  ```js
  import { render, screen } from '@testing-library/react';
  import { Publication } from '../publication';

  test('renders PUBLICATIONS heading', () => {
    render(<Publication id="publications" />);
    expect(screen.getByText('PUBLICATIONS')).toBeInTheDocument();
  });

  test('renders publication title as link', () => {
    render(<Publication id="publications" />);
    expect(screen.getByRole('link', { name: /Recommendation Systems/i })).toBeInTheDocument();
  });

  test('renders conference name', () => {
    render(<Publication id="publications" />);
    expect(screen.getByText(/Congress on Intelligent Systems/)).toBeInTheDocument();
  });

  test('renders ABSTRACT button', () => {
    render(<Publication id="publications" />);
    expect(screen.getByText(/ABSTRACT/)).toBeInTheDocument();
  });
  ```

- [ ] **Step 2: Run test to confirm it fails**

  ```bash
  npm test -- --testPathPattern=publication.test --watchAll=false
  ```

  Expected: FAIL

- [ ] **Step 3: Replace `src/components/publication.jsx`**

  ```jsx
  import { useState } from 'react';
  import { motion } from 'framer-motion';
  import { publications } from '../constants';
  import { driftUp, staggerContainer } from '../utils/motion';

  export const Publication = (props) => {
    const [showAbstract, setShowAbstract] = useState(null);

    return (
      <section id={props.id} className="bg-custom-dark text-white px-6 lg:px-20 py-20">
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <motion.p variants={driftUp(0)} className="text-xs tracking-[4px] text-custom-green uppercase mb-3">
            — Research
          </motion.p>
          <motion.h2
            variants={driftUp(0.05)}
            className="font-lulo text-3xl lg:text-4xl font-black mb-14 text-white uppercase"
          >
            PUBLICATIONS
          </motion.h2>

          <div className="flex flex-col">
            {publications.map((pub, i) => (
              <motion.div
                key={i}
                variants={driftUp(i * 0.1)}
                className="py-8 border-b border-[#181818] last:border-b-0"
              >
                {showAbstract === i ? (
                  <div>
                    <p className="text-xs tracking-[3px] text-custom-green uppercase mb-4">Abstract</p>
                    <p className="text-gray-400 text-sm leading-relaxed">{pub.abstract}</p>
                    <button
                      onClick={() => setShowAbstract(null)}
                      className="mt-6 text-xs tracking-[2px] text-gray-600 hover:text-white transition-colors"
                    >
                      ← Back
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-6">
                    <div>
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-white hover:text-custom-green transition-colors text-sm leading-snug"
                      >
                        {pub.title}
                      </a>
                      <p className="text-custom-green text-xs tracking-[1px] mt-3">{pub.conference}</p>
                      <p className="text-gray-600 text-xs mt-1">{pub.date}</p>
                    </div>
                    <button
                      onClick={() => setShowAbstract(i)}
                      className="flex-shrink-0 text-gray-600 hover:text-white text-xs tracking-[2px] transition-colors whitespace-nowrap"
                    >
                      ABSTRACT →
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    );
  };
  ```

- [ ] **Step 4: Run tests to confirm they pass**

  ```bash
  npm test -- --testPathPattern=publication.test --watchAll=false
  ```

  Expected: PASS — 4 tests.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/publication.jsx src/components/__tests__/publication.test.js
  git commit -m "refactor: Publications — ruled rows, remove Background, driftUp animations"
  ```

---

## Task 12: Refine Certifications section

**Files:**
- Modify: `src/components/Certification.jsx`
- Test: `src/components/__tests__/Certification.test.js`

- [ ] **Step 1: Write the failing test**

  Create `src/components/__tests__/Certification.test.js`:

  ```js
  import { render, screen } from '@testing-library/react';
  import { Certification } from '../Certification';

  test('renders CERTIFICATIONS heading', () => {
    render(<Certification id="certifications" />);
    expect(screen.getByText('CERTIFICATIONS')).toBeInTheDocument();
  });

  test('renders all cert titles', () => {
    render(<Certification id="certifications" />);
    expect(screen.getByText('Systems Expert Certificate')).toBeInTheDocument();
    expect(screen.getByText('The Ultimate Hands-On Hadoop: Tame Your Big Data')).toBeInTheDocument();
  });

  test('renders VIEW CREDENTIAL links', () => {
    render(<Certification id="certifications" />);
    const links = screen.getAllByText(/VIEW CREDENTIAL/);
    expect(links.length).toBe(3);
  });
  ```

- [ ] **Step 2: Run test to confirm it fails**

  ```bash
  npm test -- --testPathPattern=Certification.test --watchAll=false
  ```

  Expected: FAIL

- [ ] **Step 3: Replace `src/components/Certification.jsx`**

  ```jsx
  import { Fragment } from 'react';
  import { motion } from 'framer-motion';
  import { certifications } from '../constants';
  import { driftUp, staggerContainer } from '../utils/motion';

  export const Certification = (props) => (
    <section id={props.id} className="bg-custom-dark text-white px-6 lg:px-20 py-20">
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-5xl mx-auto"
      >
        <motion.p variants={driftUp(0)} className="text-xs tracking-[4px] text-custom-green uppercase mb-3">
          — Credentials
        </motion.p>
        <motion.h2
          variants={driftUp(0.05)}
          className="font-lulo text-3xl lg:text-4xl font-black mb-14 text-white uppercase"
        >
          CERTIFICATIONS
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, i) => (
            <motion.div
              key={i}
              variants={driftUp(i * 0.1)}
              whileHover={{ y: -3 }}
              className="border border-[#1a1a1a] rounded-lg overflow-hidden hover:border-[#333] transition-colors"
            >
              <picture
                className="cursor-pointer block"
                onClick={() => window.open(cert.credentialUrl)}
              >
                {cert.images.map((img, j) => (
                  <Fragment key={j}>
                    <source type={img.type} srcSet={img.srcSet} />
                    {img.fallback && (
                      <img
                        src={img.srcSet}
                        alt={cert.title}
                        className="w-full h-40 object-cover"
                      />
                    )}
                  </Fragment>
                ))}
              </picture>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={cert.issuerLogo}
                    alt={cert.issuer}
                    className="w-5 h-5 object-contain opacity-60"
                  />
                  <span className="text-xs tracking-[2px] text-gray-500 uppercase">{cert.issuer}</span>
                </div>
                <h3 className="text-white text-sm font-bold leading-snug mb-2">{cert.title}</h3>
                <p className="text-gray-600 text-xs mb-4">{cert.issueDate}</p>
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs tracking-[2px] text-custom-green hover:underline"
                >
                  VIEW CREDENTIAL →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
  ```

- [ ] **Step 4: Run tests to confirm they pass**

  ```bash
  npm test -- --testPathPattern=Certification.test --watchAll=false
  ```

  Expected: PASS — 3 tests.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/Certification.jsx src/components/__tests__/Certification.test.js
  git commit -m "refactor: Certifications — card grid, remove slideshow and Background"
  ```

---

## Task 13: Refine Contact section

**Files:**
- Modify: `src/components/Contact.jsx`

- [ ] **Step 1: Update section background and form container colour**

  In `src/components/Contact.jsx`, change the outer `div` className:

  ```jsx
  // Before:
  className="p-10 h-auto bg-custom-gray text-white flex flex-col items-center space-y-10"

  // After:
  className="bg-custom-dark text-white px-6 lg:px-20 py-20 flex flex-col items-center gap-10"
  ```

- [ ] **Step 2: Update form container background**

  Change the form wrapper div className:

  ```jsx
  // Before:
  className="bg-gray-600 flex-[.75] p-4 sm:p-8 rounded-lg lg:min-w-[700px] md:min-w-[600px] min-w-[300px]"

  // After:
  className="bg-[#0e0e0e] border border-[#1a1a1a] flex-[.75] p-4 sm:p-8 rounded-lg lg:min-w-[700px] md:min-w-[600px] min-w-[300px]"
  ```

- [ ] **Step 3: Update input and textarea classes**

  For all three `input` elements and the `textarea`, update the className:

  ```jsx
  // Before (all inputs/textarea):
  className="text-input px-3 py-4 rounded-lg border-none font-medium bg-custom-gray outline-none"

  // After:
  className="px-3 py-4 rounded-lg font-medium bg-[#111] border border-[#1a1a1a] outline-none focus:border-custom-green text-white w-full transition-colors"
  ```

  For the `textarea`, also add `resize-none` and the same updated className (without the separate `resize-none` class since it becomes part of the updated class):

  ```jsx
  className="px-3 py-4 rounded-lg font-medium bg-[#111] border border-[#1a1a1a] outline-none focus:border-custom-green text-white w-full transition-colors resize-none"
  ```

- [ ] **Step 4: Update submit button style**

  ```jsx
  // Before:
  className="p-3 flex w-fit gap-2 items-center justify-center bg-custom-gray font-bold rounded-lg hover:bg-black"

  // After:
  className="p-3 flex w-fit gap-2 items-center justify-center bg-custom-green text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
  ```

- [ ] **Step 5: Replace the `slideIn` form animation with `driftUp`**

  Replace the motion import line (remove `slideIn`, keep `vibrate`, add `driftUp`):

  ```js
  import { vibrate, driftUp } from '../utils/motion';
  ```

  Update the animated form wrapper `variants`:

  ```jsx
  // Before:
  variants={slideIn('left', 'tween', 0.2, 1)}

  // After:
  variants={driftUp(0.2)}
  ```

  Update `initial` and `animate` to match the new variant shape:

  ```jsx
  initial="hidden"
  animate={isInView ? "show" : "hidden"}
  ```

- [ ] **Step 6: Verify the build compiles cleanly**

  ```bash
  npm run build 2>&1 | tail -20
  ```

  Expected: `Compiled successfully.`

- [ ] **Step 7: Commit**

  ```bash
  git add src/components/Contact.jsx
  git commit -m "refactor: Contact — dark minimal styling, green focus ring, green submit button"
  ```

---

## Task 14: Refine Footer

**Files:**
- Modify: `src/components/footer.jsx`
- Test: `src/components/__tests__/footer.test.js`

- [ ] **Step 1: Write the failing test**

  Create `src/components/__tests__/footer.test.js`:

  ```js
  import { render, screen } from '@testing-library/react';
  import { Footer } from '../footer';

  test('renders name in footer', () => {
    render(<Footer />);
    expect(screen.getByText(/SAMIUL MUSHFIK/)).toBeInTheDocument();
  });

  test('renders copyright year', () => {
    render(<Footer />);
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });
  ```

- [ ] **Step 2: Run test to confirm it fails**

  ```bash
  npm test -- --testPathPattern=footer.test --watchAll=false
  ```

  Expected: FAIL — footer currently only shows the logo, not the name text.

- [ ] **Step 3: Replace `src/components/footer.jsx`**

  ```jsx
  export const Footer = () => (
    <footer className="border-t border-[#1a1a1a] bg-custom-dark px-6 lg:px-20 py-8 text-white flex items-center justify-between">
      <span className="font-lulo text-xs tracking-[2px]">
        SAMIUL MUSHFIK<span className="text-custom-green">.</span>
      </span>
      <span className="text-gray-600 text-xs tracking-[1px]">© 2026</span>
    </footer>
  );
  ```

- [ ] **Step 4: Run tests to confirm they pass**

  ```bash
  npm test -- --testPathPattern=footer.test --watchAll=false
  ```

  Expected: PASS — 2 tests.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/footer.jsx src/components/__tests__/footer.test.js
  git commit -m "refactor: Footer — thin bordered minimal footer with name and year"
  ```

---

## Task 15: Full build and test verification

- [ ] **Step 1: Run the complete test suite**

  ```bash
  npm test -- --watchAll=false
  ```

  Expected: All tests PASS. Note the count — should be at minimum the tests written across Tasks 1–14.

- [ ] **Step 2: Run the production build**

  ```bash
  npm run build 2>&1 | tail -30
  ```

  Expected output includes:
  ```
  Compiled successfully.
  ```

  If there are warnings about unused imports (e.g. `hide`, `leftArrow`, `rightArrow`, `skillsBg`, `skillsWebp` etc. from assets), remove those unused imports from the affected files and re-run until clean.

- [ ] **Step 3: Spot-check unused asset imports**

  ```bash
  grep -r "skillsBg\|skillsWebp\|experienceBg\|experienceWebp\|educationBg\|educationWebp\|publicationBg\|publicationWebp\|certificationBg\|certificationWebp\|projectBg\|projectWebp\|leftArrow\|rightArrow\|hide" src/components/ --include="*.jsx" -l
  ```

  For each file listed, open it and remove the unused import from the `import` statement.

- [ ] **Step 4: Re-run build to confirm it's clean**

  ```bash
  npm run build 2>&1 | tail -10
  ```

  Expected: `Compiled successfully.`

- [ ] **Step 5: Commit cleanup**

  ```bash
  git add -u
  git commit -m "chore: remove unused asset imports after dark minimal redesign"
  ```

- [ ] **Step 6: Final commit summary**

  ```bash
  git log --oneline -15
  ```

  You should see commits for each of the 14 tasks above.

---

## Done

All 10 sections render on `#0a0a0a` with no background images. Every section animates in on scroll with Smooth Fade & Drift. The hero shows a split layout with photo at `lg` breakpoint. Experience and Education share the `Timeline` component. `npm run build` exits 0 with no warnings.
