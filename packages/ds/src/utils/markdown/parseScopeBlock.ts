export interface ScopeBlockData {
  included: readonly string[];
  excluded: readonly string[];
}

type ScopeSection = 'included' | 'excluded';

const HEADER = /^(included|excluded)\s*:?\s*$/i;
const LIST_MARKER = /^[-*+]\s+/;

export function parseScopeBlock(source: string): ScopeBlockData {
  const included: string[] = [];
  const excluded: string[] = [];
  let current: ScopeSection | null = null;

  for (const raw of source.split('\n')) {
    const line = raw.trim();
    if (line === '') continue;

    const header = HEADER.exec(line);
    if (header) {
      current = header[1].toLowerCase() as ScopeSection;
      continue;
    }

    if (current === null) continue;
    const item = line.replace(LIST_MARKER, '');
    if (item === '') continue;
    (current === 'included' ? included : excluded).push(item);
  }

  return { included, excluded };
}

export function parseScopeFence(
  lang: string | undefined,
  text: string,
): ScopeBlockData | null {
  if (lang !== 'scope') return null;
  const scope = parseScopeBlock(text);
  if (scope.included.length === 0 && scope.excluded.length === 0) return null;
  return scope;
}

export function isScopeBlock(lang: string | undefined, text: string): boolean {
  return parseScopeFence(lang, text) !== null;
}
