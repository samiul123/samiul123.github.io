import { render, screen, fireEvent } from '@testing-library/react';
import Skills from '../skills';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return { ...actual, AnimatePresence: ({ children }) => <>{children}</> };
});

test('renders SKILLS heading', () => {
  render(<Skills id="skills" />);
  expect(screen.getByText('SKILLS')).toBeInTheDocument();
});

test('renders all four tab labels', () => {
  render(<Skills id="skills" />);
  expect(screen.getByRole('button', { name: 'Languages' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Frameworks' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Databases' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Tools' })).toBeInTheDocument();
});

test('Languages tab is active by default and shows language skills', () => {
  render(<Skills id="skills" />);
  expect(screen.getByText('JAVA')).toBeInTheDocument();
  expect(screen.getByText('PYTHON')).toBeInTheDocument();
  // REACT is in Frameworks tab — must not be visible yet
  expect(screen.queryByText('REACT')).not.toBeInTheDocument();
});

test('clicking Frameworks tab shows framework skills', () => {
  render(<Skills id="skills" />);
  fireEvent.click(screen.getByRole('button', { name: 'Frameworks' }));
  expect(screen.getByText('REACT')).toBeInTheDocument();
  expect(screen.getByText('SPRING BOOT')).toBeInTheDocument();
  expect(screen.queryByText('JAVA')).not.toBeInTheDocument();
});
