export const iconography = {
  family: 'Material Symbols Outlined',
  fill: 0,
  weight: 200,
  grade: 0,
  opticalSize: 20,
  sizes: {
    default: '20px',
    compact: '14px',
    micro: '12px',
  },
} as const;

export type IconSize = keyof typeof iconography.sizes;
