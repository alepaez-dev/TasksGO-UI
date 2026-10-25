export const GLYPH_SIZE = 18;
export const GLYPH_CENTER = GLYPH_SIZE / 2;
const PIE_RADIUS = 4.5;

export function piePath(fraction: number): string {
  const angle = fraction * 2 * Math.PI;
  const x = GLYPH_CENTER + PIE_RADIUS * Math.sin(angle);
  const y = GLYPH_CENTER - PIE_RADIUS * Math.cos(angle);
  const largeArc = fraction > 0.5 ? 1 : 0;
  return `M${GLYPH_CENTER} ${GLYPH_CENTER}V${GLYPH_CENTER - PIE_RADIUS}A${PIE_RADIUS} ${PIE_RADIUS} 0 ${largeArc} 1 ${x.toFixed(2)} ${y.toFixed(2)}Z`;
}
