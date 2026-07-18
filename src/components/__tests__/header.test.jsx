import { render, screen } from '@testing-library/react';
import Header from '../header';

test('renders all nav links', () => {
  render(<Header />);
  expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
});

test('renders logo', () => {
  render(<Header />);
  expect(screen.getByRole('banner')).toBeInTheDocument();
});

test('renders OPEN SOURCE nav link', () => {
  render(<Header />);
  expect(screen.getAllByText('OPEN SOURCE').length).toBeGreaterThan(0);
});
