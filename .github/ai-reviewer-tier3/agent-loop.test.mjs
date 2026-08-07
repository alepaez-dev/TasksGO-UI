import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runReviewAgent, describeToolUse, summarizeToolResult, budgetGuidance, budgetPhase, isTransientError, findHedges } from './agent-loop.mjs';

const config = {
  model: 'claude-opus-4-8',
  effort: 'max',
  maxOutputTokens: 64000,
  taskBudgetTokens: 1200000,
  costCeilingUsd: 3,
  maxRounds: 40,
  maxToolCalls: 120,
  maxFileReadBytes: 200000,
  maxGrepMatches: 200,
  pricing: { 'claude-opus-4-8': { input: 5, output: 25 }, 'claude-sonnet-4-6': { input: 3, output: 15 } },
};
const root = mkdtempSync(join(tmpdir(), 't3loop-'));

// A stub that plays a scripted list of assistant messages.
function stubClient(messages) {
  let i = 0;
  return {
    beta: {
      messages: {
        stream() {
          const msg = messages[i++];
          return { finalMessage: async () => msg };
        },
      },
    },
  };
}

test('the submit round logs its reasoning (the round where a dropped hypothesis dies)', async () => {
  const client = stubClient([
    {
      content: [
        { type: 'thinking', thinking: 'Checked whether dismissed can be set while findings is null — dropping it as too minor.' },
        { type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } },
      ],
      usage: { input_tokens: 100, output_tokens: 10 },
    },
  ]);
  const lines = [];
  await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: (l) => lines.push(l) });
  const joined = lines.join('\n');
  assert.match(joined, /Thinking ->/, 'the final round must surface its reasoning');
  assert.match(joined, /dropping it as too minor/, 'the discarded-hypothesis reasoning must be visible in the log');
});

test('a submit with callSiteAudit but NO confirmSuppressed is still bounced', async () => {
  const client = stubClient([
    // Audit present, confirmation record absent — the suppression check is not optional.
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [], callSiteAudit: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const lines = [];
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: (l) => lines.push(l) });
  assert.equal(out.rounds, 2, 'the first submit must be rejected for the missing confirmation record');
  assert.match(lines.join('\n'), /missing confirmSuppressed/, 'the log must name which field was missing');
  assert.equal(out.submitted, true);
});

test('a resolved suppression is logged with every step of the clearance gate', async () => {
  const confirm = [
    {
      claim: 'dismissed lost on the bounced-submit path',
      predictedFailure: 'attempt 1 supplies dismissed, omits callSiteAudit, and the bounce drops it',
      invariant: 'a bankedDismissed exists next to bankedFindings',
      enforcingCode: 'none — searched agent-loop.mjs:285-335 and no bankedDismissed exists',
      coversThisPath: 'nothing covers the rejection branch',
      counterexample: 'bounce with dismissed set — dismissed is null on the accepted resubmit',
      verdict: 'is-a-bug-moved-to-findings',
    },
  ];
  const client = stubClient([
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: confirm } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const lines = [];
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: (l) => lines.push(l) });
  const joined = lines.join('\n');
  assert.match(joined, /confirm · IS-A-BUG-MOVED-TO-FINDINGS/, 'the verdict must be visible');
  assert.match(joined, /predicts: attempt 1 supplies dismissed/, 'step 1 must be readable');
  assert.match(joined, /invariant: a bankedDismissed exists/, 'step 2 must be readable');
  assert.match(joined, /enforced by: none — searched agent-loop\.mjs/, 'step 3 must be readable');
  assert.match(joined, /covers this path: nothing covers the rejection branch/, 'step 4 must be readable');
  assert.match(joined, /counterexample: bounce with dismissed set/, 'step 5 must be readable');
  assert.deepEqual(out.confirmSuppressed, confirm);
});

test('an EMPTY re-submit does not wipe the findings banked by the bounce', async () => {
  const found = [
    { file: 'src/a.ts', line: 1, title: 'Real bug', body: 'b', confidence: 'high', severity: 'high', category: 'logic', suggestion: '' },
  ];
  const client = stubClient([
    // Round 1: real findings, no audit -> bounced, findings banked.
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: found } }], usage: { input_tokens: 100, output_tokens: 10 } },
    // Round 2: audit supplied, but findings comes back EMPTY — the retry was for bookkeeping, not a retraction.
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.deepEqual(out.findings, found, 'an empty re-submit must not silently drop confirmed bugs');
  assert.equal(out.submitted, true, 'the protocol did complete — the run should not be re-run');
});

test('a genuinely clean review still reports nothing (the floor must not invent findings)', async () => {
  const client = stubClient([
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.deepEqual(out.findings, [], 'nothing was ever banked, so nothing to restore');
  assert.equal(out.submitted, true);
});

test('a re-submit with malformed findings does not wipe the findings banked by the bounce', async () => {
  const found = [
    { file: 'src/a.ts', line: 1, title: 'Real bug', body: 'b', confidence: 'high', severity: 'high', category: 'logic', suggestion: '' },
  ];
  const client = stubClient([
    // Round 1: real findings, no audit -> bounced, findings banked.
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: found } }], usage: { input_tokens: 100, output_tokens: 10 } },
    // Round 2: audit supplied, but findings comes back malformed (not an array).
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: 'oops', callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.deepEqual(out.findings, found, 'the banked findings must survive a malformed re-submit');
  assert.equal(out.submitted, false, 'a malformed findings payload is still not a valid submission');
});

test('an empty callSiteAudit is logged as an explicit assertion, not silence', async () => {
  const client = stubClient([
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const lines = [];
  await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: (l) => lines.push(l) });
  assert.match(lines.join('\n'), /audit · none/, 'an empty audit must be distinguishable from no audit at all');
});

test('a bounced turn answers EVERY tool_use block (a missing tool_result is a 400 on the next request)', async () => {
  const scripted = [
    // Parallel tool use: grep + submit_findings in ONE turn, submit missing the audit -> bounce.
    {
      content: [
        { type: 'tool_use', id: 'tu_grep', name: 'grep', input: { pattern: 'x' } },
        { type: 'tool_use', id: 'tu_submit', name: 'submit_findings', input: { findings: [] } },
      ],
      usage: { input_tokens: 100, output_tokens: 10 },
    },
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ];
  const captured = [];
  let i = 0;
  const client = {
    beta: {
      messages: {
        stream(params) {
          captured.push(JSON.parse(JSON.stringify(params.messages)));
          const msg = scripted[i++];
          return { finalMessage: async () => msg };
        },
      },
    },
  };
  await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.equal(captured.length, 2, 'the bounce must produce a second request');
  const msgs = captured[1]; // the request that carries the bounce
  const useIds = msgs
    .filter((m) => m.role === 'assistant')
    .flatMap((m) => (Array.isArray(m.content) ? m.content : []))
    .filter((b) => b.type === 'tool_use')
    .map((b) => b.id);
  const resultIds = msgs
    .flatMap((m) => (Array.isArray(m.content) ? m.content : []))
    .filter((b) => b.type === 'tool_result')
    .map((b) => b.tool_use_id);
  for (const id of useIds) {
    assert.ok(resultIds.includes(id), `tool_use ${id} has no tool_result — the API rejects this turn with a 400`);
  }
});

test('the audit gate fires, then a budget death STOPS the run — the bounce must not continue the loop', async () => {
  const found = [
    { file: 'src/a.ts', line: 1, title: 'Real bug', body: 'b', confidence: 'high', severity: 'high', category: 'logic', suggestion: '' },
  ];
  // One round that both submits without the audit AND blows past the $3 ceiling (700k input ≈ $3.50).
  const scripted = [
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: found } }], usage: { input_tokens: 700000, output_tokens: 0 } },
  ];
  let calls = 0;
  const client = {
    beta: {
      messages: {
        stream() {
          calls += 1;
          const msg = scripted[calls - 1];
          // The bounce ends in `continue`; if the ceiling check does not break the loop, we land here.
          if (!msg) throw new Error('loop continued past the budget death instead of stopping');
          return { finalMessage: async () => msg };
        },
      },
    },
  };
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.equal(calls, 1, 'no further model call once the ceiling is already blown');
  assert.equal(out.interruptedReason, 'budget');
  assert.deepEqual(out.findings, found, 'the bounced findings survive the budget death');
  assert.equal(out.submitted, false, 'a bounced submit is not a completed submission — the commit must not be marked reviewed');
});

test('a bounced submit does not lose its findings if the run then dies on budget', async () => {
  const found = [
    { file: 'src/a.ts', line: 1, title: 'Real bug', body: 'b', confidence: 'high', severity: 'high', category: 'logic', suggestion: '' },
  ];
  const client = stubClient([
    // Round 1: submits real findings but no audit -> bounced (findings must be stashed).
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: found } }], usage: { input_tokens: 100, output_tokens: 10 } },
    // Round 2: a huge round blows the budget, so the loop stops without another submit.
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'grep', input: { pattern: 'x' } }], usage: { input_tokens: 5000000, output_tokens: 0 } },
    { content: [{ type: 'tool_use', id: 'tu_3', name: 'grep', input: { pattern: 'y' } }], usage: { input_tokens: 5000000, output_tokens: 0 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.deepEqual(out.findings, found, 'findings from the bounced submit must survive a budget death');
});

test('the audit gate still fires on an expensive run — that is where it matters most', async () => {
  const partial = [
    { file: 'src/a.ts', line: 2, title: 'Partial', body: 'b', confidence: 'high', severity: 'high', category: 'logic', suggestion: '' },
  ];
  const audit = [{ symbol: 'fn', file: 'a.mjs', line: 1, quotedLine: 'fn(x)', verdict: 'safely_unaffected', why: 'destination is computed fresh; no sibling writer supplies the field' }];
  const client = stubClient([
    // A costly round pushes spend past the soft wind-down fraction, but not over the ceiling.
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'grep', input: { pattern: 'x' } }], usage: { input_tokens: 400000, output_tokens: 0 } },
    // Submits with no audit — bounced even though budget is tight.
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: partial } }], usage: { input_tokens: 1000, output_tokens: 10 } },
    // Re-submits with the audit.
    { content: [{ type: 'tool_use', id: 'tu_3', name: 'submit_findings', input: { findings: partial, callSiteAudit: audit, confirmSuppressed: [] } }], usage: { input_tokens: 1000, output_tokens: 10 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.deepEqual(out.findings, partial);
  assert.deepEqual(out.callSiteAudit, audit, 'a tight budget must not buy a skipped completeness pass');
});

test('a submit without callSiteAudit is bounced once, then accepted with the audit', async () => {
  const audit = [
    { symbol: 'upsertStatus', file: 'a.mjs', line: 204, quotedLine: 'await upsertStatus({ resolved });', verdict: 'bug', why: 'siblings pass cleared to the same full-replace destination' },
  ];
  const client = stubClient([
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: [], callSiteAudit: audit, confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.equal(out.rounds, 2, 'the first submit is rejected, so a second round runs');
  assert.equal(out.submitted, true);
  assert.deepEqual(out.callSiteAudit, audit);
});

test('the callSiteAudit rejection fires at most once — a second bare submit is accepted', async () => {
  const client = stubClient([
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.equal(out.rounds, 2, 'must not loop rejecting forever');
  assert.equal(out.submitted, true);
  assert.deepEqual(out.callSiteAudit, [], 'no audit supplied, but the run still completes');
});

test('captures findings from submit_findings and stops', async () => {
  const findings = [
    { file: 'src/a.ts', line: 3, title: 'Bug', body: 'x', confidence: 'high', severity: 'high', category: 'logic', suggestion: '' },
  ];
  const client = stubClient([
    {
      content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings, callSiteAudit: [], confirmSuppressed: [] } }],
      usage: { input_tokens: 1000, output_tokens: 50 },
    },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.deepEqual(out.findings, findings);
  assert.equal(out.interruptedReason, null);
  assert.equal(out.rounds, 1);
  assert.equal(out.submitted, true);
});

test('runs tools then submits (multi-round)', async () => {
  const findings = [
    { file: 'src/a.ts', line: 1, title: 'T', body: 'b', confidence: 'medium', severity: 'low', category: 'logic', suggestion: 'fix' },
  ];
  const client = stubClient([
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'grep', input: { pattern: 'x' } }], usage: { input_tokens: 1000, output_tokens: 20 } },
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings, callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 500, output_tokens: 30 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.deepEqual(out.findings, findings);
  assert.equal(out.rounds, 2);
  assert.equal(out.interruptedReason, null);
});

test('a prose-only turn is nudged once, then recovers when the model submits', async () => {
  const client = stubClient([
    { content: [{ type: 'text', text: 'The change looks clean.' }], usage: { input_tokens: 1000, output_tokens: 10 } },
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 500, output_tokens: 5 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.deepEqual(out.findings, []);
  assert.equal(out.submitted, true); // recovered via the nudge → review-agent WILL mark reviewed
  assert.equal(out.rounds, 2);
});

test('two prose-only turns give up with submitted=false (review-agent will NOT mark reviewed)', async () => {
  const client = stubClient([
    { content: [{ type: 'text', text: 'looks clean' }], usage: { input_tokens: 1000, output_tokens: 10 } },
    { content: [{ type: 'text', text: 'still clean' }], usage: { input_tokens: 500, output_tokens: 5 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.deepEqual(out.findings, []);
  assert.equal(out.interruptedReason, null);
  assert.equal(out.submitted, false);
});

test('budget interrupt runs one wind-down turn that captures partial findings', async () => {
  const partial = [
    { file: 'src/a.ts', line: 2, title: 'Partial', body: 'b', confidence: 'high', severity: 'high', category: 'logic', suggestion: '' },
  ];
  const client = stubClient([
    // Round 1: an expensive read trips the budget gate ($2.50, ceiling $3).
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'grep', input: { pattern: 'x' } }], usage: { input_tokens: 500000, output_tokens: 0 } },
    // Wind-down turn (cheap, mostly cache-reads in reality): the model submits what it has.
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: partial, callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 2000, output_tokens: 100 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.equal(out.interruptedReason, 'budget');
  assert.deepEqual(out.findings, partial);
  assert.equal(out.rounds, 2);
});

test('the audit gate may fire during wind-down, but never costs the findings', async () => {
  const partial = [
    { file: 'src/a.ts', line: 2, title: 'Partial', body: 'b', confidence: 'high', severity: 'high', category: 'logic', suggestion: '' },
  ];
  const client = stubClient([
    // Round 1: an expensive read trips the budget gate, so the next turn is the wind-down turn.
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'grep', input: { pattern: 'x' } }], usage: { input_tokens: 500000, output_tokens: 0 } },
    // Wind-down turn: submits WITHOUT callSiteAudit -> bounced (asks only for work already done).
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: partial } }], usage: { input_tokens: 2000, output_tokens: 100 } },
    // If the model ignores the re-ask and calls a tool instead, the run stops — findings must survive.
    { content: [{ type: 'tool_use', id: 'tu_3', name: 'grep', input: { pattern: 'y' } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.equal(out.interruptedReason, 'budget');
  assert.deepEqual(out.findings, partial, 'the stash must protect findings even if the re-ask is never answered');
});

test('budget wind-down still stops (returns []) if the model ignores the submit instruction', async () => {
  const client = stubClient([
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'grep', input: { pattern: 'x' } }], usage: { input_tokens: 500000, output_tokens: 0 } },
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'grep', input: { pattern: 'y' } }], usage: { input_tokens: 2000, output_tokens: 0 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.equal(out.interruptedReason, 'budget');
  assert.deepEqual(out.findings, []);
  assert.equal(out.rounds, 2);
});

test('budget skips the wind-down turn when the ceiling is already exceeded', async () => {
  const client = stubClient([
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'grep', input: { pattern: 'x' } }], usage: { input_tokens: 700000, output_tokens: 0 } },
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.equal(out.interruptedReason, 'budget');
  assert.equal(out.rounds, 1); // no wind-down turn — already over the ceiling
});

test('aborts at maxRounds', async () => {
  // Always asks for a cheap tool; round cap (2) must stop it.
  const msgs = Array.from({ length: 5 }, (_, i) => ({
    content: [{ type: 'tool_use', id: `tu_${i}`, name: 'grep', input: { pattern: 'x' } }],
    usage: { input_tokens: 10, output_tokens: 10 },
  }));
  const out = await runReviewAgent({ client: stubClient(msgs), config: { ...config, maxRounds: 2 }, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.equal(out.interruptedReason, 'max_rounds');
  assert.equal(out.rounds, 3); // 2 exploration rounds + 1 wind-down turn
  assert.deepEqual(out.findings, []);
});

test('cache_control breakpoints never exceed the 4-per-request limit across rounds', async () => {
  const captured = [];
  const client = {
    beta: {
      messages: {
        stream(params) {
          const i = captured.length;
          captured.push(params);
          // rounds 0,1,2 → grep (force tool-result turns); round 3 → submit and end.
          const msg =
            i < 3
              ? { content: [{ type: 'tool_use', id: `tu_${i}`, name: 'grep', input: { pattern: 'x' } }], usage: { input_tokens: 100, output_tokens: 10 } }
              : { content: [{ type: 'tool_use', id: 'tu_s', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 50, output_tokens: 5 } };
          return { finalMessage: async () => msg };
        },
      },
    },
  };
  // Two cache_control system blocks, like review-agent.mjs builds (prompt + rules/project guide).
  const system = [
    { type: 'text', text: 'prompt', cache_control: { type: 'ephemeral' } },
    { type: 'text', text: 'rules', cache_control: { type: 'ephemeral' } },
  ];
  await runReviewAgent({ client, config, system, userMessage: 'review', root, log: () => {} });
  const counts = captured.map((p) => {
    let n = 0;
    for (const s of p.system || []) if (s && s.cache_control) n += 1;
    for (const m of p.messages || []) {
      if (Array.isArray(m.content)) for (const b of m.content) if (b && b.cache_control) n += 1;
    }
    return n;
  });
  assert.ok(captured.length >= 4, `expected ≥4 requests, got ${captured.length}`);
  for (const n of counts) {
    assert.ok(n <= 4, `a request carried ${n} cache_control breakpoints (max 4); counts=${JSON.stringify(counts)}`);
  }
});

test('a mid-loop API error degrades to findings-so-far (no thrown job failure)', async () => {
  let i = 0;
  const client = {
    beta: {
      messages: {
        stream() {
          i += 1;
          if (i === 1) {
            return { finalMessage: async () => ({ content: [{ type: 'tool_use', id: 'tu_0', name: 'grep', input: { pattern: 'x' } }], usage: { input_tokens: 100, output_tokens: 10 } }) };
          }
          return { finalMessage: async () => { throw new Error('429 rate_limit'); } };
        },
      },
    },
  };
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.equal(out.interruptedReason, 'error');
  assert.deepEqual(out.findings, []);
});

test('a first-request API error throws (fail loud on misconfig)', async () => {
  const client = {
    beta: {
      messages: {
        stream() {
          return { finalMessage: async () => { throw new Error('400 invalid_request_error: too many cache breakpoints'); } };
        },
      },
    },
  };
  await assert.rejects(runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: () => {} }), /400/);
});

test('describeToolUse renders args, not just the tool name', () => {
  assert.equal(describeToolUse({ name: 'read_file', input: { path: 'a/b.tsx', startLine: 1, endLine: 80 } }), 'read_file a/b.tsx:1-80');
  assert.equal(describeToolUse({ name: 'read_file', input: { path: 'a/b.tsx' } }), 'read_file a/b.tsx');
  assert.equal(describeToolUse({ name: 'grep', input: { pattern: 'useX', pathGlob: '**/*.tsx' } }), 'grep /useX/ glob:**/*.tsx');
  assert.equal(describeToolUse({ name: 'grep', input: { pattern: 'useX' } }), 'grep /useX/');
  assert.equal(describeToolUse({ name: 'list_dir', input: { path: 'src/hooks' } }), 'list_dir src/hooks');
  assert.equal(describeToolUse({ name: 'submit_findings', input: { findings: [1, 2, 3] } }), 'submit_findings (3)');
});

test('summarizeToolResult surfaces errors, grep match/file counts, and read_file line counts', () => {
  assert.match(summarizeToolResult({ isError: true, content: 'File not found: x.ts' }), /^ERROR: File not found/);
  assert.equal(summarizeToolResult({ isError: false, content: '(no matches)' }), 'no matches');
  // grep output (path:line:content, two colons) across two files + a truncation note
  const grep = 'src/a.tsx:12:foo\nsrc/b.tsx:3:foo\n… (5 more matches truncated)';
  assert.match(summarizeToolResult({ isError: false, content: grep }), /2 match\(es\) in 2 file\(s\).*5 more matches truncated/);
  // read_file output (N: content, one colon) must NOT be mistaken for grep matches
  assert.equal(summarizeToolResult({ isError: false, content: '1: const x = 1\n2: return x' }), '2 line(s)');
});

test('budgetPhase / budgetGuidance escalate across phases (explore → prioritize → converge)', () => {
  assert.equal(budgetPhase(0.1), 'explore');
  assert.equal(budgetPhase(0.5), 'prioritize'); // 0.5 ≥ 0.75*0.6 and < 0.75
  assert.equal(budgetPhase(0.8), 'converge');
  assert.match(budgetGuidance(0.1), /Explore freely/);
  assert.match(budgetGuidance(0.5), /prioritize/i);
  assert.match(budgetGuidance(0.8), /CONVERGE NOW/);
});

test('feeds the model a running [budget] status that escalates with spend', async () => {
  function capturing(msgs) {
    const captured = [];
    let i = 0;
    return { captured, client: { beta: { messages: { stream(p) { captured.push(p); return { finalMessage: async () => msgs[i++] }; } } } } };
  }
  const budgetBlocks = (captured) => {
    const out = [];
    for (const p of captured) for (const m of p.messages || []) {
      if (Array.isArray(m.content)) for (const b of m.content) {
        if (b && b.type === 'text' && typeof b.text === 'string' && b.text.startsWith('[budget]')) out.push(b.text);
      }
    }
    return out;
  };
  // Cheap round → low fraction → "Explore freely".
  const lo = capturing([
    { content: [{ type: 'tool_use', id: 't1', name: 'grep', input: { pattern: 'x' } }], usage: { input_tokens: 1000, output_tokens: 10 } },
    { content: [{ type: 'tool_use', id: 't2', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 5 } },
  ]);
  await runReviewAgent({ client: lo.client, config, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.ok(budgetBlocks(lo.captured).some((t) => /Explore freely/.test(t)), 'low spend should say explore freely');

  // Expensive round ($2.50 of $3 ≈ 83%) → "CONVERGE NOW".
  const hi = capturing([
    { content: [{ type: 'tool_use', id: 't1', name: 'grep', input: { pattern: 'x' } }], usage: { input_tokens: 500000, output_tokens: 0 } },
    { content: [{ type: 'tool_use', id: 't2', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 5 } },
  ]);
  await runReviewAgent({ client: hi.client, config, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.ok(budgetBlocks(hi.captured).some((t) => /CONVERGE NOW/.test(t)), 'high spend should say converge');
});

test('sets toolBudgetExhausted once maxToolCalls is exceeded', async () => {
  const client = stubClient([
    // One round requesting two tools; with maxToolCalls=1 the second exceeds the budget.
    {
      content: [
        { type: 'tool_use', id: 'tu_1', name: 'grep', input: { pattern: 'x' } },
        { type: 'tool_use', id: 'tu_2', name: 'grep', input: { pattern: 'y' } },
      ],
      usage: { input_tokens: 100, output_tokens: 10 },
    },
    { content: [{ type: 'tool_use', id: 'tu_3', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 50, output_tokens: 5 } },
  ]);
  const out = await runReviewAgent({ client, config: { ...config, maxToolCalls: 1 }, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.equal(out.toolBudgetExhausted, true);
});

function scriptedClient(steps) {
  let i = 0;
  const calls = [];
  const client = {
    beta: {
      messages: {
        stream(params) {
          calls.push(params);
          const step = steps[Math.min(i++, steps.length - 1)];
          return { finalMessage: async () => { if (step instanceof Error) throw step; return step; } };
        },
      },
    },
  };
  return { client, calls };
}
const overloaded = () => Object.assign(new Error('Overloaded'), { status: 529, error: { type: 'overloaded_error' } });
const creditBalance = () => Object.assign(new Error('Your credit balance is too low'), { status: 400, error: { type: 'invalid_request_error' } });
const submitMsg = (findings = []) => ({ content: [{ type: 'tool_use', id: 'ts', name: 'submit_findings', input: { findings, callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 10 } });
const grepMsg = () => ({ content: [{ type: 'tool_use', id: 'tg', name: 'grep', input: { pattern: 'x' } }], usage: { input_tokens: 100, output_tokens: 10 } });
const fast = (extra) => ({ ...config, retryBaseDelayMs: 0, ...extra });

test('isTransientError: retry 429/5xx/overloaded/network, never 4xx like the credit-balance 400', () => {
  const withStatus = (s, type) => Object.assign(new Error('x'), { status: s, error: type ? { type } : undefined });
  assert.equal(isTransientError(withStatus(529, 'overloaded_error')), true);
  assert.equal(isTransientError(withStatus(429, 'rate_limit_error')), true);
  assert.equal(isTransientError(withStatus(503, 'api_error')), true);
  assert.equal(isTransientError({ error: { type: 'overloaded_error' } }), true);
  assert.equal(isTransientError(new Error('socket hang up')), true);
  assert.equal(isTransientError(withStatus(400, 'invalid_request_error')), false); // credit balance / malformed
  assert.equal(isTransientError(withStatus(401)), false);
  assert.equal(isTransientError(withStatus(403)), false);
  assert.equal(isTransientError(new Error('some unrelated failure')), false);
});

test('every request asks for summarized thinking + task budget on the primary model', async () => {
  const { client, calls } = scriptedClient([submitMsg()]);
  await runReviewAgent({ client, config: fast(), system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.equal(calls[0].model, 'claude-opus-4-8');
  assert.deepEqual(calls[0].thinking, { type: 'adaptive', display: 'summarized' }); // otherwise thinking streams back empty
  assert.deepEqual(calls[0].betas, ['task-budgets-2026-03-13']);
});

test('retries a transient error and recovers on the same model', async () => {
  const { client, calls } = scriptedClient([overloaded(), submitMsg()]);
  const out = await runReviewAgent({ client, config: fast({ maxTransientRetries: 2 }), system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.equal(out.interruptedReason, null);
  assert.equal(out.submitted, true);
  assert.equal(calls.length, 2); // one failed attempt, one successful retry
});

test('falls back to the fallback model after the primary exhausts its retries', async () => {
  const { client, calls } = scriptedClient([overloaded(), overloaded(), submitMsg()]);
  const cfg = fast({ maxTransientRetries: 1, fallbackModel: 'claude-opus-4-7' });
  const out = await runReviewAgent({ client, config: cfg, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.equal(out.interruptedReason, null);
  assert.equal(out.submitted, true);
  assert.equal(calls.length, 3); // 2 primary attempts + 1 fallback
  assert.equal(calls[0].model, 'claude-opus-4-8');
  assert.equal(calls[2].model, 'claude-opus-4-7'); // fell back
  assert.deepEqual(calls[2].betas, ['task-budgets-2026-03-13']); // fallback gets the same options — no per-model branch
  assert.equal(calls[2].thinking.display, 'summarized');
});

test('a permanent 400 is not retried and fails loud on the first request', async () => {
  const { client, calls } = scriptedClient([creditBalance()]);
  await assert.rejects(
    runReviewAgent({ client, config: fast(), system: 'sys', userMessage: 'r', root, log: () => {} }),
    /credit balance/,
  );
  assert.equal(calls.length, 1); // no retry, no fallback
});

test('a permanent 400 mid-loop degrades to findings-so-far without retrying', async () => {
  const { client, calls } = scriptedClient([grepMsg(), creditBalance()]);
  const out = await runReviewAgent({ client, config: fast(), system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.equal(out.interruptedReason, 'error');
  assert.deepEqual(out.findings, []);
  assert.equal(calls.length, 2); // round 1 grep + the un-retried 400
});

test('degrades to findings-so-far once every model and retry is exhausted', async () => {
  const { client, calls } = scriptedClient([grepMsg(), overloaded(), overloaded(), overloaded(), overloaded()]);
  const cfg = fast({ maxTransientRetries: 1, fallbackModel: 'claude-sonnet-4-6' });
  const out = await runReviewAgent({ client, config: cfg, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.equal(out.interruptedReason, 'error');
  assert.deepEqual(out.findings, []);
  assert.equal(calls.length, 5); // round 1 grep + round 2: 2 primary + 2 fallback attempts
});

test('a fallback round is priced at the fallback model\'s real rate, not the primary\'s', async () => {
  const usage = { input_tokens: 100000, output_tokens: 20000 };
  const msg = { content: [{ type: 'tool_use', id: 's', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }], usage };
  // (a) opus-only run
  const a = scriptedClient([msg]);
  const outA = await runReviewAgent({ client: a.client, config, system: 'sys', userMessage: 'r', root, log: () => {} });
  // (b) identical usage, but produced on the sonnet fallback after opus is exhausted
  const b = scriptedClient([overloaded(), overloaded(), msg]);
  const outB = await runReviewAgent({ client: b.client, config: fast({ maxTransientRetries: 1, fallbackModel: 'claude-sonnet-4-6' }), system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.ok(outA.costUsd > 0 && outB.costUsd > 0);
  assert.equal(outA.usedFallback, false);
  assert.equal(outB.usedFallback, true);
  assert.ok(outB.costUsd < outA.costUsd, `fallback (sonnet) cost ${outB.costUsd} should be < primary (opus) cost ${outA.costUsd}`);
});

test('logs the model thinking (Thinking ->) when the response carries a thinking block', async () => {
  const logs = [];
  const client = stubClient([
    {
      content: [
        { type: 'thinking', thinking: 'The renderer re-parses the line, so the badge onClick may be dropped.' },
        { type: 'text', text: 'Tracing the handler.' },
        { type: 'tool_use', id: 't1', name: 'grep', input: { pattern: 'onClick' } },
      ],
      usage: { input_tokens: 1000, output_tokens: 200 },
    },
    { content: [{ type: 'tool_use', id: 't2', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: (m) => logs.push(m) });
  assert.ok(logs.some((l) => l.startsWith('Thinking -> ')), 'a "Thinking ->" line must be logged when the model thinks');
  assert.ok(logs.some((l) => l.startsWith('Reasoning -> ')), 'a "Reasoning ->" line for the text narration too');
});

test('findHedges catches the impact hand-waves that killed the concern in prose', () => {
  const thinking =
    'findings get banked but dismissed stays null, which is acceptable since dismissed is best-effort anyway. ' +
    'The renderer looks correct. That injection is purely cosmetic so I will leave it.';
  const hits = findHedges(thinking);
  assert.ok(hits.length >= 2, `expected at least 2 hedges, got ${hits.length}`);
  assert.ok(hits.some((h) => /best-effort anyway/.test(h)), 'must catch the run-7 sentence');
  assert.ok(hits.some((h) => /purely cosmetic/.test(h)), 'must catch a cosmetic hand-wave');
});

test('findHedges stays quiet on ordinary reasoning', () => {
  assert.deepEqual(findHedges('I traced the caller and the guard at line 42 prevents the null deref.'), []);
  assert.deepEqual(findHedges(''), []);
  assert.deepEqual(findHedges(undefined), []);
});

test('a submit whose reasoning hand-waved a concern is bounced once, and findings survive the bounce', async () => {
  const found = [{ file: 'a.ts', line: 1, severity: 'low', confidence: 'high', category: 'logic', title: 'real one', body: 'b', suggestion: 's' }];
  const client = stubClient([
    {
      content: [
        { type: 'thinking', thinking: 'dismissed stays null, which is acceptable since it is best-effort anyway.' },
        { type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: found, callSiteAudit: [], confirmSuppressed: [] } },
      ],
      usage: { input_tokens: 100, output_tokens: 10 },
    },
    // the forced re-submit drops findings entirely — they must be recovered from the bank
    {
      content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }],
      usage: { input_tokens: 100, output_tokens: 10 },
    },
  ]);
  const lines = [];
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: (l) => lines.push(l) });
  assert.match(lines.join('\n'), /hand-waved/i, 'the bounce must say why it fired');
  assert.deepEqual(out.findings, found, 'the hedge bounce must bank findings, or it repeats the bug it exists to catch');
});

test('an empty resubmit does not wipe the callSiteAudit banked by the hedge bounce', async () => {
  const audit = [{ file: 'a.ts', quotedLine: 'fn(x)', verdict: 'passes', why: 'supplies the field' }];
  const confirm = [{ claim: 'c', predictedFailure: 'p', invariant: 'i', enforcingCode: 'a.ts:1', coversThisPath: 'x', counterexample: 'y', verdict: 'cleared-all-five-passed' }];
  const client = stubClient([
    {
      content: [
        { type: 'thinking', thinking: 'that one is harmless so I am leaving it out.' },
        { type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [], callSiteAudit: audit, confirmSuppressed: confirm } },
      ],
      usage: { input_tokens: 100, output_tokens: 10 },
    },
    // retry answers only the hand-wave question and re-sends the records EMPTY
    {
      content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }],
      usage: { input_tokens: 100, output_tokens: 10 },
    },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.deepEqual(out.callSiteAudit, audit, 'completed call-site audit work must survive the bounce');
  assert.deepEqual(out.confirmSuppressed, confirm, 'the suppression record must survive the bounce');
});

test('a populated callSiteAudit survives the audit-gate bounce when confirmSuppressed was missing', async () => {
  const audit = [{ file: 'b.ts', quotedLine: 'g(y)', verdict: 'bug', why: 'omission erases shared state' }];
  const client = stubClient([
    // callSiteAudit done, confirmSuppressed absent -> bounced; the audit must not be thrown away
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [], callSiteAudit: audit } }], usage: { input_tokens: 100, output_tokens: 10 } },
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.deepEqual(out.callSiteAudit, audit, 'the audit gate must bank the half it already received');
});

test('a real resubmit still replaces the banked records (restore is a fallback, not a freeze)', async () => {
  const first = [{ file: 'a.ts', quotedLine: 'old', verdict: 'passes', why: 'old' }];
  const second = [{ file: 'a.ts', quotedLine: 'new', verdict: 'bug', why: 'revised after the bounce' }];
  const client = stubClient([
    {
      content: [
        { type: 'thinking', thinking: 'this is harmless, skipping.' },
        { type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [], callSiteAudit: first, confirmSuppressed: [] } },
      ],
      usage: { input_tokens: 100, output_tokens: 10 },
    },
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: [], callSiteAudit: second, confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.deepEqual(out.callSiteAudit, second, 'a non-empty resubmit must win over the bank');
});

// A bounce banks the records, then the run dies before any accepted submit: prose -> nudge -> prose -> break.
// Everything banked must still reach the caller, or the bounce silently costs the work it was protecting.
const diesAfterBounce = (firstInput) =>
  stubClient([
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: firstInput }], usage: { input_tokens: 100, output_tokens: 10 } },
    { content: [{ type: 'text', text: 'I think that is all.' }], usage: { input_tokens: 100, output_tokens: 10 } },
    { content: [{ type: 'text', text: 'still all.' }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);

test('banked dismissed survives a run that never lands an accepted submit', async () => {
  const dismissed = [{ title: 'ref could be stale', why: 'the effect re-runs on every open', anchor: 'a.ts:1' }];
  const client = diesAfterBounce({ findings: [], callSiteAudit: [], dismissed });
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.deepEqual(out.dismissed, dismissed, 'cleared concerns must still reach the status comment');
});

test('banked callSiteAudit survives a run that never lands an accepted submit', async () => {
  const audit = [{ file: 'a.ts', quotedLine: 'fn(x)', verdict: 'passes', why: 'all callers updated' }];
  const client = diesAfterBounce({ findings: [], callSiteAudit: audit });
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.deepEqual(out.callSiteAudit, audit, 'the audit must still reach the job summary');
});

test('banked confirmSuppressed survives a run that never lands an accepted submit', async () => {
  const confirm = [
    { claim: 'c', predictedFailure: 'p', invariant: 'i', enforcingCode: 'a.ts:1', coversThisPath: 'x', counterexample: 'y', verdict: 'cleared-all-five-passed' },
  ];
  // callSiteAudit omitted, not empty — supplying both fields would satisfy the gate and never bounce.
  const client = diesAfterBounce({ findings: [], confirmSuppressed: confirm });
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.deepEqual(out.confirmSuppressed, confirm, 'the suppression record must survive the bounce');
});

test('an empty resubmit does not wipe the dismissed banked by the bounce', async () => {
  const dismissed = [{ title: 'ref could be stale', why: 'the effect re-runs on every open', anchor: 'a.ts:1' }];
  const client = stubClient([
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [], callSiteAudit: [], dismissed } }], usage: { input_tokens: 100, output_tokens: 10 } },
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [], dismissed: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.deepEqual(out.dismissed, dismissed, 'an empty resubmit must not drop banked clears');
});

test('a real resubmit still replaces the banked dismissed (restore is a fallback, not a freeze)', async () => {
  const first = [{ title: 'old concern', why: 'old', anchor: 'a.ts:1' }];
  const second = [{ title: 'revised concern', why: 'new', anchor: 'a.ts:2' }];
  const client = stubClient([
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [], callSiteAudit: [], dismissed: first } }], usage: { input_tokens: 100, output_tokens: 10 } },
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [], dismissed: second } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.deepEqual(out.dismissed, second, 'a non-empty resubmit must win over the bank');
});

test('a resubmit that omits dismissed still restores the banked copy', async () => {
  const dismissed = [{ title: 'ref could be stale', why: 'the effect re-runs on every open', anchor: 'a.ts:1' }];
  const client = stubClient([
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [], callSiteAudit: [], dismissed } }], usage: { input_tokens: 100, output_tokens: 10 } },
    // answers only the bounce's question; omission means "did not re-answer", not "withdrawn"
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.deepEqual(out.dismissed, dismissed);
});

test('the hedge bounce fires at most once', async () => {
  const hedge = { type: 'thinking', thinking: 'that is harmless so I will skip it.' };
  const submit = (id) => ({
    content: [hedge, { type: 'tool_use', id, name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: [] } }],
    usage: { input_tokens: 100, output_tokens: 10 },
  });
  const client = stubClient([submit('t1'), submit('t2'), submit('t3')]);
  const lines = [];
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: (l) => lines.push(l) });
  assert.equal(lines.filter((l) => /hand-waved/i.test(l)).length, 1, 'a second hedged submit must be accepted, not looped');
  assert.deepEqual(out.findings, []);
});

test('budget guidance carries the sufficiency rule into every round', () => {
  for (const frac of [0.1, 0.5, 0.9]) {
    assert.match(budgetGuidance(frac), /already answered with a cited line/i, `missing at frac=${frac}`);
  }
});

test('a cleared concern logs its cited enforcing code, and a missing citation is loud', async () => {
  const confirm = [
    {
      claim: 'dismissed lost on the bounced-submit path',
      predictedFailure: 'attempt 1 supplies dismissed and omits callSiteAudit; the bounce discards it',
      invariant: 'dismissed is banked before the continue, like findings',
      enforcingCode: 'agent-loop.mjs:294: if (Array.isArray(submittedFindings) && submittedFindings.length) bankedFindings = submittedFindings;',
      coversThisPath: 'it does NOT cover the rejection branch',
      counterexample: 'bounce with dismissed set -> dismissed is null on resubmit',
      verdict: 'is-a-bug-moved-to-findings',
    },
    {
      claim: 'anchor backtick breaks the code span',
      predictedFailure: 'an anchor containing a backtick breaks the markdown span',
      invariant: 'sanitizeText escapes backticks',
      enforcingCode: '',
      coversThisPath: 'n/a',
      counterexample: '',
      verdict: 'cleared-all-five-passed',
    },
  ];
  const client = stubClient([
    {
      content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [], callSiteAudit: [], confirmSuppressed: confirm } }],
      usage: { input_tokens: 100, output_tokens: 10 },
    },
  ]);
  const lines = [];
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: (l) => lines.push(l) });
  const joined = lines.join('\n');
  assert.deepEqual(out.confirmSuppressed, confirm);
  assert.match(joined, /agent-loop\.mjs:294/, 'the cited enforcing line must be visible in the run log');
  assert.match(joined, /NO CODE CITED/, 'an empty enforcingCode must be called out, not printed as blank');
  assert.match(joined, /NOT ATTEMPTED/, 'a missing counterexample must be called out');
});

// Six break statements reach the return without passing the in-submit restore, so a bounced submit's
// audit/confirm were banked and then dropped on any non-submit exit.
test("a bounced submit's audit and confirm survive a no-tool-call exit", async () => {
  const audit = [{ file: 'a.ts', quotedLine: 'fn(x)', verdict: 'passes', why: 'supplies the field' }];
  const confirm = [{ claim: 'c', predictedFailure: 'p', invariant: 'i', enforcingCode: 'a.ts:1', coversThisPath: 'x', counterexample: 'y', verdict: 'cleared-all-five-passed' }];
  const client = stubClient([
    {
      content: [
        { type: 'thinking', thinking: 'that one is harmless so I am leaving it out.' },
        { type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [], callSiteAudit: audit, confirmSuppressed: confirm } },
      ],
      usage: { input_tokens: 100, output_tokens: 10 },
    },
    { content: [{ type: 'text', text: 'I am done.' }], usage: { input_tokens: 100, output_tokens: 10 } },
    { content: [{ type: 'text', text: 'Still done.' }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.equal(out.submitted, false, 'no successful submit happened');
  assert.deepEqual(out.callSiteAudit, audit, 'banked audit must survive an exit that never reaches the submit branch');
  assert.deepEqual(out.confirmSuppressed, confirm, 'banked confirm must survive the same exit');
});

test('the accepted-submit path still wins over the bank', async () => {
  const banked = [{ file: 'a.ts', quotedLine: 'old', verdict: 'passes', why: 'old' }];
  const fresh = [{ file: 'a.ts', quotedLine: 'new', verdict: 'bug', why: 'revised' }];
  const client = stubClient([
    {
      content: [
        { type: 'thinking', thinking: 'this is harmless, skipping.' },
        { type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [], callSiteAudit: banked, confirmSuppressed: [] } },
      ],
      usage: { input_tokens: 100, output_tokens: 10 },
    },
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: [], callSiteAudit: fresh, confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.deepEqual(out.callSiteAudit, fresh, 'a non-empty resubmit must still beat the bank');
});

// Restoring the records is pointless if nobody can read them: every exit path breaks before the
// submit branch's logging, so a bounced-then-interrupted run printed nothing about the gate.
test('the audit and the clearance gate are logged even when the run never submits', async () => {
  const audit = [{ file: 'a.ts', line: 7, quotedLine: 'fn(x)', verdict: 'bug', why: 'omission erases shared state' }];
  const confirm = [{
    claim: 'dismissed lost on exit', predictedFailure: 'bank then break', invariant: 'none enforced',
    enforcingCode: 'agent-loop.mjs:466 `dismissed ?? []`', coversThisPath: 'breaks never set it',
    counterexample: 'constructed it', verdict: 'cleared-all-five-passed',
  }];
  const client = stubClient([
    {
      content: [
        { type: 'thinking', thinking: 'that one is harmless so I am leaving it out.' },
        { type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [], callSiteAudit: audit, confirmSuppressed: confirm } },
      ],
      usage: { input_tokens: 100, output_tokens: 10 },
    },
    { content: [{ type: 'text', text: 'I am done.' }], usage: { input_tokens: 100, output_tokens: 10 } },
    { content: [{ type: 'text', text: 'Still done.' }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const lines = [];
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: (l) => lines.push(l) });
  const joined = lines.join('\n');
  assert.equal(out.submitted, false, 'this run never successfully submitted');
  assert.match(joined, /audit · BUG .*a\.ts:7/, 'the banked audit must be readable in the run log');
  assert.match(joined, /confirm · CLEARED-ALL-FIVE-PASSED dismissed lost on exit/, 'the gate record must be readable');
  assert.match(joined, /invariant: none enforced/, 'the failed gate step must be readable');
  assert.doesNotMatch(joined, /submit_findings →/, 'a run that never submitted must not claim it did');
});

test('a normal submit logs the records exactly once', async () => {
  const audit = [{ file: 'a.ts', line: 1, quotedLine: 'fn(x)', verdict: 'passes', why: 'supplies it' }];
  const client = stubClient([
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [], callSiteAudit: audit, confirmSuppressed: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  const lines = [];
  await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: (l) => lines.push(l) });
  assert.equal(lines.filter((l) => /audit · PASSES/.test(l)).length, 1, 'the restore-path call must not double-log');
});
