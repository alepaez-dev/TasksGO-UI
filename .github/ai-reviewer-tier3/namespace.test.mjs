import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMarker,
  parseMarkers,
  parseStatusReviewedSha,
  buildVerifyMarker,
  parseVerifyMarker,
} from '../ai-reviewer/review.mjs';

const T2 = 'ai-reviewer';
const T3 = 'ai-reviewer-tier3';
const finding = { fp: 'abc', file: 'src/a.ts', line: 3, title: 'Bug' };

test('finding markers are disjoint across tiers', () => {
  const m2 = buildMarker(finding, T2);
  const m3 = buildMarker(finding, T3);
  assert.notEqual(m2, m3);
  // Each tier's parser ignores the other tier's markers entirely.
  assert.equal(parseMarkers(m2, T3).length, 0);
  assert.equal(parseMarkers(m3, T2).length, 0);
  // Each parses its own.
  assert.equal(parseMarkers(m3, T3)[0].fp, 'abc');
  assert.equal(parseMarkers(m2, T2)[0].fp, 'abc');
});

test('default prefix still parses the tier-2 namespace (Tier 2 unchanged)', () => {
  const m2 = buildMarker(finding);
  assert.match(m2, /<!-- ai-reviewer v1 /);
  assert.equal(parseMarkers(m2)[0].fp, 'abc');
});

test('status reviewedSha is read from its own namespace only', () => {
  const t2body = '<!-- ai-reviewer-status v1 {"sha":"deadbeef"} -->';
  const t3body = '<!-- ai-reviewer-tier3-status v1 {"sha":"feedface"} -->';
  assert.equal(parseStatusReviewedSha(t2body, T3), null); // tier3 ignores tier2 status
  assert.equal(parseStatusReviewedSha(t3body, T3), 'feedface');
  assert.equal(parseStatusReviewedSha(t2body, T2), 'deadbeef'); // default still works
});

test('verify markers are disjoint across tiers', () => {
  const v2 = buildVerifyMarker({ fp: 'x', status: 'fixed' }, T2);
  const v3 = buildVerifyMarker({ fp: 'x', status: 'fixed' }, T3);
  assert.equal(parseVerifyMarker(v2, T3), null);
  assert.equal(parseVerifyMarker(v3, T3).status, 'fixed');
  assert.equal(parseVerifyMarker(v2).status, 'fixed'); // default works
});
