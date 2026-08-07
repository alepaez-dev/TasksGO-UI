import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REVIEW_AGENT_SYSTEM_PROMPT, PRIMARY_RULES_REMINDER } from './prompts.mjs';

test('the PRIMARY block leads the prompt and claims precedence', () => {
  const head = REVIEW_AGENT_SYSTEM_PROMPT.slice(0, 2000);
  assert.match(head, /PRIMARY — HOW YOU FIND BUGS/);
  assert.match(head, /THIS SECTION WINS/);
  assert.match(head, /LAW 1 — EVIDENCE BEFORE VERDICT/);
  assert.match(head, /LAW 2 — THE FIVE-STEP CLEARANCE GATE/);
});

test('the state-preservation pass precedes the call-site pass', () => {
  const state = REVIEW_AGENT_SYSTEM_PROMPT.indexOf('METHOD A — STATE-PRESERVATION PASS');
  const calls = REVIEW_AGENT_SYSTEM_PROMPT.indexOf('METHOD B — COMPLETENESS');
  const overlay = REVIEW_AGENT_SYSTEM_PROMPT.indexOf('METHOD C — OVERLAY');
  assert.ok(state > 0 && calls > 0 && overlay > 0, 'all three method sections must exist');
  assert.ok(state < calls, 'state preservation must come before the call-site pass');
  assert.ok(calls < overlay, 'the overlay checklist must come last of the three');
});

test('the state-preservation pass names the sibling-asymmetry rule and the initializer rule', () => {
  assert.match(REVIEW_AGENT_SYSTEM_PROMPT, /SIBLING VALUES HANDLED ASYMMETRICALLY/);
  assert.match(REVIEW_AGENT_SYSTEM_PROMPT, /Read the initializer/);
  assert.match(REVIEW_AGENT_SYSTEM_PROMPT, /where can it be LOST/);
});

test('the four removed softeners are gone', () => {
  const p = REVIEW_AGENT_SYSTEM_PROMPT;
  assert.doesNotMatch(p, /does confirmation gate reporting/, 'the confirmation gate reinstatement must be gone');
  assert.doesNotMatch(p, /Two filters you cannot see/, 'the invisible-filter disclosure must be gone');
  assert.doesNotMatch(p, /always discarded/, 'the minConfidence disclosure must be gone');
  assert.doesNotMatch(p, /read a slice \(startLine\/endLine\) of large files/, 'the slice-first guidance must be gone');
  assert.doesNotMatch(p, /genuinely-unverifiable/, 'the removed enum value must not be referenced');
});

test('the overlay section is compressed and trigger-gated', () => {
  const start = REVIEW_AGENT_SYSTEM_PROMPT.indexOf('METHOD C — OVERLAY');
  const end = REVIEW_AGENT_SYSTEM_PROMPT.indexOf('BUDGET DISCIPLINE');
  assert.ok(start > 0 && end > start, 'the overlay section must be bounded by BUDGET DISCIPLINE');
  const section = REVIEW_AGENT_SYSTEM_PROMPT.slice(start, end);
  // 6234 -> ~2630. The floor is set by content that exists for a reason: the six dismissal paths,
  // the (a)-(d) resolution trace (PR #202 false-positive guard), and the canonical-abstraction check.
  assert.ok(section.length < 2700, `overlay section is ${section.length} chars, expected < 2700 (was 6234)`);
  assert.match(section, /skip this section entirely/, 'it must be skippable in one line');
});

test('the reminder restates both laws and is short enough to sit last', () => {
  assert.match(PRIMARY_RULES_REMINDER, /EVIDENCE BEFORE VERDICT/);
  assert.match(PRIMARY_RULES_REMINDER, /FIVE-STEP CLEARANCE GATE/);
  assert.match(PRIMARY_RULES_REMINDER, /outrank/i);
  assert.ok(PRIMARY_RULES_REMINDER.length < 1400, `reminder is ${PRIMARY_RULES_REMINDER.length} chars, expected < 1400`);
});

// A stopping rule in a prompt whose whole point is "do not stop early" must be scoped to one concern
// and must carry its own counterweight, or it becomes the licence the old prompt already handed out.
test('the sufficiency rule is scoped to one concern and cannot be read as permission to end the review', () => {
  const p = REVIEW_AGENT_SYSTEM_PROMPT;
  const section = p.slice(p.indexOf('LAW 2 — THE FIVE-STEP CLEARANCE GATE'), p.indexOf('THE BIAS'));
  assert.match(section, /SUFFICIENCY/, 'the rule belongs inside the gate it closes');
  assert.match(section, /could change its verdict/i, 'the test for more evidence is whether it changes the verdict');
  assert.match(section, /never a reason to end the review/i, 'the counterweight must sit in the same breath');
  assert.match(section, /un-gated/, 'it must name the case where stopping is still wrong');
});

// run 7 killed the real bug with "dismissed is best-effort anyway" — an intent claim with no source,
// inferred purely from the fact that the value was not preserved.
test('the gate forbids inferring intent from behaviour, but still allows grounded intent', () => {
  const p = REVIEW_AGENT_SYSTEM_PROMPT;
  const section = p.slice(p.indexOf('LAW 2 — THE FIVE-STEP CLEARANCE GATE'), p.indexOf('THE BIAS'));
  assert.match(section, /Do not infer implementation INTENT from implementation BEHAVIOUR/i);
  assert.match(section, /absence of preservation is not evidence/i);
  // the carve-out: intent IS provable, just not from behaviour alone
  for (const src of ['Comments', 'documentation', 'explicit invariants', 'observable mechanism']) {
    assert.match(section, new RegExp(src, 'i'), `grounded intent must stay legal — "${src}" missing`);
  }
});

test('the anti-early-stop rules survive alongside the sufficiency rule', () => {
  const p = REVIEW_AGENT_SYSTEM_PROMPT;
  assert.match(p, /Do NOT stop because a conclusion FEELS settled/);
  assert.match(p, /Budget you did not spend is not a virtue/);
});

// The code promotes only when confidenceBasis LEADS with the citation. If the prompt merely says
// "name a line", a model that obeys the prompt loses the promotion the prompt promised it.
test('the prompt states the same position rule the code enforces', () => {
  const p = REVIEW_AGENT_SYSTEM_PROMPT;
  assert.match(p, /START \\?`confidenceBasis\\?` with the/i, 'the prompt must ask for the citation FIRST');
  assert.doesNotMatch(p, /if you can name one, confidence is/i, 'the old "name it anywhere" wording must be gone');
});

test('the prompt names the five confirmSuppressed fields it now depends on', () => {
  for (const f of ['predictedFailure', 'invariant', 'enforcingCode', 'coversThisPath', 'counterexample']) {
    assert.match(REVIEW_AGENT_SYSTEM_PROMPT, new RegExp(f), `${f} must be named in the prompt`);
  }
});

