import { describe, expect, it } from 'vitest';
import { readableTextOn } from './readableTextOn';

describe('readableTextOn', () => {
  it('picks light text on the dark tints used for profile avatars', () => {
    expect(readableTextOn('#4F6F8F')).toBe('light');
    expect(readableTextOn('#856D4A')).toBe('light');
    expect(readableTextOn('#7560C2')).toBe('light');
  });

  it('picks dark text on the light avatarTone palette', () => {
    expect(readableTextOn('#7D9B84')).toBe('dark');
    expect(readableTextOn('#C38E70')).toBe('dark');
    expect(readableTextOn('#6C89A8')).toBe('dark');
    expect(readableTextOn('#887DA9')).toBe('dark');
  });

  it('picks dark text on a pale surface', () => {
    expect(readableTextOn('#e5e7eb')).toBe('dark');
    expect(readableTextOn('#ffffff')).toBe('dark');
  });

  it('picks light text on black', () => {
    expect(readableTextOn('#000000')).toBe('light');
  });

  it('accepts three-digit hex', () => {
    expect(readableTextOn('#000')).toBe('light');
    expect(readableTextOn('#fff')).toBe('dark');
  });

  it('accepts rgb() notation', () => {
    expect(readableTextOn('rgb(79, 111, 143)')).toBe('light');
    expect(readableTextOn('rgb(229, 231, 235)')).toBe('dark');
  });

  it('returns null when the colour cannot be parsed, so callers keep their default', () => {
    expect(readableTextOn('rebeccapurple')).toBeNull();
    expect(
      readableTextOn('var(--ds-color-avatar-tone-project-ocean)'),
    ).toBeNull();
    expect(readableTextOn('')).toBeNull();
  });
});
