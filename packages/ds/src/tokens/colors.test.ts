import { describe, it, expect } from 'vitest';
import { colors } from './colors';

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Avatar initials are 9-13px, so WCAG AA large-text (3:1) never applies.
const AA_NORMAL_TEXT = 4.5;

describe('avatarTone palette', () => {
  it('draws profile initials in dark and project initials in white', () => {
    expect(colors.avatar.profileText).toBe(colors.text.primary);
    expect(colors.avatar.text).toBe(colors.surface.primary);
  });

  it.each(Object.entries(colors.avatarTone.profile))(
    'profile tone %s meets AA against the dark initials',
    (_name, tint) => {
      expect(contrast(tint, colors.avatar.profileText)).toBeGreaterThanOrEqual(
        AA_NORMAL_TEXT,
      );
    },
  );

  it.each(Object.entries(colors.avatarTone.project))(
    'project tone %s meets AA against the white initials',
    (_name, tint) => {
      expect(contrast(tint, colors.avatar.text)).toBeGreaterThanOrEqual(
        AA_NORMAL_TEXT,
      );
    },
  );

  it('keeps the two groups disjoint so a tone cannot be used on the wrong variant', () => {
    const profile: string[] = Object.values(colors.avatarTone.profile);
    const project: string[] = Object.values(colors.avatarTone.project);
    expect(profile.filter((tint) => project.includes(tint))).toEqual([]);
  });
});
