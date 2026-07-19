import { render, screen, fireEvent } from '@testing-library/react';
import ExperienceTimeline from '../ExperienceTimeline';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return { ...actual, AnimatePresence: ({ children }) => <>{children}</> };
});

const items = [
  {
    title: 'Software Engineer',
    subtitle: 'Acme Corp',
    date: '2022–2023',
    bulletPoints: ['Shipped the checkout redesign.', 'Mentored two junior engineers.'],
  },
  {
    title: 'Junior Developer',
    subtitle: 'Beta Inc',
    date: '2020–2022',
    bulletPoints: ['Built the onboarding flow.'],
  },
];

test('renders section title', () => {
  render(<ExperienceTimeline items={items} label="Career" title="EXPERIENCE" id="experiences" />);
  expect(screen.getByText('EXPERIENCE')).toBeInTheDocument();
});

test('renders all role titles in the list', () => {
  render(<ExperienceTimeline items={items} label="Career" title="EXPERIENCE" id="experiences" />);
  expect(screen.getByRole('button', { name: /Software Engineer/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Junior Developer/ })).toBeInTheDocument();
});

test('shows the first role selected by default with its bullets', () => {
  render(<ExperienceTimeline items={items} label="Career" title="EXPERIENCE" id="experiences" />);
  expect(screen.getByText('Shipped the checkout redesign.')).toBeInTheDocument();
  expect(screen.queryByText('Built the onboarding flow.')).not.toBeInTheDocument();
});

test('switches the detail panel when a different role is selected', () => {
  render(<ExperienceTimeline items={items} label="Career" title="EXPERIENCE" id="experiences" />);
  fireEvent.click(screen.getByRole('button', { name: /Junior Developer/ }));

  expect(screen.getByText('Built the onboarding flow.')).toBeInTheDocument();
  expect(screen.queryByText('Shipped the checkout redesign.')).not.toBeInTheDocument();
});
