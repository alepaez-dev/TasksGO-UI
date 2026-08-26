import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

test('projectTerminalTurnUsd prices the submit turn at the terminal output floor', () => {
  const g = createGovernor({ config: { ...config, terminalOutputTokens: 8000 } });
  // A cheap exploration round: 200k cache-read ($0.10) + 500 output ($0.0125) = $0.1125
  const last = { input_tokens: 0, cache_read_input_tokens: 200000, cache_creation_input_tokens: 0, output_tokens: 500 };
  // The submit turn re-reads the same context ($0.10) but emits ~8000 tokens ($0.20) => $0.30
  const projected = g.projectTerminalTurnUsd(last);
  assert.ok(projected > 0.29 && projected < 0.31, `expected ~0.30, got ${projected}`);
});

test('projectTerminalTurnUsd never underestimates a round that already exceeded the floor', () => {
  const g = createGovernor({ config: { ...config, terminalOutputTokens: 8000 } });
  const last = { input_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0, output_tokens: 20000 };
  assert.ok(g.projectTerminalTurnUsd(last) >= (20000 * 25) / 1e6);
});

test('projectTerminalTurnUsd falls back to a sane floor when no round has run yet', () => {
  const g = createGovernor({ config: { ...config, terminalOutputTokens: 8000 } });
  assert.ok(g.projectTerminalTurnUsd(null) >= (8000 * 25) / 1e6);
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

// The invariant behind two separate shipped defects: an affordability check must price the LIMIT the
// request carries, never the observed usage of some other request. Reserving less than the cap lets a
// run decide it can stop "at" the ceiling and then finish over it.
test('the terminal reserve is never smaller than the cap the terminal turn is sent with', () => {
  const cfg = JSON.parse(readFileSync(new URL('./config.json', import.meta.url), 'utf8'));
  assert.ok(cfg.terminalOutputTokens > 0, 'terminalOutputTokens must be set — it is both the cap and the reserve');
  assert.equal(cfg.terminalTurnOutputTokens, undefined, 'a second name for the terminal cap is how the reserve drifted below it');
  const g = createGovernor({ config: { ...config, terminalOutputTokens: cfg.terminalOutputTokens } });
  const idle = { input_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0, output_tokens: 0 };
  assert.ok(
    g.projectTerminalTurnUsd(idle) >= (cfg.terminalOutputTokens * 25) / 1e6,
    'the reserve must cover a terminal turn that emits its full cap',
  );
});

test('affordableOutputTokens never returns more than the budget can pay for', () => {
  const g = createGovernor({ config });
  const usage = { input_tokens: 0, cache_read_input_tokens: 200000, cache_creation_input_tokens: 0, output_tokens: 0 };
  // $0.60 budget, $0.10 of which the re-read of context consumes => $0.50 / $25 per Mtok = 20000.
  assert.equal(g.affordableOutputTokens(usage, 'claude-opus-4-8', 0.6), 20000);
  assert.equal(g.affordableOutputTokens(usage, 'claude-opus-4-8', 0.05), 0, 'input alone over budget yields nothing');
});
