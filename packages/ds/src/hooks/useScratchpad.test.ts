import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScratchpad } from './useScratchpad';
import type { ScratchpadLine } from '../components/Scratchpad';

const initial: readonly ScratchpadLine[] = [
  { id: 'a', text: '# Heading' },
  { id: 'b', text: '[ ] Task' },
  { id: 'c', text: 'Note' },
];

describe('useScratchpad', () => {
  it('starts with the provided lines', () => {
    const { result } = renderHook(() => useScratchpad(initial));
    expect(result.current.lines.map((l) => l.id)).toEqual(['a', 'b', 'c']);
  });

  it('updates a line text', () => {
    const { result } = renderHook(() => useScratchpad(initial));
    act(() => result.current.onLineTextChange('a', '# New heading'));
    expect(result.current.lines[0].text).toBe('# New heading');
  });

  it('toggles a todo line by rewriting its marker', () => {
    const { result } = renderHook(() => useScratchpad(initial));
    act(() => result.current.onLineToggle('b'));
    expect(result.current.lines.find((l) => l.id === 'b')?.text).toBe(
      '[x] Task',
    );
  });

  it('inserts a new empty line after the given id and focuses it', () => {
    const { result } = renderHook(() => useScratchpad(initial));
    act(() => result.current.onAddLine('a'));
    const ids = result.current.lines.map((l) => l.id);
    expect(ids).toHaveLength(4);
    expect(ids[1]).toBe(result.current.autoFocusLineId);
    expect(result.current.lines[1].text).toBe('');
  });

  it('deletes the edited line and moves edit and focus to the previous one', () => {
    const { result } = renderHook(() => useScratchpad(initial));
    act(() => result.current.onLineStartEdit('b'));
    act(() => result.current.onLineDelete('b'));
    expect(result.current.lines.map((l) => l.id)).toEqual(['a', 'c']);
    expect(result.current.autoFocusLineId).toBe('a');
    expect(result.current.editingLineId).toBe('a');
  });

  it('clears edit and focus when deleting the edited first line', () => {
    const { result } = renderHook(() => useScratchpad(initial));
    act(() => result.current.onLineStartEdit('a'));
    act(() => result.current.onLineDelete('a'));
    expect(result.current.autoFocusLineId).toBeNull();
    expect(result.current.editingLineId).toBeNull();
  });

  it('leaves edit and focus untouched when deleting a line that is not being edited', () => {
    const { result } = renderHook(() => useScratchpad(initial));
    act(() => result.current.onLineStartEdit('c'));
    act(() => result.current.onLineDelete('a'));
    expect(result.current.lines.map((l) => l.id)).toEqual(['b', 'c']);
    expect(result.current.autoFocusLineId).toBe('c');
    expect(result.current.editingLineId).toBe('c');
  });

  it('reorders lines', () => {
    const { result } = renderHook(() => useScratchpad(initial));
    act(() => result.current.onReorder([initial[2], initial[0], initial[1]]));
    expect(result.current.lines.map((l) => l.id)).toEqual(['c', 'a', 'b']);
  });

  it('opens a badge popover immediately', () => {
    const { result } = renderHook(() => useScratchpad(initial));
    act(() => result.current.onBadgeOpenChange('c#0'));
    expect(result.current.openBadgeId).toBe('c#0');
  });

  it('delays closing a badge popover so the pointer can reach the card', () => {
    vi.useFakeTimers();
    try {
      const { result } = renderHook(() => useScratchpad(initial));
      act(() => result.current.onBadgeOpenChange('c#0'));
      act(() => result.current.onBadgeOpenChange(null));
      // still open right after leaving the chip
      expect(result.current.openBadgeId).toBe('c#0');
      // re-entering (the card) cancels the pending close
      act(() => result.current.onBadgeOpenChange('c#0'));
      act(() => vi.advanceTimersByTime(300));
      expect(result.current.openBadgeId).toBe('c#0');
      // leaving for good closes after the delay
      act(() => result.current.onBadgeOpenChange(null));
      act(() => vi.advanceTimersByTime(300));
      expect(result.current.openBadgeId).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('sets the editing line on start edit', () => {
    const { result } = renderHook(() => useScratchpad(initial));
    act(() => result.current.onLineStartEdit('b'));
    expect(result.current.editingLineId).toBe('b');
    expect(result.current.autoFocusLineId).toBe('b');
  });

  it('clears the editing line on stop edit only for the matching line', () => {
    const { result } = renderHook(() => useScratchpad(initial));
    act(() => result.current.onLineStartEdit('b'));
    act(() => result.current.onLineStopEdit('a'));
    expect(result.current.editingLineId).toBe('b');
    act(() => result.current.onLineStopEdit('b'));
    expect(result.current.editingLineId).toBeNull();
  });

  it('marks a newly added line as the editing line', () => {
    const { result } = renderHook(() => useScratchpad(initial));
    act(() => result.current.onAddLine('a'));
    expect(result.current.editingLineId).toBe(result.current.lines[1].id);
  });
});
