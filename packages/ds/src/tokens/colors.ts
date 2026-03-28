const accent = {
  primary: '#4f6f8f',
  secondary: '#5e778f',
  warm: '#d6c583',
  subtle: '#d9d1b2',
  warmText: '#856D4A',
} as const;

const text = {
  primary: '#1a1a1a',
  secondary: '#636363',
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
  high: '#c2410c',
  medium: '#737373',
  low: '#737373',
  info: '#2563eb',
  active: '#22c55e',
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
      text: '#6b7280',
      border: badgeTodoBg,
    },
    default: {
      background: 'transparent',
      text: text.secondary,
      border: border.default,
    },
  },

  nav: {
    activeBg: surface.primary,
    activeText: text.primary,
    defaultText: text.secondary,
    hoverBg: surface.hover,
  },

  avatar: {
    background: text.primary,
    text: surface.primary,
    profileBackground: surface.secondary,
    profileText: text.primary,
    profileBorder: border.default,
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
    ghostText: text.primary,
    ghostHoverBg: surface.hover,
  },

  scrollbar,

  header: {
    background: 'rgba(255, 255, 255, 0.8)',
  },

  completedRow: {
    title: '#6b7280',
  },

  refLabel: {
    attachment: text.secondary,
    doc: accent.warmText,
    general: text.secondary,
  },

  searchInput: {
    border: border.default,
    focusBorder: accent.primary,
    icon: text.secondary,
    placeholder: text.disabled,
    clearText: text.secondary,
  },

  searchPalette: {
    groupHeader: text.secondary,
    refTask: accent.primary,
    refTicket: status.info,
    refDoc: accent.warmText,
  },

  breadcrumb: {
    text: text.secondary,
    separator: text.disabled,
    activeText: text.primary,
  },

  taskSection: {
    chevron: text.secondary,
  },

  sidebar: {
    background: surface.secondary,
    border: border.default,
  },

  floatingSearch: {
    background: surface.primary,
    border: border.default,
  },

  drawer: {
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  mobileSearchSheet: {
    overlay: 'rgba(0, 0, 0, 0.3)',
    footerBg: 'rgba(255, 255, 255, 0.95)',
    footerBorder: border.default,
    resultBorder: '#f3f4f6',
  },
} as const;

export type ColorGroup = keyof typeof colors;
