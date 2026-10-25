import { describe, it, expect } from 'vitest';
import { piePath } from './piePath';

describe('piePath', () => {
  it("draws a quarter from 12 o'clock to 3 o'clock", () => {
    expect(piePath(0.25)).toBe('M9 9V4.5A4.5 4.5 0 0 1 13.50 9.00Z');
  });

  it('keeps the small-arc flag at exactly half', () => {
    expect(piePath(0.5)).toBe('M9 9V4.5A4.5 4.5 0 0 1 9.00 13.50Z');
  });

  it('sets the large-arc flag above half', () => {
    expect(piePath(0.75)).toBe('M9 9V4.5A4.5 4.5 0 1 1 4.50 9.00Z');
    expect(piePath(0.9)).toBe('M9 9V4.5A4.5 4.5 0 1 1 6.35 5.36Z');
  });
});
