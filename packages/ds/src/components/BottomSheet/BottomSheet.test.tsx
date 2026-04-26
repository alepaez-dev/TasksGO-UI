import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BottomSheet } from './BottomSheet';

describe('BottomSheet', () => {
  it('renders a dialog with aria-modal when open', () => {
    render(
      <BottomSheet open onClose={vi.fn()} aria-label="Test sheet">
        content
      </BottomSheet>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('applies aria-label to the dialog', () => {
    render(
      <BottomSheet open onClose={vi.fn()} aria-label="Test sheet">
        content
      </BottomSheet>,
    );
    expect(
      screen.getByRole('dialog', { name: 'Test sheet' }),
    ).toBeInTheDocument();
  });

  it('applies aria-labelledby to the dialog', () => {
    render(
      <>
        <span id="sheet-title">My sheet</span>
        <BottomSheet open onClose={vi.fn()} aria-labelledby="sheet-title">
          content
        </BottomSheet>
      </>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute(
      'aria-labelledby',
      'sheet-title',
    );
  });

  it('renders children inside the sheet', () => {
    render(
      <BottomSheet open onClose={vi.fn()} aria-label="Test">
        Hello sheet
      </BottomSheet>,
    );
    expect(screen.getByText('Hello sheet')).toBeInTheDocument();
  });

  it('renders a decorative handle', () => {
    render(
      <BottomSheet open onClose={vi.fn()} aria-label="Test">
        content
      </BottomSheet>,
    );
    const dialog = screen.getByRole('dialog');
    const handle = dialog.firstElementChild;
    expect(handle).toHaveAttribute('aria-hidden', 'true');
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} aria-label="Test">
        content
      </BottomSheet>,
    );
    const dialog = screen.getByRole('dialog');
    const backdropButton = dialog.previousElementSibling as HTMLElement;
    fireEvent.click(backdropButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when panel is clicked', () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} aria-label="Test">
        content
      </BottomSheet>,
    );
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} aria-label="Test">
        content
      </BottomSheet>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on Escape when closed', () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open={false} onClose={onClose} aria-label="Test">
        content
      </BottomSheet>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not call onClose on Escape when a nested handler prevented default', () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} aria-label="Test">
        <button
          data-testid="inner"
          onKeyDown={(e) => {
            if (e.key === 'Escape') e.preventDefault();
          }}
        />
      </BottomSheet>,
    );
    fireEvent.keyDown(screen.getByTestId('inner'), { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('locks body scroll when open', () => {
    const { unmount } = render(
      <BottomSheet open onClose={vi.fn()} aria-label="Test">
        content
      </BottomSheet>,
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('forwards ref to the panel element', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(
      <BottomSheet ref={ref} open onClose={vi.fn()} aria-label="Test">
        content
      </BottomSheet>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByRole('dialog'));
  });

  it('merges custom className on panel', () => {
    render(
      <BottomSheet open onClose={vi.fn()} className="custom" aria-label="Test">
        content
      </BottomSheet>,
    );
    expect(screen.getByRole('dialog').className).toContain('custom');
  });

  it('spreads additional HTML attributes', () => {
    render(
      <BottomSheet
        open
        onClose={vi.fn()}
        data-testid="my-sheet"
        aria-label="Test"
      >
        content
      </BottomSheet>,
    );
    expect(screen.getByTestId('my-sheet')).toBeInTheDocument();
  });

  it('calls onClose when dragged down past threshold', () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} aria-label="Test">
        content
      </BottomSheet>,
    );
    const dialog = screen.getByRole('dialog');
    fireEvent.touchStart(dialog, {
      touches: [{ clientY: 100 }],
    });
    fireEvent.touchMove(dialog, {
      touches: [{ clientY: 250 }],
    });
    fireEvent.touchEnd(dialog);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not dismiss when drag does not reach threshold', () => {
    const onClose = vi.fn();
    render(
      <BottomSheet open onClose={onClose} aria-label="Test">
        content
      </BottomSheet>,
    );
    const dialog = screen.getByRole('dialog');
    fireEvent.touchStart(dialog, {
      touches: [{ clientY: 100 }],
    });
    fireEvent.touchMove(dialog, {
      touches: [{ clientY: 150 }],
    });
    fireEvent.touchEnd(dialog);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('opens cleanly after a drag-dismiss (no stale dragY)', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <BottomSheet open onClose={onClose} aria-label="Test">
        content
      </BottomSheet>,
    );
    const dialog = screen.getByRole('dialog');
    fireEvent.touchStart(dialog, { touches: [{ clientY: 0 }] });
    fireEvent.touchMove(dialog, { touches: [{ clientY: 200 }] });
    fireEvent.touchEnd(dialog);
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <BottomSheet open={false} onClose={onClose} aria-label="Test">
        content
      </BottomSheet>,
    );
    rerender(
      <BottomSheet open onClose={onClose} aria-label="Test">
        content
      </BottomSheet>,
    );

    const reopened = screen.getByRole('dialog');
    expect(reopened.style.transform).toBe('');
    expect(reopened.style.transition).toBe('');
  });
});
