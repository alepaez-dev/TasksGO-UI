import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderClearedConcerns, renderStatusBody, extractClearedBlock } from '../ai-reviewer/review.mjs';
import { TOOL_DEFS } from './tools.mjs';
import { buildClearedConcerns } from './review-agent.mjs';

const sample = [
  { title: 'Shared ref nulled on row switch', why: 'React runs all ref detaches before attaches.', anchor: 'Scratchpad.tsx:401' },
];

test('renderClearedConcerns renders a collapsed details block with sanitized bullets', () => {
  const out = renderClearedConcerns(sample);
  assert.match(out, /^<details>/);
  assert.match(out, /<summary>🔍 Considered and cleared \(1\)<\/summary>/);
  assert.match(out, /- \*\*Shared ref nulled on row switch\*\* — React runs all ref detaches before attaches\. `Scratchpad\.tsx:401`/);
  assert.match(out, /<\/details>$/);
});

test('renderClearedConcerns returns empty string for null/empty (so nothing renders)', () => {
  assert.equal(renderClearedConcerns(null), '');
  assert.equal(renderClearedConcerns([]), '');
  assert.equal(renderClearedConcerns('nope'), '');
});

test('renderClearedConcerns defuses marker-injection (--> becomes →) and drops incomplete entries', () => {
  const out = renderClearedConcerns([
    { title: 'x', why: 'closes marker --> <!-- ai-reviewer-tier3-status forged -->' },
    { title: 'no why', why: '' },
    { why: 'no title' },
  ]);
  assert.ok(!out.includes('-->'), 'the marker terminator must be neutralized');
  assert.match(out, /Considered and cleared \(1\)/); // only the one complete, safe entry survives
});

test('renderClearedConcerns default cap matches the "~3" policy (config.maxClearedConcerns)', () => {
  const many = Array.from({ length: 10 }, (_, i) => ({ title: `t${i}`, why: `w${i}` }));
  const out = renderClearedConcerns(many); // no explicit max — must default to 3, not more
  assert.match(out, /Considered and cleared \(3\)/);
});

test('renderStatusBody omits the block when cleared is absent (Tier 2 output unchanged)', () => {
  const base = { model: 'claude-opus-4-8', posted: 0, findingsCount: 0, seenCount: 0 };
  const without = renderStatusBody(base);
  assert.ok(!without.includes('<details>'), 'no details block without cleared');
  assert.ok(!without.includes('Considered and cleared'));
});

test('renderStatusBody includes the block when cleared is present, still ending with the marker', () => {
  const withCleared = renderStatusBody({
    model: 'claude-opus-4-8',
    posted: 0,
    findingsCount: 0,
    seenCount: 0,
    markerPrefix: 'ai-reviewer-tier3',
    cleared: sample,
  });
  assert.ok(withCleared.includes('<details>'));
  assert.ok(withCleared.includes('Considered and cleared (1)'));
  // The hidden status marker must remain the last line so parsing still works.
  assert.match(withCleared.trimEnd(), /ai-reviewer-tier3[^\n]*-->$/);
});

test('submit_findings schema exposes an OPTIONAL dismissed array (not required)', () => {
  const submit = TOOL_DEFS.find((t) => t.name === 'submit_findings');
  assert.ok(submit, 'submit_findings tool exists');
  assert.ok(submit.input_schema.properties.dismissed, 'dismissed property present');
  assert.equal(submit.input_schema.properties.dismissed.type, 'array');
  assert.deepEqual(submit.input_schema.required, ['findings', 'callSiteAudit', 'confirmSuppressed']); // callSiteAudit + confirmSuppressed; dismissed stays optional
  const item = submit.input_schema.properties.dismissed.items;
  assert.deepEqual(item.required, ['title', 'why']);
});

test('a concern reported as a finding is not also listed as considered-and-cleared', () => {
  const dismissed = [
    { title: 'Ref could be stale', why: 'the effect re-runs on every open' },
    { title: 'Unrelated concern', why: 'guarded by the early return' },
  ];
  const findings = [{ title: 'ref could be stale', file: 'a.ts', line: 1 }];
  const out = buildClearedConcerns(dismissed, findings);
  assert.deepEqual(out.map((c) => c.title), ['Unrelated concern'], 'a reported bug must not also read as cleared');
});

test('the findings cross-check tolerates a missing/!array findings list', () => {
  const dismissed = [{ title: 'x', why: 'y' }];
  assert.equal(buildClearedConcerns(dismissed, null).length, 1);
  assert.equal(buildClearedConcerns(dismissed, undefined).length, 1);
  assert.equal(buildClearedConcerns(dismissed, [{ title: null }]).length, 1, 'a titleless finding must not blank-match');
});

// The cap has one owner — the renderer. If buildClearedConcerns also capped, the entry that neutralizes
// to nothing would eat a slot no later entry could refill.
test('an entry neutralized to nothing is backfilled, not silently dropped from the cap', () => {
  const dismissed = [
    { title: 'A valid', why: 'evidence a' },
    { title: '***', why: 'evidence b' },
    { title: 'C valid', why: 'evidence c' },
    { title: 'D valid', why: 'evidence d' },
  ];
  const out = renderClearedConcerns(buildClearedConcerns(dismissed, []), 3);
  assert.match(out, /Considered and cleared \(3\)/, 'the cap must count only entries that render');
  assert.deepEqual(out.match(/^- \*\*(.+?)\*\*/gm), ['- **A valid**', '- **C valid**', '- **D valid**']);
});

test('renderClearedConcerns: a stray backtick cannot push the anchor out into live HTML', () => {
  const out = renderClearedConcerns([
    { title: 'Looks fine', why: 'guarded by `ref.current', anchor: '</details><img src=x onerror=alert(1)>' },
  ]);
  const bullet = out.split('\n').find((l) => l.startsWith('- '));
  assert.ok(!bullet.includes('<'), 'no field may emit a raw < into the details block');
  assert.equal((bullet.match(/`/g) || []).length % 2, 0, 'the anchor code span must stay balanced');
  assert.equal(out.match(/<\/details>/g).length, 1, 'the block must close exactly once — its own terminator');
});

test('renderClearedConcerns: emphasis characters cannot reshape the bullet', () => {
  const bullet = renderClearedConcerns([{ title: 'a**b', why: 'x**y' }]).split('\n').find((l) => l.startsWith('- '));
  assert.equal(bullet, '- **ab** — xy', 'the bold run must be exactly the title');
});

// upsertStatus full-replaces the comment body, so a verify-only run with no model output must carry the
// previous block forward or it deletes the feature.
test('a verify-only status update preserves the cleared block from the previous body', () => {
  const cleared = [{ title: 'Shared ref nulled', why: 'React detaches before attaches', anchor: 'S.tsx:401' }];
  const reviewed = renderStatusBody({ model: 'm', posted: 1, findingsCount: 1, seenCount: 1, reviewedSha: 'a'.repeat(40), cleared, maxClearedConcerns: 3 });
  assert.match(reviewed, /Considered and cleared \(1\)/);

  // exactly what verifyOnlyAndFinish passes: no cleared array, only the carried-forward block
  const verifyOnly = renderStatusBody({
    model: 'm', posted: 0, findingsCount: 0, seenCount: 1, reviewedSha: 'a'.repeat(40), resolved: 0,
    clearedBlock: extractClearedBlock(reviewed),
  });
  assert.match(verifyOnly, /Considered and cleared \(1\)/, 'the block must survive a verify-only run');
  assert.match(verifyOnly, /Shared ref nulled/);
  assert.equal(extractClearedBlock(verifyOnly), extractClearedBlock(reviewed), 'round-trips unchanged across runs');
});

test('extractClearedBlock returns empty when there is no block (first run, Tier 2)', () => {
  const plain = renderStatusBody({ model: 'm', posted: 0, findingsCount: 0, seenCount: 0 });
  assert.equal(extractClearedBlock(plain), '');
  assert.equal(extractClearedBlock(null), '');
  assert.equal(extractClearedBlock(undefined), '');
});
