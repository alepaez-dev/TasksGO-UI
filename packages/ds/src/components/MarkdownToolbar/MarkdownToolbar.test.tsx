import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { MarkdownToolbar } from './MarkdownToolbar';

const labels = [
  'Heading',
  'Bold',
  'Italic',
  'Bulleted list',
  'Quote',
  'Code',
  'Link',
  'Image',
  'Checklist item',
];

function openKeyboard() {
  Object.defineProperty(window, 'visualViewport', {
    value: {
      height: 400,
      offsetTop: 0,
      addEventListener: () => {},
      removeEventListener: () => {},
    },
    configurable: true,
    writable: true,
  });
  window.innerHeight = 800;
}

afterEach(() => {
  Object.defineProperty(window, 'visualViewport', {
    value: undefined,
    configurable: true,
    writable: true,
  });
});

describe('MarkdownToolbar', () => {
  it('renders a labelled toolbar with one button per action', () => {
    render(<MarkdownToolbar onAction={() => {}} />);
    expect(
      screen.getByRole('toolbar', { name: 'Formatting' }),
    ).toBeInTheDocument();
    labels.forEach((name) => {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    });
  });

  it('fires onAction with the matching action id when a button is clicked', () => {
    const onAction = vi.fn();
    render(<MarkdownToolbar onAction={onAction} />);
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    expect(onAction).toHaveBeenCalledWith('bold');
    fireEvent.click(screen.getByRole('button', { name: 'Bulleted list' }));
    expect(onAction).toHaveBeenCalledWith('list');
    fireEvent.click(screen.getByRole('button', { name: 'Link' }));
    expect(onAction).toHaveBeenCalledWith('link');
    fireEvent.click(screen.getByRole('button', { name: 'Image' }));
    expect(onAction).toHaveBeenCalledWith('image');
    fireEvent.click(screen.getByRole('button', { name: 'Checklist item' }));
    expect(onAction).toHaveBeenCalledWith('checkbox');
  });

  it('is a single tab stop (roving tabindex)', () => {
    render(<MarkdownToolbar onAction={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('tabindex', '0');
    buttons
      .slice(1)
      .forEach((button) => expect(button).toHaveAttribute('tabindex', '-1'));
  });

  it('moves focus and the tab stop with arrow keys', () => {
    render(<MarkdownToolbar onAction={() => {}} />);
    const buttons = screen.getAllByRole('button');
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'ArrowRight' });
    expect(buttons[1]).toHaveFocus();
    expect(buttons[1]).toHaveAttribute('tabindex', '0');
    expect(buttons[0]).toHaveAttribute('tabindex', '-1');
  });

  it('jumps to the last and first buttons with End and Home', () => {
    render(<MarkdownToolbar onAction={() => {}} />);
    const buttons = screen.getAllByRole('button');
    const last = buttons.length - 1;
    fireEvent.keyDown(buttons[0], { key: 'End' });
    expect(buttons[last]).toHaveFocus();
    fireEvent.keyDown(buttons[last], { key: 'Home' });
    expect(buttons[0]).toHaveFocus();
  });

  it('disables every button when disabled', () => {
    const onAction = vi.fn();
    render(<MarkdownToolbar onAction={onAction} disabled />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(labels.length);
    buttons.forEach((button) => expect(button).toBeDisabled());
  });

  it('accepts a custom aria-label', () => {
    render(
      <MarkdownToolbar onAction={() => {}} aria-label="Markdown formatting" />,
    );
    expect(
      screen.getByRole('toolbar', { name: 'Markdown formatting' }),
    ).toBeInTheDocument();
  });

  it('forwards ref to the toolbar element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<MarkdownToolbar ref={ref} onAction={() => {}} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.getAttribute('role')).toBe('toolbar');
  });

  it('merges a custom className', () => {
    render(<MarkdownToolbar onAction={() => {}} className="custom" />);
    expect(screen.getByRole('toolbar')).toHaveClass('custom');
  });

  it('renders only the actions passed via `actions`, in that order', () => {
    render(
      <MarkdownToolbar
        onAction={() => {}}
        actions={['bold', 'code', 'checkbox']}
      />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.map((b) => b.getAttribute('aria-label'))).toEqual([
      'Bold',
      'Code',
      'Checklist item',
    ]);
  });
});

describe('MarkdownToolbar — accessory variant', () => {
  it('renders the toolbar and a Done button when the keyboard is open', () => {
    openKeyboard();
    const onDone = vi.fn();
    render(
      <MarkdownToolbar
        variant="accessory"
        onAction={() => {}}
        onDone={onDone}
      />,
    );
    expect(
      screen.getByRole('toolbar', { name: 'Formatting' }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('anchors its bottom to the visual viewport bottom edge', () => {
    openKeyboard(); // height 400, offsetTop 0
    render(
      <MarkdownToolbar
        variant="accessory"
        onAction={() => {}}
        onDone={() => {}}
      />,
    );
    const toolbar = screen.getByRole('toolbar', { name: 'Formatting' });
    expect(toolbar).toBeInTheDocument();
    // Anchored to the visual viewport bottom (offsetTop 0 + height 400) via a
    // single transform; `- 100%` lifts it by its own height above the keyboard.
    expect(toolbar).toHaveStyle({
      transform: 'translateY(calc(400px - 100%))',
    });
  });

  it('suppresses blur by preventing default on pointerdown', () => {
    openKeyboard();
    render(<MarkdownToolbar variant="accessory" onAction={() => {}} />);
    const bold = screen.getByRole('button', { name: 'Bold' });
    const event = new MouseEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
    });
    bold.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('does not render a Done button in the default inline variant', () => {
    render(<MarkdownToolbar onAction={() => {}} onDone={() => {}} />);
    expect(
      screen.queryByRole('button', { name: 'Done' }),
    ).not.toBeInTheDocument();
  });

  it('forwards ref to the portaled toolbar element', () => {
    openKeyboard();
    const ref = createRef<HTMLDivElement>();
    render(
      <MarkdownToolbar ref={ref} variant="accessory" onAction={() => {}} />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.getAttribute('role')).toBe('toolbar');
  });
});
