export const zIndex = {
  header: '30',
  dropdown: '40',
  floatingSearch: '40',
  overlay: '50',
} as const;

export type ZIndexToken = keyof typeof zIndex;
