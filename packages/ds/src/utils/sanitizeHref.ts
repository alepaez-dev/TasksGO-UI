const BLOCKED_PROTOCOLS = /^(javascript|data|vbscript):/i;
const SCRIPT_SCHEMES = /^(javascript|vbscript):/i;
// eslint-disable-next-line no-control-regex -- intentional: stripping C0 controls for URL sanitization
const C0_CONTROLS = /[\x00-\x1f]/g;

function normalize(href: string): string {
  return href.replace(C0_CONTROLS, '').trim();
}

export function sanitizeHref(href: string): string {
  return BLOCKED_PROTOCOLS.test(normalize(href)) ? '#' : href;
}

/** For download/attachment sinks, where data: and blob: are legitimate. */
export function isScriptScheme(href: string): boolean {
  return SCRIPT_SCHEMES.test(normalize(href));
}
