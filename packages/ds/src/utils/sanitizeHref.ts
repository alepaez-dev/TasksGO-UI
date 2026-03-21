const BLOCKED_PROTOCOLS = /^(javascript|data|vbscript):/i;
// \0 covers null-byte bypass in older browsers
const WHITESPACE_CHARS = /[\t\n\r\0]/g;

export function sanitizeHref(href: string): string {
  const normalized = href.replace(WHITESPACE_CHARS, '').trim();
  return BLOCKED_PROTOCOLS.test(normalized) ? '#' : href;
}
