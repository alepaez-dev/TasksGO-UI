import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  validateRootCauses,
  renderRootCauseComment,
  parseRootCauseMarkers,
  planRootCausePosts,
  extractFindingBody,
  renderAlreadyReported,
  groupScanByOrigin,
  unclusteredGroups,
  checkMechanismCitation,
  mechanismKey,
  coveredConcernsSharingOrigin,
  resolveCitationLine,
  renderRootCauseCorrection,
} from './root-causes.mjs';

const PREFIX = 'ai-reviewer-tier3';

function headRoot() {
  const root = mkdtempSync(join(tmpdir(), 't3rc-'));
  mkdirSync(join(root, 'hooks'));
  writeFileSync(join(root, 'hooks', 'useOverlayLifecycle.ts'), 'a\nb\n  return { shouldRender: open || isClosing, isVisible, backdropRef };\n');
  return root;
}
const MECH = 'hooks/useOverlayLifecycle.ts:3 return { shouldRender: open || isClosing, isVisible, backdropRef };';

const cluster = {
  title: 'OverlayShell leaves the exit window to every consumer',
  sharedMechanism: MECH,
  members: [
    { title: 'Preview overlay blanks its content during the close fade', how: 'content props die while shouldRender is still true' },
    { title: 'Preview chrome stays clickable during the close fade', how: 'pointer-events stay auto while shouldRender is still true' },
  ],
  recommendation: 'Make the shell own the exit window: inert while not visible, snapshot children while closing.',
  nextSymptom: 'the next consumer that reads a value derived from open will show the same blank or clickable interval',
};
const ok = () => ({ ok: true });

test('validateRootCauses keeps a cluster whose members are all filed or already reported', () => {
  const { kept, problems } = validateRootCauses([cluster], {
    filedTitles: ['Preview overlay blanks its content during the close fade'],
    knownTitles: ['preview chrome stays clickable during the close fade'],
    checkCitation: ok,
  });
  assert.equal(kept.length, 1);
  assert.deepEqual(problems, []);
});

test('validateRootCauses reports a member that is neither filed nor already reported', () => {
  const { kept, problems } = validateRootCauses([cluster], { filedTitles: [cluster.members[0].title], knownTitles: [], checkCitation: ok });
  assert.equal(kept.length, 0);
  assert.deepEqual(problems, [{ title: cluster.title, problem: 'unfiled-member', detail: 'Preview chrome stays clickable during the close fade' }]);
});

test('validateRootCauses reports fewer than two members, a missing nextSymptom, and a citation not found at head', () => {
  const titles = cluster.members.map((m) => m.title);
  const one = validateRootCauses([{ ...cluster, members: [cluster.members[0]] }], { filedTitles: titles, checkCitation: ok });
  assert.equal(one.problems[0].problem, 'too-few-members');
  const noNext = validateRootCauses([{ ...cluster, nextSymptom: '' }], { filedTitles: titles, checkCitation: ok });
  assert.equal(noNext.problems[0].problem, 'missing-next-symptom');
  const bad = validateRootCauses([cluster], { filedTitles: titles, checkCitation: () => ({ ok: false, reason: 'no such file' }) });
  assert.deepEqual(bad.problems, [{ title: cluster.title, problem: 'citation-not-found', detail: 'no such file' }]);
  assert.equal(bad.kept.length, 0);
});

test('checkMechanismCitation accepts a line that exists at head and rejects a missing file or absent text', () => {
  const root = headRoot();
  assert.deepEqual(checkMechanismCitation(MECH, { root }), { ok: true, line: 3 });
  assert.equal(checkMechanismCitation('hooks/nope.ts:3 return x;', { root }).ok, false);
  assert.equal(checkMechanismCitation('hooks/useOverlayLifecycle.ts:3 return { somethingElse }', { root }).ok, false);
  assert.equal(checkMechanismCitation('hooks/useOverlayLifecycle.ts:1 a', { root }).ok, true, 'short fragments are matched too');
  assert.equal(checkMechanismCitation('no path here', { root }).ok, false);
  assert.equal(checkMechanismCitation('../etc/passwd:1 root', { root }).ok, false, 'never reads outside the head');
});

test('checkMechanismCitation rejects an in-repo symlink whose target escapes the head', () => {
  const root = headRoot();
  const outside = join(mkdtempSync(join(tmpdir(), 't3rc-out-')), 'secret.txt');
  writeFileSync(outside, 'TOKEN=abc\n');
  symlinkSync(outside, join(root, 'hooks', 'leak.txt'));
  const res = checkMechanismCitation('hooks/leak.txt:1 token=abc', { root });
  assert.equal(res.ok, false);
  assert.match(res.reason, /outside the PR head/);
});

test('checkMechanismCitation accepts every separator form the harness itself writes', () => {
  const root = headRoot();
  const forms = [
    'hooks/useOverlayLifecycle.ts:3 `return { shouldRender: open || isClosing, isVisible, backdropRef };`',
    'hooks/useOverlayLifecycle.ts:3 — return { shouldRender: open || isClosing, isVisible, backdropRef };',
    'hooks/useOverlayLifecycle.ts:3 – return { shouldRender: open || isClosing',
    'hooks/useOverlayLifecycle.ts:3: return { shouldRender: open || isClosing',
    '`hooks/useOverlayLifecycle.ts:3` — `return { shouldRender: open || isClosing`',
    'hooks/useOverlayLifecycle.ts:3 (`return { shouldRender: open || isClosing`)',
    'hooks/useOverlayLifecycle.ts:3 ("return { shouldRender: open || isClosing")',
  ];
  for (const f of forms) assert.equal(checkMechanismCitation(f, { root }).ok, true, f);
  assert.equal(checkMechanismCitation('hooks/useOverlayLifecycle.ts:3 — `return { somethingElse }`', { root }).ok, false, 'a wrong quote is still rejected');
});

test('checkMechanismCitation matches the quoted text near the cited line, not anywhere in the file', () => {
  const root = headRoot();
  writeFileSync(join(root, 'hooks', 'far.ts'), ['const x = useThing();', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'const x = useThing();'].join('\n'));
  assert.deepEqual(checkMechanismCitation('hooks/far.ts:1 const x = useThing();', { root }), { ok: true, line: 1 });
  assert.deepEqual(checkMechanismCitation('hooks/far.ts:3 const x = useThing();', { root }), { ok: true, line: 1 }, 'within two lines resolves to the real line');
  const far = checkMechanismCitation('hooks/far.ts:5 const x = useThing();', { root });
  assert.equal(far.ok, false);
  assert.match(far.reason, /within 2 lines of hooks\/far\.ts:5/);
  assert.deepEqual(checkMechanismCitation('hooks/far.ts:4', { root }), { ok: true, line: 4 }, 'no quoted text keeps the cited line');
});

test('resolveCitationLine returns the real line or null', () => {
  const root = headRoot();
  assert.equal(resolveCitationLine('hooks/useOverlayLifecycle.ts:2 return { shouldRender', { root }), 3);
  assert.equal(resolveCitationLine('hooks/useOverlayLifecycle.ts:3 nothing like this', { root }), null);
  assert.equal(resolveCitationLine('nope.ts:1 x', { root }), null);
});

test('groupScanByOrigin groups off-by-one citations of one line when given a resolver', () => {
  const scan = [
    { title: 'a', status: 'filed', failsAt: 'x:1 y', originatesAt: 'hooks/useOverlayLifecycle.ts:3 return { shouldRender' },
    { title: 'b', status: 'filed', failsAt: 'x:2 y', originatesAt: 'hooks/useOverlayLifecycle.ts:2 return { shouldRender' },
    { title: 'c', status: 'filed', failsAt: 'x:3 y', originatesAt: 'hooks/useOverlayLifecycle.ts:1' },
  ];
  assert.equal(groupScanByOrigin(scan).length, 0, 'without a resolver the numbers split them');
  const root = headRoot();
  const groups = groupScanByOrigin(scan, { resolveLine: (c) => resolveCitationLine(c, { root }) });
  assert.equal(groups.length, 1);
  assert.deepEqual(groups[0].titles, ['a', 'b']);
  assert.equal(groups[0].line, 'hooks/useOverlayLifecycle.ts:3');
});

test('mechanismKey ignores the quoted text, whitespace and case so two citations of one line match', () => {
  assert.equal(mechanismKey('hooks/useOverlayLifecycle.ts:97 return { shouldRender }'), mechanismKey('  hooks/useOverlayLifecycle.ts:97  `return {...}`'));
  assert.notEqual(mechanismKey('a.ts:1 x'), mechanismKey('a.ts:2 x'));
  assert.equal(mechanismKey('no line'), null);
});

test('groupScanByOrigin groups scan entries by originatesAt, not by failsAt, and drops singletons', () => {
  const scan = [
    { title: 'blanks', status: 'already-reported', failsAt: 'stories/TicketOverviewDesktop.stories.tsx:750 files={previewScenario?.evidence ?? []}', originatesAt: 'hooks/useOverlayLifecycle.ts:97 return { shouldRender: open || isClosing }' },
    { title: 'clickable', status: 'already-reported', failsAt: 'FilePreviewOverlay.module.css:30 pointer-events: auto', originatesAt: 'hooks/useOverlayLifecycle.ts:97 shouldRender' },
    { title: 'snaps', status: 'already-reported', failsAt: 'TestScenarioCard.stories.tsx:197 previewIndex', originatesAt: 'hooks/useOverlayLifecycle.ts:97' },
    { title: 'zip drops files', status: 'filed', failsAt: 'FilePreviewOverlay.tsx:142 if (zipFiles.length === 0) return;', originatesAt: 'FilePreviewOverlay.tsx:142 if (zipFiles.length === 0) return;' },
    { title: 'garbage', status: 'filed', failsAt: 'none', originatesAt: 'none' },
  ];
  const groups = groupScanByOrigin(scan);
  assert.equal(groups.length, 1);
  assert.deepEqual(groups.find((g) => /useOverlayLifecycle/.test(g.line)).titles, ['blanks', 'clickable', 'snaps']);
  assert.equal(groups.find((g) => /142/.test(g.line)), undefined, 'a single entry on a line is not a group');
});

test('coveredConcernsSharingOrigin names a dismissed-as-covered entry whose origin another entry also cites', () => {
  const scan = [
    { title: 'clickable', status: 'already-reported', failsAt: 'a.css:30 x', originatesAt: 'hooks/useOverlayLifecycle.ts:97 shouldRender' },
    { title: 'focus restored mid-fade', status: 'dismissed-as-covered', failsAt: 'hooks/useFocusTrap.ts:60 focus()', originatesAt: 'hooks/useOverlayLifecycle.ts:97 shouldRender' },
    { title: 'lonely', status: 'dismissed-as-covered', failsAt: 'z.ts:1 a', originatesAt: 'z.ts:1 a' },
  ];
  const out = coveredConcernsSharingOrigin(scan);
  assert.deepEqual(out, [{ title: 'focus restored mid-fade', line: 'hooks/useOverlayLifecycle.ts:97', sharedWith: ['clickable'] }]);
  const withDup = [...scan, { title: 'same bug reworded', status: 'duplicate-of-reported', failsAt: 'a.css:30 x', originatesAt: 'hooks/useOverlayLifecycle.ts:97' }];
  assert.equal(coveredConcernsSharingOrigin(withDup).length, 1, 'a recorded duplicate is neither bounced nor counted as a sharer');
  assert.deepEqual(coveredConcernsSharingOrigin(withDup)[0].sharedWith, ['clickable']);
});

test('unclusteredGroups returns the groups no cluster names in full', () => {
  const groups = [{ line: 'h.ts:97', titles: ['blanks', 'clickable', 'snaps'] }, { line: 'z.ts:1', titles: ['a', 'b'] }];
  const clusters = [{ members: [{ title: 'Blanks' }, { title: 'clickable' }, { title: 'snaps' }] }];
  const out = unclusteredGroups(groups, clusters);
  assert.deepEqual(out.map((g) => g.line), ['z.ts:1']);
  assert.equal(unclusteredGroups(groups, []).length, 2);
});

test('renderRootCauseComment carries a marker that parseRootCauseMarkers reads back', () => {
  const body = renderRootCauseComment(
    {
      ...cluster,
      fp: 'abc123',
      members: [
        { fp: 'fp1', title: cluster.members[0].title, file: 'a.tsx', how: cluster.members[0].how },
        { fp: 'fp2', title: cluster.members[1].title, file: 'b.css', how: cluster.members[1].how },
      ],
    },
    PREFIX,
  );
  assert.match(body, /Shared root cause · 2 findings/);
  assert.match(body, /produced 2 of the findings on this PR/i);
  assert.match(body, /fix(ing)? it at the source/i);
  assert.match(body, /useOverlayLifecycle\.ts:3/);
  assert.match(body, /content props die while shouldRender/);
  assert.match(body, /Left as is[^\n]*next consumer/);
  assert.match(body, /each member is still reported on its own/i);
  const [marker] = parseRootCauseMarkers(body, PREFIX);
  assert.equal(marker.fp, 'abc123');
  assert.deepEqual(marker.members.map((m) => m.fp), ['fp1', 'fp2']);
  assert.equal(marker.members[0].file, 'a.tsx');
  assert.equal(marker.members[0].how, cluster.members[0].how, 'the marker keeps each member\'s explanation so an update can re-render it');
  assert.equal(marker.title, cluster.title);
});

test('a root-cause marker is not mistaken for a finding marker', async () => {
  const { parseMarkers } = await import('../ai-reviewer/review.mjs');
  const body = renderRootCauseComment({ ...cluster, fp: 'abc123', members: [{ fp: 'fp1', title: 'a', file: 'a.tsx' }, { fp: 'fp2', title: 'b', file: 'b.css' }] }, PREFIX);
  assert.equal(parseMarkers(body, PREFIX).length, 0);
});

test('planRootCausePosts updates a prior cluster that shares a member and creates the rest', () => {
  const m = (fp) => ({ fp, title: `t-${fp}`, file: `${fp}.ts`, how: `how-${fp}` });
  const prior = [{ id: 11, fp: 'old', title: 'old title', members: [m('fp1'), m('fp2')], mechanism: 'x.ts:1' }];
  const fresh = [
    { ...cluster, fp: 'new1', members: [m('fp2'), m('fp3')] },
    { ...cluster, title: 'unrelated', fp: 'new2', members: [m('fp8'), m('fp9')] },
  ];
  const { update, create, unchanged } = planRootCausePosts(prior, fresh);
  assert.equal(update.length, 1);
  assert.equal(update[0].id, 11);
  assert.deepEqual(update[0].rootCause.members.map((x) => x.fp), ['fp1', 'fp2', 'fp3']);
  assert.deepEqual(update[0].rootCause.members.map((x) => x.how), ['how-fp1', 'how-fp2', 'how-fp3'], 'prior members keep their explanation on merge');
  assert.equal(update[0].rootCause.fp, 'old');
  assert.equal(unchanged.length, 0);
  assert.equal(create.length, 1);
  assert.equal(create[0].fp, 'new2');
});

test('extractFindingBody keeps the finding text and drops the header, footer and marker', () => {
  const comment = [
    '**🎨 Frontend · ⚪ Low** — Preview overlay blanks its content during the close fade',
    '',
    '`files` is derived from `evidencePreview`, so `open` flips to false and `files` becomes `[]` in the same commit.',
    '',
    '**Suggested fix:** Keep the last previewed scenario while the overlay is closing.',
    '',
    '<sub>🤖 AI bug review (Claude) · confidence: high.</sub>',
    '<!-- ai-reviewer-tier3 v1 {"fp":"x"} -->',
  ].join('\n');
  const body = extractFindingBody(comment);
  assert.match(body, /derived from `evidencePreview`/);
  assert.match(body, /Suggested fix/);
  assert.doesNotMatch(body, /Frontend · ⚪ Low/);
  assert.doesNotMatch(body, /AI bug review/);
  assert.doesNotMatch(body, /<!--/);
});

test('renderAlreadyReported includes a body when one is known and stays title-only otherwise', () => {
  const text = renderAlreadyReported([
    { file: 'a.tsx', title: 'first', sha: 'a466eb7c612c', body: 'the mechanism is X' },
    { file: 'b.css', title: 'second' },
  ]);
  assert.match(text, /- a\.tsx: first \(reported at a466eb7\)\n {2}the mechanism is X/);
  assert.match(text, /- b\.css: second(\n|$)/);
  assert.match(text, /de-duplication/);
  const fixed = renderAlreadyReported([{ file: 'a.tsx', title: 'first', sha: 'a466eb7c612c', fixed: true, fixedSha: '5ab79a784adf' }]);
  assert.match(fixed, /- a\.tsx: first \(reported at a466eb7, fixed at 5ab79a7\)/);
});

test('renderRootCauseComment says so when every member is already fixed in place', () => {
  const members = [
    { fp: 'fp1', title: 'label match', file: 'a.tsx', how: 'h', fixed: true },
    { fp: 'fp2', title: 'positional index', file: 'b.tsx', how: 'h', fixed: true },
  ];
  const body = renderRootCauseComment({ ...cluster, fp: 'x', members }, PREFIX);
  assert.match(body, /produced 2 of the findings on this PR, all since fixed in place/i);
  assert.match(body, /mechanism (is still there|remains)/i);
  const mixed = renderRootCauseComment({ ...cluster, fp: 'x', members: [members[0], { ...members[1], fixed: false }] }, PREFIX);
  assert.doesNotMatch(mixed, /all since fixed/i);
});


test('renderRootCauseCorrection writes one line per problem code, group and covered concern, and nothing when there is nothing', () => {
  assert.equal(renderRootCauseCorrection({ problems: [], unclustered: [], coveredMembers: [] }), '');
  const text = renderRootCauseCorrection({
    problems: [
      { title: 'c1', problem: 'unfiled-member', detail: 'ghost' },
      { title: 'c2', problem: 'citation-not-found', detail: 'no such file' },
      { title: 'c3', problem: 'missing-next-symptom', detail: '' },
      { title: 'c4', problem: 'too-few-members', detail: '1 member(s)' },
    ],
    unclustered: [{ line: 'h.ts:97', titles: ['a', 'b'] }],
    coveredMembers: [{ title: 'f', line: 'h.ts:97', sharedWith: ['a'] }],
  });
  assert.match(text, /^ROOT CAUSES/);
  assert.match(text, /"c1": member "ghost" is not in `findings`/);
  assert.match(text, /"c2": sharedMechanism does not match the PR head \(no such file\)/);
  assert.match(text, /"c3": no nextSymptom/);
  assert.match(text, /"c4": too-few-members \(1 member\(s\)\)/);
  assert.match(text, /h\.ts:97 is the origin of "a", "b"/);
  assert.match(text, /"f" was set aside as covered.*MEMBER/);
  assert.match(text, /duplicate-of-reported/);
  assert.match(text, /in ADDITION to its findings/);
});
