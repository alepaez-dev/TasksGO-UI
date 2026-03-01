export const elevation = {
  none: 'none',
  nav: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  dropdown: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
  headerBlur: 'blur(12px)',
  headerBg: 'rgba(255, 255, 255, 0.8)',
} as const;

export type ElevationToken = keyof typeof elevation;
