import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RefLink } from './RefLink';

const baseProps = {
  value: 'feat/dynamic-edge-caching',
  href: 'https://github.com/example/edge-gateway-service/tree/feat/dynamic-edge-caching',
};

describe('RefLink', () => {
  it('renders the value in a link that opens in a new tab', () => {
    render(<RefLink {...baseProps} />);
    const link = screen.getByRole('link', {
      name: /feat\/dynamic-edge-caching/,
    });
    expect(link).toHaveAttribute('href', baseProps.href);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('exposes the untruncated value as a title', () => {
    render(<RefLink {...baseProps} />);
    expect(
      screen.getByRole('link', { name: /feat\/dynamic-edge-caching/ }),
    ).toHaveAttribute('title', baseProps.value);
  });

  it('renders no copy button when onCopy is omitted', () => {
    render(<RefLink {...baseProps} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onCopy when the copy button is clicked', async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    render(
      <RefLink {...baseProps} onCopy={onCopy} copyAriaLabel="Copy branch" />,
    );
    await user.click(screen.getByRole('button', { name: 'Copy branch' }));
    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it('announces the copied label only while copied', () => {
    const { rerender } = render(<RefLink {...baseProps} onCopy={() => {}} />);
    expect(screen.getByRole('status')).toHaveTextContent('');
    rerender(<RefLink {...baseProps} onCopy={() => {}} copied />);
    expect(screen.getByRole('status')).toHaveTextContent('Copied');
  });
});
