import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShareDialog } from './ShareDialog';
import { vi } from 'vitest';

describe('ShareDialog', () => {
  const mockProps = {
    open: true,
    onOpenChange: vi.fn(),
    quizId: '123',
    quizTitle: 'Test Quiz'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<ShareDialog {...mockProps} />);
    expect(screen.getByText('Share Quiz')).toBeInTheDocument();
    expect(screen.getByLabelText('Quiz share URL')).toBeInTheDocument();
  });

  it('handles copy link', async () => {
    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined)
    };
    Object.assign(navigator, { clipboard: mockClipboard });

    render(<ShareDialog {...mockProps} />);
    
    const copyButton = screen.getByText('Copy Link');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining(mockProps.quizId)
      );
    });
  });

  it('handles share functionality', async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { share: mockShare });

    render(<ShareDialog {...mockProps} />);
    
    const shareButton = screen.getByText('Share Quiz');
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(mockShare).toHaveBeenCalledWith({
        title: mockProps.quizTitle,
        text: expect.stringContaining(mockProps.quizTitle),
        url: expect.stringContaining(mockProps.quizId)
      });
    });
  });
}); 