import { colors } from './colors.ts';

const FOCUS_RING_WIDTH = '3px';

export const transitionDurations = {
  fast: '100ms',
  normal: '150ms',
  slow: '250ms',
  slower: '400ms',
} as const;

export type TransitionDuration = keyof typeof transitionDurations;

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
