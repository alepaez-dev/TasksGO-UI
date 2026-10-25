import type { ActivityReaction, ActivityReactor } from './types';

export function toggleReaction(
  reactions: readonly ActivityReaction[],
  emoji: string,
  viewer: ActivityReactor,
): readonly ActivityReaction[] {
  const existing = reactions.find((reaction) => reaction.emoji === emoji);

  if (existing === undefined) {
    return [
      ...reactions,
      { emoji, count: 1, reactedByViewer: true, actors: [viewer] },
    ];
  }

  if (!existing.reactedByViewer) {
    return reactions.map((reaction) =>
      reaction.emoji === emoji
        ? {
            ...reaction,
            count: reaction.count + 1,
            reactedByViewer: true,
            actors: [...reaction.actors, viewer],
          }
        : reaction,
    );
  }

  if (existing.count <= 1) {
    return reactions.filter((reaction) => reaction.emoji !== emoji);
  }

  return reactions.map((reaction) =>
    reaction.emoji === emoji
      ? {
          ...reaction,
          count: reaction.count - 1,
          reactedByViewer: false,
          actors: reaction.actors.filter((actor) => actor.id !== viewer.id),
        }
      : reaction,
  );
}
