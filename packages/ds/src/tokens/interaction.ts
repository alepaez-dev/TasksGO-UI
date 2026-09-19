import { colors } from './colors.ts';

const FOCUS_RING_WIDTH = '3px';

export const transitionDurations = {
  fast: '100ms',
  normal: '150ms',
  slow: '250ms',
  slower: '400ms',
} as const;

export type TransitionDuration = keyof typeof transitionDurations;

/**
 * Viewport queries for layouts that change shape, not just spacing.
 *
 * `stacked` is the phone treatment: components below it restack — and some
 * reorder their DOM, so the same query has to drive both the markup and the
 * styling or tab order stops tracking the layout.
 *
 * Note: several components still hand-write `@media (max-width: 480px)`. CSS
 * media queries cannot read a custom property, so those are not yet unified.
 */
export const breakpoints = {
  stacked: '(max-width: 480px)',
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const interaction = {
  transition: {
    duration: transitionDurations.normal,
    durations: transitionDurations,
    timingFunction: 'ease',
    property: 'background-color, color, border-color, opacity',
  },
  scrollbar: {
    width: '4px',
    trackColor: colors.scrollbar.track,
    thumbColor: colors.scrollbar.thumb,
  },
  focusRing: {
    width: FOCUS_RING_WIDTH,
    color: colors.focus.ring,
    style: `0 0 0 ${FOCUS_RING_WIDTH} ${colors.focus.ring}`,
  },
} as const;
