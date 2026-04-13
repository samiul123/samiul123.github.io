import { render, screen } from '@testing-library/react';
import { Project } from '../Project';

test('renders PROJECTS heading', () => {
  render(<Project id="projects" />);
  expect(screen.getByText('PROJECTS')).toBeInTheDocument();
});

test('renders project titles', () => {
  render(<Project id="projects" />);
  expect(screen.getByText('MindQuest')).toBeInTheDocument();
  expect(screen.getByText('Portfolio')).toBeInTheDocument();
});
