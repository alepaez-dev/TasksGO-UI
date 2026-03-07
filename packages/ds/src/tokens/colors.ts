const accent = {
  primary: '#4f6f8f',
  secondary: '#5e778f',
  warm: '#d6c583',
  subtle: '#d9d1b2',
} as const;

const text = {
  primary: '#1a1a1a',
  secondary: '#737373',
  disabled: '#a3a3a3',
} as const;

const border = {
  default: '#f0f0f0',
} as const;

const surface = {
  primary: '#FFFFFF',
  secondary: '#F8F9FA',
  hover: '#eff1f3',
} as const;

const scrollbar = {
  track: 'transparent',
  thumb: '#e5e5e5',
} as const;

const status = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: 'rgba(115, 115, 115, 0.7)',
  low: text.disabled,
  info: '#2563eb',
} as const;

const badgeTodoBg = '#f3f4f6';

const focus = {
  ring: 'rgba(79, 111, 143, 0.2)',
} as const;

export const colors = {
  accent,

  surface,

  text,

  border,

  focus,

  status,

  badge: {
    progress: {
      background: '#eff6ff',
      text: status.info,
      border: '#dbeafe',
    },
    todo: {
      background: badgeTodoBg,
      text: '#4b5563',
      border: '#e5e7eb',
    },
    done: {
      background: '#f9fafb',
      text: '#9ca3af',
      border: badgeTodoBg,
    },
  },

  checkbox: {
    border: '#d1d5db',
    active: accent.primary,
    focusRing: focus.ring,
    completed: text.disabled,
  },

  ticketId: {
    text: '#374151',
    border: border.default,
    background: 'transparent',
  },

  button: {
    primaryBg: text.primary,
    primaryText: surface.primary,
    primaryHoverBg: '#333333',
    secondaryText: accent.primary,
    secondaryBorder: accent.primary,
    secondaryHoverBg: surface.hover,
  },

  scrollbar,

  header: {
    background: 'rgba(255, 255, 255, 0.8)',
  },

  completedRow: {
    title: 'rgba(156, 163, 175, 0.6)',
  },
} as const;

export type ColorGroup = keyof typeof colors;
