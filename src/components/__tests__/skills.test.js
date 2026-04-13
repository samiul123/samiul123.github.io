import { render, screen } from '@testing-library/react';
import Skills from '../skills';

test('renders SKILLS heading', () => {
  render(<Skills id="skills" />);
  expect(screen.getByText('SKILLS')).toBeInTheDocument();
});

test('renders skill group titles', () => {
  render(<Skills id="skills" />);
  expect(screen.getByText(/PROGRAMMING LANGUAGES/)).toBeInTheDocument();
  expect(screen.getByText(/FRAMEWORKS & LIBRARIES/)).toBeInTheDocument();
});

test('renders individual skill names', () => {
  render(<Skills id="skills" />);
  expect(screen.getByText('JAVA')).toBeInTheDocument();
  expect(screen.getByText('PYTHON')).toBeInTheDocument();
  expect(screen.getByText('REACT')).toBeInTheDocument();
});
