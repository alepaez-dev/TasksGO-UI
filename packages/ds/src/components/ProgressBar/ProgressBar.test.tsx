import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from './ProgressBar';

const fill = (el: HTMLElement) =>
  el.style.getPropertyValue('--ds-progress-bar-fill');

describe('ProgressBar', () => {
  it('reports its value to assistive tech', () => {
    render(<ProgressBar value={3} max={5} aria-label="QA 3 of 5 passing" />);
    const bar = screen.getByRole('progressbar', { name: 'QA 3 of 5 passing' });
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '5');
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(fill(bar)).toBe('60%');
  });

  it('clamps a value above max', () => {
    render(<ProgressBar value={7} max={5} aria-label="QA" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '5');
    expect(fill(bar)).toBe('100%');
  });

  it('clamps a negative value to zero', () => {
    render(<ProgressBar value={-2} max={5} aria-label="QA" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
    expect(fill(bar)).toBe('0%');
  });

  it('renders an empty bar when max is zero', () => {
    render(<ProgressBar value={0} max={0} aria-label="QA" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemax', '0');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
    expect(fill(bar)).toBe('0%');
  });

  it('treats a non-finite value as zero', () => {
    render(<ProgressBar value={Number.NaN} max={5} aria-label="QA" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
    expect(fill(bar)).toBe('0%');
  });

  it('treats a non-finite max as an empty bar', () => {
    const { rerender } = render(
      <ProgressBar value={3} max={Number.NaN} aria-label="QA" />,
    );
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemax', '0');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
    expect(fill(bar)).toBe('0%');
    rerender(
      <ProgressBar value={3} max={Number.POSITIVE_INFINITY} aria-label="QA" />,
    );
    expect(bar).toHaveAttribute('aria-valuemax', '0');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
    expect(fill(bar)).toBe('0%');
  });

  it('defaults to the sm size and neutral tone', () => {
    render(<ProgressBar value={1} max={2} aria-label="QA" />);
    expect(screen.getByRole('progressbar')).toHaveClass('sm', 'neutral');
  });

  it('keeps a consumer style alongside the fill', () => {
    render(
      <ProgressBar
        value={1}
        max={2}
        aria-label="QA"
        style={{ marginLeft: '4px' }}
      />,
    );
    const bar = screen.getByRole('progressbar');
    expect(bar.style.marginLeft).toBe('4px');
    expect(fill(bar)).toBe('50%');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<ProgressBar ref={ref} value={1} max={2} aria-label="QA" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
