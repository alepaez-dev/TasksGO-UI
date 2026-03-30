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
    minWidth: '3.5em',
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
  dropdown: {
    inset: '6px',
    optionPaddingY: '12px',
    endWidth: '320px',
  },
  header: {
    gap: '48px',
    searchMaxWidth: '320px',
  },
  sidebar: {
    paddingX: '16px',
    paddingY: '24px',
    sectionGap: '24px',
  },
  floatingSearch: {
    maxWidth: '448px',
    height: '48px',
    paddingX: '16px',
    bottomOffset: '32px',
  },
  iconButton: {
    smSize: '24px',
    mdSize: '32px',
  },
  mobileSearchSheet: {
    height: '55vh',
    topRadius: '24px',
    resultPaddingX: '24px',
    resultPaddingY: '12px',
    groupHeaderPaddingX: '24px',
    groupHeaderPaddingY: '8px',
  },
  drawer: {
    closeButtonInset: '12px',
    width: '480px',
  },
  taskDrawer: {
    paddingX: '32px',
    paddingY: '24px',
    bodyPaddingY: '32px',
    bodyGap: '24px',
    fieldGap: '8px',
    sectionMarginTop: '16px',
    textareaMinHeight: '120px',
    textareaLineHeight: '1.6',
  },
  columnWidths: {
    priority: '80px',
    ticketId: '100px',
    date: '80px',
  },
} as const;

export type SpacingGroup = keyof typeof spacing;
