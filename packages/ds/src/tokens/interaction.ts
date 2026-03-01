import { colors } from './colors';

const FOCUS_RING_WIDTH = '3px';

export const interaction = {
  transition: {
    duration: '150ms',
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
