import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PriorityLabel } from './PriorityLabel';

describe('PriorityLabel', () => {
  it('renders the priority text', () => {
    render(<PriorityLabel priority="high" />);
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('applies the correct variant class for each priority', () => {
    const { rerender } = render(<PriorityLabel priority="critical" />);
    expect(screen.getByText('critical')).toHaveClass('critical');

    rerender(<PriorityLabel priority="high" />);
    expect(screen.getByText('high')).toHaveClass('high');

    rerender(<PriorityLabel priority="medium" />);
    expect(screen.getByText('medium')).toHaveClass('medium');

    rerender(<PriorityLabel priority="low" />);
    expect(screen.getByText('low')).toHaveClass('low');
  });

  it('forwards ref to the span element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<PriorityLabel ref={ref} priority="high" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('merges custom className', () => {
    render(<PriorityLabel priority="high" className="custom" />);
    expect(screen.getByText('high')).toHaveClass('custom');
  });

  it('shows only the word by default', () => {
    const { container } = render(<PriorityLabel priority="high" />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it.each([
    ['critical', 'warning'],
    ['high', 'signal_cellular_alt'],
    ['medium', 'signal_cellular_alt_2_bar'],
    ['low', 'signal_cellular_alt_1_bar'],
  ] as const)(
    'shows the %s glyph before the word in icon-text',
    (priority, icon) => {
      const { container } = render(
        <PriorityLabel priority={priority} appearance="icon-text" />,
      );
      expect(
        container.querySelector(`[data-icon-name="${icon}"]`),
      ).toBeInTheDocument();
      expect(screen.getByText(priority)).toBeInTheDocument();
    },
  );

  it('keeps the word for screen readers in the icon appearance', () => {
    const { container } = render(
      <PriorityLabel priority="low" appearance="icon" />,
    );
    expect(
      container.querySelector('[data-icon-name="signal_cellular_alt_1_bar"]'),
    ).toBeInTheDocument();
    expect(screen.getByText('low')).toHaveClass('srOnly');
  });

  it('puts critical in a chip only in icon-text', () => {
    const { rerender, container } = render(
      <PriorityLabel priority="critical" appearance="icon-text" />,
    );
    expect(container.firstChild).toHaveClass('chip');
    rerender(<PriorityLabel priority="high" appearance="icon-text" />);
    expect(container.firstChild).not.toHaveClass('chip');
    rerender(<PriorityLabel priority="critical" />);
    expect(container.firstChild).not.toHaveClass('chip');
  });
});
