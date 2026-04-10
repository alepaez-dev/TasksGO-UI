export const effects = {
  blur: 'blur(12px)',
  fadedOpacity: '0.6',
  mutedOpacity: '0.4',
  disabledOpacity: '0.5',
  desaturate: 'grayscale(1)',
  completedSaturate: 'saturate(0.3)',
} as const;

export type EffectToken = keyof typeof effects;
