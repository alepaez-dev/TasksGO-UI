import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AvatarGroup } from './AvatarGroup';
import { Avatar } from '../Avatar';

describe('AvatarGroup', () => {
  it('renders all child avatars', () => {
    render(
      <AvatarGroup aria-label="Assignees">
        <Avatar initial="AP" aria-label="Ale P." variant="profile" />
        <Avatar initial="JD" aria-label="Jordan D." variant="profile" />
      </AvatarGroup>,
    );
    expect(screen.getByLabelText('Ale P.')).toBeInTheDocument();
    expect(screen.getByLabelText('Jordan D.')).toBeInTheDocument();
  });

  it('exposes a labelled group role to assistive tech', () => {
    render(
      <AvatarGroup aria-label="Assignees">
        <Avatar initial="AP" aria-label="Ale P." variant="profile" />
      </AvatarGroup>,
    );
    expect(
      screen.getByRole('group', { name: 'Assignees' }),
    ).toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <AvatarGroup ref={ref} aria-label="Assignees">
        <Avatar initial="AP" aria-label="Ale P." variant="profile" />
      </AvatarGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className onto the root element', () => {
    const { container } = render(
      <AvatarGroup aria-label="Assignees" className="custom">
        <Avatar initial="AP" aria-label="Ale P." variant="profile" />
      </AvatarGroup>,
    );
    expect(container.firstChild).toHaveClass('custom');
  });

  it('spreads additional HTML attributes onto the root element', () => {
    render(
      <AvatarGroup aria-label="Assignees" data-testid="group">
        <Avatar initial="AP" aria-label="Ale P." variant="profile" />
      </AvatarGroup>,
    );
    expect(screen.getByTestId('group')).toBeInTheDocument();
  });
});
