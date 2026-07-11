import styles from './Scratchpad.module.css';

export const BADGE_TOKENS = {
  task: { label: 'TASK', className: styles.tokenTask },
  qa: { label: 'QA', className: styles.tokenQa },
} satisfies Record<string, { label: string; className: string }>;

export type TokenKey = keyof typeof BADGE_TOKENS;

export const TOKEN_PATTERN = new RegExp(
  `\\[(${Object.keys(BADGE_TOKENS).join('|')})\\]`,
  'gi',
);

export type LineSegment =
  | { type: 'text'; key: string; value: string }
  | { type: 'token'; id: string; tokenKey: TokenKey };

export function splitLineTokens(lineId: string, text: string): LineSegment[] {
  const segments: LineSegment[] = [];
  let last = 0;
  let tokenIndex = 0;
  let textIndex = 0;
  for (const match of text.matchAll(TOKEN_PATTERN)) {
    const start = match.index ?? 0;
    if (start > last) {
      segments.push({
        type: 'text',
        key: `${lineId}:t${textIndex++}`,
        value: text.slice(last, start),
      });
    }
    segments.push({
      type: 'token',
      id: `${lineId}#${tokenIndex++}`,
      tokenKey: match[1].toLowerCase() as TokenKey,
    });
    last = start + match[0].length;
  }
  if (last < text.length) {
    segments.push({
      type: 'text',
      key: `${lineId}:t${textIndex++}`,
      value: text.slice(last),
    });
  }
  return segments;
}
