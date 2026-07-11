import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runReviewAgent, describeToolUse, summarizeToolResult, budgetGuidance, budgetPhase } from './agent-loop.mjs';

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
  pricing: { 'claude-opus-4-8': { input: 5, output: 25 } },
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
