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
  function projectNextRoundUsd(lastUsage, model = config.model) {
    // Conservative: assume the next round costs at least as much as the last one did, at the model we're on.
    return priceFor(lastUsage, model);
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
    projectNextRoundUsd,
    wouldExceed,
    interrupt,
    get interruptedReason() {
      return interruptedReason;
    },
  };
}
