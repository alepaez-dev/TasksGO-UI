const BLOCKED_PROTOCOLS = /^(javascript|data|vbscript):/i;
// eslint-disable-next-line no-control-regex -- intentional: stripping C0 controls for URL sanitization
const C0_CONTROLS = /[\x00-\x1f]/g;

export function sanitizeHref(href: string): string {
  const normalized = href.replace(C0_CONTROLS, '').trim();
  return BLOCKED_PROTOCOLS.test(normalized) ? '#' : href;
}
