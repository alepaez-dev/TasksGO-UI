import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('renders a dialog with aria-modal when open', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        content
      </Drawer>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('renders children inside the panel', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        Hello Drawer
      </Drawer>,
    );
    expect(screen.getByText('Hello Drawer')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose}>
        content
      </Drawer>,
    );
    const dialog = screen.getByRole('dialog');
    const backdropButton = dialog.previousElementSibling as HTMLElement;
    fireEvent.click(backdropButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when panel is clicked', () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose}>
        content
      </Drawer>,
    );
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose}>
        content
      </Drawer>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose on Escape when closed', () => {
    const onClose = vi.fn();
    render(
      <Drawer open={false} onClose={onClose}>
        content
      </Drawer>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders close button with correct aria-label', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        content
      </Drawer>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('uses custom closeLabel', () => {
    render(
      <Drawer open onClose={vi.fn()} closeLabel="Cerrar">
        content
      </Drawer>,
    );
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose}>
        content
      </Drawer>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('applies left side class by default', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        content
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel.className).toContain('left');
  });

  it('applies right side class', () => {
    render(
      <Drawer open onClose={vi.fn()} side="right">
        content
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel.className).toContain('right');
  });

  it('forwards ref to the panel element', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(
      <Drawer ref={ref} open onClose={vi.fn()}>
        content
      </Drawer>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className on panel', () => {
    render(
      <Drawer open onClose={vi.fn()} className="custom">
        content
      </Drawer>,
    );
    const panel = screen.getByRole('dialog');
    expect(panel.className).toContain('custom');
  });

  it('spreads additional HTML attributes', () => {
    render(
      <Drawer open onClose={vi.fn()} data-testid="my-drawer">
        content
      </Drawer>,
    );
    expect(screen.getByTestId('my-drawer')).toBeInTheDocument();
  });

  it('does not call onClose on Escape when a nested handler already prevented default', () => {
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose}>
        <button
          data-testid="inner"
          onKeyDown={(e) => {
            if (e.key === 'Escape') e.preventDefault();
          }}
        />
      </Drawer>,
    );
    fireEvent.keyDown(screen.getByTestId('inner'), { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('locks body scroll when open', () => {
    const { unmount } = render(
      <Drawer open onClose={vi.fn()}>
        content
      </Drawer>,
    );
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
