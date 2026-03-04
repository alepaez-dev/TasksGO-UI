export const elevation = {
  none: 'none',
  nav: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  dropdown: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
} as const;

export type ElevationToken = keyof typeof elevation;
