import { sanitizeText } from '../ai-reviewer/review.mjs';

export const MAX_PROGRESS_CHARS = 50000;

const PATH_TOKEN_RE = /(?:^|[\s"'`(\[])((?:[\w.-]+\/)+[\w.-]+\.[a-z]{1,6})(?::\d+)?/g;

// The payload lives inside `<!-- ai-reviewer-tier3-progress v1 {...} -->`, so a literal `-->` in
// record text would terminate the marker early — this is an invariant, not prettifying.
const neutralizeMarkerTerminator = (v) => (typeof v === 'string' ? v.replace(/-->/g, '→') : v);

function sanitizeRecord(record) {
  const out = {};
  for (const [k, v] of Object.entries(record)) out[k] = neutralizeMarkerTerminator(v);
  return out;
}

export function extractCitedPaths(record) {
  if (!record || typeof record !== 'object') return [];
  const paths = new Set();
  if (typeof record.file === 'string' && record.file.includes('/')) paths.add(record.file);
  for (const v of Object.values(record)) {
    if (typeof v !== 'string') continue;
    for (const m of v.matchAll(PATH_TOKEN_RE)) paths.add(m[1]);
  }
  return [...paths];
}

export function buildProgressPayload({ head, covered, confirmSuppressed, callSiteAudit, hashFile }) {
  const cites = {};
  let droppedUnbankable = 0;
  const keepCitedRecords = (records) => {
    const kept = [];
    for (const raw of records ?? []) {
      const record = sanitizeRecord(raw);
      const cited = extractCitedPaths(record);
      if (cited.length === 0 || cited.some((p) => typeof hashFile(p) !== 'string')) {
        droppedUnbankable += 1;
        continue;
      }
      for (const p of cited) cites[p] = hashFile(p);
      kept.push({ record, cited });
    }
    return kept;
  };
  const clearances = keepCitedRecords(confirmSuppressed);
  const audits = keepCitedRecords(callSiteAudit);

  const safeCovered = [];
  for (const entry of covered ?? []) {
    // blobByPath, so a rewritten path could never match on resume — dropping is the honest fix.
    if (`${entry?.path}${entry?.blob}${entry?.head}`.includes('-->')) {
      droppedUnbankable += 1;
      continue;
    }
    safeCovered.push({ path: entry.path, blob: entry.blob, head: entry.head });
  }

  const assemble = (nClear, nAudit) => {
    const used = new Set();
    for (const { cited } of [...clearances.slice(0, nClear), ...audits.slice(0, nAudit)]) {
      for (const p of cited) used.add(p);
    }
    return {
      head,
      covered: safeCovered,
      confirmSuppressed: clearances.slice(0, nClear).map((k) => k.record),
      callSiteAudit: audits.slice(0, nAudit).map((k) => k.record),
      cites: Object.fromEntries(Object.entries(cites).filter(([p]) => used.has(p))),
    };
  };

  let nClear = clearances.length;
  let nAudit = audits.length;
  let payload = assemble(nClear, nAudit);
  while (JSON.stringify(payload).length > MAX_PROGRESS_CHARS && (nClear > 0 || nAudit > 0)) {
    if (nAudit > 0) nAudit -= 1;
    else nClear -= 1;
    payload = assemble(nClear, nAudit);
  }
  const droppedForSize = clearances.length - nClear + (audits.length - nAudit);
  const dropped = droppedUnbankable + droppedForSize;
  return { payload: { ...payload, dropped }, droppedUnbankable, droppedForSize };
}

const PROGRESS_MARKER_RE = /<!-- ai-reviewer-tier3-progress v1 (\{.*?\}) -->/;

export const PROGRESS_PARTIAL_PREFIX = '⏳ **Partial Tier 3 review banked**';
export const PROGRESS_COMPLETE_PREFIX = '✅ Tier 3 review completed';

const emptyPayload = (head) => ({ head, covered: [], confirmSuppressed: [], callSiteAudit: [], cites: {}, dropped: 0 });

export function isProgressCommentBody(body) {
  return typeof body === 'string' && (body.startsWith(PROGRESS_PARTIAL_PREFIX) || body.startsWith(PROGRESS_COMPLETE_PREFIX));
}

export function renderProgressComment(payload) {
  const dropped = payload.dropped ?? 0;
  const line =
    `${PROGRESS_PARTIAL_PREFIX} at \`${String(payload.head).slice(0, 7)}\`: ` +
    `${payload.covered.length} file(s) covered, ${payload.confirmSuppressed.length} clearance(s), ` +
    `${payload.callSiteAudit.length} audit row(s)${dropped ? `, ${dropped} record(s) not banked` : ''} — ` +
    'the next run resumes from here instead of starting over.';
  return `${line}\n<!-- ai-reviewer-tier3-progress v1 ${JSON.stringify(payload)} -->`;
}

export function renderProgressCompleteComment(headSha) {
  return (
    `${PROGRESS_COMPLETE_PREFIX} at \`${String(headSha).slice(0, 7)}\` — no partial progress pending.\n` +
    `<!-- ai-reviewer-tier3-progress v1 ${JSON.stringify(emptyPayload(headSha))} -->`
  );
}

export function parseProgressComment(body) {
  if (!isProgressCommentBody(body)) return null;
  const m = String(body ?? '').match(PROGRESS_MARKER_RE);
  if (!m) return null;
  try {
    const p = JSON.parse(m[1]);
    if (!p || typeof p !== 'object' || Array.isArray(p)) return null;
    for (const key of ['covered', 'confirmSuppressed', 'callSiteAudit']) {
      if (key in p && !Array.isArray(p[key])) return null;
    }
    if ('cites' in p && (p.cites === null || typeof p.cites !== 'object' || Array.isArray(p.cites))) return null;
    if (!('covered' in p)) return null;
    return { ...emptyPayload(p.head), ...p };
  } catch {
    return null;
  }
}

export function validateProgress(payload, { blobByPath, hashFile }) {
  const covered = (payload.covered ?? []).filter((c) => c && typeof c.blob === 'string' && typeof c.head === 'string' && blobByPath.get(c.path) === c.blob);
  let droppedStale = 0;
  const keepRecords = (records) =>
    (records ?? []).filter((record) => {
      const cited = extractCitedPaths(record);
      const ok = cited.length > 0 && cited.every((p) => hashFile(p) === payload.cites?.[p] && typeof payload.cites?.[p] === 'string');
      if (!ok) droppedStale += 1;
      return ok;
    });
  const confirmSuppressed = keepRecords(payload.confirmSuppressed);
  const callSiteAudit = keepRecords(payload.callSiteAudit);
  droppedStale += (payload.covered ?? []).length - covered.length;
  return { covered, confirmSuppressed, callSiteAudit, droppedStale };
}

export function coverageHeadMoved(covered, currentHead) {
  return (covered ?? []).some((c) => c?.head !== currentHead);
}

const recordNorm = (v) => String(v ?? '').trim().toLowerCase().replace(/\s+/g, ' ');

export function clearanceKey(record) {
  return recordNorm(record?.claim);
}

export function auditKey(record) {
  return `${recordNorm(record?.file)}:${record?.line ?? ''}:${recordNorm(record?.symbol)}`;
}

export function mergeRecordsPreferNew(oldRecords, newRecords, keyFn) {
  const fresh = newRecords ?? [];
  const newKeys = new Set(fresh.map(keyFn));
  return [...fresh, ...(oldRecords ?? []).filter((o) => !newKeys.has(keyFn(o)))];
}

export function renderBankedRecordsBlock(validated, headShaShort, { headMoved = false } = {}) {
  const { covered, confirmSuppressed, callSiteAudit } = validated;
  if (!covered.length && !confirmSuppressed.length && !callSiteAudit.length) return '';
  const parts = [
    `WORK ALREADY COMPLETED by a previous Tier 3 run at ${headShaShort} (your own records; every file they cite is unchanged since). ` +
      'These concerns were settled by the full five-step gate — the sufficiency rule applies: do not re-derive them from scratch. ' +
      'But settled is not sacred: if evidence you encounter while reviewing the remainder contradicts one, RE-OPEN it — re-derive it or file it. ' +
      'Anything NOT listed here is not covered.',
  ];
  if (covered.length) parts.push(`Fully reviewed files (their patches appear as stubs above): ${covered.map((c) => c.path).join(', ')}`);
  if (headMoved && covered.length) {
    parts.push(
      'NOTE: commits were pushed AFTER these files were reviewed. Each covered file is itself unchanged, but NO ONE has reviewed ' +
        'the interactions between the newer changes (the full patches below) and the covered files — whenever a full-patch file ' +
        'touches a covered file, open the covered file with read_file and check that interaction.',
    );
  }
  const clean = (v, cap) => sanitizeText(v ?? '?', cap) || '?';
  for (const c of confirmSuppressed) {
    parts.push(
      `- CLEARED (${clean(c.verdict, 40)}): ${clean(c.claim, 300)}\n  predicts: ${clean(c.predictedFailure, 300)}\n  invariant: ${clean(c.invariant, 200)}\n  enforced by: ${clean(c.enforcingCode, 400)}\n  covers this path: ${clean(c.coversThisPath, 300)}\n  counterexample tried: ${clean(c.counterexample, 300)}`,
    );
  }
  for (const a of callSiteAudit) {
    parts.push(`- AUDIT ${clean(String(a.verdict ?? '?').toUpperCase(), 40)} ${clean(a.file, 160)}${a.line ? `:${a.line}` : ''} — ${clean(a.why, 240)}`);
  }
  return parts.join('\n');
}
