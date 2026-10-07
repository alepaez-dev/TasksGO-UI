import { matchRanges, sliceRanges, type MatchRange } from '../matchRanges';
import { textRunLayout } from './textRuns';

export interface HighlightPlan {
  byNode: WeakMap<object, MatchRange[]>;
  byText: Map<string, MatchRange[]>;
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
    const local = sliceRanges(global, offsets[index], text.length);
    if (local.length > 0) plan.byNode.set(nodes[index], local);
  });
  for (const run of detached) {
    const local = sliceRanges(global, run.offset, run.text.length);
    if (local.length > 0) plan.byText.set(run.text, local);
  }
  return { ast, plan };
}
