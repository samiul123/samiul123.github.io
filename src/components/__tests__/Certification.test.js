import { render, screen } from '@testing-library/react';
import { Certification } from '../Certification';

test('renders CERTIFICATIONS heading', () => {
  render(<Certification id="certifications" />);
  expect(screen.getByText('CERTIFICATIONS')).toBeInTheDocument();
});

test('renders all cert titles', () => {
  render(<Certification id="certifications" />);
  expect(screen.getByText('Systems Expert Certificate')).toBeInTheDocument();
  expect(screen.getByText('The Ultimate Hands-On Hadoop: Tame Your Big Data')).toBeInTheDocument();
});

test('renders VIEW CREDENTIAL links', () => {
  render(<Certification id="certifications" />);
  const links = screen.getAllByText(/VIEW CREDENTIAL/);
  expect(links.length).toBeGreaterThan(0);
});
