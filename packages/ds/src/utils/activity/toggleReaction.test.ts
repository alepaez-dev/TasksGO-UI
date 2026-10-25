import { describe, expect, it } from 'vitest';
import { toggleReaction } from './toggleReaction';
import type { ActivityReaction, ActivityReactor } from './types';

const VIEWER: ActivityReactor = { id: 'ap', name: 'Ale P.' };
const SAM: ActivityReactor = { id: 'sk', name: 'Sam K.' };
const ALEX: ActivityReactor = { id: 'am', name: 'Alex M.' };

const reactions: readonly ActivityReaction[] = [
  { emoji: '👍', count: 2, reactedByViewer: false, actors: [SAM, ALEX] },
  { emoji: '👀', count: 1, reactedByViewer: true, actors: [VIEWER] },
];

describe('toggleReaction', () => {
  it('adds a reaction the comment does not have yet', () => {
    expect(toggleReaction(reactions, '🎉', VIEWER)).toEqual([
      ...reactions,
      { emoji: '🎉', count: 1, reactedByViewer: true, actors: [VIEWER] },
    ]);
  });

  it('joins an existing reaction the viewer has not made', () => {
    const [thumbs] = toggleReaction(reactions, '👍', VIEWER);
    expect(thumbs).toEqual({
      emoji: '👍',
      count: 3,
      reactedByViewer: true,
      actors: [SAM, ALEX, VIEWER],
    });
  });

  it('leaves an existing reaction alone when the viewer joins another', () => {
    expect(toggleReaction(reactions, '👍', VIEWER)[1]).toEqual(reactions[1]);
  });

  it('withdraws the viewer from a reaction they already made', () => {
    const shared: readonly ActivityReaction[] = [
      { emoji: '👀', count: 2, reactedByViewer: true, actors: [SAM, VIEWER] },
    ];
    expect(toggleReaction(shared, '👀', VIEWER)).toEqual([
      { emoji: '👀', count: 1, reactedByViewer: false, actors: [SAM] },
    ]);
  });

  it('drops the reaction entirely when the viewer was the only one', () => {
    expect(toggleReaction(reactions, '👀', VIEWER)).toEqual([reactions[0]]);
  });

  it('withdraws only the viewer when someone shares their display name', () => {
    const namesake: ActivityReactor = { id: 'am2', name: 'Alex M.' };
    const crowded: readonly ActivityReaction[] = [
      {
        emoji: '👍',
        count: 3,
        reactedByViewer: true,
        actors: [ALEX, namesake, SAM],
      },
    ];
    expect(toggleReaction(crowded, '👍', ALEX)).toEqual([
      {
        emoji: '👍',
        count: 2,
        reactedByViewer: false,
        actors: [namesake, SAM],
      },
    ]);
  });

  it('still drops the count when the viewer is not in a truncated actor list', () => {
    const truncated: readonly ActivityReaction[] = [
      { emoji: '👍', count: 12, reactedByViewer: true, actors: [SAM, ALEX] },
    ];
    expect(toggleReaction(truncated, '👍', VIEWER)).toEqual([
      { emoji: '👍', count: 11, reactedByViewer: false, actors: [SAM, ALEX] },
    ]);
  });

  it('does not mutate the reactions it was given', () => {
    const before = JSON.stringify(reactions);
    toggleReaction(reactions, '👍', VIEWER);
    toggleReaction(reactions, '👀', VIEWER);
    expect(JSON.stringify(reactions)).toBe(before);
  });
});
