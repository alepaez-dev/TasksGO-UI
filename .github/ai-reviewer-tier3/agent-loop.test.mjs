import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runReviewAgent, describeToolUse, summarizeToolResult, budgetGuidance, budgetPhase, isTransientError } from './agent-loop.mjs';

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

test('captures findings from submit_findings and stops', async () => {
  const findings = [
    { file: 'src/a.ts', line: 3, title: 'Bug', body: 'x', confidence: 'high', severity: 'high', category: 'logic', suggestion: '' },
  ];
  const client = stubClient([
    {
      content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings } }],
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
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings } }], usage: { input_tokens: 500, output_tokens: 30 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.deepEqual(out.findings, findings);
  assert.equal(out.rounds, 2);
  assert.equal(out.interruptedReason, null);
});

test('a prose-only turn is nudged once, then recovers when the model submits', async () => {
  const client = stubClient([
    { content: [{ type: 'text', text: 'The change looks clean.' }], usage: { input_tokens: 1000, output_tokens: 10 } },
    { content: [{ type: 'tool_use', id: 'tu_1', name: 'submit_findings', input: { findings: [] } }], usage: { input_tokens: 500, output_tokens: 5 } },
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
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: partial } }], usage: { input_tokens: 2000, output_tokens: 100 } },
  ]);
  const out = await runReviewAgent({ client, config, system: 'sys', userMessage: 'review', root, log: () => {} });
  assert.equal(out.interruptedReason, 'budget');
  assert.deepEqual(out.findings, partial);
  assert.equal(out.rounds, 2);
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
    { content: [{ type: 'tool_use', id: 'tu_2', name: 'submit_findings', input: { findings: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
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
              : { content: [{ type: 'tool_use', id: 'tu_s', name: 'submit_findings', input: { findings: [] } }], usage: { input_tokens: 50, output_tokens: 5 } };
          return { finalMessage: async () => msg };
        },
      },
    },
  };
  // Two cache_control system blocks, like review-agent.mjs builds (prompt + rules/CLAUDE.md).
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
    { content: [{ type: 'tool_use', id: 't2', name: 'submit_findings', input: { findings: [] } }], usage: { input_tokens: 100, output_tokens: 5 } },
  ]);
  await runReviewAgent({ client: lo.client, config, system: 'sys', userMessage: 'r', root, log: () => {} });
  assert.ok(budgetBlocks(lo.captured).some((t) => /Explore freely/.test(t)), 'low spend should say explore freely');

  // Expensive round ($2.50 of $3 ≈ 83%) → "CONVERGE NOW".
  const hi = capturing([
    { content: [{ type: 'tool_use', id: 't1', name: 'grep', input: { pattern: 'x' } }], usage: { input_tokens: 500000, output_tokens: 0 } },
    { content: [{ type: 'tool_use', id: 't2', name: 'submit_findings', input: { findings: [] } }], usage: { input_tokens: 100, output_tokens: 5 } },
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
    { content: [{ type: 'tool_use', id: 'tu_3', name: 'submit_findings', input: { findings: [] } }], usage: { input_tokens: 50, output_tokens: 5 } },
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
const submitMsg = (findings = []) => ({ content: [{ type: 'tool_use', id: 'ts', name: 'submit_findings', input: { findings } }], usage: { input_tokens: 100, output_tokens: 10 } });
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
  const msg = { content: [{ type: 'tool_use', id: 's', name: 'submit_findings', input: { findings: [] } }], usage };
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
    { content: [{ type: 'tool_use', id: 't2', name: 'submit_findings', input: { findings: [] } }], usage: { input_tokens: 100, output_tokens: 10 } },
  ]);
  await runReviewAgent({ client, config, system: 'sys', userMessage: 'r', root, log: (m) => logs.push(m) });
  assert.ok(logs.some((l) => l.startsWith('Thinking -> ')), 'a "Thinking ->" line must be logged when the model thinks');
  assert.ok(logs.some((l) => l.startsWith('Reasoning -> ')), 'a "Reasoning ->" line for the text narration too');
});
