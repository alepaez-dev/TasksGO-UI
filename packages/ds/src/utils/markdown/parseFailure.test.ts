import { describe, it, expect, vi } from 'vitest';

vi.mock('markdown-to-jsx', async (importOriginal) => ({
  ...(await importOriginal<typeof import('markdown-to-jsx')>()),
  parser: () => {
    throw new Error('parse failed');
  },
}));

const { plainText } = await import('./plainText');
const { textRuns, textRunLayout } = await import('./textRuns');

const SOURCE = 'QA **needs** a number';

describe('when the parser throws', () => {
  it('indexes the raw source so the body stays searchable', () => {
    expect(plainText(SOURCE)).toBe(SOURCE);
  });

  it('yields the whole source as one run so it still renders', () => {
    expect(textRuns(SOURCE)).toEqual([SOURCE]);
  });

  it('reports no nodes, so nothing is keyed for highlighting', () => {
    const layout = textRunLayout(SOURCE);
    expect(layout.nodes).toEqual([]);
    expect(layout.joined).toBe(SOURCE);
    expect(layout.offsets).toEqual([0]);
  });
});
