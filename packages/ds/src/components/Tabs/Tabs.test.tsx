import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Tabs, type TabItem } from './Tabs';

const items: readonly TabItem[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'dev', label: 'Dev' },
  { value: 'qa', label: 'QA' },
  { value: 'activity', label: 'Activity' },
];

describe('Tabs', () => {
  it('renders a tablist with one tab per item', () => {
    render(
      <Tabs
        items={items}
        value="overview"
        onValueChange={() => {}}
        aria-label="Sections"
      />,
    );
    const tablist = screen.getByRole('tablist', { name: 'Sections' });
    expect(tablist).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(items.length);
  });

  it('marks the active tab with aria-selected="true" and tabIndex=0', () => {
    render(<Tabs items={items} value="dev" onValueChange={() => {}} />);
    const active = screen.getByRole('tab', { name: 'Dev' });
    expect(active).toHaveAttribute('aria-selected', 'true');
    expect(active).toHaveAttribute('tabindex', '0');
  });

  it('marks inactive tabs with aria-selected="false" and tabIndex=-1', () => {
    render(<Tabs items={items} value="dev" onValueChange={() => {}} />);
    const inactive = screen.getByRole('tab', { name: 'Overview' });
    expect(inactive).toHaveAttribute('aria-selected', 'false');
    expect(inactive).toHaveAttribute('tabindex', '-1');
  });

  it('fires onChange with the clicked value', () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="overview" onValueChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Dev' }));
    expect(onChange).toHaveBeenCalledWith('dev');
  });

  it('does not fire onChange when clicking the already-active tab', () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="overview" onValueChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Overview' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('disables a tab via the native disabled attribute', () => {
    const disabled = [...items];
    disabled[2] = { ...disabled[2], disabled: true };
    render(<Tabs items={disabled} value="overview" onValueChange={() => {}} />);
    const qa = screen.getByRole('tab', { name: 'QA' });
    expect(qa).toBeDisabled();
    expect(qa).not.toHaveAttribute('aria-disabled');
  });

  it('does not fire onChange when clicking a disabled tab', () => {
    const onChange = vi.fn();
    const disabled = [...items];
    disabled[2] = { ...disabled[2], disabled: true };
    render(<Tabs items={disabled} value="overview" onValueChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'QA' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('ArrowRight activates the next tab', () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="overview" onValueChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Overview' }), {
      key: 'ArrowRight',
    });
    expect(onChange).toHaveBeenCalledWith('dev');
  });

  it('ArrowLeft activates the previous tab', () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="dev" onValueChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Dev' }), {
      key: 'ArrowLeft',
    });
    expect(onChange).toHaveBeenCalledWith('overview');
  });

  it('ArrowRight wraps from last to first', () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="activity" onValueChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Activity' }), {
      key: 'ArrowRight',
    });
    expect(onChange).toHaveBeenCalledWith('overview');
  });

  it('ArrowLeft wraps from first to last', () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="overview" onValueChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Overview' }), {
      key: 'ArrowLeft',
    });
    expect(onChange).toHaveBeenCalledWith('activity');
  });

  it('Home activates the first enabled tab', () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="activity" onValueChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Activity' }), {
      key: 'Home',
    });
    expect(onChange).toHaveBeenCalledWith('overview');
  });

  it('End activates the last enabled tab', () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="overview" onValueChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Overview' }), {
      key: 'End',
    });
    expect(onChange).toHaveBeenCalledWith('activity');
  });

  it('arrow keys skip disabled tabs', () => {
    const onChange = vi.fn();
    const withDisabled: readonly TabItem[] = [
      { value: 'overview', label: 'Overview' },
      { value: 'dev', label: 'Dev', disabled: true },
      { value: 'qa', label: 'QA' },
    ];
    render(
      <Tabs items={withDisabled} value="overview" onValueChange={onChange} />,
    );
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Overview' }), {
      key: 'ArrowRight',
    });
    expect(onChange).toHaveBeenCalledWith('qa');
  });

  it('falls back to the first enabled tab being focusable when value matches no item', () => {
    render(<Tabs items={items} value="nonexistent" onValueChange={() => {}} />);
    const overview = screen.getByRole('tab', { name: 'Overview' });
    expect(overview).toHaveAttribute('tabindex', '0');
    expect(overview).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: 'Dev' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
  });

  it('skips disabled tabs when picking the fallback focusable tab', () => {
    const withFirstDisabled: readonly TabItem[] = [
      { value: 'overview', label: 'Overview', disabled: true },
      { value: 'dev', label: 'Dev' },
      { value: 'qa', label: 'QA' },
    ];
    render(
      <Tabs
        items={withFirstDisabled}
        value="nonexistent"
        onValueChange={() => {}}
      />,
    );
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
    expect(screen.getByRole('tab', { name: 'Dev' })).toHaveAttribute(
      'tabindex',
      '0',
    );
  });

  it('falls back to first enabled tab when value matches a disabled tab', () => {
    const selectedDisabled: readonly TabItem[] = [
      { value: 'overview', label: 'Overview', disabled: true },
      { value: 'dev', label: 'Dev' },
      { value: 'qa', label: 'QA' },
    ];
    render(
      <Tabs
        items={selectedDisabled}
        value="overview"
        onValueChange={() => {}}
      />,
    );
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'tabindex',
      '-1',
    );
    expect(screen.getByRole('tab', { name: 'Dev' })).toHaveAttribute(
      'tabindex',
      '0',
    );
  });

  it('makes no tab focusable when all tabs are disabled and no value matches', () => {
    const allDisabled: readonly TabItem[] = [
      { value: 'a', label: 'A', disabled: true },
      { value: 'b', label: 'B', disabled: true },
    ];
    render(<Tabs items={allDisabled} value="" onValueChange={() => {}} />);
    screen.getAllByRole('tab').forEach((tab) => {
      expect(tab).toHaveAttribute('tabindex', '-1');
    });
  });

  it('forwards ref to the tablist element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tabs
        ref={ref}
        items={items}
        value="overview"
        onValueChange={() => {}}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.getAttribute('role')).toBe('tablist');
  });

  it('merges custom className onto the tablist', () => {
    render(
      <Tabs
        items={items}
        value="overview"
        onValueChange={() => {}}
        className="custom"
      />,
    );
    expect(screen.getByRole('tablist')).toHaveClass('custom');
  });
});
