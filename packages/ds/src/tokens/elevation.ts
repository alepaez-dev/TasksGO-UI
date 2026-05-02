export const elevation = {
  none: 'none',
  nav: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  dropdown: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
  floatingSearch: '0 25px 50px -12px rgba(0, 0, 0, 0.05)',
  drawer: '4px 0 24px rgba(0, 0, 0, 0.12)',
  fab: '0 4px 16px rgba(0, 0, 0, 0.18)',
  bottomSheet: '0 -8px 24px rgba(0, 0, 0, 0.12)',
} as const;

export type ElevationToken = keyof typeof elevation;
