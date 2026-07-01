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

test('read_file supports a line slice', async () => {
  const run = makeToolRunner({ root: fixtureRoot(), config: cfg });
  const r = await run('read_file', { path: 'src/a.ts', startLine: 2, endLine: 2 });
  assert.match(r.content, /2: const secret = 2;/);
  assert.doesNotMatch(r.content, /export const a/);
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
