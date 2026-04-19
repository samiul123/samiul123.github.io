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
