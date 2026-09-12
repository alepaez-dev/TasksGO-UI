import { describe, it, expect } from 'vitest';
import { isScriptScheme, sanitizeHref } from './sanitizeHref';

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

  it('blocks protocols with internal tab, newline, or carriage return', () => {
    expect(sanitizeHref('java\tscript:alert(1)')).toBe('#');
    expect(sanitizeHref('java\nscript:alert(1)')).toBe('#');
    expect(sanitizeHref('java\rscript:alert(1)')).toBe('#');
    expect(sanitizeHref('da\tta:text/html,test')).toBe('#');
  });

  it('blocks protocols with embedded null bytes', () => {
    expect(sanitizeHref('java\0script:alert(1)')).toBe('#');
  });

  it('blocks protocols with leading C0 control characters', () => {
    expect(sanitizeHref('\x01javascript:alert(1)')).toBe('#');
    expect(sanitizeHref('\x08javascript:alert(1)')).toBe('#');
    expect(sanitizeHref('\x1fjavascript:alert(1)')).toBe('#');
  });

  it('returns safe URLs unchanged (does not mutate consumer input)', () => {
    expect(sanitizeHref('  /dashboard  ')).toBe('  /dashboard  ');
    expect(sanitizeHref('/my path')).toBe('/my path');
    expect(sanitizeHref('/safe\x01path')).toBe('/safe\x01path');
  });
});

describe('isScriptScheme', () => {
  it('flags javascript: and vbscript:', () => {
    expect(isScriptScheme('javascript:alert(1)')).toBe(true);
    expect(isScriptScheme('JavaScript:void(0)')).toBe(true);
    expect(isScriptScheme('vbscript:MsgBox("xss")')).toBe(true);
  });

  it('flags script schemes obfuscated with C0 controls', () => {
    expect(isScriptScheme('  javascript:alert(1)')).toBe(true);
    expect(isScriptScheme('java\tscript:alert(1)')).toBe(true);
    expect(isScriptScheme('java\0script:alert(1)')).toBe(true);
    expect(isScriptScheme('\x1fjavascript:alert(1)')).toBe(true);
  });

  it('allows data:, blob:, http(s), and relative urls (legitimate downloads)', () => {
    expect(isScriptScheme('data:image/svg+xml;utf8,<svg/>')).toBe(false);
    expect(isScriptScheme('data:application/zip;base64,AAAA')).toBe(false);
    expect(isScriptScheme('blob:https://app.local/uuid')).toBe(false);
    expect(isScriptScheme('https://cdn.example/evidence.png')).toBe(false);
    expect(isScriptScheme('/api/files/123')).toBe(false);
  });
});
