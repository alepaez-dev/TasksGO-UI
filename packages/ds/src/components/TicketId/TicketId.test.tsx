import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TicketId } from './TicketId';

describe('TicketId', () => {
  it('renders children text', () => {
    render(<TicketId>ENG-902</TicketId>);
    expect(screen.getByText('ENG-902')).toBeInTheDocument();
  });

  it('forwards ref to the span element', () => {
    const ref = { current: null } as React.RefObject<HTMLSpanElement | null>;
    render(<TicketId ref={ref}>ENG-902</TicketId>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('merges custom className', () => {
    render(<TicketId className="custom">ENG-902</TicketId>);
    expect(screen.getByText('ENG-902')).toHaveClass('custom');
  });

  it('spreads additional HTML attributes', () => {
    render(<TicketId data-testid="ticket">ENG-902</TicketId>);
    expect(screen.getByTestId('ticket')).toBeInTheDocument();
  });
});
