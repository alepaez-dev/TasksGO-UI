import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGovernor } from './cost-governor.mjs';

const config = {
  model: 'claude-opus-4-8',
  costCeilingUsd: 3,
  pricing: { 'claude-opus-4-8': { input: 5, output: 25 } },
};

test('accumulates spend across rounds', () => {
  const g = createGovernor({ config });
  g.record({ input_tokens: 100000, output_tokens: 0 }); // $0.50
  g.record({ input_tokens: 0, output_tokens: 4000 }); // $0.10
  assert.ok(Math.abs(g.spentUsd() - 0.6) < 1e-6);
});

test('wouldExceed compares spent + projection to ceiling', () => {
  const g = createGovernor({ config });
  g.record({ input_tokens: 500000, output_tokens: 0 }); // $2.50
  assert.equal(g.wouldExceed(0.2), false); // 2.70 < 3
  assert.equal(g.wouldExceed(0.6), true); // 3.10 > 3
});

test('interrupt records the reason', () => {
  const g = createGovernor({ config });
  assert.equal(g.interruptedReason, null);
  g.interrupt('budget');
  assert.equal(g.interruptedReason, 'budget');
});

test('projectNextRoundUsd estimates from the last round usage (cache-aware)', () => {
  const g = createGovernor({ config });
  // 200k cache-read ($0.10) + 2k output ($0.05) => ~0.15
  const next = g.projectNextRoundUsd({
    input_tokens: 0,
    cache_read_input_tokens: 200000,
    cache_creation_input_tokens: 0,
    output_tokens: 2000,
  });
  assert.ok(next >= 0.15 && next < 0.5);
});

test('totalUsage reflects accumulated tokens', () => {
  const g = createGovernor({ config });
  g.record({ input_tokens: 10, cache_read_input_tokens: 20, cache_creation_input_tokens: 5, output_tokens: 3 });
  g.record({ input_tokens: 1, cache_read_input_tokens: 2, cache_creation_input_tokens: 0, output_tokens: 4 });
  assert.deepEqual(g.totalUsage(), {
    input_tokens: 11,
    cache_read_input_tokens: 22,
    cache_creation_input_tokens: 5,
    output_tokens: 7,
  });
});
