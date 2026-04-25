export const zIndex = {
  header: '30',
  fab: '35',
  dropdown: '40',
  overlay: '50',
  floatingSearch: '60',
  modal: '70',
} as const;

export type ZIndexToken = keyof typeof zIndex;
