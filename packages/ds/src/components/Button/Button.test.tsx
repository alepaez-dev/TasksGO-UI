import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole('button', { name: 'Click me' }),
    ).toBeInTheDocument();
  });

  it('forwards ref to the button element', () => {
    const ref = { current: null } as React.RefObject<HTMLButtonElement | null>;
    render(<Button ref={ref}>Ref test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies the variant class', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('secondary');
  });

  it('applies the size class', () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('lg');
  });

  it('merges custom className', () => {
    render(<Button className="custom">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom');
  });
});
