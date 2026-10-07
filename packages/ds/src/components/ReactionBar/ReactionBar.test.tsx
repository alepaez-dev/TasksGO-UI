import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ReactionBar } from './ReactionBar';
import type { ActivityReaction } from '../../utils/activity';

const reactions: readonly ActivityReaction[] = [
  { emoji: '👍', count: 2, reactedByViewer: true },
  { emoji: '🎉', count: 1, reactedByViewer: false },
];

describe('ReactionBar', () => {
  it('renders a button per reaction with its count', () => {
    render(<ReactionBar reactions={reactions} />);
    expect(screen.getByRole('button', { name: /👍/ })).toHaveTextContent('2');
    expect(screen.getByRole('button', { name: /🎉/ })).toHaveTextContent('1');
  });

  it('marks the viewer’s own reaction as pressed', () => {
    render(<ReactionBar reactions={reactions} />);
    expect(screen.getByRole('button', { name: /👍/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: /🎉/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('reports which emoji was toggled', async () => {
    const onToggleReaction = vi.fn();
    render(
      <ReactionBar reactions={reactions} onToggleReaction={onToggleReaction} />,
    );
    await userEvent.click(screen.getByRole('button', { name: /🎉/ }));
    expect(onToggleReaction).toHaveBeenCalledExactlyOnceWith('🎉');
  });
});

describe('ReactionBar add affordance', () => {
  it('offers an add button only when the caller can handle it', async () => {
    const onAddReaction = vi.fn();
    const { rerender } = render(
      <ReactionBar reactions={reactions} onAddReaction={onAddReaction} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Add reaction' }));
    expect(onAddReaction).toHaveBeenCalledOnce();

    rerender(<ReactionBar reactions={reactions} />);
    expect(
      screen.queryByRole('button', { name: 'Add reaction' }),
    ).not.toBeInTheDocument();
  });

  it('renders nothing when there is neither a reaction nor a way to add one', () => {
    const { container } = render(<ReactionBar reactions={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
