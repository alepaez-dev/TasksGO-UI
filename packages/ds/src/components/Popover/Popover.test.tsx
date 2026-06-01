import { createRef, useRef } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Popover } from './Popover';

function Harness({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={anchorRef}>Anchor</button>
      <Popover
        open={open}
        onOpenChange={onOpenChange}
        anchorRef={anchorRef}
        aria-label="Popover"
      >
        <div>Popover body</div>
      </Popover>
      <div data-testid="outside">Outside</div>
    </>
  );
}

describe('Popover', () => {
  it('renders nothing when open is false', () => {
    render(<Harness open={false} onOpenChange={() => {}} />);
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
  });

  it('renders into a portal when open is true', () => {
    render(<Harness open={true} onOpenChange={() => {}} />);
    expect(screen.getByText('Popover body')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onOpenChange(false) when Escape is pressed', () => {
    const onOpenChange = vi.fn();
    render(<Harness open={true} onOpenChange={onOpenChange} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not call onOpenChange when other keys are pressed', () => {
    const onOpenChange = vi.fn();
    render(<Harness open={true} onOpenChange={onOpenChange} />);
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'a' });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('calls onOpenChange(false) when clicking outside', () => {
    const onOpenChange = vi.fn();
    render(<Harness open={true} onOpenChange={onOpenChange} />);
    fireEvent.pointerDown(screen.getByTestId('outside'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not call onOpenChange when clicking inside the popover', () => {
    const onOpenChange = vi.fn();
    render(<Harness open={true} onOpenChange={onOpenChange} />);
    fireEvent.pointerDown(screen.getByText('Popover body'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('does not call onOpenChange when clicking the anchor', () => {
    const onOpenChange = vi.fn();
    render(<Harness open={true} onOpenChange={onOpenChange} />);
    fireEvent.pointerDown(screen.getByText('Anchor'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('forwards ref to the dialog element', () => {
    const ref = createRef<HTMLDivElement>();
    function RefHarness() {
      const anchorRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button ref={anchorRef}>Anchor</button>
          <Popover
            ref={ref}
            open={true}
            onOpenChange={() => {}}
            anchorRef={anchorRef}
            aria-label="Popover"
          >
            <div>Body</div>
          </Popover>
        </>
      );
    }
    render(<RefHarness />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.getAttribute('role')).toBe('dialog');
  });

  it('merges custom className', () => {
    function ClassHarness() {
      const anchorRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button ref={anchorRef}>Anchor</button>
          <Popover
            open={true}
            onOpenChange={() => {}}
            anchorRef={anchorRef}
            className="custom"
            aria-label="Popover"
          >
            <div>Body</div>
          </Popover>
        </>
      );
    }
    render(<ClassHarness />);
    expect(screen.getByRole('dialog')).toHaveClass('custom');
  });

  it('unmounts the popover from the DOM when closed', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Harness open={true} onOpenChange={onOpenChange} />,
    );
    expect(screen.getByText('Popover body')).toBeInTheDocument();
    rerender(<Harness open={false} onOpenChange={onOpenChange} />);
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
  });

  it('moves focus to the popover on open', () => {
    function FocusHarness() {
      const anchorRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button ref={anchorRef}>Anchor</button>
          <Popover
            open={true}
            onOpenChange={() => {}}
            anchorRef={anchorRef}
            aria-label="Popover"
          >
            <div>Body</div>
          </Popover>
        </>
      );
    }
    render(<FocusHarness />);
    expect(document.activeElement).toBe(screen.getByRole('dialog'));
  });

  it('does not move focus to the popover when manageFocus is false', () => {
    function NoFocusHarness() {
      const anchorRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button ref={anchorRef}>Anchor</button>
          <Popover
            open={true}
            onOpenChange={() => {}}
            anchorRef={anchorRef}
            manageFocus={false}
            aria-label="Popover"
          >
            <div>Body</div>
          </Popover>
        </>
      );
    }
    render(<NoFocusHarness />);
    expect(document.activeElement).not.toBe(screen.getByRole('dialog'));
  });

  it('returns focus to the previously focused element on close', () => {
    function FocusReturnHarness({ open }: { open: boolean }) {
      const anchorRef = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button ref={anchorRef}>Anchor</button>
          <Popover
            open={open}
            onOpenChange={() => {}}
            anchorRef={anchorRef}
            aria-label="Popover"
          >
            <div>Body</div>
          </Popover>
        </>
      );
    }
    const { rerender } = render(<FocusReturnHarness open={false} />);
    const anchor = screen.getByText('Anchor');
    act(() => {
      anchor.focus();
    });
    expect(document.activeElement).toBe(anchor);
    rerender(<FocusReturnHarness open={true} />);
    // Popover took focus
    expect(document.activeElement).toBe(screen.getByRole('dialog'));
    rerender(<FocusReturnHarness open={false} />);
    // Focus returned
    expect(document.activeElement).toBe(anchor);
  });
});
