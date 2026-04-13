import { render, screen } from '@testing-library/react';
import { Education } from '../education';

test('renders EDUCATION heading', () => {
  render(<Education id="education" />);
  expect(screen.getByText('EDUCATION')).toBeInTheDocument();
});

test('renders institution names', () => {
  render(<Education id="education" />);
  expect(screen.getByText('University of Minnesota - Duluth')).toBeInTheDocument();
  expect(screen.getByText('Bangladesh University of Engineering and Technology')).toBeInTheDocument();
});

test('renders degree names', () => {
  render(<Education id="education" />);
  expect(screen.getByText('Master of Science')).toBeInTheDocument();
  expect(screen.getByText('Bachelor of Science')).toBeInTheDocument();
});
