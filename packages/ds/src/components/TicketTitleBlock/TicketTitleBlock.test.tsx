import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TicketTitleBlock } from './TicketTitleBlock';

describe('TicketTitleBlock', () => {
  it('renders the title as an h1', () => {
    render(<TicketTitleBlock title="Edge caching" />);
    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Edge caching',
    });
    expect(heading).toBeInTheDocument();
  });

  it('renders all badges with their labels', () => {
    render(
      <TicketTitleBlock
        title="Edge caching"
        badges={[
          { label: 'In Progress', variant: 'progress' },
          { label: 'High Prio', variant: 'high' },
        ]}
      />,
    );
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('High Prio')).toBeInTheDocument();
  });

  it('renders the avatar slot when provided', () => {
    render(
      <TicketTitleBlock
        title="Edge caching"
        avatar={<span data-testid="avatar">JD</span>}
      />,
    );
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  it('omits the meta row entirely when badges and avatar are both absent', () => {
    const { container } = render(<TicketTitleBlock title="Edge caching" />);
    expect(container.querySelectorAll('div').length).toBe(1);
  });

  it('renders the meta row when only badges are provided', () => {
    render(
      <TicketTitleBlock
        title="Edge caching"
        badges={[{ label: 'Done', variant: 'done' }]}
      />,
    );
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('renders the meta row when only avatar is provided', () => {
    render(
      <TicketTitleBlock
        title="Edge caching"
        avatar={<span data-testid="avatar">JD</span>}
      />,
    );
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
    render(<TicketTitleBlock ref={ref} title="Edge caching" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    const { container } = render(
      <TicketTitleBlock title="Edge caching" className="custom" />,
    );
    expect(container.firstChild).toHaveClass('custom');
  });

  it('spreads additional HTML attributes', () => {
    render(<TicketTitleBlock title="Edge caching" data-testid="block" />);
    expect(screen.getByTestId('block')).toBeInTheDocument();
  });
});
