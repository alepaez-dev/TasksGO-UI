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
  chunkSummaryComments,
  buildDiffContext,
  filterFindings,
  estimateCostUsd,
  worstCaseCostUsd,
  summarizeUsage,
  formatUsage,
  addUsage,
  estimateInputTokens,
  renderStatusBody,
  parseStatusReviewedSha,
  parseStatusVerifiedSha,
  verificationComplete,
  reviewFullySurfaced,
  buildVerifyMarker,
  parseVerifyMarker,
  selectThreadsToVerify,
  extractWindow,
  shouldPostVerifyReply,
  orderThreadsForVerification,
  classifyVerifyFile,
  confirmedDeletion,
  diffIsComplete,
  mapVerdictsToItems,
  unjudgedThreads,
  isTrustedAuthor,
  parseImports,
  isLocalSpecifier,
  resolveImportPath,
  confineToRepo,
  gatherContextFiles,
  buildFileContextSection,
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
    { filename: 'huge.ts', status: 'modified', additions: 1, deletions: 0, patch: '@@ -1,1 +1,2 @@\n a\n+' + 'x'.repeat(60000) },
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
  // One call (verification off): 150k input @ $5/1M = $0.75 + 64k output @ $25/1M = $1.60 => $2.35
  assert.ok(Math.abs(worstCaseCostUsd(config) - 2.35) < 1e-9);
  // Verification on adds a SECOND billable call (same input gate + its own output cap):
  // review $2.35 + verify (150k @ $5/1M = $0.75 + 24k @ $25/1M = $0.60 = $1.35) => $3.70
  assert.ok(Math.abs(worstCaseCostUsd({ ...config, verifyResolutions: true, maxVerifyOutputTokens: 24000 }) - 3.7) < 1e-9);
  // Verify falls back to maxOutputTokens when no dedicated cap is set => $2.35 + $2.35 = $4.70
  assert.ok(Math.abs(worstCaseCostUsd({ ...config, verifyResolutions: true }) - 4.7) < 1e-9);
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

check('status marker tracks findings (sha) and verification (vsha) SHAs independently', () => {
  const sha = 'rev1234567890';
  const vsha = 'ver9876543210';
  // Both present -> both round-trip; verifying without findings (or vice-versa) is representable.
  const both = renderStatusBody({ model: 'claude-opus-4-8', posted: 0, reviewedSha: sha, verifiedSha: vsha });
  assert.equal(parseStatusReviewedSha(both), sha);
  assert.equal(parseStatusVerifiedSha(both), vsha);
  // Findings done but verification not yet -> vsha absent (so a re-run still verifies).
  const findingsOnly = renderStatusBody({ model: 'claude-opus-4-8', posted: 1, reviewedSha: sha });
  assert.equal(parseStatusReviewedSha(findingsOnly), sha);
  assert.equal(parseStatusVerifiedSha(findingsOnly), null);
  // Verification done on a commit whose findings weren't fully posted -> sha absent, vsha present.
  const verifyOnly = renderStatusBody({ model: 'claude-opus-4-8', posted: 0, verifiedSha: vsha });
  assert.equal(parseStatusReviewedSha(verifyOnly), null);
  assert.equal(parseStatusVerifiedSha(verifyOnly), vsha);
});

check('verificationComplete lets the verified-SHA advance only when no work is pending', () => {
  assert.equal(verificationComplete(null), true); // NOT attempted: disabled / already done / no threads
  assert.equal(verificationComplete({ complete: true }), true);
  assert.equal(verificationComplete({ complete: false }), false);
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

check('buildVerifyMarker/parseVerifyMarker round-trip the verdict', () => {
  const marker = buildVerifyMarker({ fp: 'abc123', status: 'fixed', sha: 'deadbeefcafe' });
  const parsed = parseVerifyMarker(`some reply text\n${marker}`);
  assert.equal(parsed.fp, 'abc123');
  assert.equal(parsed.status, 'fixed');
  assert.equal(parsed.sha, 'deadbeefcafe');
  assert.equal(parseVerifyMarker('no marker here'), null);
});

const BOT = DEFAULT_CONFIG.botActor;
const findingMarker = (f) => buildMarker({ fp: f.fp, file: f.file, line: f.line, title: f.title });
const botComment = (body, diffHunk = '@@ -1 +1 @@') => ({ body, diffHunk, user: { login: BOT } });
const humanComment = (body) => ({ body, diffHunk: '', user: { login: 'someone' } });

check('selectThreadsToVerify picks open bot threads and parses the finding marker', () => {
  const f = { fp: 'fp1', file: 'src/a.ts', line: 42, title: 'Null deref' };
  const threads = [
    {
      id: 'T_open',
      isResolved: false,
      isOutdated: true,
      viewerCanResolve: true,
      comments: [botComment(`Bug body\n${findingMarker(f)}`, '@@ hunk @@')],
    },
  ];
  const picked = selectThreadsToVerify(threads, { botActor: BOT });
  assert.equal(picked.length, 1);
  assert.deepEqual(
    { threadId: picked[0].threadId, fp: picked[0].fp, file: picked[0].file, line: picked[0].line, isOutdated: picked[0].isOutdated, viewerCanResolve: picked[0].viewerCanResolve, originalHunk: picked[0].originalHunk },
    { threadId: 'T_open', fp: 'fp1', file: 'src/a.ts', line: 42, isOutdated: true, viewerCanResolve: true, originalHunk: '@@ hunk @@' },
  );
});

check('selectThreadsToVerify never returns resolved threads, non-bot roots, or marker-less threads', () => {
  const f = { fp: 'fp1', file: 'src/a.ts', line: 1, title: 'x' };
  const threads = [
    { id: 'resolved', isResolved: true, isOutdated: true, viewerCanResolve: true, comments: [botComment(findingMarker(f))] },
    { id: 'human-root', isResolved: false, isOutdated: false, viewerCanResolve: true, comments: [humanComment(findingMarker(f))] },
    { id: 'no-marker', isResolved: false, isOutdated: false, viewerCanResolve: true, comments: [botComment('just a comment, no marker')] },
    { id: 'empty', isResolved: false, isOutdated: false, viewerCanResolve: true, comments: [] },
  ];
  assert.deepEqual(selectThreadsToVerify(threads, { botActor: BOT }), []);
});

check('selectThreadsToVerify reads the latest verify status from our own replies', () => {
  const f = { fp: 'fp1', file: 'src/a.ts', line: 9, title: 'x' };
  const threads = [
    {
      id: 'T',
      isResolved: false,
      isOutdated: false,
      viewerCanResolve: true,
      comments: [
        botComment(findingMarker(f)),
        botComment(`still open\n${buildVerifyMarker({ fp: 'fp1', status: 'still_present' })}`),
        botComment(`hmm\n${buildVerifyMarker({ fp: 'fp1', status: 'unsure' })}`),
      ],
    },
  ];
  assert.equal(selectThreadsToVerify(threads, { botActor: BOT })[0].lastVerifyStatus, 'unsure');
});

check('extractWindow numbers lines 1-based and clamps at file boundaries', () => {
  const file = Array.from({ length: 10 }, (_, i) => `line${i + 1}`).join('\n');
  const win = extractWindow(file, 5, 2);
  assert.match(win, /^\s+3 {2}line3/m);
  assert.match(win, /^\s+7 {2}line7/m);
  assert.ok(!/line2\b/.test(win) && !/line8\b/.test(win));
  // Near the top: never emits line 0 or negative numbers.
  const top = extractWindow(file, 1, 3);
  assert.match(top, /^\s+1 {2}line1/m);
  assert.ok(!/ 0 {2}/.test(top));
});

check('extractWindow clamps long lines and keeps the flagged line under a char budget (M4)', () => {
  // A file of very long lines; the flagged line (50) carries a unique marker mid-line.
  const lines = Array.from({ length: 100 }, (_, i) =>
    i + 1 === 50 ? `${'a'.repeat(400)}FLAG${'b'.repeat(400)}` : 'z'.repeat(2000),
  );
  const win = extractWindow(lines.join('\n'), 50, 40, { maxLineChars: 120, maxChars: 4000 });
  assert.ok(win.length <= 4000, `window ${win.length} should respect the char budget`);
  // The flagged line's number is present AND its content survived (prefix-slice would have dropped it).
  assert.match(win, /\b50 {2}/);
  assert.ok(win.includes('FLAG') || win.includes('a'.repeat(50)), 'flagged line content must be kept');
  // Long context lines are clamped, not emitted at full 2000 chars.
  assert.ok(!/z{200}/.test(win), 'long lines should be clamped');
});

check('shouldPostVerifyReply is idempotent: announce fixed/unsure once, quiet on still-present (M1)', () => {
  assert.equal(shouldPostVerifyReply('fixed', null), true);
  assert.equal(shouldPostVerifyReply('fixed', 'fixed'), false); // already announced -> idempotent
  assert.equal(shouldPostVerifyReply('unsure', null), true);
  assert.equal(shouldPostVerifyReply('unsure', 'unsure'), false);
  assert.equal(shouldPostVerifyReply('still_present', null), false);
  assert.equal(shouldPostVerifyReply('still_present', 'fixed'), false);
});

check('orderThreadsForVerification puts never-checked + outdated first so the cap does not starve them (M3)', () => {
  const c = (id, lastVerifyStatus, isOutdated) => ({ threadId: id, lastVerifyStatus, isOutdated });
  const ordered = orderThreadsForVerification([
    c('checked-fresh', 'still_present', false),
    c('new-outdated', null, true),
    c('checked-outdated', 'still_present', true),
    c('new-fresh', null, false),
  ]).map((t) => t.threadId);
  assert.deepEqual(ordered, ['new-outdated', 'new-fresh', 'checked-outdated', 'checked-fresh']);
});

check('classifyVerifyFile maps fetch outcome + file status to a disposition (B1)', () => {
  assert.equal(classifyVerifyFile('content', undefined), 'verify');
  assert.equal(classifyVerifyFile('missing', 'removed'), 'removed');
  assert.equal(classifyVerifyFile('missing', 'renamed'), 'moved'); // rename -> NOT auto-fixed
  assert.equal(classifyVerifyFile('missing', undefined), 'moved'); // unknown 404 -> NOT auto-fixed
  assert.equal(classifyVerifyFile('error', 'removed'), 'unfetched'); // fetch error -> never assume fixed
});

check('confirmedDeletion fast-paths a removed file ONLY when the PR has no non-removed files', () => {
  // Pure all-deletions PR (no non-removed files) -> no move destination -> resolve with no Claude call.
  assert.equal(confirmedDeletion('removed', false), true);
  // ANY added/modified file present (even one omitted from diffText for size/ignore) -> a "removed"
  // path may be a low-similarity rename (delete+add) whose code moved -> must go to Claude.
  assert.equal(confirmedDeletion('removed', true), false);
  // Only 'removed' is ever a candidate; renames/errors/normal files never auto-fix.
  assert.equal(confirmedDeletion('moved', false), false);
  assert.equal(confirmedDeletion('unfetched', false), false);
  assert.equal(confirmedDeletion('verify', false), false);
});

check('mapVerdictsToItems keys by unique ref so same-fp threads never collide (B2)', () => {
  // Two distinct threads, SAME fp (line-agnostic), different lines + refs.
  const items = [
    { ref: 't0', fp: 'samefp', threadId: 'A', line: 10 },
    { ref: 't1', fp: 'samefp', threadId: 'B', line: 99 },
  ];
  const mapped = mapVerdictsToItems(
    [
      { ref: 't1', status: 'fixed', reason: 'b' },
      { ref: 't0', status: 'still_present', reason: 'a' },
      { ref: 'bogus', status: 'fixed', reason: 'ignored' },
    ],
    items,
  );
  assert.equal(mapped.length, 2); // bogus ref dropped
  assert.deepEqual(
    mapped.map((m) => [m.item.threadId, m.status]),
    [['B', 'fixed'], ['A', 'still_present']],
  );
  // An out-of-enum status is coerced to 'unsure' (never silently treated as fixed).
  assert.equal(mapVerdictsToItems([{ ref: 't0', status: 'lol' }], items)[0].status, 'unsure');
});

check('diffIsComplete gates auto-resolve: false when any file was dropped for size or truncated', () => {
  assert.equal(diffIsComplete([], false), true); // whole change is in the diff -> safe to auto-resolve
  assert.equal(diffIsComplete(['huge.ts'], false), false); // a file omitted for size -> incomplete
  assert.equal(diffIsComplete([], true), false); // diff truncated past the budget -> incomplete
  assert.equal(diffIsComplete(['huge.ts'], true), false);
  assert.equal(diffIsComplete(undefined, undefined), true);
});

check('unjudgedThreads flags items Claude omitted, so a partial verdict set is not "complete"', () => {
  const items = [{ ref: 't0' }, { ref: 't1' }, { ref: 't2' }];
  // Claude returned verdicts for t0 and t2 only -> t1 went un-judged.
  const missing = unjudgedThreads(items, [
    { ref: 't0', status: 'fixed' },
    { ref: 't2', status: 'unsure' },
    { ref: 'bogus', status: 'fixed' }, // extra/hallucinated ref doesn't count as judging any item
  ]);
  assert.deepEqual(missing.map((i) => i.ref), ['t1']);
  // Every item judged -> nothing missing (verification is complete).
  assert.deepEqual(unjudgedThreads(items, [{ ref: 't0' }, { ref: 't1' }, { ref: 't2' }]), []);
  // No verdicts at all -> everything is missing.
  assert.equal(unjudgedThreads(items, []).length, 3);
});

check('isTrustedAuthor gates auto-resolve to the same set the workflow trusts', () => {
  for (const a of ['OWNER', 'MEMBER', 'COLLABORATOR', 'collaborator']) assert.equal(isTrustedAuthor(a), true);
  for (const a of ['CONTRIBUTOR', 'FIRST_TIME_CONTRIBUTOR', 'NONE', '', null, undefined]) {
    assert.equal(isTrustedAuthor(a), false);
  }
});

check('addUsage sums review + verification spend into one true total', () => {
  const review = { input_tokens: 700, cache_creation_input_tokens: 4000, cache_read_input_tokens: 0, output_tokens: 50 };
  const verify = { input_tokens: 300, cache_creation_input_tokens: 0, cache_read_input_tokens: 4000, output_tokens: 20 };
  const total = addUsage(review, verify);
  assert.deepEqual(total, {
    input_tokens: 1000,
    cache_creation_input_tokens: 4000,
    cache_read_input_tokens: 4000,
    output_tokens: 70,
  });
  // Combined total flows through the existing reporters; cost over the sum equals the sum of costs.
  assert.equal(summarizeUsage(total).totalInput, 9000);
  const pricing = { m: { input: 5, output: 25 } };
  assert.equal(
    estimateCostUsd(total, 'm', pricing).toFixed(6),
    (estimateCostUsd(review, 'm', pricing) + estimateCostUsd(verify, 'm', pricing)).toFixed(6),
  );
  // Absent verification usage (step skipped) leaves the review total unchanged; all-null -> null.
  assert.deepEqual(addUsage(review, null), { ...review });
  assert.equal(addUsage(null, undefined), null);
});

check('estimateInputTokens: char-based fallback so the budget gate never fails open', () => {
  const system = [{ text: 'a'.repeat(700) }, { text: 'b'.repeat(700) }]; // 1400 chars
  const user = 'c'.repeat(700); // 700 chars; 2100 total / 3.5 = 600
  assert.equal(estimateInputTokens(system, user), 600);
  // Conservative divisor over-counts vs a 4-chars/token rule, so it errs toward skipping near the cap.
  assert.ok(estimateInputTokens(system, user) > Math.ceil(2100 / 4));
  // An over-cap estimate trips the same gate the exact count would: 600k chars / 3.5 ≈ 171k > 150k.
  assert.ok(estimateInputTokens([{ text: 'x'.repeat(600000) }], '') > 150000);
  // Robust to missing/odd inputs.
  assert.equal(estimateInputTokens(null, null), 0);
  assert.equal(estimateInputTokens([{}], undefined), 0);
});

check('chunkSummaryComments posts EVERY finding (split across comments), dropping none', () => {
  const makeFinding = (i) => ({
    file: `src/file${i}.ts`,
    line: i,
    severity: 'low',
    confidence: 'medium',
    category: 'bug',
    title: `Finding ${i}`,
    body: 'x'.repeat(3000), // clamped to 2000 in the block, so each block is bounded
    suggestion: 'y'.repeat(3000),
    fp: `fp${i}`,
  });
  const many = Array.from({ length: 50 }, (_, i) => makeFinding(i));
  const chunks = chunkSummaryComments(many, 20000);
  // Every chunk is under the cap, and every finding lands in exactly one chunk (nothing dropped).
  assert.ok(chunks.length > 1, 'should split when over the cap');
  for (const c of chunks) {
    assert.ok(c.body.length <= 20000, `chunk body ${c.body.length} should be within the cap`);
    assert.ok(c.findings.length >= 1);
  }
  const totalPosted = chunks.reduce((n, c) => n + c.findings.length, 0);
  assert.equal(totalPosted, many.length); // postedGeneral will equal general.length only by posting ALL
  const refs = new Set(chunks.flatMap((c) => c.findings.map((f) => f.fp)));
  assert.equal(refs.size, many.length); // each finding present exactly once
  // Every finding carries its dedup marker on the PR.
  assert.match(chunks[0].body, /<!-- ai-reviewer v1 /);
  // Everything fits -> a single chunk.
  assert.equal(chunkSummaryComments([makeFinding(1)], 60000).length, 1);
  assert.equal(chunkSummaryComments([], 60000).length, 0);
});

check('parseImports extracts static, type, side-effect, re-export and dynamic specifiers', () => {
  const src = [
    "import a from './a';",
    "import { b } from '../b';",
    "import type { T } from './t';",
    "import * as ns from './ns';",
    "import './sideEffect.css';",
    "export { x } from './x';",
    "const m = await import('./dyn');",
    "import pkg from 'react';",
  ].join('\n');
  const specs = parseImports(src);
  for (const s of ['./a', '../b', './t', './ns', './sideEffect.css', './x', './dyn', 'react']) {
    assert.ok(specs.includes(s), `missing ${s}`);
  }
  assert.equal(isLocalSpecifier('./a'), true);
  assert.equal(isLocalSpecifier('../b'), true);
  assert.equal(isLocalSpecifier('react'), false);
});

check('resolveImportPath probes extensions and falls through to index files', () => {
  const FS = new Set([
    'pkg/stories/useState.ts',
    'pkg/components/BottomSheet/index.ts',
    'pkg/components/BottomSheet/BottomSheet.tsx',
  ]);
  const isFile = (p) => FS.has(p);
  // bare relative -> .ts
  assert.equal(resolveImportPath('pkg/stories/Mobile.tsx', './useState', isFile), 'pkg/stories/useState.ts');
  // directory import -> index.ts (because the dir itself is not a file)
  assert.equal(
    resolveImportPath('pkg/stories/Mobile.tsx', '../components/BottomSheet', isFile),
    'pkg/components/BottomSheet/index.ts',
  );
  // unresolvable
  assert.equal(resolveImportPath('pkg/stories/Mobile.tsx', './nope', isFile), null);
});

const CONTEXT_FS = {
  'pkg/stories/Mobile.stories.tsx':
    "import { BottomSheet } from '../components/BottomSheet';\nimport { useS } from './useState';",
  'pkg/stories/useState.ts': 'export const useS = () => {};',
  'pkg/components/BottomSheet/index.ts': "export { BottomSheet } from './BottomSheet';",
  'pkg/components/BottomSheet/BottomSheet.tsx':
    "import { useDragToDismiss } from '../../hooks/useDragToDismiss';\nexport const BottomSheet = 1;",
  'pkg/hooks/useDragToDismiss.ts': 'export const useDragToDismiss = () => {};',
};
const posixDir = (p) => p.slice(0, p.lastIndexOf('/'));
const posixBase = (p) => p.slice(p.lastIndexOf('/') + 1);
const ctxAccessors = {
  read: (p) => CONTEXT_FS[p] ?? null,
  isFile: (p) => p in CONTEXT_FS,
  listDir: (dir) => Object.keys(CONTEXT_FS).filter((p) => posixDir(p) === dir).map(posixBase),
};
const ctxConfig = (over) => ({
  ...DEFAULT_CONFIG,
  ignore: [],
  contextExtensions: ['.ts', '.tsx', '.css'],
  importExtensions: ['.ts', '.tsx'],
  maxReferenceFiles: 50,
  maxContextFileBytes: 60000,
  maxReferenceChars: 300000,
  includeSiblingFiles: true,
  followImports: true,
  importDepth: 2,
  ...over,
});

check('gatherContextFiles follows imports through barrels to depth 2 (reaches the deep hook)', () => {
  const out = gatherContextFiles({
    changedPaths: ['pkg/stories/Mobile.stories.tsx'],
    ...ctxAccessors,
    config: ctxConfig(),
  });
  const paths = out.map((f) => f.path).sort();
  assert.deepEqual(paths, [
    'pkg/components/BottomSheet/BottomSheet.tsx', // depth 1 (barrel index.ts was transparent)
    'pkg/hooks/useDragToDismiss.ts', // depth 2 — the deep target Tier 2 is meant to reach
    'pkg/stories/useState.ts', // sibling
  ]);
  // the barrel itself and the changed file are never emitted as context
  assert.ok(!paths.includes('pkg/components/BottomSheet/index.ts'));
  assert.ok(!paths.includes('pkg/stories/Mobile.stories.tsx'));
});

check('gatherContextFiles respects importDepth (1 stops before the hook)', () => {
  const out = gatherContextFiles({
    changedPaths: ['pkg/stories/Mobile.stories.tsx'],
    ...ctxAccessors,
    config: ctxConfig({ importDepth: 1 }),
  });
  const paths = out.map((f) => f.path).sort();
  assert.deepEqual(paths, ['pkg/components/BottomSheet/BottomSheet.tsx', 'pkg/stories/useState.ts']);
  assert.ok(!paths.includes('pkg/hooks/useDragToDismiss.ts')); // depth 2 not reached
});

check('gatherContextFiles enforces the maxReferenceFiles cap', () => {
  const out = gatherContextFiles({
    changedPaths: ['pkg/stories/Mobile.stories.tsx'],
    ...ctxAccessors,
    config: ctxConfig({ maxReferenceFiles: 1 }),
  });
  assert.equal(out.length, 1);
});

check('buildFileContextSection numbers changed files and labels reference files as do-not-report', () => {
  const section = buildFileContextSection(
    [{ path: 'a.tsx', content: 'const x = 1;\nconst y = 2;' }],
    [{ path: 'b.ts', kind: 'import', content: 'export const z = 3;' }],
  );
  assert.match(section, /CHANGED FILES/);
  assert.match(section, /### a\.tsx/);
  assert.match(section, /1 {2}const x = 1;/); // line-numbered
  assert.match(section, /REFERENCE FILES/);
  assert.match(section, /do NOT report issues/i);
  assert.match(section, /### b\.ts {2}\(import\)/);
});

check('confineToRepo refuses paths that escape the repo (PR-controlled import strings)', () => {
  const root = '/work/repo';
  // in-repo paths resolve normally
  assert.equal(confineToRepo(root, 'packages/ds/src/a.ts'), '/work/repo/packages/ds/src/a.ts');
  assert.equal(confineToRepo(root, 'a/b/../c.ts'), '/work/repo/a/c.ts');
  assert.equal(confineToRepo(root, '.'), root); // the root itself is allowed
  // escapes are refused
  assert.equal(confineToRepo(root, '../../../../tmp/evil.js'), null);
  assert.equal(confineToRepo(root, 'packages/../../etc/passwd'), null);
  // a sibling dir that merely shares a name prefix must NOT pass (the `+ sep` guard)
  assert.equal(confineToRepo(root, '../repo-evil/x.js'), null);
});

check('filterFindings drops off-diff findings unless high-confidence (Tier 2 noise guard)', () => {
  const commentableByFile = new Map([['a.ts', new Set([10])]]);
  const config = { ...DEFAULT_CONFIG, minConfidence: 'low', minSeverity: 'low', maxFindings: 25 };
  const raw = [
    { file: 'a.ts', line: 99, severity: 'high', confidence: 'medium', category: 'bug', title: 'pre-existing medium off-diff', body: '', suggestion: '' },
    { file: 'a.ts', line: 99, severity: 'high', confidence: 'high', category: 'bug', title: 'strong off-diff', body: '', suggestion: '' },
    { file: 'a.ts', line: 10, severity: 'low', confidence: 'low', category: 'bug', title: 'inline low conf', body: '', suggestion: '' },
  ];
  const { findings, dropped, offDiffDropped } = filterFindings(raw, { config, commentableByFile, seenFingerprints: new Set() });
  const titles = findings.map((f) => f.title);
  assert.ok(!titles.includes('pre-existing medium off-diff')); // off-diff + below high -> dropped
  assert.equal(dropped.offDiff, 1);
  assert.ok(titles.includes('strong off-diff')); // off-diff but high-confidence -> kept
  assert.ok(titles.includes('inline low conf')); // inline (added line) -> not subject to the guard
  // the dropped finding is returned with detail so main() can log exactly what was filtered
  assert.deepEqual(offDiffDropped, [
    { file: 'a.ts', line: 99, confidence: 'medium', category: 'bug', title: 'pre-existing medium off-diff' },
  ]);
});

console.log(`\nAll ${passed} self-tests passed.`);
