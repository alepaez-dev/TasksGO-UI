import { matchRanges, type MatchRange } from '../matchRanges';
import { textRunLayout } from './textRuns';

export interface HighlightPlan {
  byNode: WeakMap<object, MatchRange[]>;
  byText: Map<string, MatchRange[]>;
}

function slice(
  global: readonly MatchRange[],
  start: number,
  length: number,
): MatchRange[] {
  const end = start + length;
  const local: MatchRange[] = [];
  for (const range of global) {
    const from = Math.max(range.start, start);
    const to = Math.min(range.end, end);
    if (from < to) local.push({ start: from - start, end: to - start });
  }
  return local;
}

export function buildHighlightPlan(
  source: string,
  query: string,
): { ast: unknown; plan: HighlightPlan } {
  const { runs, offsets, nodes, detached, joined, ast } = textRunLayout(source);
  const plan: HighlightPlan = { byNode: new WeakMap(), byText: new Map() };
  if (query === '') return { ast, plan };

  const global = matchRanges(joined, query);
  runs.forEach((text, index) => {
    const local = slice(global, offsets[index], text.length);
    if (local.length > 0) plan.byNode.set(nodes[index], local);
  });
  for (const run of detached) {
    const local = slice(global, run.offset, run.text.length);
    if (local.length > 0) plan.byText.set(run.text, local);
  }
  return { ast, plan };
}
