export type {
  ActivityActor,
  ActivityActorKind,
  ActivityAsk,
  ActivityComment,
  ActivityDayDivider,
  ActivityEvent,
  ActivityEventChange,
  ActivityFeedNode,
  ActivityGapDivider,
  ActivityGroup,
  ActivityItemNode,
  ActivityItem,
  ActivityNode,
  ActivityReaction,
  ActivityRef,
  ActivityRefType,
  ActivityRelativeDay,
  ActivityReply,
} from './types';
export { filterItems, type ActivitySegment } from './filterItems';
export { sortItems, type ActivitySortDirection } from './sortItems';
export {
  buildSearchIndex,
  matchesQuery,
  searchItems,
  type ActivitySearchIndex,
} from './searchItems';
export { groupItems, GROUP_GAP_MS, type GroupItemsOptions } from './groupItems';
export {
  withDividers,
  GAP_DIVIDER_MS,
  type WithDividersOptions,
} from './withDividers';
