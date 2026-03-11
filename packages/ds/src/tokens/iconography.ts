export const iconography = {
  family: 'Material Symbols Outlined',
  fill: 1,
  weight: 300,
  grade: 0,
  opticalSize: 20,
  sizes: {
    sm: '14px',
    md: '20px',
  },
} as const;

export type IconSize = keyof typeof iconography.sizes;
