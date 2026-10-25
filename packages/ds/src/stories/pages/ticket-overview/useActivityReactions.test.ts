import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActivityReactions } from './useActivityReactions';
import {
  ALEX,
  CI,
  JORDAN,
  ask,
  comment,
  event,
} from '../../../utils/activity/testFixtures';
import type { ActivityItem, ActivityReactor } from '../../../utils/activity';

const VIEWER: ActivityReactor = { id: 'ap', name: 'Ale P.' };

const items: readonly ActivityItem[] = [
  comment(JORDAN, 0, { id: 'c1', body: 'looking at edge-caching' }),
  event(CI, 20, { id: 'e2', summary: 'Build #1847 passed on QA-01' }),
  ask(ALEX, 30, { id: 'a1', body: 'what TTL are we using?' }),
];

describe('useActivityReactions', () => {
  const withViewer = () =>
    renderHook(() => useActivityReactions({ items, viewer: VIEWER }));

  it('starts from the reactions the item came with', () => {
    const { result } = withViewer();
    expect(result.current.reactionsOf('c1')).toEqual([]);
  });

  it('adds a picked reaction to the item it was picked on', () => {
    const { result } = withViewer();
    act(() => result.current.pickReaction('c1', '🎉'));
    expect(result.current.reactionsOf('c1')).toEqual([
      {
        emoji: '🎉',
        count: 1,
        reactedByViewer: true,
        actors: [{ id: 'ap', name: 'Ale P.' }],
      },
    ]);
  });

  it('keeps each item’s reactions separate', () => {
    const { result } = withViewer();
    act(() => result.current.pickReaction('c1', '🎉'));
    expect(result.current.reactionsOf('a1')).toEqual([]);
  });

  it('reacts on an ask just as it does on a comment', () => {
    const { result } = withViewer();
    act(() => result.current.pickReaction('a1', '👀'));
    expect(result.current.reactionsOf('a1')).toEqual([
      {
        emoji: '👀',
        count: 1,
        reactedByViewer: true,
        actors: [{ id: 'ap', name: 'Ale P.' }],
      },
    ]);
  });

  it('withdraws the reaction when the same chip is toggled again', () => {
    const { result } = withViewer();
    act(() => result.current.pickReaction('c1', '🎉'));
    act(() => result.current.toggleReaction('c1', '🎉'));
    expect(result.current.reactionsOf('c1')).toEqual([]);
  });

  it('opens the picker for one item at a time', () => {
    const { result } = withViewer();
    expect(result.current.pickerOpenId).toBeNull();
    act(() => result.current.setPickerOpen('c1'));
    expect(result.current.pickerOpenId).toBe('c1');
    act(() => result.current.setPickerOpen('a1'));
    expect(result.current.pickerOpenId).toBe('a1');
    act(() => result.current.setPickerOpen(null));
    expect(result.current.pickerOpenId).toBeNull();
  });

  it('closes the picker once a reaction is picked', () => {
    const { result } = withViewer();
    act(() => result.current.setPickerOpen('c1'));
    act(() => result.current.pickReaction('c1', '🚀'));
    expect(result.current.pickerOpenId).toBeNull();
  });
});

describe('useActivityReactions — picking is add-only', () => {
  const withViewer = () =>
    renderHook(() => useActivityReactions({ items, viewer: VIEWER }));

  it('keeps the reaction when the viewer picks one they already gave', () => {
    const { result } = withViewer();
    act(() => result.current.pickReaction('c1', '🎉'));
    const after = result.current.reactionsOf('c1');

    act(() => result.current.pickReaction('c1', '🎉'));
    expect(result.current.reactionsOf('c1')).toEqual(after);
  });

  it('still closes the picker when the pick was a no-op', () => {
    const { result } = withViewer();
    act(() => result.current.pickReaction('c1', '🎉'));
    act(() => result.current.setPickerOpen('c1'));
    act(() => result.current.pickReaction('c1', '🎉'));
    expect(result.current.pickerOpenId).toBeNull();
  });

  it('leaves the chip as the only way to withdraw', () => {
    const { result } = withViewer();
    act(() => result.current.pickReaction('c1', '🎉'));
    act(() => result.current.toggleReaction('c1', '🎉'));
    expect(result.current.reactionsOf('c1')).toEqual([]);
  });
});
