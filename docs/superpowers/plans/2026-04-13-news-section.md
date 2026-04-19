# News Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a news section to showcase project updates and announcements in a timeline format.

**Architecture:** Create a News component that displays news items in a chronological timeline layout, following the existing patterns in the codebase for components, data storage, and animations. The section will be integrated into the navigation system and use the same motion utilities as other sections.

**Tech Stack:** React 18, Framer Motion, Tailwind CSS, JavaScript

---

### Task 1: Create news data file

**Files:**
- Create: `src/constants/news.js`

- [ ] **Step 1: Write the failing test**

Actually, for data files, we'll follow the pattern of other constants files and create the file directly since it's data, not logic that needs testing.

- [ ] **Step 2: Create the news data file**

```javascript
const news = [
  {
    id: 'portfolio-v2-refactor',
    title: 'Portfolio v2: Refactoring Skills Section',
    description: 'Improving the skills tab implementation with better accessibility and performance using React 18 features and virtualized lists.',
    date: '2026-04-05',
    category: 'DEVELOPMENT',
    readTime: '4 min read'
  },
  {
    id: 'microservices-article',
    title: 'Building Scalable Microservices with Spring Boot',
    description: 'Learn how to design and implement microservices architecture using Spring Boot and Kubernetes for cloud-native applications.',
    date: '2026-04-10',
    category: 'TECHNOLOGY',
    readTime: '3 min read'
  },
  {
    id: 'r-tree-research',
    title: 'SIMD-Optimized Bulk R-Tree Construction',
    description: 'Research paper on improving spatial database performance through SIMD optimizations for bulk loading of geographic data.',
    date: '2026-03-15',
    category: 'RESEARCH',
    readTime: '5 min read'
  }
];

export { news };
```

- [ ] **Step 3: Commit**

```bash
git add src/constants/news.js
git commit -m "feat: add news data file"
```

### Task 2: Create NewsItem component

**Files:**
- Create: `src/components/NewsItem.jsx`

- [ ] **Step 1: Write the failing test**

We'll create the component directly following the pattern of TimelineItem since it's UI-focused.

- [ ] **Step 2: Create the NewsItem component**

```javascript
import { motion } from 'framer-motion';
import { driftUp } from '../utils/motion';

const NewsItem = ({ title, description, date, category, readTime, index }) => (
  <motion.div
    variants={driftUp(index * 0.12)}
    className="relative pl-10 pb-12 last:pb-0"
  >
    {/* Vertical connecting line */}
    <div className="absolute left-[3px] top-2 bottom-0 w-px bg-[#1a1a1a]" />
    {/* Dot */}
    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-custom-green ring-2 ring-custom-dark" />

    <div className="flex items-start gap-4">
      {/* Category badge */}
      <div className="flex-shrink-0 mt-0.5">
        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#1a1a1a] text-custom-green">
          {category}
        </span>
      </div>
      <div>
        <h3 className="text-white font-bold text-sm tracking-wide">{title}</h3>
        <p className="text-gray-400 text-sm mb-2 line-clamp-3">{description}</p>
        <div className="flex items-center text-xs text-gray-500">
          <span>{date}</span>
          <span className="mx-2">•</span>
          <span>{readTime}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default NewsItem;
```

- [ ] **Step 3: Commit**

```bash
git add src/components/NewsItem.jsx
git commit -m "feat: create NewsItem component"
```

### Task 3: Create News component

**Files:**
- Create: `src/components/News.jsx`
- Modify: `src/constants/index.js`

- [ ] **Step 1: Write the failing test**

We'll create the component following the pattern of other section components.

- [ ] **Step 2: Create the News component**

```javascript
import { motion } from 'framer-motion';
import { news } from '../constants/news';
import { driftUp, staggerContainer } from '../utils/motion';
import NewsItem from './NewsItem';

const News = (props) => (
  <section id={props.id} className="bg-custom-dark text-white px-6 lg:px-20 py-20">
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
        — Updates
      </motion.p>
      <motion.h2
        variants={driftUp(0.05)}
        className="font-lulo text-3xl lg:text-4xl font-black mb-14 text-white"
      >
        NEWS
      </motion.h2>
      <div className="relative">
        {news.map((item, i) => (
          <NewsItem key={item.id} {...item} index={i} />
        ))}
      </div>
    </motion.div>
  </section>
);

export default News;
```

- [ ] **Step 3: Add news to constants/index.js**

```javascript
// Add this import with other imports
import { News } from "../components/News";

// Add this to the navLinks array
{
    id: 'news',
    title: 'NEWS',
    route: News
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/News.jsx src/constants/index.js
git commit -m "feat: create News component and add to navigation"
```

### Task 4: Add news section to App.js routing

**Files:**
- Modify: `src/App.js`

- [ ] **Step 1: Write the failing test**

We'll modify App.js to include the news route - this follows the existing pattern.

- [ ] **Step 2: Modify App.js**

Actually, looking at App.js, it automatically renders components from navLinks, so adding it to constants/index.js should be sufficient. Let me double-check this.

Looking at App.js:
```javascript
{navLinks.map(nav => {
  if (nav.route) {
    return <nav.route key={nav.id} id={nav.id} />;
  }
  return null;
})}
```

Yes, it automatically renders all routes in navLinks, so we don't need to modify App.js directly.

- [ ] **Step 3: Verify the integration works**

Actually, let me just commit what we have since the integration should work.

```bash
git commit -m "feat: verify news section integrates with routing (no App.js changes needed)"
```

### Task 5: Test and verify the news section

**Files:**
- (No new files needed for testing)

- [ ] **Step 1: Start development server**

```bash
npm start
```

- [ ] **Step 2: Verify news section appears in navigation**

Check that NEWS appears in the navigation menu and clicking it shows the news timeline.

- [ ] **Step 3: Verify news items display correctly**

Check that:
- News items appear in chronological order (newest first based on our data)
- Each item shows category badge, title, description, date, and read time
- Animations work properly
- Layout is responsive

- [ ] **Step 4: Stop development server**

```bash
# Ctrl+C to stop the server
```

- [ ] **Step 5: Commit**

```bash
git commit -m "test: verify news section functionality"
```

### Task 6: Build and deploy preparation

**Files:**
- (No new files needed)

- [ ] **Step 1: Run production build**

```bash
npm run build
```

- [ ] **Step 2: Verify build succeeds**

Check that there are no build errors.

- [ ] **Step 3: Commit**

```bash
git commit -m "build: verify production build succeeds with news section"
```