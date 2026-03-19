import { describe, it, expect } from 'vitest';
import { sanitizeHref } from './sanitizeHref';

describe('sanitizeHref', () => {
  it('allows normal URLs', () => {
    expect(sanitizeHref('/dashboard')).toBe('/dashboard');
    expect(sanitizeHref('https://example.com')).toBe('https://example.com');
    expect(sanitizeHref('#section')).toBe('#section');
  });

  it('blocks javascript: protocol', () => {
    expect(sanitizeHref('javascript:alert(1)')).toBe('#');
    expect(sanitizeHref('JavaScript:alert(1)')).toBe('#');
    expect(sanitizeHref('JAVASCRIPT:void(0)')).toBe('#');
  });

  it('blocks data: protocol', () => {
    expect(sanitizeHref('data:text/html,<script>alert(1)</script>')).toBe('#');
  });

  it('blocks vbscript: protocol', () => {
    expect(sanitizeHref('vbscript:MsgBox("xss")')).toBe('#');
  });

  it('blocks protocols with leading whitespace', () => {
    expect(sanitizeHref('  javascript:alert(1)')).toBe('#');
    expect(sanitizeHref('\tdata:text/html,test')).toBe('#');
  });
});
