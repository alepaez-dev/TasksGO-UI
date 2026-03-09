export const fontFamilies = {
  sans: "'Inter', sans-serif",
  mono: "'IBM Plex Mono', monospace",
} as const;

export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export interface TypographyScale {
  fontSize: string;
  fontFamily: string;
  fontWeight: number;
  letterSpacing: string;
  textTransform: string;
  lineHeight: string;
  textDecoration?: string;
}

const DEFAULT_LINE_HEIGHT = '1.4';

const metadataBase = {
  fontSize: '11px',
  fontFamily: fontFamilies.mono,
  letterSpacing: 'normal',
  textTransform: 'none',
  lineHeight: DEFAULT_LINE_HEIGHT,
};

const taskTitleBase = {
  fontSize: '14px',
  fontFamily: fontFamilies.sans,
  letterSpacing: 'normal',
  textTransform: 'none',
  lineHeight: '1.35',
};

const buttonInputBase = {
  fontSize: '12px',
  fontFamily: fontFamilies.sans,
  letterSpacing: 'normal',
  textTransform: 'none',
  lineHeight: DEFAULT_LINE_HEIGHT,
};

export const typographyScale = {
  sectionHeader: {
    fontSize: '10px',
    fontFamily: fontFamilies.mono,
    fontWeight: fontWeights.extrabold,
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    lineHeight: DEFAULT_LINE_HEIGHT,
  },
  microLabel: {
    fontSize: '9px',
    fontFamily: fontFamilies.mono,
    fontWeight: fontWeights.bold,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    lineHeight: DEFAULT_LINE_HEIGHT,
  },
  microMeta: {
    fontSize: '9px',
    fontFamily: fontFamilies.mono,
    fontWeight: fontWeights.regular,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    lineHeight: DEFAULT_LINE_HEIGHT,
  },
  breadcrumb: {
    fontSize: '10px',
    fontFamily: fontFamilies.mono,
    fontWeight: fontWeights.regular,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    lineHeight: DEFAULT_LINE_HEIGHT,
  },
  pageTitle: {
    fontSize: '20px',
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.semibold,
    letterSpacing: '-0.025em',
    textTransform: 'none',
    lineHeight: '1.25',
  },
  taskTitle: {
    ...taskTitleBase,
    fontWeight: fontWeights.medium,
  },
  taskTitleDone: {
    ...taskTitleBase,
    fontWeight: fontWeights.regular,
    textDecoration: 'line-through',
  },
  navLabel: {
    fontSize: '14px',
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.regular,
    letterSpacing: 'normal',
    textTransform: 'none',
    lineHeight: DEFAULT_LINE_HEIGHT,
  },
  metadata: {
    ...metadataBase,
    fontWeight: fontWeights.regular,
  },
  metadataUrgent: {
    ...metadataBase,
    fontWeight: fontWeights.bold,
  },
  ticketId: {
    fontSize: '10px',
    fontFamily: fontFamilies.mono,
    fontWeight: fontWeights.medium,
    letterSpacing: 'normal',
    textTransform: 'none',
    lineHeight: DEFAULT_LINE_HEIGHT,
  },
  priorityLabel: {
    fontSize: '10px',
    fontFamily: fontFamilies.mono,
    fontWeight: fontWeights.medium,
    letterSpacing: 'normal',
    textTransform: 'uppercase',
    lineHeight: DEFAULT_LINE_HEIGHT,
  },
  badgeLabel: {
    fontSize: '9px',
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.medium,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    lineHeight: DEFAULT_LINE_HEIGHT,
  },
  buttonLabel: {
    ...buttonInputBase,
    fontSize: '14px',
    fontWeight: fontWeights.bold,
  },
  buttonLabelSm: {
    ...buttonInputBase,
    fontWeight: fontWeights.medium,
  },
  searchInput: {
    ...buttonInputBase,
    fontWeight: fontWeights.regular,
  },
  searchPlaceholder: {
    fontSize: '9px',
    fontFamily: fontFamilies.mono,
    fontWeight: fontWeights.bold,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    lineHeight: DEFAULT_LINE_HEIGHT,
  },
  refLabel: {
    fontSize: '10px',
    fontFamily: fontFamilies.mono,
    fontWeight: fontWeights.medium,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    lineHeight: DEFAULT_LINE_HEIGHT,
  },
} as const satisfies Record<string, TypographyScale>;

export type TypographyScaleName = keyof typeof typographyScale;
export type FontFamily = keyof typeof fontFamilies;
export type FontWeight = keyof typeof fontWeights;
