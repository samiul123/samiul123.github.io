import { render, screen, fireEvent } from '@testing-library/react';
import ResumeDrawer from '../ResumeDrawer';

describe('ResumeDrawer', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('renders nothing when closed', () => {
    render(<ResumeDrawer isOpen={false} onClose={onClose} />);
    expect(screen.queryByRole('dialog', { name: /resume/i })).not.toBeInTheDocument();
  });

  it('renders the drawer when open', () => {
    render(<ResumeDrawer isOpen={true} onClose={onClose} />);
    expect(screen.getByRole('dialog', { name: /resume/i })).toBeInTheDocument();
  });

  it('renders key resume sections', () => {
    render(<ResumeDrawer isOpen={true} onClose={onClose} />);
    expect(screen.getByText(/Technical Skills/i)).toBeInTheDocument();
    expect(screen.getByText(/Professional Experience/i)).toBeInTheDocument();
    expect(screen.getByText(/Education/i)).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    render(<ResumeDrawer isOpen={true} onClose={onClose} />);
    // The overlay is the sibling div before the motion.div
    const dialog = screen.getByRole('dialog', { name: /resume/i });
    fireEvent.click(dialog.previousSibling);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', () => {
    render(<ResumeDrawer isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close resume/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<ResumeDrawer isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('adds no-scroll class to body when open', () => {
    render(<ResumeDrawer isOpen={true} onClose={onClose} />);
    expect(document.body.classList.contains('no-scroll')).toBe(true);
  });

  it('removes no-scroll class from body when closed', () => {
    const { rerender } = render(<ResumeDrawer isOpen={true} onClose={onClose} />);
    rerender(<ResumeDrawer isOpen={false} onClose={onClose} />);
    expect(document.body.classList.contains('no-scroll')).toBe(false);
  });
});
