export const zIndex = {
  header: '30',
  dropdown: '40',
  overlay: '50',
  floatingSearch: '60',
} as const;

export type ZIndexToken = keyof typeof zIndex;
