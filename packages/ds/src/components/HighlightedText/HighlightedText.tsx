import type { ReactNode } from 'react';
import { matchRanges, type MatchRange } from '../../utils/matchRanges';
import styles from './HighlightedText.module.css';

export interface HighlightedTextProps {
  text: string;
  query?: string;
  ranges?: readonly MatchRange[];
}

export function HighlightedText({
  text,
  query = '',
  ranges: given,
}: HighlightedTextProps) {
  const ranges = given ?? matchRanges(text, query);
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
