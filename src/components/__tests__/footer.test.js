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
