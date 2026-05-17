export const iconography = {
  sizes: {
    xs: '12px',
    sm: '14px',
    md: '20px',
    lg: '24px',
  },
} as const;

export type IconSize = keyof typeof iconography.sizes;
