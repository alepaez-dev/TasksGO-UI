import type { ReactNode } from 'react';
import { parseSearchTerms } from '../../utils/searchTerms';
import styles from './HighlightedText.module.css';

export interface HighlightedTextProps {
  text: string;
  query?: string;
}

interface MatchRange {
  start: number;
  end: number;
}

function matchRanges(text: string, query: string): MatchRange[] {
  const terms = parseSearchTerms(query);
  if (terms.length === 0) return [];

  const lower = text.toLowerCase();
  const starts: number[] = [];
  const ends: number[] = [];
  let i = 0;
  for (const ch of text) {
    for (let k = 0; k < ch.toLowerCase().length; k += 1) {
      starts.push(i);
      ends.push(i + ch.length);
    }
    i += ch.length;
  }

  const found: MatchRange[] = [];
  for (const term of terms) {
    let at = lower.indexOf(term);
    while (at !== -1) {
      found.push({ start: starts[at], end: ends[at + term.length - 1] });
      at = lower.indexOf(term, at + 1);
    }
  }

  found.sort((a, b) => a.start - b.start || a.end - b.end);

  const merged: MatchRange[] = [];
  for (const range of found) {
    const last = merged[merged.length - 1];
    if (last !== undefined && range.start <= last.end) {
      last.end = Math.max(last.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }
  return merged;
}

export function HighlightedText({ text, query = '' }: HighlightedTextProps) {
  const ranges = matchRanges(text, query);
  if (ranges.length === 0) return <>{text}</>;

  const parts: ReactNode[] = [];
  let cursor = 0;
  ranges.forEach((range, i) => {
    if (range.start > cursor) parts.push(text.slice(cursor, range.start));
    parts.push(
      <mark key={i} className={styles.mark}>
        {text.slice(range.start, range.end)}
      </mark>,
    );
    cursor = range.end;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));

  return <>{parts}</>;
}
