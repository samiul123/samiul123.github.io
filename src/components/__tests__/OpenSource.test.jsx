import { render, screen } from '@testing-library/react';
import { OpenSource } from '../OpenSource';

test('renders OPEN SOURCE heading', () => {
  render(<OpenSource id="open-source" />);
  expect(screen.getByText('OPEN SOURCE')).toBeInTheDocument();
});

test('renders contribution PR title and repo', () => {
  render(<OpenSource id="open-source" />);
  expect(screen.getByText('Add PostgreSQL span exporter')).toBeInTheDocument();
  expect(screen.getByText('monocle2ai/monocle')).toBeInTheDocument();
});

test('renders merged status badge', () => {
  render(<OpenSource id="open-source" />);
  expect(screen.getByText('Merged')).toBeInTheDocument();
});
