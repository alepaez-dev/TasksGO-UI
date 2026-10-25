import { forwardRef, useRef, type HTMLAttributes } from 'react';
import { Icon } from '../Icon';
import { Popover } from '../Popover';
import { cn } from '../../utils/cn';
import type { ActivityReaction } from '../../utils/activity';
import styles from './ReactionBar.module.css';

export const REACTION_CHOICES = [
  '👍',
  '❤️',
  '🎉',
  '😄',
  '👀',
  '🙌',
  '🚀',
  '✅',
] as const;

export interface ReactionBarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  reactions: readonly ActivityReaction[];
  onToggleReaction?: (emoji: string) => void;
  pickerOpen?: boolean;
  onPickerOpenChange?: (open: boolean) => void;
  onPickReaction?: (emoji: string) => void;
}

function reactionLabel({ actors, count, emoji }: ActivityReaction): string {
  if (actors.length === 0) return `${count} reacted ${emoji}`;

  const named = actors.map((actor) => actor.name).join(', ');
  const unnamed = count - actors.length;
  if (unnamed > 0) {
    return `${named} and ${unnamed} ${unnamed === 1 ? 'other' : 'others'} reacted ${emoji}`;
  }
  return `${named} reacted ${emoji}`;
}

export const ReactionBar = forwardRef<HTMLDivElement, ReactionBarProps>(
  (
    {
      reactions,
      onToggleReaction,
      pickerOpen = false,
      onPickerOpenChange,
      onPickReaction,
      className,
      ...rest
    },
    ref,
  ) => {
    const addRef = useRef<HTMLButtonElement>(null);
    const canAdd =
      onPickerOpenChange !== undefined && onPickReaction !== undefined;

    if (reactions.length === 0 && !canAdd) return null;

    return (
      <div ref={ref} className={cn(styles.bar, className)} {...rest}>
        {reactions.map((reaction) => (
          <button
            key={reaction.emoji}
            type="button"
            aria-pressed={reaction.reactedByViewer}
            aria-label={reactionLabel(reaction)}
            className={cn(styles.chip, reaction.reactedByViewer && styles.on)}
            onClick={() => onToggleReaction?.(reaction.emoji)}
          >
            {reaction.emoji}
            <span className={styles.count}>{reaction.count}</span>
          </button>
        ))}
        {canAdd && (
          <>
            <button
              ref={addRef}
              type="button"
              aria-label="Add reaction"
              aria-expanded={pickerOpen}
              className={cn(styles.chip, styles.add)}
              onClick={() => onPickerOpenChange(!pickerOpen)}
            >
              <Icon name="mood" size="sm" />
            </button>
            <Popover
              open={pickerOpen}
              onOpenChange={onPickerOpenChange}
              anchorRef={addRef}
              placement="top-start"
              aria-label="Pick a reaction"
              className={styles.picker}
            >
              {REACTION_CHOICES.map((emoji) => {
                const mine = reactions.some(
                  (reaction) =>
                    reaction.emoji === emoji && reaction.reactedByViewer,
                );
                return (
                  <button
                    key={emoji}
                    type="button"
                    aria-label={`React with ${emoji}`}
                    aria-pressed={mine}
                    className={cn(styles.choice, mine && styles.choiceOn)}
                    onClick={() => {
                      onPickReaction(emoji);
                      onPickerOpenChange(false);
                    }}
                  >
                    {emoji}
                  </button>
                );
              })}
            </Popover>
          </>
        )}
      </div>
    );
  },
);

ReactionBar.displayName = 'ReactionBar';
