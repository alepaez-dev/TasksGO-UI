import { TOOL_DEFS, makeToolRunner } from './tools.mjs';
import { createGovernor } from './cost-governor.mjs';

const TASK_BUDGET_BETA = 'task-budgets-2026-03-13';

function findToolUses(content) {
  return (content || []).filter((b) => b && b.type === 'tool_use');
}

export async function runReviewAgent({ client, config, system, userMessage, root, log }) {
  const runTool = makeToolRunner({ root, config });
  const governor = createGovernor({ config });
  const tools = TOOL_DEFS;

  const messages = [
    { role: 'user', content: [{ type: 'text', text: userMessage, cache_control: { type: 'ephemeral' } }] },
  ];

  let findings = null;
  let rounds = 0;
  let toolCalls = 0;
  let lastUsage = null;
  let windingDown = false;
  let toolBudgetExhausted = false;
  let nudgedToSubmit = false;
  let submitted = false;

  const clearUserBreakpoints = () => {
    for (const m of messages) {
      if (m.role === 'user' && Array.isArray(m.content)) {
        for (const b of m.content) if (b && b.cache_control) delete b.cache_control;
      }
    }
  };

  while (true) {
    // When budget/rounds are about to be exceeded, give the model ONE final turn to submit the
    // findings it already hass
    if (!windingDown) {
      const overBudget = lastUsage && governor.wouldExceed(governor.projectNextRoundUsd(lastUsage));
      const overRounds = rounds >= config.maxRounds;
      if (overBudget || overRounds) {
        governor.interrupt(overRounds ? 'max_rounds' : 'budget');
        if (governor.spentUsd() >= config.costCeilingUsd) break;
        windingDown = true;
        clearUserBreakpoints();
        const limitReached = overRounds
          ? 'You have reached the review round limit.'
          : 'You are out of review budget.';
        messages.push({
          role: 'user',
          content: [
            {
              type: 'text',
              text:
                `${limitReached} Call submit_findings now with every genuine bug you have ` +
                'confirmed so far (or an empty list if none). Do not call any other tool or read more files.',
              cache_control: { type: 'ephemeral' },
            },
          ],
        });
      }
    }

    let msg;
    try {
      const stream = client.beta.messages.stream({
        betas: [TASK_BUDGET_BETA],
        model: config.model,
        max_tokens: config.maxOutputTokens,
        thinking: { type: 'adaptive' },
        output_config: {
          effort: config.effort,
          task_budget: { type: 'tokens', total: Math.max(20000, config.taskBudgetTokens) },
        },
        system,
        tools,
        messages,
      });
      msg = await stream.finalMessage();
    } catch (e) {
      if (rounds === 0) throw e;
      governor.interrupt('error');
      log(`model request failed after ${rounds} round(s); returning findings so far: ${e && e.message ? e.message : e}`);
      break;
    }
    rounds += 1;
    lastUsage = msg.usage || null;
    governor.record(msg.usage);

    const uses = findToolUses(msg.content);
    messages.push({ role: 'assistant', content: msg.content });
    if (uses.length === 0) {
      if (!nudgedToSubmit && !windingDown) {
        nudgedToSubmit = true;
        clearUserBreakpoints();
        messages.push({
          role: 'user',
          content: [
            {
              type: 'text',
              text:
                'You ended your turn without calling submit_findings. You MUST finish by calling ' +
                'submit_findings exactly once — with every genuine bug you found, or an empty list if the ' +
                'change is clean. Call it now; do not reply with prose.',
              cache_control: { type: 'ephemeral' },
            },
          ],
        });
        continue;
      }
      findings = findings ?? [];
      break;
    }

    const submit = uses.find((u) => u.name === 'submit_findings');
    if (submit) {
      const submittedFindings = submit.input?.findings;
      if (Array.isArray(submittedFindings)) {
        submitted = true;
        findings = submittedFindings;
      } else {
        findings = [];
      }
      break;
    }

    // Force the stop in case the model keeps trying to explore more files (or just loops) after the wind-down turn
    if (windingDown) {
      findings = findings ?? [];
      break;
    }

    const results = [];
    for (const use of uses) {
      toolCalls += 1;
      let out;
      if (toolCalls > config.maxToolCalls) {
        toolBudgetExhausted = true;
        out = { content: 'Tool-call budget exhausted. Call submit_findings now with what you have.', isError: true };
      } else {
        out = await runTool(use.name, use.input);
      }
      results.push({ type: 'tool_result', tool_use_id: use.id, content: out.content, is_error: out.isError });
    }
    // Roll the single message-side cache breakpoint forward (drop the prior round's, set the new one)
    // so each request stays within the 4-breakpoint cap (2 system + 1 rolling). The lone rolling
    // breakpoint still caches the whole prefix before it (earlier writes remain read points).
    clearUserBreakpoints();
    results[results.length - 1].cache_control = { type: 'ephemeral' };
    messages.push({ role: 'user', content: results });
    log(`round ${rounds}: ${uses.map((u) => u.name).join(', ')} · spent ≈ $${governor.spentUsd().toFixed(3)}`);
  }

  return {
    findings: findings ?? [],
    usage: governor.totalUsage(),
    interruptedReason: governor.interruptedReason,
    rounds,
    toolBudgetExhausted,
    submitted,
  };
}
