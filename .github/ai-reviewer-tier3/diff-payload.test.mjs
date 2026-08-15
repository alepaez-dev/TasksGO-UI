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

test('renderWholeFileBlock numbers every line so + line numbers still resolve', () => {
  const out = renderWholeFileBlock('const a = 1;\nconst b = 2;');
  assert.match(out, /^ {5}1: const a = 1;$/m);
  assert.match(out, /^ {5}2: const b = 2;$/m);
});

test('renderWholeFileBlock says why the patch was replaced, so the model does not re-read it', () => {
  const out = renderWholeFileBlock('const a = 1;');
  assert.match(out, /WHOLE FILE/);
  assert.match(out, /do not need to read it again/i);
});
