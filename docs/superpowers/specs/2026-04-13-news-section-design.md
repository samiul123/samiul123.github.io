# News Section Design Specification

## Overview
Add a news section to the portfolio website to showcase project updates and announcements in a timeline format.

## Content Focus
- Project updates (as needed)
- Announcements about project milestones, releases, and significant developments

## Layout & Design
- Timeline-based layout (chronological display)
- Similar to existing Timeline component but adapted for news items
- Each news item includes:
  - Category badge (color-coded by type)
  - Title
  - Description
  - Publication date
  - Estimated read time
- Uses existing motion patterns (driftUp, staggerContainer) for animations consistent with the site

## Component Structure
- `src/components/News.jsx`: Main component that maps over news data
- `src/components/NewsItem.jsx`: Individual news item component
- `src/constants/news.js`: Data file containing news items (following existing pattern)

## Data Model
Each news item will contain:
```javascript
{
  id: 'unique-identifier',
  title: 'News headline',
  description: 'Brief summary of the update',
  date: 'Publication date (YYYY-MM-DD)',
  category: 'Type of update (e.g., PROJECT, RELEASE, MILESTONE)',
  readTime: 'Estimated reading time (e.g., "3 min read")'
}
```

## Styling Approach
- Follow existing Tailwind CSS patterns in the codebase
- Use custom colors matching the portfolio theme:
  - Dark background: #0a0a0a
  - Accent green: #10b981
- Responsive design that works on mobile and desktop
- Hover effects and subtle animations for engagement

## Integration
- Add new navigation link in `src/constants/index.js` navLinks array
- Import and include News component in App.js routing
- Follow existing patterns for component imports and exports

## Animation & Motion
- Use existing motion utilities from `src/utils/motion.js`:
  - staggerContainer() for overall list animation
  - driftUp() for individual item animations
- Consistent with Home, Skills, and other sections

## Accessibility Considerations
- Proper semantic HTML (section, article, time elements)
- Sufficient color contrast ratios
- Keyboard navigable
- Screen reader friendly labels

## Future Extensibility
- Easy to add new content types via category system
- Can accommodate different content formats (links, embedded media)
- Prepared for potential filtering/sorting features