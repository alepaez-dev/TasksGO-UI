import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
  ReactionBar,
  REACTION_CHOICES,
  type ReactionBarProps,
} from './ReactionBar';
import type { ActivityReaction } from '../../utils/activity';

const reactions: readonly ActivityReaction[] = [
  {
    emoji: '👍',
    count: 2,
    reactedByViewer: true,
    actors: [
      { id: 'ap', name: 'Ale P.' },
      { id: 'sk', name: 'Sam K.' },
    ],
  },
  {
    emoji: '🎉',
    count: 1,
    reactedByViewer: false,
    actors: [{ id: 'am', name: 'Alex M.' }],
  },
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

  it('names who reacted, so the count is not the only cue', () => {
    render(<ReactionBar reactions={reactions} />);
    expect(
      screen.getByRole('button', { name: 'Ale P., Sam K. reacted 👍' }),
    ).toBeInTheDocument();
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
    const onPickerOpenChange = vi.fn();
    const { rerender } = render(
      <ReactionBar
        reactions={reactions}
        onPickerOpenChange={onPickerOpenChange}
        onPickReaction={() => {}}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Add reaction' }));
    expect(onPickerOpenChange).toHaveBeenCalledExactlyOnceWith(true);

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

describe('ReactionBar picker', () => {
  const renderOpenPicker = (props: Partial<ReactionBarProps> = {}) =>
    render(
      <ReactionBar
        reactions={reactions}
        onPickerOpenChange={() => {}}
        onPickReaction={() => {}}
        pickerOpen
        {...props}
      />,
    );

  it('keeps the picker out of the document until it is opened', () => {
    render(
      <ReactionBar
        reactions={reactions}
        onPickerOpenChange={() => {}}
        onPickReaction={() => {}}
      />,
    );
    for (const emoji of REACTION_CHOICES) {
      expect(
        screen.queryByRole('button', { name: `React with ${emoji}` }),
      ).not.toBeInTheDocument();
    }
  });

  it('offers every choice once open', () => {
    renderOpenPicker();
    for (const emoji of REACTION_CHOICES) {
      expect(
        screen.getByRole('button', { name: `React with ${emoji}` }),
      ).toBeInTheDocument();
    }
  });

  it('reports the emoji the viewer picked', async () => {
    const onPickReaction = vi.fn();
    renderOpenPicker({ onPickReaction });
    await userEvent.click(
      screen.getByRole('button', { name: 'React with 🎉' }),
    );
    expect(onPickReaction).toHaveBeenCalledExactlyOnceWith('🎉');
  });

  it('asks to close once a choice is made', async () => {
    const onPickerOpenChange = vi.fn();
    renderOpenPicker({ onPickerOpenChange });
    await userEvent.click(
      screen.getByRole('button', { name: 'React with 🚀' }),
    );
    expect(onPickerOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('ReactionBar — the label carries what the chip cannot show', () => {
  it('names everyone when the list is complete', () => {
    render(<ReactionBar reactions={reactions} />);
    expect(
      screen.getByRole('button', { name: 'Ale P., Sam K. reacted 👍' }),
    ).toBeInTheDocument();
  });

  it('accounts for reactors the list leaves out', () => {
    render(
      <ReactionBar
        reactions={[
          {
            emoji: '👍',
            count: 12,
            reactedByViewer: false,
            actors: [
              { id: 'sk', name: 'Sam K.' },
              { id: 'am', name: 'Alex M.' },
            ],
          },
        ]}
      />,
    );
    expect(
      screen.getByRole('button', {
        name: 'Sam K., Alex M. and 10 others reacted 👍',
      }),
    ).toBeInTheDocument();
  });

  it('uses the singular for a single unnamed reactor', () => {
    render(
      <ReactionBar
        reactions={[
          {
            emoji: '👍',
            count: 2,
            reactedByViewer: false,
            actors: [{ id: 'sk', name: 'Sam K.' }],
          },
        ]}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Sam K. and 1 other reacted 👍' }),
    ).toBeInTheDocument();
  });
});

describe('ReactionBar — the picker shows what the viewer already gave', () => {
  it('marks a choice the viewer has already reacted with', () => {
    render(
      <ReactionBar
        reactions={reactions}
        pickerOpen
        onPickerOpenChange={() => {}}
        onPickReaction={() => {}}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'React with 👍' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('button', { name: 'React with 🎉' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('does not offer a picker whose choices would do nothing', () => {
    render(<ReactionBar reactions={reactions} onPickerOpenChange={() => {}} />);
    expect(
      screen.queryByRole('button', { name: 'Add reaction' }),
    ).not.toBeInTheDocument();
  });
});
