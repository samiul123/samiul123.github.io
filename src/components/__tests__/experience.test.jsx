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

