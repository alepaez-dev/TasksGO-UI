import { forwardRef, type HTMLAttributes } from 'react';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import type { ActivityReaction } from '../../utils/activity';
import styles from './ReactionBar.module.css';

export interface ReactionBarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  reactions: readonly ActivityReaction[];
  onToggleReaction?: (emoji: string) => void;
  onAddReaction?: () => void;
}

export const ReactionBar = forwardRef<HTMLDivElement, ReactionBarProps>(
  ({ reactions, onToggleReaction, onAddReaction, className, ...rest }, ref) => {
    if (reactions.length === 0 && onAddReaction === undefined) return null;

    return (
      <div ref={ref} className={cn(styles.bar, className)} {...rest}>
        {reactions.map((reaction) => (
          <button
            key={reaction.emoji}
            type="button"
            aria-pressed={reaction.reactedByViewer}
            className={cn(styles.chip, reaction.reactedByViewer && styles.on)}
            onClick={() => onToggleReaction?.(reaction.emoji)}
          >
            {reaction.emoji}
            <span className={styles.count}>{reaction.count}</span>
          </button>
        ))}
        {onAddReaction !== undefined && (
          <button
            type="button"
            aria-label="Add reaction"
            className={cn(styles.chip, styles.add)}
            onClick={onAddReaction}
          >
            <Icon name="mood" size="sm" />
          </button>
        )}
      </div>
    );
  },
);

ReactionBar.displayName = 'ReactionBar';
