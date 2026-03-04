export const spacing = {
  layout: {
    sidebarWidth: '288px',
    headerHeight: '56px',
    contentMaxWidth: '1024px',
    contentPaddingX: '40px',
    contentPaddingY: '64px',
    sectionGap: '32px',
  },
  row: {
    paddingActive: '16px',
    paddingDone: '12px',
    gapInternal: '24px',
  },
  nav: {
    itemPaddingX: '12px',
    itemPaddingY: '8px',
    itemGap: '12px',
    listGap: '4px',
  },
  badge: {
    paddingX: '8px',
    paddingY: '2px',
  },
  ticketId: {
    paddingX: '6px',
    paddingY: '2px',
  },
  button: {
    paddingX: '12px',
    paddingY: '6px',
    gap: '8px',
  },
  columnWidths: {
    priority: '60px',
    ticketId: '80px',
    date: '60px',
  },
} as const;

export type SpacingGroup = keyof typeof spacing;
