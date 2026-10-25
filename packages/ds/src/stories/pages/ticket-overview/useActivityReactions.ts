import { useCallback, useMemo, useState } from 'react';
import {
  toggleReaction as applyReaction,
  type ActivityItem,
  type ActivityReaction,
  type ActivityReactor,
} from '../../../utils/activity';

export interface UseActivityReactionsOptions {
  items: readonly ActivityItem[];
  viewer: ActivityReactor;
}

export interface UseActivityReactions {
  pickerOpenId: string | null;
  reactionsOf: (itemId: string) => readonly ActivityReaction[];
  toggleReaction: (itemId: string, emoji: string) => void;
  pickReaction: (itemId: string, emoji: string) => void;
  setPickerOpen: (itemId: string | null) => void;
}

export function useActivityReactions({
  items,
  viewer,
}: UseActivityReactionsOptions): UseActivityReactions {
  const [pickerOpenId, setPickerOpen] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<
    ReadonlyMap<string, readonly ActivityReaction[]>
  >(() => new Map());

  const base = useMemo(() => {
    const byId = new Map<string, readonly ActivityReaction[]>();
    for (const item of items) {
      if (item.kind === 'comment' || item.kind === 'ask') {
        byId.set(item.id, item.reactions);
      }
    }
    return byId;
  }, [items]);

  const reactionsOf = useCallback(
    (itemId: string): readonly ActivityReaction[] =>
      overrides.get(itemId) ?? base.get(itemId) ?? [],
    [overrides, base],
  );

  const toggleReaction = useCallback(
    (itemId: string, emoji: string) => {
      setOverrides((current) => {
        const existing = current.get(itemId) ?? base.get(itemId) ?? [];
        return new Map(current).set(
          itemId,
          applyReaction(existing, emoji, viewer),
        );
      });
    },
    [base, viewer],
  );

  const pickReaction = useCallback(
    (itemId: string, emoji: string) => {
      const already = reactionsOf(itemId).some(
        (reaction) => reaction.emoji === emoji && reaction.reactedByViewer,
      );
      if (!already) toggleReaction(itemId, emoji);
      setPickerOpen(null);
    },
    [toggleReaction, reactionsOf],
  );

  return {
    pickerOpenId,
    reactionsOf,
    toggleReaction,
    pickReaction,
    setPickerOpen,
  };
}
