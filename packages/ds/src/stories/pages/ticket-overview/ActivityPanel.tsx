import { useEffect, useRef, type ReactNode } from 'react';
import {
  ActivityComposer,
  Badge,
  CommentCard,
  HighlightedText,
  Icon,
  SearchInput,
  SegmentedControl,
  TimelineDivider,
  TimelineEvent,
  TimelineGroup,
  countActions,
  type ActivityComposerProps,
  type ActivityEvent,
  type ActivityItem,
  type ActivitySegment,
} from '../../../index';
import { formatTimeAgo } from './formatTimeAgo';
import type { UseActivityState } from './useActivityState';
import styles from './ActivityPanel.module.css';

export interface ActivityPanelProps {
  activity: UseActivityState;
  composer: ActivityComposerProps;
  now: string;
  mentions?: readonly string[];
}

const SEGMENT_LABEL: Record<ActivitySegment, string> = {
  all: 'All',
  comments: 'Comments & Asks',
  events: 'System',
};

const CHANGE_BADGE = {
  'to do': 'todo',
  'in progress': 'progress',
  done: 'done',
  high: 'high',
  critical: 'critical',
} as const;

type ChangeBadgeVariant =
  | (typeof CHANGE_BADGE)[keyof typeof CHANGE_BADGE]
  | 'default';

function changeVariant(value: string): ChangeBadgeVariant {
  return (
    CHANGE_BADGE[value.toLowerCase() as keyof typeof CHANGE_BADGE] ?? 'default'
  );
}

export function ActivityPanel({
  activity,
  composer,
  now,
  mentions,
}: ActivityPanelProps): ReactNode {
  const searching = activity.query.trim() !== '';
  const pinnedRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (activity.pinnedId === null) return;
    const row = pinnedRef.current;
    if (row === null) return;
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    row.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'center',
    });
  }, [activity.pinnedId]);

  const refFor = (id: string) =>
    activity.pinnedId === id ? pinnedRef : undefined;

  const pinPropsFor = (id: string) =>
    activity.pinnedId === id
      ? { pinned: true as const }
      : { onPin: searching ? () => activity.pin(id) : undefined };

  const renderEvent = (
    event: ActivityEvent,
    variant: 'standalone' | 'nested',
  ): ReactNode => (
    <TimelineEvent
      key={event.id}
      icon={event.icon}
      variant={variant}
      timestamp={formatTimeAgo(event.at, now)}
      muted={event.actor.kind === 'system'}
      ref={refFor(event.id)}
      {...pinPropsFor(event.id)}
    >
      <b>
        <HighlightedText text={event.actor.name} query={activity.query} />
      </b>{' '}
      <HighlightedText text={event.summary} query={activity.query} />
      {event.change && (
        <>
          {' '}
          {event.change.from !== undefined && (
            <Badge variant="previous">
              <HighlightedText
                text={event.change.from}
                query={activity.query}
              />
            </Badge>
          )}{' '}
          →{' '}
          <Badge variant={changeVariant(event.change.to)}>
            <HighlightedText text={event.change.to} query={activity.query} />
          </Badge>
        </>
      )}
    </TimelineEvent>
  );

  const renderComment = (item: ActivityItem): ReactNode => {
    if (item.kind === 'event') return null;
    const shared = {
      actor: item.actor,
      body: item.body,
      timestamp: formatTimeAgo(item.at, now),
      query: activity.query,
      mentions,
      reactions: activity.reactionsOf(item.id),
      replies: item.replies.map((entry) => ({
        id: entry.id,
        actor: entry.actor,
        body: entry.body,
        timestamp: formatTimeAgo(entry.at, now),
      })),
      attachments: item.attachments,
      onToggleReaction: (emoji: string) =>
        activity.toggleReaction(item.id, emoji),
      pickerOpen: activity.pickerOpenId === item.id,
      onPickerOpenChange: (open: boolean) =>
        activity.setPickerOpen(open ? item.id : null),
      onPickReaction: (emoji: string) => activity.pickReaction(item.id, emoji),
    };
    return item.kind === 'ask' ? (
      <CommentCard
        key={item.id}
        kind="ask"
        answeredBy={item.answeredBy}
        {...shared}
        ref={refFor(item.id)}
        {...pinPropsFor(item.id)}
      />
    ) : (
      <CommentCard
        key={item.id}
        kind="comment"
        {...shared}
        ref={refFor(item.id)}
        {...pinPropsFor(item.id)}
      />
    );
  };

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <SegmentedControl
          variant="filter"
          aria-label="Filter activity"
          value={activity.segment}
          onValueChange={(value) =>
            activity.setSegment(value as ActivitySegment)
          }
          options={(['all', 'comments', 'events'] as const).map((value) => ({
            value,
            label: SEGMENT_LABEL[value],
            count: activity.counts[value],
          }))}
        />
        <SearchInput
          className={styles.search}
          borderless
          placeholder="Search activity…"
          aria-label="Search activity"
          value={activity.query}
          onChange={(event) => activity.setQuery(event.target.value)}
          onClear={() => activity.setQuery('')}
        />
        <button
          type="button"
          className={styles.sort}
          onClick={activity.toggleSort}
        >
          <Icon name="unfold_more" size="xs" />
          {activity.sort === 'oldest' ? 'Oldest first' : 'Newest first'}
        </button>
      </div>

      {searching && (
        <div className={styles.banner}>
          <Icon name="search" size="xs" />
          <span className={styles.bannerText}>
            <b>{activity.matchCount}</b> matching events · pin any one to keep
            it and get the full timeline back
          </span>
          <button
            type="button"
            className={styles.bannerAction}
            onClick={() => activity.setQuery('')}
          >
            Clear
          </button>
        </div>
      )}

      {!searching &&
        activity.pinnedId !== null &&
        activity.visibleIds.includes(activity.pinnedId) && (
          <div className={styles.banner}>
            <Icon name="push_pin_filled" size="xs" />
            <span className={styles.bannerText}>
              Pinned — full timeline restored around it
            </span>
            <button
              type="button"
              className={styles.bannerAction}
              onClick={activity.clearPin}
            >
              Clear pin
            </button>
          </div>
        )}

      {activity.isEmpty ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <Icon name="search" size="sm" />
          </span>
          <span className={styles.emptyTitle}>No matching activity</span>
          <span className={styles.emptyHint}>
            Try a different filter or search term.
          </span>
        </div>
      ) : (
        <ul className={styles.feed}>
          <li className={styles.spine} aria-hidden="true" />
          {activity.feed.map((node, index) => {
            if (node.type === 'dayDivider' || node.type === 'gapDivider') {
              return <TimelineDivider key={`divider-${index}`} {...node} />;
            }
            if (node.type === 'group') {
              const label = activity.matchLabelOf(node);
              return (
                <TimelineGroup
                  key={node.id}
                  count={countActions(node)}
                  summary={
                    node.actor.kind === 'system' ? (
                      <b>{countActions(node)} system events</b>
                    ) : (
                      <>
                        <b>
                          <HighlightedText
                            text={node.actor.name}
                            query={activity.query}
                          />
                        </b>{' '}
                        performed {countActions(node)} updates
                      </>
                    )
                  }
                  meta={
                    <>
                      ·{' '}
                      <HighlightedText
                        text={node.fields.join(', ')}
                        query={activity.query}
                      />
                    </>
                  }
                  matchLabel={label ?? undefined}
                  open={activity.isGroupOpen(node.id)}
                  onOpenChange={() => activity.toggleGroup(node.id)}
                >
                  {activity
                    .visibleRowsOf(node)
                    .map((e) => renderEvent(e, 'nested'))}
                </TimelineGroup>
              );
            }
            return node.item.kind === 'event'
              ? renderEvent(node.item, 'standalone')
              : renderComment(node.item);
          })}
        </ul>
      )}

      <ActivityComposer {...composer} />
    </div>
  );
}
