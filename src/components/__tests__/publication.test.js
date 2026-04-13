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
