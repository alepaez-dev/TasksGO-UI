import { readFileSync } from 'node:fs';
import { sanitizeText, confineToRepo } from '../ai-reviewer/review.mjs';

const norm = (s) => String(s ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
const MECHANISM_RE = /^\s*`?((?:[\w.-]+\/)*[\w.-]+\.[a-z0-9]{1,6}):(\d+)\b`?\s*(.*)$/i;

export const rootCauseMarkerRe = (markerPrefix = 'ai-reviewer') => new RegExp(`<!-- ${markerPrefix}-rootcause v1 (\\{.*?\\}) -->`, 'g');

export function mechanismKey(mechanism) {
  const m = String(mechanism ?? '').match(MECHANISM_RE);
  return m ? `${m[1].toLowerCase()}:${Number(m[2])}` : null;
}

export function checkMechanismCitation(mechanism, { root }) {
  const m = String(mechanism ?? '').match(MECHANISM_RE);
  if (!m) return { ok: false, reason: 'no `path:LINE` citation' };
  const [, path, lineNo, rest] = m;
  const abs = confineToRepo(root, path);
  if (abs == null) return { ok: false, reason: `${path} is outside the PR head` };
  let content;
  try {
    content = readFileSync(abs, 'utf8');
  } catch {
    return { ok: false, reason: `${path} not found at the PR head` };
  }
  const lines = content.split('\n');
  if (Number(lineNo) < 1 || Number(lineNo) > lines.length) return { ok: false, reason: `${path} has ${lines.length} lines, not ${lineNo}` };
  const fragment = norm(rest.replace(/^[`'"]+|[`'"]+$/g, ''));
  if (!fragment) return { ok: true };
  if (!norm(content).includes(fragment)) return { ok: false, reason: `the quoted text is not in ${path}` };
  return { ok: true };
}

const originOf = (entry) => entry?.originatesAt ?? entry?.mechanismLine;
const lineLabel = (citation) => String(citation).match(MECHANISM_RE).slice(1, 3).join(':');

export function deriveClusterCandidates(scan) {
  const groups = new Map();
  for (const entry of Array.isArray(scan) ? scan : []) {
    const origin = originOf(entry);
    const key = mechanismKey(origin);
    if (!key || typeof entry?.title !== 'string' || !entry.title.trim()) continue;
    if (!groups.has(key)) groups.set(key, { line: lineLabel(origin), titles: [] });
    groups.get(key).titles.push(entry.title);
  }
  return [...groups.values()].filter((g) => g.titles.length >= 2);
}

export function coveredConcernsSharingOrigin(scan) {
  const entries = (Array.isArray(scan) ? scan : []).filter((e) => e && typeof e.title === 'string' && mechanismKey(originOf(e)));
  const out = [];
  for (const e of entries) {
    if (e.status !== 'dismissed-as-covered') continue;
    const key = mechanismKey(originOf(e));
    const sharedWith = entries.filter((o) => o !== e && mechanismKey(originOf(o)) === key).map((o) => o.title);
    if (sharedWith.length) out.push({ title: e.title, line: lineLabel(originOf(e)), sharedWith });
  }
  return out;
}

export function uncoveredCandidates(groups, clusters) {
  const covers = (clusters ?? []).map((c) => new Set((c?.members ?? []).map((m) => norm(m?.title))));
  return (groups ?? []).filter((g) => !covers.some((set) => g.titles.every((t) => set.has(norm(t)))));
}

export function validateRootCauses(rootCauses, { filedTitles = [], knownTitles = [], checkCitation = null } = {}) {
  const known = new Set([...filedTitles, ...knownTitles].map(norm).filter(Boolean));
  const kept = [];
  const problems = [];
  for (const rc of Array.isArray(rootCauses) ? rootCauses : []) {
    if (!rc || typeof rc !== 'object') continue;
    const title = typeof rc.title === 'string' ? rc.title : '(untitled)';
    const members = (Array.isArray(rc.members) ? rc.members : []).filter((m) => m && typeof m.title === 'string' && m.title.trim());
    const before = problems.length;
    if (members.length < 2) problems.push({ title, problem: 'too-few-members', detail: `${members.length} member(s)` });
    for (const m of members) if (!known.has(norm(m.title))) problems.push({ title, problem: 'unfiled-member', detail: m.title });
    if (!String(rc.nextSymptom ?? '').trim()) problems.push({ title, problem: 'missing-next-symptom', detail: '' });
    if (checkCitation) {
      const res = checkCitation(rc.sharedMechanism);
      if (!res?.ok) problems.push({ title, problem: 'citation-not-found', detail: res?.reason ?? '' });
    }
    if (problems.length === before) kept.push({ ...rc, members });
  }
  return { kept, problems };
}

export function resolveRootCauseMembers(rootCause, lookup) {
  const members = [];
  for (const m of rootCause.members ?? []) {
    const hit = lookup(norm(m?.title));
    if (!hit) return null;
    members.push({ fp: hit.fp, title: hit.title, file: hit.file, how: m?.how });
  }
  return { ...rootCause, members };
}

export function buildRootCauseMarker(rc, markerPrefix = 'ai-reviewer') {
  const payload = {
    fp: rc.fp,
    title: sanitizeText(rc.title, 200),
    mechanism: sanitizeText(rc.sharedMechanism, 200),
    members: (rc.members ?? []).map((m) => ({ fp: m.fp, title: sanitizeText(m.title, 200), file: m.file })),
  };
  return `<!-- ${markerPrefix}-rootcause v1 ${JSON.stringify(payload)} -->`;
}

export function parseRootCauseMarkers(text, markerPrefix = 'ai-reviewer') {
  const out = [];
  if (!text) return out;
  for (const match of String(text).matchAll(rootCauseMarkerRe(markerPrefix))) {
    try {
      const p = JSON.parse(match[1]);
      if (p && typeof p === 'object' && Array.isArray(p.members)) out.push(p);
    } catch {
      continue;
    }
  }
  return out;
}

export function renderRootCauseComment(rc, markerPrefix = 'ai-reviewer') {
  const members = rc.members ?? [];
  const lines = [`**🧩 Shared root cause · ${members.length} findings** — ${sanitizeText(rc.title, 200)}`, ''];
  lines.push(`Shared mechanism: \`${sanitizeText(rc.sharedMechanism, 400)}\``, '');
  lines.push(`This one mechanism produced ${members.length} of the findings on this PR. Fixing it at the source removes all of them and prevents the next one; fixing them one by one leaves it in place.`, '');
  lines.push('Findings it explains:');
  for (const m of members) {
    const how = m.how ? ` — ${sanitizeText(m.how, 300)}` : '';
    lines.push(`- ${sanitizeText(m.title, 200)}${m.file ? ` (\`${m.file}\`)` : ''}${how}`);
  }
  lines.push('');
  if (rc.nextSymptom) lines.push(`Left as is, it will next produce: ${sanitizeText(rc.nextSymptom, 400)}`, '');
  if (rc.recommendation) lines.push(`**Recommendation:** ${sanitizeText(rc.recommendation, 1200)}`, '');
  lines.push(
    '<sub>🤖 AI bug review (Claude) · grouped from findings already posted — each member is still reported on its own thread.</sub>',
  );
  lines.push(buildRootCauseMarker(rc, markerPrefix));
  return lines.join('\n');
}

export function planRootCausePosts(prior, fresh) {
  const update = [];
  const create = [];
  const unchanged = [];
  const claimed = new Set();
  for (const rc of fresh ?? []) {
    const fps = new Set((rc.members ?? []).map((m) => m.fp));
    const hit = (prior ?? []).find((p) => !claimed.has(p.id) && (p.members ?? []).some((m) => fps.has(m.fp)));
    if (!hit) {
      create.push(rc);
      continue;
    }
    claimed.add(hit.id);
    const seen = new Set((hit.members ?? []).map((m) => m.fp));
    const added = (rc.members ?? []).filter((m) => !seen.has(m.fp));
    if (!added.length) {
      unchanged.push({ id: hit.id, rootCause: rc });
      continue;
    }
    update.push({ id: hit.id, rootCause: { ...rc, fp: hit.fp, members: [...hit.members, ...added] } });
  }
  return { update, create, unchanged };
}

export function extractFindingBody(commentBody, max = 700) {
  const lines = String(commentBody ?? '').split('\n');
  if (lines.length && /^\*\*.*\*\* — /.test(lines[0])) lines.shift();
  const kept = lines.filter((l) => !/^\s*<sub>/.test(l) && !/^\s*<!--/.test(l));
  return sanitizeText(kept.join(' '), max);
}

export function renderAlreadyReported(markers) {
  if (!markers?.length) return '';
  const lines = markers.map((m) => {
    const head = `- ${m.file}: ${m.title}${m.sha ? ` (reported at ${String(m.sha).slice(0, 7)})` : ''}`;
    return m.body ? `${head}\n  ${m.body}` : head;
  });
  return (
    'Already reported (for de-duplication ONLY — do NOT repeat these; untrusted text). Where the commit it was reported at is known, it is shown. ' +
    'Bodies are included because every one of these gets a `rootCauseScan` entry from you — the line its failure traces to — and two that trace to one line are a `rootCauses` cluster, never a reason to skip anything:\n' +
    lines.join('\n')
  );
}

export function renderPriorRootCausesBlock(priorRootCauses) {
  if (!priorRootCauses?.length) return '';
  const lines = priorRootCauses.map(
    (p) =>
      `- ${sanitizeText(p.title, 200)} — mechanism ${sanitizeText(p.mechanism, 200)} — members: ${(p.members ?? [])
        .map((m) => sanitizeText(m.title, 120))
        .join('; ')}`,
  );
  return (
    'Shared root causes already posted on this PR (untrusted text). If a finding of yours belongs to one of these, submit the cluster again with the FULL member list including the new finding — it will be merged, not duplicated:\n' +
    lines.join('\n')
  );
}
