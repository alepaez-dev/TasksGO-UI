import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CollapsibleCard } from './CollapsibleCard';

describe('CollapsibleCard', () => {
  it('renders the header', () => {
    render(<CollapsibleCard header="Scenarios">Body</CollapsibleCard>);
    expect(screen.getByText('Scenarios')).toBeInTheDocument();
  });

  it('renders the body content', () => {
    render(<CollapsibleCard header="Scenarios">Body content</CollapsibleCard>);
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('is closed by default', () => {
    render(<CollapsibleCard header="Scenarios">Body</CollapsibleCard>);
    expect(screen.getByRole('group')).not.toHaveAttribute('open');
  });

  it('starts open when defaultOpen is true', () => {
    render(
      <CollapsibleCard header="Scenarios" defaultOpen>
        Body
      </CollapsibleCard>,
    );
    expect(screen.getByRole('group')).toHaveAttribute('open');
  });

  it('toggles open when the summary is clicked', () => {
    render(<CollapsibleCard header="Scenarios">Body</CollapsibleCard>);
    const details = screen.getByRole('group');
    expect(details).not.toHaveAttribute('open');
    fireEvent.click(screen.getByText('Scenarios'));
    expect(details).toHaveAttribute('open');
  });

  it('forwards ref to the details element', () => {
    const ref = createRef<HTMLDetailsElement>();
    render(
      <CollapsibleCard ref={ref} header="Scenarios">
        Body
      </CollapsibleCard>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDetailsElement);
  });

  it('merges custom className', () => {
    const { container } = render(
      <CollapsibleCard header="Scenarios" className="custom">
        Body
      </CollapsibleCard>,
    );
    expect(container.firstChild).toHaveClass('custom');
  });

  it('spreads additional HTML attributes', () => {
    render(
      <CollapsibleCard header="Scenarios" data-testid="card">
        Body
      </CollapsibleCard>,
    );
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });
});
