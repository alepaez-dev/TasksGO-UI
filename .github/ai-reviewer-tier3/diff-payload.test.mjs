import { test } from 'node:test';
import assert from 'node:assert/strict';
import { changedRatio, renderWholeFileBlock } from './diff-payload.mjs';

test('changedRatio measures changed lines against the head file length', () => {
  // TicketOverviewMobile.stories.tsx on PR #221: +385/-125 in a 951-line file.
  assert.ok(Math.abs(changedRatio(385, 125, 951) - 0.536) < 0.001);
});

test('changedRatio is 0 for an unknown head length rather than Infinity', () => {
  assert.equal(changedRatio(10, 5, 0), 0);
});

test('renderWholeFileBlock marks added lines exactly as annotatePatch does', () => {
  const out = renderWholeFileBlock('const a = 1;\nconst b = 2;', new Set([2]));
  // Same fixed 8-column gutter annotatePatch uses: marker + padStart(6), then a two-space gap.
  assert.match(out, /^ {7}1 {2}const a = 1;$/m, 'an unchanged line is context — no marker');
  assert.match(out, /^\+ {6}2 {2}const b = 2;$/m, 'a commentable line carries the + marker');
});

test('renderWholeFileBlock marks every commentable line and no other', () => {
  const src = Array.from({ length: 8 }, (_, i) => `line ${i + 1}`).join('\n');
  const commentable = new Set([2, 5, 8]);
  const marked = new Set(
    renderWholeFileBlock(src, commentable)
      .split('\n')
      .filter((l) => /^\+\s+\d+\s{2}/.test(l))
      .map((l) => Number(l.match(/^\+\s+(\d+)/)[1])),
  );
  assert.deepEqual([...marked].sort((a, b) => a - b), [...commentable].sort((a, b) => a - b));
});

test('renderWholeFileBlock tells the model what the + marker means for anchoring', () => {
  const out = renderWholeFileBlock('const a = 1;', new Set([1]));
  assert.match(out, /ONLY\s+lines an inline finding can be anchored to/);
});

test('renderWholeFileBlock says why the patch was replaced, so the model does not re-read it', () => {
  const out = renderWholeFileBlock('const a = 1;');
  assert.match(out, /WHOLE FILE/);
  assert.match(out, /do not need to read it again/i);
});
