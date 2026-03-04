export const effects = {
  headerBlur: 'blur(12px)',
  badgeDoneOpacity: '0.6',
  completedRowMetaOpacity: '0.4',
  completedRowMetaFilter: 'grayscale(1)',
} as const;

export type EffectToken = keyof typeof effects;
