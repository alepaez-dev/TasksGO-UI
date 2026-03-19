const BLOCKED_PROTOCOLS = /^(javascript|data|vbscript):/i;

export function sanitizeHref(href: string): string {
  return BLOCKED_PROTOCOLS.test(href.trim()) ? '#' : href;
}
