import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StepList } from './StepList';

describe('StepList', () => {
  it('renders one list item per step in an ordered list', () => {
    render(<StepList steps={['First step', 'Second step', 'Third step']} />);
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('First step')).toBeInTheDocument();
  });

  it('renders inline markdown code within a step', () => {
    render(<StepList steps={['Deploy to `QA-01` environment']} />);
    expect(screen.getByText('QA-01').tagName).toBe('CODE');
  });

  it('forwards ref to the ol element', () => {
    const ref = createRef<HTMLOListElement>();
    render(<StepList ref={ref} steps={['A']} />);
    expect(ref.current).toBeInstanceOf(HTMLOListElement);
  });

  it('merges custom className', () => {
    render(<StepList steps={['A']} className="custom" data-testid="sl" />);
    expect(screen.getByTestId('sl')).toHaveClass('stepList', 'custom');
  });

  it('has no divider styling by default', () => {
    render(<StepList steps={['A', 'B']} data-testid="sl" />);
    expect(screen.getByTestId('sl')).not.toHaveClass('dividers');
  });

  it('adds divider styling when dividers is set', () => {
    render(<StepList steps={['A', 'B']} dividers data-testid="sl" />);
    expect(screen.getByTestId('sl')).toHaveClass('dividers');
  });
});
