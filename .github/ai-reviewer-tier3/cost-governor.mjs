import { addUsage, estimateCostUsd } from '../ai-reviewer/review.mjs';

export function createGovernor({ config }) {
  let total = { input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 };
  let interruptedReason = null;

  function record(usage) {
    if (usage) total = addUsage(total, usage);
  }
  function spentUsd() {
    return estimateCostUsd(total, config.model, config.pricing) ?? 0;
  }
  function projectNextRoundUsd(lastUsage) {
    // Conservative: assume the next round costs at least as much as the last one did.
    return estimateCostUsd(lastUsage, config.model, config.pricing) ?? 0;
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
