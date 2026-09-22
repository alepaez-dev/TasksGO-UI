import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyChecks, decideGate } from './gate.cjs';

const WANTED = ['guard', 'validate', 'a11y', 'e2e'];
const run = (name, status, conclusion = null) => ({ name, status, conclusion });
const green = (name) => run(name, 'completed', 'success');

test('a red, cancelled, or skipped watched check skips — severity of the conclusion is irrelevant', () => {
  for (const conclusion of ['failure', 'cancelled', 'skipped', 'timed_out']) {
    const states = classifyChecks([green('guard'), run('e2e', 'completed', conclusion)], WANTED);
    const d = decideGate({ states, seen: new Set(WANTED), graceExpired: false, timedOut: false });
    assert.equal(d.action, 'skip', `${conclusion} must skip`);
    assert.match(d.reason, /e2e did not succeed/);
  }
});

test('absent is not pending: before the grace it waits, after the grace it gates on what exists', () => {
  // Stacked PR: ci.yml (branches: [main]) never triggers, only guard exists.
  const states = classifyChecks([green('guard')], WANTED);
  const early = decideGate({ states, seen: new Set(['guard']), graceExpired: false, timedOut: false });
  assert.equal(early.action, 'wait', 'within the grace, absence could still be webhook lag');
  const late = decideGate({ states, seen: new Set(['guard']), graceExpired: true, timedOut: false });
  assert.equal(late.action, 'pass', 'after the grace, never-seen checks are dropped and guard alone gates');
  assert.deepEqual(late.dropped, ['validate', 'a11y', 'e2e']);
});

test('a check SEEN earlier is not dropped by the grace — only never-existed ones are', () => {
  const states = classifyChecks([green('guard')], WANTED); // e2e absent in THIS poll
  const d = decideGate({ states, seen: new Set(['guard', 'e2e']), graceExpired: true, timedOut: false });
  assert.equal(d.action, 'wait', 'a previously-seen check that vanished must be waited for, not dropped');
  assert.deepEqual(d.dropped, ['validate', 'a11y']);
});

test('name collision: worst state wins regardless of API ordering', () => {
  const real = run('e2e', 'completed', 'failure');
  const forgedGreen = green('e2e');
  for (const order of [[real, forgedGreen], [forgedGreen, real]]) {
    const states = classifyChecks([green('guard'), green('validate'), green('a11y'), ...order], WANTED);
    assert.equal(states.get('e2e'), 'red', 'a failing twin must outrank a green one in either order');
    assert.equal(decideGate({ states, seen: new Set(WANTED), graceExpired: false, timedOut: false }).action, 'skip');
  }
  const pendingTwin = classifyChecks([green('e2e'), run('e2e', 'queued')], WANTED);
  assert.equal(pendingTwin.get('e2e'), 'pending', 'a pending twin must outrank a green one');
});

test('all green passes; nothing watched existing passes with a disclosure', () => {
  const allGreen = classifyChecks(WANTED.map(green), WANTED);
  assert.equal(decideGate({ states: allGreen, seen: new Set(WANTED), graceExpired: false, timedOut: false }).action, 'pass');
  const none = classifyChecks([], WANTED);
  const d = decideGate({ states: none, seen: new Set(), graceExpired: true, timedOut: false });
  assert.equal(d.action, 'pass');
  assert.match(d.reason, /nothing to gate on/);
  assert.deepEqual(d.dropped, WANTED);
});

test('pending at the timeout skips; pending before it waits', () => {
  const states = classifyChecks([green('guard'), green('validate'), green('a11y'), run('e2e', 'in_progress')], WANTED);
  assert.equal(decideGate({ states, seen: new Set(WANTED), graceExpired: true, timedOut: false }).action, 'wait');
  const d = decideGate({ states, seen: new Set(WANTED), graceExpired: true, timedOut: true });
  assert.equal(d.action, 'skip');
  assert.match(d.reason, /e2e still not finished/);
});

test('malformed runs never crash the classification', () => {
  const states = classifyChecks([null, {}, { name: 42 }, { name: 'e2e' }], WANTED);
  assert.equal(states.get('e2e'), 'pending', 'a run with no status is at worst pending');
});
