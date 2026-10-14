import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FileChip } from './FileChip';

const bar = (c: HTMLElement) =>
  c.querySelector<HTMLElement>('[data-progress-bar]');

const barRatio = (c: HTMLElement) =>
  bar(c)?.style.getPropertyValue('--ds-file-chip-progress');

describe('FileChip', () => {
  it('shows no progress affordance when the file has settled', () => {
    const { container } = render(<FileChip label="a.png" kind="image" />);
    expect(bar(container)).toBeNull();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it('reports upload progress as a percentage', () => {
    render(<FileChip label="a.csv" kind="file" uploadFraction={0.64} />);
    expect(screen.getByText('64%')).toBeInTheDocument();
  });

  it('passes the ratio to CSS rather than setting a width inline', () => {
    const { container } = render(
      <FileChip label="a.csv" kind="file" uploadFraction={0.5} />,
    );
    expect(barRatio(container)).toBe('0.5');
  });

  it('clamps progress above one', () => {
    const { container } = render(
      <FileChip label="a.csv" kind="file" uploadFraction={4} />,
    );
    expect(barRatio(container)).toBe('1');
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('clamps progress below zero', () => {
    const { container } = render(
      <FileChip label="a.csv" kind="file" uploadFraction={-2} />,
    );
    expect(barRatio(container)).toBe('0');
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('treats a non-finite progress as settled rather than drawing a broken bar', () => {
    const { container } = render(
      <FileChip label="a.csv" kind="file" uploadFraction={NaN} />,
    );
    expect(bar(container)).toBeNull();
  });

  it('still resolves an icon for a name with no extension', () => {
    const { container } = render(<FileChip label="dump" kind="file" />);
    expect(container.querySelector('[data-icon-name]')).not.toBeNull();
  });
});
