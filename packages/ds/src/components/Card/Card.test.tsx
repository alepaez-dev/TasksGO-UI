import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <p>Body content</p>
      </Card>,
    );
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders header content when provided', () => {
    render(
      <Card header="Included">
        <p>Body</p>
      </Card>,
    );
    expect(screen.getByText('Included')).toBeInTheDocument();
  });

  it('does not render the header text when header is omitted', () => {
    render(
      <Card>
        <p>Body</p>
      </Card>,
    );
    expect(screen.queryByText('Included')).not.toBeInTheDocument();
  });

  it('applies the default variant class by default', () => {
    const { container } = render(
      <Card>
        <p>Body</p>
      </Card>,
    );
    expect(container.firstChild).toHaveClass('default');
  });

  it('applies the subtle variant class when variant="subtle"', () => {
    const { container } = render(
      <Card variant="subtle">
        <p>Body</p>
      </Card>,
    );
    expect(container.firstChild).toHaveClass('subtle');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref}>
        <p>Body</p>
      </Card>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className onto the root element', () => {
    const { container } = render(
      <Card className="custom">
        <p>Body</p>
      </Card>,
    );
    expect(container.firstChild).toHaveClass('custom');
  });

  it('spreads additional HTML attributes onto the root element', () => {
    render(
      <Card data-testid="my-card">
        <p>Body</p>
      </Card>,
    );
    expect(screen.getByTestId('my-card')).toBeInTheDocument();
  });
});
