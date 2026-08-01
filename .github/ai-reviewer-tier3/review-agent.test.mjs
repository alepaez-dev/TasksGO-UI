import { test } from 'node:test';
import assert from 'node:assert/strict';
import { touchesFrontend, promoteVerifiedConfidence } from './review-agent.mjs';

test('touchesFrontend detects frontend files and ignores CI-only changes', () => {
  assert.equal(touchesFrontend([{ filename: 'src/components/Button/Button.tsx' }]), true);
  assert.equal(touchesFrontend([{ filename: 'src/tokens/colors.ts' }]), true);
  assert.equal(touchesFrontend([{ filename: 'src/components/Button/Button.module.css' }]), true);
  assert.equal(touchesFrontend([{ filename: '.github/ai-reviewer-tier3/agent-loop.mjs' }]), false);
  assert.equal(touchesFrontend([{ filename: '.github/workflows/ci.yml' }, { filename: 'README.md' }]), false);
  assert.equal(touchesFrontend([]), false);
});

test('touchesFrontend is true when only one of many files is frontend', () => {
  assert.equal(
    touchesFrontend([{ filename: 'README.md' }, { filename: '.github/x.mjs' }, { filename: 'src/a.tsx' }]),
    true,
  );
});

test('touchesFrontend does not match .mjs or a substring extension', () => {
  assert.equal(touchesFrontend([{ filename: 'scripts/build.mjs' }]), false);
  assert.equal(touchesFrontend([{ filename: 'weird.ts.bak' }]), false);
});

test('touchesFrontend tolerates a missing or malformed file entry', () => {
  assert.equal(touchesFrontend(undefined), false);
  assert.equal(touchesFrontend([{}, null]), false);
});

// The PR #204 regression: run 3 traced the bug, cited the line, then self-rated low/low because the
// trigger is "model-dependent" — and minConfidence:medium deleted it before a human saw it.
test('promoteVerifiedConfidence rescues a traced finding the model self-rated low', () => {
  const findings = [
    {
      title: 'dismissed is not banked across the audit-rejection resubmit, unlike findings',
      severity: 'low',
      confidence: 'low',
      confidenceBasis: '.github/ai-reviewer-tier3/agent-loop.mjs:294 — bankedFindings is set, dismissed is not',
    },
  ];
  const promoted = promoteVerifiedConfidence(findings);
  assert.equal(findings[0].confidence, 'high', 'a cited line makes the mechanism verified by construction');
  assert.equal(findings[0].severity, 'low', 'severity must be left alone — it is where rarity belongs');
  assert.equal(promoted, 1);
});

test('promoteVerifiedConfidence leaves an uncited finding alone', () => {
  const findings = [
    { title: 'a hunch', severity: 'high', confidence: 'low', confidenceBasis: 'could not check the caller' },
    { title: 'no basis at all', severity: 'low', confidence: 'low' },
    { title: 'vague reference', severity: 'low', confidence: 'low', confidenceBasis: 'somewhere in review.mjs' },
  ];
  assert.equal(promoteVerifiedConfidence(findings), 0);
  assert.ok(findings.every((f) => f.confidence === 'low'));
});

test('promoteVerifiedConfidence never downgrades and is safe on junk input', () => {
  const findings = [{ title: 'already high', confidence: 'high', confidenceBasis: 'no citation here' }];
  assert.equal(promoteVerifiedConfidence(findings), 0);
  assert.equal(findings[0].confidence, 'high', 'a high rating is never lowered');
  assert.equal(promoteVerifiedConfidence(undefined), 0);
  assert.equal(promoteVerifiedConfidence([null, 'nope']), 0);
});
