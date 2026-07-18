import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Callout } from './Callout';

describe('Callout', () => {
  it('renders children', () => {
    render(<Callout>Response carries a cache hit</Callout>);
    expect(
      screen.getByText('Response carries a cache hit'),
    ).toBeInTheDocument();
  });

  it('applies the neutral variant class by default', () => {
    render(<Callout>Not run</Callout>);
    expect(screen.getByText('Not run')).toHaveClass('callout', 'neutral');
  });

  it('applies the requested variant class', () => {
    render(<Callout variant="positive">Expected</Callout>);
    expect(screen.getByText('Expected')).toHaveClass('positive');
  });

  it('applies the critical variant class', () => {
    render(<Callout variant="critical">Actual</Callout>);
    expect(screen.getByText('Actual')).toHaveClass('critical');
  });

  it('applies the warning variant class', () => {
    render(<Callout variant="warning">Waived</Callout>);
    expect(screen.getByText('Waived')).toHaveClass('warning');
  });

  it('forwards ref to the div element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Callout ref={ref}>Label</Callout>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className and forwards rest props', () => {
    render(
      <Callout className="custom" data-testid="cb">
        Label
      </Callout>,
    );
    const el = screen.getByTestId('cb');
    expect(el).toHaveClass('custom');
    expect(el).toHaveClass('callout');
  });
});
