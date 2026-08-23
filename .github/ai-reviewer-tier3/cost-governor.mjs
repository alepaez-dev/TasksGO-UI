import { addUsage, estimateCostUsd } from '../ai-reviewer/review.mjs';

const ZERO = { input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 };

export function createGovernor({ config }) {
  let total = { ...ZERO };
  const byModel = new Map(); // model → accumulated usage, so a fallback round is priced at its OWN rate
  let interruptedReason = null;

  function record(usage, model = config.model) {
    if (!usage) return;
    total = addUsage(total, usage);
    byModel.set(model, addUsage(byModel.get(model) ?? { ...ZERO }, usage));
  }
  function priceFor(usage, model) {
    return estimateCostUsd(usage, model, config.pricing) ?? estimateCostUsd(usage, config.model, config.pricing) ?? 0;
  }
  function spentUsd() {
    let sum = 0;
    for (const [model, usage] of byModel) sum += priceFor(usage, model);
    return sum;
  }
  function projectTerminalTurnUsd(lastUsage, model = config.model) {
    const floor = config.terminalOutputTokens ?? 8000;
    const basis = lastUsage ?? { input_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0, output_tokens: 0 };
    return priceFor({ ...basis, output_tokens: Math.max(basis.output_tokens ?? 0, floor) }, model);
  }
  function affordableOutputTokens(lastUsage, model = config.model, budgetUsd = 0) {
    const basis = { ...(lastUsage ?? ZERO), output_tokens: 0 };
    const rate = (config.pricing?.[model]?.output ?? config.pricing?.[config.model]?.output ?? 0) / 1e6;
    if (rate <= 0) return 0;
    return Math.max(0, Math.floor((budgetUsd - priceFor(basis, model)) / rate));
  }
  function wouldExceed(projectedNextUsd) {
    return spentUsd() + (projectedNextUsd ?? 0) > config.costCeilingUsd;
  }
  function budgetFraction() {
    return config.costCeilingUsd > 0 ? spentUsd() / config.costCeilingUsd : 0;
  }
  function interrupt(reason) {
    interruptedReason = reason;
  }

  return {
    record,
    spentUsd,
    budgetFraction,
    totalUsage: () => total,
    projectTerminalTurnUsd,
    affordableOutputTokens,
    wouldExceed,
    interrupt,
    get interruptedReason() {
      return interruptedReason;
    },
  };
}
