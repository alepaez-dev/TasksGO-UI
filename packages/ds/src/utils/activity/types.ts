import type { IconName } from '../../icons';

export type ActivityActorKind = 'human' | 'system';

export interface ActivityActor {
  readonly id: string;
  readonly name: string;
  readonly initial: string;
  readonly kind: ActivityActorKind;
  readonly tint?: string;
}

export type ActivityRefType =
  | 'file'
  | 'pullRequest'
  | 'ticket'
  | 'scenario'
  | 'environment'
  | 'build';

export interface ActivityRef {
  readonly type: ActivityRefType;
  readonly label: string;
  readonly href?: string;
}

export interface ActivityReaction {
  readonly emoji: string;
  readonly count: number;
  readonly reactedByViewer: boolean;
}

export interface ActivityReply {
  readonly id: string;
  readonly at: string;
  readonly actor: ActivityActor;
  readonly body: string;
}

interface ActivityItemBase {
  readonly id: string;
  readonly at: string;
  readonly actor: ActivityActor;
}

export interface ActivityComment extends ActivityItemBase {
  readonly kind: 'comment';
  readonly body: string;
  readonly reactions: readonly ActivityReaction[];
  readonly replies: readonly ActivityReply[];
}

export interface ActivityAsk extends ActivityItemBase {
  readonly kind: 'ask';
  readonly body: string;
  readonly reactions: readonly ActivityReaction[];
  readonly replies: readonly ActivityReply[];
  /** Absent means the ask is still open — absence is the state, not a missing value. */
  readonly answeredBy?: ActivityActor;
}

export interface ActivityEventChange {
  readonly from?: string;
  readonly to: string;
}

export interface ActivityEvent extends ActivityItemBase {
  readonly kind: 'event';
  readonly icon: IconName;
  readonly summary: string;
  readonly field?: string;
  readonly change?: ActivityEventChange;
  readonly refs: readonly ActivityRef[];
}

export type ActivityItem = ActivityComment | ActivityAsk | ActivityEvent;

export interface ActivityItemNode {
  readonly type: 'item';
  readonly item: ActivityItem;
}

export interface ActivityGroup {
  readonly type: 'group';
  readonly id: string;
  /** For a system-only group this is the first bot; renderers must not name it. */
  readonly actor: ActivityActor;
  readonly items: readonly ActivityEvent[];
  readonly fields: readonly string[];
}

export type ActivityNode = ActivityItemNode | ActivityGroup;

export type ActivityRelativeDay = 'today' | 'yesterday';

/**
 * Dividers carry data, not display strings — formatting a date is a locale
 * decision that belongs to the component, not to a pure util.
 */
export interface ActivityDayDivider {
  readonly type: 'dayDivider';
  readonly at: string;
  readonly relative: ActivityRelativeDay | null;
}

export interface ActivityGapDivider {
  readonly type: 'gapDivider';
  readonly durationMs: number;
}

export type ActivityFeedNode =
  | ActivityNode
  | ActivityDayDivider
  | ActivityGapDivider;
