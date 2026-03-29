export const iconography = {
  sizes: {
    sm: '14px',
    md: '20px',
    lg: '24px',
  },
} as const;

export type IconSize = keyof typeof iconography.sizes;
