import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TicketId } from './TicketId';

describe('TicketId', () => {
  it('renders the ticket ID text', () => {
    render(<TicketId ticketId="ENG-902" />);
    expect(screen.getByText('ENG-902')).toBeInTheDocument();
  });

  it('forwards ref to the span element', () => {
    const ref = { current: null } as React.RefObject<HTMLSpanElement | null>;
    render(<TicketId ref={ref} ticketId="ENG-902" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('merges custom className', () => {
    render(<TicketId ticketId="ENG-902" className="custom" />);
    expect(screen.getByText('ENG-902')).toHaveClass('custom');
  });

  it('spreads additional HTML attributes', () => {
    render(<TicketId ticketId="ENG-902" data-testid="ticket" />);
    expect(screen.getByTestId('ticket')).toBeInTheDocument();
  });
});
