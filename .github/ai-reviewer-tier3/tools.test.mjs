import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { makeToolRunner, TOOL_DEFS } from './tools.mjs';

function fixtureRoot() {
  const root = mkdtempSync(join(tmpdir(), 't3-'));
  mkdirSync(join(root, 'src'));
  writeFileSync(join(root, 'src', 'a.ts'), 'export const a = 1;\nconst secret = 2;\n');
  writeFileSync(join(root, 'src', 'b.ts'), 'import { a } from "./a";\n');
  writeFileSync(join(root, 'src', 'many.ts'), 'zz\nzz\nzz\n');
  return root;
}
const cfg = { maxFileReadBytes: 200000, maxGrepMatches: 200 };

test('read_file returns numbered content inside root', async () => {
  const run = makeToolRunner({ root: fixtureRoot(), config: cfg });
  const r = await run('read_file', { path: 'src/a.ts' });
  assert.equal(r.isError, false);
  assert.match(r.content, /1: export const a = 1;/);
});

test('read_file supports a line slice on a file too large to return whole', async () => {
  const root = fixtureRoot();
  writeFileSync(join(root, 'src', 'big.ts'), Array.from({ length: 500 }, (_, i) => `line ${i + 1}`).join('\n'));
  const run = makeToolRunner({ root, config: { ...cfg, maxFileReadBytes: 60 } });
  const r = await run('read_file', { path: 'src/big.ts', startLine: 2, endLine: 2 });
  assert.match(r.content, /2: line 2/);
  assert.doesNotMatch(r.content, /1: line 1/);
});

test('read_file rejects path escape', async () => {
  const run = makeToolRunner({ root: fixtureRoot(), config: cfg });
  const r = await run('read_file', { path: '../../../../etc/passwd' });
  assert.equal(r.isError, true);
  assert.match(r.content, /outside the repository|not allowed/i);
});

test('read_file enforces the byte cap', async () => {
  const run = makeToolRunner({ root: fixtureRoot(), config: { ...cfg, maxFileReadBytes: 5 } });
  const r = await run('read_file', { path: 'src/a.ts' });
  assert.equal(r.isError, true);
  assert.match(r.content, /too large/i);
});

test('grep finds a unique token with file:line', async () => {
  const run = makeToolRunner({ root: fixtureRoot(), config: cfg });
  const r = await run('grep', { pattern: 'secret' });
  assert.equal(r.isError, false);
  assert.match(r.content, /a\.ts:2:/);
});

test('grep caps results and notes truncation', async () => {
  const run = makeToolRunner({ root: fixtureRoot(), config: { ...cfg, maxGrepMatches: 2 } });
  const r = await run('grep', { pattern: 'zz' });
  assert.equal(r.isError, false);
  assert.match(r.content, /more matches truncated/);
});

test('grep counts all matches per file (accurate total) and names dense files to read directly', async () => {
  const root = fixtureRoot();
  writeFileSync(join(root, 'src', 'dense.ts'), Array.from({ length: 120 }, () => 'needleZZ here').join('\n'));
  const r = await makeToolRunner({ root, config: cfg })('grep', { pattern: 'needleZZ' });
  assert.equal(r.isError, false);
  const shown = r.content.split('\n').filter((l) => l.startsWith('src/dense.ts:')).length;
  assert.ok(shown <= 50, `showed ${shown} lines from dense.ts, expected <= 50 (per-file cap)`);
  assert.match(r.content, /more matches truncated/); // total is accurate (120), not silently capped at 50
  assert.match(r.content, /src\/dense\.ts \(120\)/); // dense file named with its TRUE count, not the cap
});

test('grep with no matches is not an error', async () => {
  const run = makeToolRunner({ root: fixtureRoot(), config: cfg });
  const r = await run('grep', { pattern: 'nonexistent_token_xyzzy' });
  assert.equal(r.isError, false);
  assert.match(r.content, /no matches/);
});

test('list_dir lists entries and rejects escape', async () => {
  const run = makeToolRunner({ root: fixtureRoot(), config: cfg });
  const ok = await run('list_dir', { path: 'src' });
  assert.match(ok.content, /a\.ts/);
  const bad = await run('list_dir', { path: '..' });
  assert.equal(bad.isError, true);
});

test('TOOL_DEFS includes four tools and submit_findings carries the findings schema', () => {
  const names = TOOL_DEFS.map((t) => t.name).sort();
  assert.deepEqual(names, ['grep', 'list_dir', 'read_file', 'submit_findings']);
  const submit = TOOL_DEFS.find((t) => t.name === 'submit_findings');
  assert.ok(submit.input_schema && submit.input_schema.properties.findings);
});

test('the reasoning fields are emitted BEFORE findings (order is what makes them reasoning, not narration)', () => {
  const keys = Object.keys(TOOL_DEFS.find((t) => t.name === 'submit_findings').input_schema.properties);
  assert.ok(keys.indexOf('callSiteAudit') < keys.indexOf('findings'), 'callSiteAudit must precede findings');
  assert.ok(keys.indexOf('confirmSuppressed') < keys.indexOf('findings'), 'confirmSuppressed must precede findings');
  assert.equal(keys[keys.length - 1], 'findings', 'findings is written last so it can absorb both checks');
});

test('confirmSuppressed requires all five clearance steps', () => {
  const submit = TOOL_DEFS.find((t) => t.name === 'submit_findings');
  const item = submit.input_schema.properties.confirmSuppressed.items;
  for (const f of ['claim', 'predictedFailure', 'invariant', 'enforcingCode', 'coversThisPath', 'counterexample', 'verdict']) {
    assert.ok(item.required.includes(f), `${f} must be required`);
  }
});

test('confirmSuppressed offers no unverifiable escape hatch', () => {
  const submit = TOOL_DEFS.find((t) => t.name === 'submit_findings');
  const item = submit.input_schema.properties.confirmSuppressed.items;
  assert.deepEqual(item.properties.verdict.enum, ['cleared-all-five-passed', 'is-a-bug-moved-to-findings']);
  assert.ok(
    !JSON.stringify(item).includes('genuinely-unverifiable'),
    'the genuinely-unverifiable exit was abused as a silent drop and must be gone',
  );
});

test('enforcingCode demands a real citation, not a mechanism name', () => {
  const submit = TOOL_DEFS.find((t) => t.name === 'submit_findings');
  const d = submit.input_schema.properties.confirmSuppressed.items.properties.enforcingCode.description;
  assert.match(d, /verbatim/i);
  assert.match(d, /is-a-bug-moved-to-findings/, 'failing step 3 must name the consequence');
});

test('read_file rejects an in-repo symlink whose target escapes the repo', async () => {
  const root = fixtureRoot();
  const outside = join(mkdtempSync(join(tmpdir(), 't3-outside-')), 'secret.txt');
  writeFileSync(outside, 'TOP SECRET ANTHROPIC_API_KEY=sk-ant-leak');
  symlinkSync(outside, join(root, 'src', 'evil.ts'));
  const run = makeToolRunner({ root, config: cfg });
  const r = await run('read_file', { path: 'src/evil.ts' });
  assert.equal(r.isError, true);
  assert.doesNotMatch(r.content, /TOP SECRET/);
});

test('list_dir rejects an in-repo symlink to an outside directory', async () => {
  const root = fixtureRoot();
  const outsideDir = mkdtempSync(join(tmpdir(), 't3-outdir-'));
  symlinkSync(outsideDir, join(root, 'src', 'linkdir'));
  const run = makeToolRunner({ root, config: cfg });
  const r = await run('list_dir', { path: 'src/linkdir' });
  assert.equal(r.isError, true);
});

test('grep skips files over the byte cap and reports it, but searches them under the cap', async () => {
  const root = fixtureRoot();
  writeFileSync(join(root, 'src', 'big.ts'), 'const needleXYZ = 1;\n' + 'x'.repeat(5000));
  // tiny cap → big.ts is skipped, and the skip is noted (not a silent "no matches")
  const skip = await makeToolRunner({ root, config: { ...cfg, maxGrepFileBytes: 100 } })('grep', { pattern: 'needleXYZ' });
  assert.equal(skip.isError, false);
  assert.doesNotMatch(skip.content, /big\.ts/);
  assert.match(skip.content, /not searched/);
  // generous cap → the same file is searched normally
  const found = await makeToolRunner({ root, config: { ...cfg, maxGrepFileBytes: 999999 } })('grep', { pattern: 'needleXYZ' });
  assert.match(found.content, /big\.ts:1:/);
});

test('read_file slices an over-cap file (the size gate no longer blocks slices)', async () => {
  const root = fixtureRoot();
  const big = Array.from({ length: 500 }, (_, i) => `line ${i + 1}`).join('\n');
  writeFileSync(join(root, 'src', 'big.ts'), big);
  // whole-file read of an over-cap file → still errors (correctly)
  const whole = await makeToolRunner({ root, config: { ...cfg, maxFileReadBytes: 50 } })('read_file', { path: 'src/big.ts' });
  assert.equal(whole.isError, true);
  assert.match(whole.content, /too large/i);
  // sliced read of the SAME over-cap file → returns just the requested lines, not the error
  const sliced = await makeToolRunner({ root, config: { ...cfg, maxFileReadBytes: 50 } })('read_file', {
    path: 'src/big.ts',
    startLine: 3,
    endLine: 5,
  });
  assert.equal(sliced.isError, false);
  assert.match(sliced.content, /3: line 3/);
  assert.match(sliced.content, /5: line 5/);
  assert.doesNotMatch(sliced.content, /line 6/);
});

test('read_file returns the WHOLE file when a slice was requested but the file is small', async () => {
  const run = makeToolRunner({ root: fixtureRoot(), config: cfg });
  const r = await run('read_file', { path: 'src/a.ts', startLine: 2, endLine: 2 });
  assert.equal(r.isError, false);
  // line 1 is OUTSIDE the requested slice — the whole file came back anyway
  assert.match(r.content, /1: export const a = 1;/);
  assert.match(r.content, /2: const secret = 2;/);
  assert.match(r.content, /returned the WHOLE file/);
});

test('read_file keeps slicing a file over the expand threshold, even though it is under the read cap', async () => {
  const root = fixtureRoot();
  writeFileSync(join(root, 'src', 'wide2.ts'), Array.from({ length: 2000 }, (_, i) => `line ${i + 1}`).join('\n'));
  const run = makeToolRunner({ root, config: { ...cfg, maxWholeFileExpandBytes: 1000 } });
  const r = await run('read_file', { path: 'src/wide2.ts', startLine: 3, endLine: 5 });
  assert.equal(r.isError, false);
  assert.match(r.content, /3: line 3/);
  assert.doesNotMatch(r.content, /1: line 1/, 'a large file must stay sliced');
  assert.doesNotMatch(r.content, /returned the WHOLE file/);
  assert.match(r.content, /2000 lines/, 'but it must still be told how much it did not see');
});

test('read_file expand threshold defaults well below the read cap', async () => {
  const root = fixtureRoot();
  // 60 KB: under the 200 KB read cap, over any sane expand threshold
  writeFileSync(join(root, 'src', 'big60.ts'), Array.from({ length: 6000 }, (_, i) => `line ${i + 1}`).join('\n'));
  const r = await makeToolRunner({ root, config: cfg })('read_file', { path: 'src/big60.ts', startLine: 3, endLine: 5 });
  assert.doesNotMatch(r.content, /returned the WHOLE file/, 'a 60 KB file must not silently expand');
});

test('read_file does NOT warn when the slice was genuinely necessary', async () => {
  const root = fixtureRoot();
  writeFileSync(join(root, 'src', 'big.ts'), Array.from({ length: 500 }, (_, i) => `line ${i + 1}`).join('\n'));
  const r = await makeToolRunner({ root, config: { ...cfg, maxFileReadBytes: 50 } })('read_file', {
    path: 'src/big.ts',
    startLine: 3,
    endLine: 5,
  });
  assert.equal(r.isError, false);
  assert.match(r.content, /3: line 3/);
  assert.doesNotMatch(r.content, /line 6/, 'an over-cap file must still be sliced');
  assert.doesNotMatch(r.content, /returned the WHOLE file/);
});

test('read_file does not annotate a plain whole-file read', async () => {
  const run = makeToolRunner({ root: fixtureRoot(), config: cfg });
  const r = await run('read_file', { path: 'src/a.ts' });
  assert.equal(r.isError, false);
  assert.doesNotMatch(r.content, /returned the WHOLE file/);
});

test('confidence measures whether the explanation is right; severity measures whether users see it', () => {
  const item = TOOL_DEFS.find((t) => t.name === 'submit_findings').input_schema.properties.findings.items;
  assert.ok(item.required.includes('confidenceBasis'), 'confidenceBasis must be required');
  const c = item.properties.confidence.description;
  const s = item.properties.severity.description;
  assert.match(c, /explanation of the implementation/i);
  assert.match(c, /Never reduce confidence/i);
  assert.match(c, /model-dependent/i, 'must name the exact rationalization runs 1 and 3 used');
  assert.match(c, /[Rr]are bugs still deserve high confidence/);
  assert.match(s, /users are likely to observe/i);
  assert.match(item.properties.confidenceBasis.description, /must be `high`/);
});

test('read_file slice reports the byte cap (not "no lines in range") when the first line is too big', async () => {
  const root = fixtureRoot();
  writeFileSync(join(root, 'src', 'wide.ts'), 'x'.repeat(500) + '\nsecond\n');
  // first in-range line alone exceeds the cap → say so, don't claim the range is empty
  const capped = await makeToolRunner({ root, config: { ...cfg, maxFileReadBytes: 50 } })('read_file', {
    path: 'src/wide.ts',
    startLine: 1,
    endLine: 1,
  });
  assert.equal(capped.isError, false);
  assert.match(capped.content, /exceed the byte cap/i);
  assert.doesNotMatch(capped.content, /no lines in range/);
  // a genuinely empty range (past EOF) on an over-cap file still reports "(no lines in range)"
  const empty = await makeToolRunner({ root, config: { ...cfg, maxFileReadBytes: 50 } })('read_file', {
    path: 'src/wide.ts',
    startLine: 100,
    endLine: 101,
  });
  assert.match(empty.content, /no lines in range/);
});

test('a slice request on a 20KB file is honoured, not widened to the whole file', async () => {
  const dir = mkdtempSync(join(tmpdir(), 't3slice-'));
  const path = 'big.css';
  writeFileSync(join(dir, path), Array.from({ length: 800 }, (_, i) => `.rule-${i} { color: red; }`).join('\n'));
  const run = makeToolRunner({ root: dir, config: { ...cfg, maxWholeFileExpandBytes: 16000, toolExtensions: ['.css'], ignore: [] } });
  const out = await run('read_file', { path, startLine: 1, endLine: 20 });
  assert.match(out.content, /^ *20: /m, 'the requested range must be present');
  assert.doesNotMatch(out.content, /^ *21: /m, 'a 20KB file must not be widened past the requested range');
});

test('a wrong path points at the real file instead of returning a bare Not found', async () => {
  const root = mkdtempSync(join(tmpdir(), 't3find-'));
  mkdirSync(join(root, 'components', 'OverlayShell'), { recursive: true });
  writeFileSync(join(root, 'components', 'OverlayShell', 'OverlayShell.tsx'), 'export const OverlayShell = () => null;\n');
  const run = makeToolRunner({ root, config: { ...cfg, toolExtensions: ['.tsx'], ignore: [] } });
  const out = await run('read_file', { path: 'components/_internal/OverlayShell.tsx' });
  assert.equal(out.isError, true);
  assert.match(out.content, /components\/OverlayShell\/OverlayShell\.tsx/, 'must name the real location');
});

test('a genuinely absent basename says so, so the model does not go hunting', async () => {
  const run = makeToolRunner({ root: fixtureRoot(), config: { ...cfg, toolExtensions: ['.ts'], ignore: [] } });
  const out = await run('read_file', { path: 'src/NoSuchThing.ts' });
  assert.equal(out.isError, true);
  assert.match(out.content, /No file or directory with that basename/);
});

test('a mistyped DIRECTORY is pointed at the real one, not told it does not exist', async () => {
  const root = mkdtempSync(join(tmpdir(), 't3dir-'));
  mkdirSync(join(root, 'components', 'OverlayShell'), { recursive: true });
  writeFileSync(join(root, 'components', 'OverlayShell', 'OverlayShell.tsx'), 'export const O = () => null;\n');
  const run = makeToolRunner({ root, config: { ...cfg, toolExtensions: ['.tsx'], ignore: [] } });
  const out = await run('list_dir', { path: 'components/_internal/OverlayShell' });
  assert.equal(out.isError, true);
  assert.match(out.content, /components\/OverlayShell/, 'the real directory must be named');
  assert.doesNotMatch(out.content, /do not search for it/, 'a directory that exists must never be denied');
});

test('a file outside toolExtensions is still known to exist', async () => {
  const root = mkdtempSync(join(tmpdir(), 't3ext-'));
  mkdirSync(join(root, 'styles'), { recursive: true });
  writeFileSync(join(root, 'styles', 'theme.scss'), '$c: red;\n');
  // .scss is not in toolExtensions, but read_file can still open it — so the index must cover it.
  const run = makeToolRunner({ root, config: { ...cfg, toolExtensions: ['.ts', '.tsx'], ignore: [] } });
  const out = await run('read_file', { path: 'src/theme.scss' });
  assert.equal(out.isError, true);
  assert.match(out.content, /styles\/theme\.scss/);
  assert.doesNotMatch(out.content, /do not search for it/);
});

test('an ignored file is still known to exist — ignore decides review scope, not existence', async () => {
  const root = mkdtempSync(join(tmpdir(), 't3ign-'));
  mkdirSync(join(root, 'packages'), { recursive: true });
  writeFileSync(join(root, 'packages', 'package-lock.json'), '{}\n');
  const run = makeToolRunner({ root, config: { ...cfg, toolExtensions: ['.ts'], ignore: ['**/package-lock.json'] } });
  const out = await run('read_file', { path: 'package-lock.json' });
  assert.match(out.content, /packages\/package-lock\.json/);
  assert.doesNotMatch(out.content, /do not search for it/);
});

test('a truncated index never claims a path does not exist', async () => {
  const root = mkdtempSync(join(tmpdir(), 't3cap-'));
  mkdirSync(join(root, 'src'), { recursive: true });
  for (let i = 0; i < 5; i++) writeFileSync(join(root, 'src', `f${i}.ts`), 'export {};\n');
  // The walk stops after 2 files, so the index cannot support a repo-wide "does not exist" claim.
  const run = makeToolRunner({ root, config: { ...cfg, maxFilesWalked: 2, toolExtensions: ['.ts'], ignore: [] } });
  const out = await run('read_file', { path: 'src/definitely-absent.ts' });
  assert.equal(out.isError, true);
  assert.doesNotMatch(out.content, /do not search for it/, 'a partial index must not assert a negative');
  assert.match(out.content, /Not found: src\/definitely-absent\.ts/);
});
