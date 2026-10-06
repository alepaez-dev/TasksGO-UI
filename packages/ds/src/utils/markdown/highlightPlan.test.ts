import { describe, it, expect } from 'vitest';
import { type MarkdownToJSX } from 'markdown-to-jsx';
import { buildHighlightPlan } from './highlightPlan';
import { isTextRunNode } from './textRuns';

function textNodesOf(ast: unknown): object[] {
  const out: object[] = [];
  const walk = (n: unknown): void => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (n === null || typeof n !== 'object') return;
    const t = n as Record<string, unknown> & { type?: number };
    if (t.type !== undefined && isTextRunNode(n as MarkdownToJSX.ASTNode)) {
      out.push(t);
      return;
    }
    for (const k of ['children', 'content']) if (t[k] !== undefined) walk(t[k]);
    for (const k of ['items', 'header', 'cells']) {
      const rows = t[k];
      if (Array.isArray(rows)) rows.forEach(walk);
    }
  };
  walk(ast);
  return out;
}

function rangesPerRun(source: string, query: string) {
  const { ast, plan } = buildHighlightPlan(source, query);
  const nodes = textNodesOf(ast);
  return {
    runs: nodes.map((n) => (n as { text?: string }).text ?? ''),
    byIdentity: nodes.map((node) => plan.byNode.get(node) ?? []),
    nodes,
    plan,
  };
}

describe('buildHighlightPlan', () => {
  it('marks nothing when there is no query', () => {
    const { byIdentity } = rangesPerRun('edge-**cache** here', '');
    expect(byIdentity).toEqual([[], [], []]);
  });

  it('splits a match that spans two inline runs', () => {
    const { runs, byIdentity } = rangesPerRun(
      'edge-**cache** here',
      'edge-cache',
    );
    expect(runs).toEqual(['edge-', 'cache', ' here']);
    expect(byIdentity).toEqual([
      [{ start: 0, end: 5 }],
      [{ start: 0, end: 5 }],
      [],
    ]);
  });

  it('refuses a match that would span a block boundary', () => {
    expect(rangesPerRun('- one\n- two', 'onet').byIdentity).toEqual([[], []]);
    expect(rangesPerRun('foo\n\nbar', 'oob').byIdentity).toEqual([[], []]);
  });

  it('marks within a block either side of a boundary', () => {
    expect(rangesPerRun('foo\n\nbar', 'foo bar').byIdentity).toEqual([
      [{ start: 0, end: 3 }],
      [{ start: 0, end: 3 }],
    ]);
  });

  it('marks only the covered slice of a run', () => {
    expect(rangesPerRun('edge-**cache** here', 'dge-cac').byIdentity).toEqual([
      [{ start: 1, end: 5 }],
      [{ start: 0, end: 3 }],
      [],
    ]);
  });

  it('keys the plan by node identity, so a re-parse does not match', () => {
    const source = 'QA **needs** a number';
    const { nodes, plan } = rangesPerRun(source, 'needs');
    const needsNode = nodes.find(
      (n) => (n as { text?: string }).text === 'needs',
    );
    expect(plan.byNode.get(needsNode as object)).toEqual([
      { start: 0, end: 5 },
    ]);

    const reparsed = buildHighlightPlan(source, 'needs');
    expect(reparsed.plan.byNode.get(needsNode as object)).toBeUndefined();
  });
});
