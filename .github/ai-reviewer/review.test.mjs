import assert from 'node:assert/strict';
import {
  annotatePatch,
  globToRegExp,
  isIgnored,
  normalizeTitle,
  fingerprint,
  runFingerprint,
  sanitizeText,
  isTrustedMarkerComment,
  buildMarker,
  parseMarkers,
  buildDiffContext,
  filterFindings,
  estimateCostUsd,
  worstCaseCostUsd,
  summarizeUsage,
  formatUsage,
  renderStatusBody,
  parseStatusReviewedSha,
  reviewFullySurfaced,
  DEFAULT_CONFIG,
} from './review.mjs';

let passed = 0;
const check = (name, fn) => {
  fn();
  passed += 1;
  console.log(`  ✓ ${name}`);
};

check('annotatePatch numbers added lines on the new side', () => {
  const patch = [
    '@@ -1,3 +1,4 @@',
    ' const a = 1;',
    '-const b = 2;',
    '+const b = 3;',
    '+const c = 4;',
    ' const d = 5;',
  ].join('\n');
  const { commentable, text } = annotatePatch(patch);
  assert.deepEqual([...commentable].sort((x, y) => x - y), [2, 3]);
  assert.match(text, /\+\s+2 {2}const b = 3;/);
  assert.match(text, /\+\s+3 {2}const c = 4;/);
  // context line d is on new line 4
  assert.match(text, /\s+4 {2}const d = 5;/);
});

check('annotatePatch keeps numbering when an added line starts with ++/--', () => {
  // `++count;` becomes `+++count;` in the patch; `--count;` becomes `---count;`.
  const patch = ['@@ -1,1 +1,3 @@', ' first;', '+++count;', '+normal;'].join('\n');
  const { commentable, text } = annotatePatch(patch);
  // first=1 (context), ++count=2 (added), normal=3 (added)
  assert.deepEqual([...commentable].sort((x, y) => x - y), [2, 3]);
  assert.match(text, /\+\s+2 {2}\+\+count;/);
  assert.match(text, /\+\s+3 {2}normal;/);
});

check('annotatePatch resets line counter per hunk', () => {
  const patch = [
    '@@ -1,1 +1,2 @@',
    ' a',
    '+b',
    '@@ -10,1 +20,2 @@',
    ' x',
    '+y',
  ].join('\n');
  const { commentable } = annotatePatch(patch);
  assert.deepEqual([...commentable].sort((x, y) => x - y), [2, 21]);
});

check('globToRegExp handles **, * and ?', () => {
  assert.ok(globToRegExp('**/*.lock').test('a/b/c.lock'));
  assert.ok(globToRegExp('**/*.lock').test('c.lock'));
  assert.ok(globToRegExp('**/dist/**').test('packages/ds/dist/x/y.js'));
  assert.ok(globToRegExp('**/tokens.css').test('packages/ds/src/tokens.css'));
  assert.ok(!globToRegExp('*.ts').test('a/b.ts')); // single * does not cross /
  assert.ok(globToRegExp('*.ts').test('b.ts'));
});

check('isIgnored matches default ignore list', () => {
  assert.ok(isIgnored('package-lock.json', DEFAULT_CONFIG.ignore));
  assert.ok(isIgnored('packages/ds/dist/index.js', DEFAULT_CONFIG.ignore));
  assert.ok(isIgnored('a/b/icon.svg', DEFAULT_CONFIG.ignore));
  assert.ok(!isIgnored('packages/ds/src/components/Button/Button.tsx', DEFAULT_CONFIG.ignore));
});

check('fingerprint is stable across reworded whitespace/case', () => {
  const a = fingerprint('a.ts', 'Missing await on save()');
  const b = fingerprint('a.ts', 'missing   await on   save()');
  assert.equal(a, b);
  assert.notEqual(a, fingerprint('b.ts', 'Missing await on save()'));
  assert.equal(normalizeTitle('Foo  BAR-baz!'), 'foo bar baz');
});

check('marker round-trips through parseMarkers', () => {
  const marker = buildMarker({ fp: 'abc123', file: 'a.ts', line: 5, title: 'Bug -> here' });
  const body = `some comment\n\n${marker}`;
  const parsed = parseMarkers(body);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].fp, 'abc123');
  assert.equal(parsed[0].file, 'a.ts');
  assert.ok(!parsed[0].title.includes('-->')); // sanitized
});

check('parseMarkers reads multiple markers from one comment', () => {
  const body = [
    buildMarker({ fp: 'one', file: 'a.ts', line: 1, title: 't1' }),
    buildMarker({ fp: 'two', file: 'b.ts', line: 2, title: 't2' }),
  ].join('\n');
  assert.deepEqual(parseMarkers(body).map((m) => m.fp), ['one', 'two']);
});

check('buildDiffContext skips removed/binary/ignored/oversized files', () => {
  const files = [
    { filename: 'src/a.tsx', status: 'modified', additions: 1, deletions: 0, patch: '@@ -1,1 +1,2 @@\n a\n+b' },
    { filename: 'gone.ts', status: 'removed', additions: 0, deletions: 3, patch: '@@ -1,3 +0,0 @@\n-x\n-y\n-z' },
    { filename: 'logo.svg', status: 'added', additions: 1, deletions: 0, patch: '@@ -0,0 +1 @@\n+<svg/>' },
    { filename: 'huge.ts', status: 'modified', additions: 1, deletions: 0, patch: '@@ -1,1 +1,2 @@\n a\n+' + 'x'.repeat(40000) },
    { filename: 'bin.png', status: 'modified', additions: 0, deletions: 0 }, // no patch
  ];
  const { commentableByFile, skippedForSize, diffText } = buildDiffContext(files, DEFAULT_CONFIG);
  assert.deepEqual([...commentableByFile.keys()], ['src/a.tsx']);
  assert.deepEqual(skippedForSize, ['huge.ts']);
  assert.ok(diffText.includes('### src/a.tsx'));
  assert.ok(!diffText.includes('logo.svg'));
});

check('buildDiffContext does not register a budget-tripping file as commentable', () => {
  const files = [
    { filename: 'a.ts', status: 'modified', additions: 1, deletions: 0, patch: '@@ -1,1 +1,2 @@\n a\n+b' },
    { filename: 'b.ts', status: 'modified', additions: 1, deletions: 0, patch: '@@ -1,1 +1,2 @@\n a\n+' + 'y'.repeat(300) },
  ];
  // budget small enough to fit a.ts but trip on b.ts
  const config = { ...DEFAULT_CONFIG, maxFilePatchChars: 100000, maxTotalDiffChars: 120 };
  const { commentableByFile, diffText, truncated } = buildDiffContext(files, config);
  assert.equal(truncated, true);
  assert.deepEqual([...commentableByFile.keys()], ['a.ts']); // b.ts NOT registered (Claude never saw it)
  assert.ok(diffText.includes('### a.ts'));
  assert.ok(!diffText.includes('### b.ts'));
});

check('filterFindings applies thresholds, dedup, inline detection, sorting and cap', () => {
  const commentableByFile = new Map([['a.ts', new Set([2, 3])]]);
  const seen = new Set([fingerprint('a.ts', 'already reported')]);
  const config = { ...DEFAULT_CONFIG, minConfidence: 'medium', minSeverity: 'low', maxFindings: 2 };

  const raw = [
    { file: 'a.ts', line: 2, severity: 'high', confidence: 'high', category: 'bug', title: 'real inline', body: '', suggestion: '' },
    { file: 'a.ts', line: 3, severity: 'low', confidence: 'low', category: 'bug', title: 'too low conf', body: '', suggestion: '' },
    { file: 'b.ts', line: 1, severity: 'high', confidence: 'high', category: 'bug', title: 'unchanged file', body: '', suggestion: '' },
    { file: 'a.ts', line: 2, severity: 'high', confidence: 'high', category: 'bug', title: 'already reported', body: '', suggestion: '' },
    { file: 'a.ts', line: 99, severity: 'critical', confidence: 'high', category: 'security', title: 'not in diff line', body: '', suggestion: '' },
    { file: 'a.ts', line: 3, severity: 'medium', confidence: 'medium', category: 'logic', title: 'fourth kept', body: '', suggestion: '' },
  ];

  const { findings, dropped, capped } = filterFindings(raw, { config, commentableByFile, seenFingerprints: seen });
  assert.equal(dropped.byConfidence, 1);
  assert.equal(dropped.byFile, 1);
  assert.equal(dropped.duplicate, 1);
  assert.equal(capped, true); // 3 survivors, cap 2
  assert.equal(findings.length, 2);
  // sorted by severity desc: critical 'not in diff line' first (inline=false), then high 'real inline'
  assert.equal(findings[0].title, 'not in diff line');
  assert.equal(findings[0].inline, false);
  assert.equal(findings[1].title, 'real inline');
  assert.equal(findings[1].inline, true);
});

check('runFingerprint is line-aware while fingerprint stays line-agnostic', () => {
  // cross-run key: same regardless of line (so a finding still matches its marker after lines shift)
  assert.equal(fingerprint('a.ts', 'Missing null check'), fingerprint('a.ts', 'Missing null check'));
  // within-run key: distinct lines -> distinct keys (so two same-title bugs don't collapse)
  assert.notEqual(runFingerprint('a.ts', 20, 'Missing null check'), runFingerprint('a.ts', 88, 'Missing null check'));
  assert.equal(runFingerprint('a.ts', 20, 'Missing null check'), runFingerprint('a.ts', 20, 'missing  null check'));
});

check('filterFindings keeps two distinct same-title bugs on different lines in one run', () => {
  const commentableByFile = new Map([['a.ts', new Set([20, 88])]]);
  const config = { ...DEFAULT_CONFIG, minConfidence: 'low', minSeverity: 'low', maxFindings: 25 };
  const raw = [
    { file: 'a.ts', line: 20, severity: 'high', confidence: 'high', category: 'bug', title: 'Missing null check', body: '', suggestion: '' },
    { file: 'a.ts', line: 88, severity: 'high', confidence: 'high', category: 'bug', title: 'Missing null check', body: '', suggestion: '' },
  ];
  const { findings, dropped } = filterFindings(raw, { config, commentableByFile, seenFingerprints: new Set() });
  assert.equal(findings.length, 2);
  assert.equal(dropped.duplicate, 0);
});

check('filterFindings still collapses a finding already reported in a prior run', () => {
  const commentableByFile = new Map([['a.ts', new Set([20, 88])]]);
  const config = { ...DEFAULT_CONFIG, minConfidence: 'low', minSeverity: 'low' };
  // prior marker was stored with the line-agnostic fp, so both lines dedup against it
  const seen = new Set([fingerprint('a.ts', 'Missing null check')]);
  const raw = [
    { file: 'a.ts', line: 88, severity: 'high', confidence: 'high', category: 'bug', title: 'Missing null check', body: '', suggestion: '' },
  ];
  const { findings, dropped } = filterFindings(raw, { config, commentableByFile, seenFingerprints: seen });
  assert.equal(findings.length, 0);
  assert.equal(dropped.duplicate, 1);
});

check('sanitizeText strips control chars, the comment terminator, and caps length', () => {
  assert.equal(sanitizeText('a\x00\x07b\nc'), 'a b c');
  assert.equal(sanitizeText('break out --> done'), 'break out → done');
  assert.equal(sanitizeText('   spaced   out  '), 'spaced out');
  assert.equal(sanitizeText('x'.repeat(50), 10).length, 10);
  assert.equal(sanitizeText(null), '');
  assert.equal(sanitizeText(undefined), '');
});

check('isTrustedMarkerComment only trusts the bot (or configured actor)', () => {
  const bot = { user: { type: 'Bot', login: 'github-actions[bot]' } };
  const human = { user: { type: 'User', login: 'attacker' } };
  // default (botActor=null): trust any Bot author, reject humans
  assert.equal(isTrustedMarkerComment(bot, null), true);
  assert.equal(isTrustedMarkerComment(human, null), false);
  assert.equal(isTrustedMarkerComment({}, null), false);
  // configured actor: exact login match only
  assert.equal(isTrustedMarkerComment({ user: { type: 'User', login: 'my-bot' } }, 'my-bot'), true);
  assert.equal(isTrustedMarkerComment(bot, 'my-bot'), false);
});

check('forged markers from a non-bot commenter are not trusted for dedup (integration shape)', () => {
  // Simulate main()'s marker harvesting: a forged human comment must not feed seenFingerprints.
  const forgedFp = fingerprint('src/db.ts', 'SQL injection in query builder');
  const comments = [
    { user: { type: 'User', login: 'attacker' }, body: buildMarker({ fp: forgedFp, file: 'src/db.ts', line: 1, title: 'SQL injection in query builder' }) },
    { user: { type: 'Bot', login: 'github-actions[bot]' }, body: buildMarker({ fp: 'realfp00', file: 'src/x.ts', line: 9, title: 'real prior finding' }) },
  ];
  const trusted = comments.filter((c) => isTrustedMarkerComment(c, null)).flatMap((c) => parseMarkers(c.body));
  const seen = new Set(trusted.map((m) => m.fp));
  assert.ok(!seen.has(forgedFp)); // attacker cannot suppress the real finding
  assert.ok(seen.has('realfp00')); // legitimate bot marker still deduped
});

check('estimateCostUsd prices fresh/cached input and output correctly', () => {
  const pricing = { 'claude-opus-4-8': { input: 5, output: 25 } };
  // 100k fresh input @ $5/1M = $0.50; 20k output @ $25/1M = $0.50 => $1.00
  const cost = estimateCostUsd(
    { input_tokens: 100000, output_tokens: 20000, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
    'claude-opus-4-8',
    pricing,
  );
  assert.ok(Math.abs(cost - 1.0) < 1e-9);
  // cache reads bill at 0.1x input: 100k cache-read = $0.05
  const cached = estimateCostUsd(
    { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 100000, cache_creation_input_tokens: 0 },
    'claude-opus-4-8',
    pricing,
  );
  assert.ok(Math.abs(cached - 0.05) < 1e-9);
  // unknown model => null (no $ estimate, never a wrong number)
  assert.equal(estimateCostUsd({ input_tokens: 1 }, 'mystery', pricing), null);
});

check('worstCaseCostUsd is the deterministic per-run ceiling from the hard caps', () => {
  const config = {
    model: 'claude-opus-4-8',
    maxInputTokens: 150000,
    maxOutputTokens: 64000,
    pricing: { 'claude-opus-4-8': { input: 5, output: 25 } },
  };
  // 150k input @ $5/1M = $0.75 + 64k output @ $25/1M = $1.60 => $2.35
  assert.ok(Math.abs(worstCaseCostUsd(config) - 2.35) < 1e-9);
  // no cap configured => null
  assert.equal(worstCaseCostUsd({ ...config, maxInputTokens: null }), null);
});

check('renderStatusBody shows cost and is NOT parsed as a finding marker', () => {
  const body = renderStatusBody({
    model: 'claude-opus-4-8',
    posted: 3,
    findingsCount: 3,
    seenCount: 2,
    inputTokens: 50000,
    usage: { input_tokens: 50000, output_tokens: 8000, cache_read_input_tokens: 0 },
    costUsd: 0.45,
    runUrl: 'https://example/run/1',
  });
  assert.match(body, /Posted \*\*3\*\* new issue/);
  assert.match(body, /≈ \$0\.450/);
  assert.match(body, /input 50000 \(fresh 50000\) · output 8000/);
  // critical: the status marker must NOT be picked up by the finding-marker parser
  assert.equal(parseMarkers(body).length, 0);
});

check('renderStatusBody reports a skip with no spend', () => {
  const body = renderStatusBody({ model: 'claude-opus-4-8', skipped: true, note: 'Skipped — too large.', inputTokens: 999999 });
  assert.match(body, /⚠️ Skipped — too large\./);
  assert.equal(parseMarkers(body).length, 0);
});

check('status comment round-trips the reviewed SHA for per-commit idempotency', () => {
  const sha = 'abc1234567890def';
  const body = renderStatusBody({ model: 'claude-opus-4-8', posted: 1, reviewedSha: sha });
  assert.equal(parseStatusReviewedSha(body), sha);
  assert.equal(parseMarkers(body).length, 0);
  assert.equal(parseStatusReviewedSha('### x\n<!-- ai-reviewer-status v1 -->'), null);
  assert.equal(parseStatusReviewedSha('no marker here'), null);
});

check('default botActor pins to github-actions[bot] and rejects other bots (public-repo hardening)', () => {
  assert.equal(DEFAULT_CONFIG.botActor, 'github-actions[bot]');
  const ours = { user: { type: 'Bot', login: 'github-actions[bot]' } };
  const otherBot = { user: { type: 'Bot', login: 'codecov[bot]' } }; // a 3rd-party App on a public repo
  assert.equal(isTrustedMarkerComment(ours, DEFAULT_CONFIG.botActor), true);
  assert.equal(isTrustedMarkerComment(otherBot, DEFAULT_CONFIG.botActor), false);
  // null is still the documented escape hatch meaning "trust any bot"
  assert.equal(isTrustedMarkerComment(otherBot, null), true);
});

check('renderStatusBody distinguishes found-but-not-posted from a clean run', () => {
  const notPosted = renderStatusBody({ model: 'm', posted: 0, findingsCount: 2, seenCount: 1 });
  assert.match(notPosted, /Found \*\*2\*\* new issue\(s\), but none were posted/);
  const clean = renderStatusBody({ model: 'm', posted: 0, findingsCount: 0, seenCount: 1 });
  assert.match(clean, /No new issues found ✅/);
  assert.ok(!clean.includes('but none were posted'));
});

check('reviewFullySurfaced gates the reviewed-SHA so unposted findings are not silently lost', () => {
  // summaries on, every off-diff/fallback finding posted -> fully surfaced (advance SHA)
  assert.equal(reviewFullySurfaced({ postSummaryComment: true, generalCount: 2, postedGeneral: 2, failedInline: 0 }), true);
  // summaries on, the summary comment failed to post -> NOT surfaced (don't advance; re-review)
  assert.equal(reviewFullySurfaced({ postSummaryComment: true, generalCount: 2, postedGeneral: 0, failedInline: 0 }), false);
  // no general findings at all (all posted inline) -> fully surfaced
  assert.equal(reviewFullySurfaced({ postSummaryComment: true, generalCount: 0, postedGeneral: 0, failedInline: 0 }), true);
  // summaries OFF, only intentional off-diff drops (no inline failures) -> surfaced-by-policy (advance)
  assert.equal(reviewFullySurfaced({ postSummaryComment: false, generalCount: 3, postedGeneral: 0, failedInline: 0 }), true);
  // summaries OFF, but an inline post errored -> retryable, NOT surfaced (don't advance; re-review)
  assert.equal(reviewFullySurfaced({ postSummaryComment: false, generalCount: 3, postedGeneral: 0, failedInline: 1 }), false);
});

check('summarizeUsage/formatUsage report the true input across all three buckets', () => {
  const cold = { input_tokens: 743, cache_creation_input_tokens: 4012, cache_read_input_tokens: 0, output_tokens: 56 };
  const s = summarizeUsage(cold);
  assert.equal(s.totalInput, 4755);
  assert.equal(s.fresh, 743);
  assert.equal(s.cacheWrite, 4012);
  assert.match(formatUsage(cold), /input 4755 \(fresh 743 · cache-write 4012\) · output 56/);
  const warm = { input_tokens: 743, cache_creation_input_tokens: 0, cache_read_input_tokens: 4012, output_tokens: 56 };
  assert.equal(summarizeUsage(warm).totalInput, 4755);
  assert.match(formatUsage(warm), /input 4755 \(fresh 743 · cache-read 4012\) · output 56/);
  assert.equal(summarizeUsage(null), null);
  assert.equal(formatUsage(null), null);
});

check('status comment reports the true total input (not just the uncached portion)', () => {
  const usage = { input_tokens: 743, cache_creation_input_tokens: 4012, cache_read_input_tokens: 0, output_tokens: 56 };
  const body = renderStatusBody({ model: 'claude-opus-4-8', posted: 0, findingsCount: 0, usage, costUsd: 0.03 });
  assert.match(body, /input 4755/);
  assert.ok(!/input 743 ·/.test(body)); // no longer reports the misleading 743 as "input"
});

console.log(`\nAll ${passed} self-tests passed.`);
