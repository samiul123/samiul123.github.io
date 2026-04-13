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
