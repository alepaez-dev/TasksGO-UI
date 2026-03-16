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
    smPaddingY: '6px',
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
    smPaddingX: '12px',
    smPaddingY: '6px',
    mdPaddingX: '16px',
    mdPaddingY: '8px',
    gap: '8px',
    groupGap: '12px',
  },
  avatar: {
    size: '28px',
  },
  statusDot: {
    size: '6px',
  },
  checkbox: {
    size: '16px',
  },
  scale: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  breadcrumb: {
    gap: '8px',
  },
  searchInput: {
    paddingX: '12px',
    paddingY: '8px',
    iconGap: '8px',
  },
  taskSection: {
    headerGap: '8px',
    contentPaddingTop: '12px',
  },
  columnWidths: {
    priority: '60px',
    ticketId: '80px',
    date: '60px',
  },
} as const;

export type SpacingGroup = keyof typeof spacing;
