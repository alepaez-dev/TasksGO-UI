import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { Markdown } from '../Markdown';
import { ReactionBar } from '../ReactionBar';
import { cn } from '../../utils/cn';
import type {
  ActivityActor,
  ActivityReaction,
  ActivityReply,
} from '../../utils/activity';
import styles from './CommentCard.module.css';

const chipClass = {
  comment: styles.chipComment,
  ask: styles.chipAsk,
} as const;

const bubbleClass = {
  comment: styles.bubbleComment,
  ask: styles.bubbleAsk,
} as const;

type CommentCardKindState =
  | { kind: 'comment'; answeredBy?: never; onMarkAnswered?: never }
  | {
      kind: 'ask';
      answeredBy?: ActivityActor;
      onMarkAnswered?: () => void;
    };

type CommentCardPinState =
  | { pinned: true; onPin?: never }
  | { pinned?: false; onPin?: () => void };

export type CommentCardProps = CommentCardKindState &
  CommentCardPinState &
  Omit<HTMLAttributes<HTMLLIElement>, 'children'> & {
    actor: ActivityActor;
    body: string;
    timestamp: ReactNode;
    query?: string;
    mentions?: readonly string[];
    replies?: readonly ActivityReply[];
    reactions?: readonly ActivityReaction[];
    onReply?: () => void;
    onToggleReaction?: (emoji: string) => void;
    onAddReaction?: () => void;
    onMore?: () => void;
  };

export const CommentCard = forwardRef<HTMLLIElement, CommentCardProps>(
  (
    {
      kind,
      actor,
      body,
      timestamp,
      query = '',
      mentions,
      replies = [],
      reactions = [],
      answeredBy,
      pinned = false,
      onReply,
      onMarkAnswered,
      onToggleReaction,
      onAddReaction,
      onMore,
      onPin,
      className,
      ...rest
    },
    ref,
  ) => {
    const answered = kind === 'ask' && answeredBy !== undefined;

    return (
      <li
        ref={ref}
        tabIndex={pinned ? -1 : undefined}
        className={cn(styles.entry, pinned && styles.pinned, className)}
        {...rest}
      >
        {pinned && <span className={styles.srOnly}>Pinned</span>}
        <Avatar
          size="lg"
          variant="profile"
          initial={actor.initial}
          tint={actor.tint}
          aria-label={actor.name}
          className={styles.avatar}
        />
        <div className={styles.main}>
          <div className={styles.head}>
            <span className={styles.author}>{actor.name}</span>
            <span className={cn(styles.chip, chipClass[kind])}>
              <Icon
                name={kind === 'ask' ? 'help' : 'comment_filled'}
                size="xs"
              />
              {kind === 'ask' ? 'Asked' : 'Comment'}
            </span>
            {answered && (
              <span className={cn(styles.chip, styles.chipAnswered)}>
                <Icon name="check_circle" size="xs" />
                Answered
              </span>
            )}
            <span className={styles.time}>{timestamp}</span>
            <span className={styles.actions}>
              {onPin && (
                <button
                  type="button"
                  className={styles.action}
                  onClick={onPin}
                  aria-label={`Pin ${kind === 'ask' ? 'ask' : 'comment'} by ${actor.name}`}
                >
                  <Icon name="push_pin_filled" size="xs" />
                </button>
              )}
              {onMore && (
                <button
                  type="button"
                  className={styles.action}
                  aria-label="More actions"
                  onClick={onMore}
                >
                  <Icon name="more_horiz" size="xs" />
                </button>
              )}
            </span>
          </div>

          <Markdown
            source={body}
            query={query}
            mentions={mentions}
            className={cn(
              styles.bubble,
              bubbleClass[kind],
              answered && styles.bubbleAnswered,
            )}
          />

          <div className={styles.foot}>
            {onReply && (
              <button
                type="button"
                className={styles.footBtn}
                onClick={onReply}
              >
                <Icon name="reply" size="xs" />
                {kind === 'ask' ? 'Reply to Ask' : 'Reply'}
              </button>
            )}
            {answered && (
              <span className={cn(styles.footBtn, styles.solved)}>
                <Icon name="check_circle" size="xs" />
                Answered by {answeredBy.name}
              </span>
            )}
            {kind === 'ask' && !answered && onMarkAnswered && (
              <button
                type="button"
                className={styles.footBtn}
                onClick={onMarkAnswered}
              >
                <Icon name="check" size="xs" />
                Mark as answered
              </button>
            )}
            <ReactionBar
              reactions={reactions}
              onToggleReaction={onToggleReaction}
              onAddReaction={onAddReaction}
            />
          </div>

          {replies.length > 0 && (
            <ul aria-label="Replies" className={styles.replies}>
              {replies.map((reply) => (
                <li key={reply.id} className={styles.reply}>
                  <Avatar
                    variant="profile"
                    initial={reply.actor.initial}
                    tint={reply.actor.tint}
                    aria-label={reply.actor.name}
                  />
                  <div>
                    <div className={styles.replyHead}>
                      <span className={styles.replyAuthor}>
                        {reply.actor.name}
                      </span>
                      <span className={styles.time}>{reply.at}</span>
                    </div>
                    <Markdown
                      source={reply.body}
                      query={query}
                      mentions={mentions}
                      className={styles.replyBody}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </li>
    );
  },
);

CommentCard.displayName = 'CommentCard';
