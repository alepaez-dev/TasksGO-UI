import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Icon } from './Icon';
import { iconRegistry, type IconName } from '../../icons';

const allIconNames = Object.keys(iconRegistry) as IconName[];

describe('Icon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<Icon name="task_alt" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('does not render icon names as visible text (no FOUT)', () => {
    const { container } = render(
      <div>
        {allIconNames.map((name) => (
          <Icon key={name} name={name} />
        ))}
      </div>,
    );
    for (const name of allIconNames) {
      expect(screen.queryByText(name)).not.toBeInTheDocument();
    }
    expect(container.querySelectorAll('svg')).toHaveLength(allIconNames.length);
  });

  it('applies md size class by default', () => {
    const { container } = render(<Icon name="task_alt" />);
    const span = container.querySelector('span');
    expect(span).toHaveClass('md');
  });

  it('applies the sm size class', () => {
    const { container } = render(<Icon name="task_alt" size="sm" />);
    const span = container.querySelector('span');
    expect(span).toHaveClass('sm');
  });

  it('sets aria-hidden to true', () => {
    const { container } = render(<Icon name="task_alt" />);
    const span = container.querySelector('span');
    expect(span).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards ref to the span element', () => {
    const ref = { current: null } as React.RefObject<HTMLSpanElement | null>;
    render(<Icon ref={ref} name="task_alt" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('merges custom className', () => {
    const { container } = render(<Icon name="task_alt" className="custom" />);
    const span = container.querySelector('span');
    expect(span).toHaveClass('custom');
  });
});
