import { test } from 'node:test';
import assert from 'node:assert/strict';
import { changedRatio, deletedLinesByHeadLine, renderWholeFileBlock } from './diff-payload.mjs';

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

test('deletedLinesByHeadLine anchors each removed line to the head line it preceded', () => {
  const patch = [
    '@@ -1,4 +1,4 @@',
    ' const a = 1;',
    '-const gone = true;',
    '+const added = true;',
    ' const b = 2;',
  ].join('\n');
  const dels = deletedLinesByHeadLine(patch);
  assert.deepEqual([...dels.keys()], [2], 'the removal sat before head line 2');
  assert.deepEqual(dels.get(2), ['const gone = true;']);
});

test('a whole-file block shows removed lines in position, not just a count', () => {
  const patch = ['@@ -1,3 +1,3 @@', ' keep;', '-await cleanup();', '+replaced();'].join('\n');
  const out = renderWholeFileBlock('keep;\nreplaced();', new Set([2]), deletedLinesByHeadLine(patch));
  const body = out.split('\n').slice(1);
  assert.deepEqual(body, ['       1  keep;', '-         await cleanup();', '+      2  replaced();']);
});

test('a file with no deletions renders exactly as before', () => {
  const withMap = renderWholeFileBlock('a;\nb;', new Set([2]), deletedLinesByHeadLine('@@ -1,1 +1,2 @@\n a;\n+b;'));
  const without = renderWholeFileBlock('a;\nb;', new Set([2]));
  assert.equal(withMap, without);
});

test('the NOTE tells the model what a - line means', () => {
  const out = renderWholeFileBlock('a;', new Set(), new Map([[1, ['old();']]]));
  assert.match(out, /REMOVED, shown where they used to be/);
});

// The cap that matters is on the RENDERED block: head bytes are not what gets sent. A 34KB head file
// on PR #221 renders to a 50KB block once gutter markers and re-inserted deletions are added.
test('the rendered block is materially larger than the head file it came from', () => {
  const head = Array.from({ length: 400 }, (_, i) => `const v${i} = ${i};`).join('\n');
  const commentable = new Set(Array.from({ length: 200 }, (_, i) => i + 1));
  const deletions = new Map([[10, ['await cleanup();', 'guard();']]]);
  const block = renderWholeFileBlock(head, commentable, deletions);
  assert.ok(block.length > head.length * 1.2, `block ${block.length} vs head ${head.length} — the gutter is not free`);
});
