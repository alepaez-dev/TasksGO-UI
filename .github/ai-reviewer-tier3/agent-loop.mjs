import { TOOL_DEFS, makeToolRunner } from './tools.mjs';
import { createGovernor } from './cost-governor.mjs';

const TASK_BUDGET_BETA = 'task-budgets-2026-03-13';

function findToolUses(content) {
  return (content || []).filter((b) => b && b.type === 'tool_use');
}

function formatTokens(n) {
  n = n || 0;
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

export function describeToolUse(use) {
  const input = (use && use.input) || {};
  switch (use && use.name) {
    case 'read_file': {
      const hasRange = Number.isInteger(input.startLine) || Number.isInteger(input.endLine);
      const range = hasRange ? `:${input.startLine ?? 1}-${input.endLine ?? ''}` : '';
      return `read_file ${input.path ?? '?'}${range}`;
    }
    case 'grep':
      return `grep /${input.pattern ?? ''}/${input.pathGlob ? ` glob:${input.pathGlob}` : ''}`;
    case 'list_dir':
      return `list_dir ${input.path ?? '?'}`;
    case 'submit_findings':
      return `submit_findings (${Array.isArray(input.findings) ? input.findings.length : 0})`;
    default:
      return (use && use.name) || 'unknown_tool';
  }
}

export function summarizeToolResult(out) {
  if (!out) return '';
  const content = String(out.content ?? '');
  if (out.isError) return `ERROR: ${content.replace(/\s+/g, ' ').trim().slice(0, 80)}`;
  if (content.startsWith('(no matches)')) return 'no matches';
  const note = content.match(/\(([^)]*(?:match|truncat|no lines|byte cap|dense)[^)]*)\)\s*$/i);
  // grep emits `path:line:content` (two colons); read_file emits `N: content` (one) → count grep hits + files.
  const grepLines = content.split('\n').filter((l) => /^[^\s:]+:\d+:/.test(l));
  if (grepLines.length) {
    const files = new Set(grepLines.map((l) => l.slice(0, l.indexOf(':'))));
    return `${grepLines.length} match(es) in ${files.size} file(s)${note ? ` · ${note[1]}` : ''}`;
  }
  const lines = content ? content.split('\n').length : 0;
  return note ? `${lines} line(s) · ${note[1]}` : `${lines} line(s)`;
}

export function budgetPhase(frac, softFraction = 0.75) {
  if (frac >= softFraction) return 'converge';
  if (frac >= softFraction * 0.6) return 'prioritize';
  return 'explore';
}

const BUDGET_GUIDANCE = {
  explore: 'Explore freely — read whole functions and trace callers/state.',
  prioritize:
    'Past the mid-point of your budget — prioritize the highest-risk changes (security, correctness, data-loss) and avoid low-value exploration.',
  converge:
    'Budget is running low — CONVERGE NOW: confirm only the most important (high/critical) issues, stop opening new low-severity threads, and call submit_findings soon.',
};

// The exact guidance sentence handed to the model each round (thresholds live in budgetPhase).
export function budgetGuidance(frac, softFraction = 0.75) {
  return BUDGET_GUIDANCE[budgetPhase(frac, softFraction)];
}

function collectReasoning(content) {
  const text = [];
  const thinking = [];
  for (const b of content || []) {
    if (!b) continue;
    if (b.type === 'text' && typeof b.text === 'string') text.push(b.text);
    else if (b.type === 'thinking' && typeof b.thinking === 'string') thinking.push(b.thinking);
  }
  return { text: text.join(' '), thinking: thinking.join(' ') };
}

function surfaceReasoning(log, content) {
  const { text: narration, thinking } = collectReasoning(content);
  if (thinking.trim()) log(`Thinking -> ${thinking.trim()}`);
  if (narration.trim()) log(`Reasoning -> ${narration.trim()}`);
}

function logRound({ log, logLevel, config, rounds, msg, uses, outs, spentUsd, frac, softFraction, elapsedMs }) {
  if (logLevel === 'quiet') {
    log(`round ${rounds}: ${uses.map((u) => u.name).join(', ')} · spent ≈ $${spentUsd.toFixed(3)}`);
    return;
  }
  const u = msg.usage || {};
  log(
    `round ${rounds}/${config.maxRounds} · in ${formatTokens(u.input_tokens)} out ${formatTokens(u.output_tokens)} · ` +
      `$${spentUsd.toFixed(2)} (${Math.round(frac * 100)}%) · ${Math.round(elapsedMs / 1000)}s`,
  );
  surfaceReasoning(log, msg.content); // WHY it acted
  for (let k = 0; k < uses.length; k++) {
    log(`  ↳ ${describeToolUse(uses[k])} -> ${summarizeToolResult(outs[k])}`);
    if (logLevel === 'debug') {
      const raw = String(outs[k].content ?? '').trim();
      if (raw) log(`      ⤷ ${raw}`);
    }
  }
  // debug: what we told the model 
  log(`  budget -> model: ${budgetPhase(frac, softFraction)} (${Math.round(frac * 100)}% spent)`);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const errMsg = (e) => (e && e.message ? e.message : String(e));

export function isTransientError(e) {
  const status = e?.status ?? e?.statusCode;
  if (status === 429 || (typeof status === 'number' && status >= 500 && status <= 599)) return true;
  const type = e?.error?.error?.type ?? e?.error?.type ?? e?.type;
  if (type === 'overloaded_error' || type === 'rate_limit_error' || type === 'api_error') return true;
  if (status == null && /ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|socket hang up|network|timeout/i.test(errMsg(e))) return true;
  return false;
}

function buildRequestParams(model, { config, system, tools, messages }) {
  return {
    model,
    max_tokens: config.maxOutputTokens,
    betas: [TASK_BUDGET_BETA],
    thinking: { type: 'adaptive', display: 'summarized' },
    output_config: {
      effort: config.effort,
      task_budget: { type: 'tokens', total: Math.max(20000, config.taskBudgetTokens) },
    },
    system,
    tools,
    messages,
  };
}

async function streamRoundWithRetry({ client, models, startIdx, maxRetries, baseDelay, params, log }) {
  let lastErr;
  for (let idx = startIdx; idx < models.length; idx++) {
    const model = models[idx];
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const stream = client.beta.messages.stream(buildRequestParams(model, params));
        const msg = await stream.finalMessage();
        if (idx !== startIdx) log(`recovered on fallback model ${model}.`);
        return { msg, idx };
      } catch (e) {
        if (!isTransientError(e)) throw e;
        lastErr = e;
        const moreAttempts = attempt < maxRetries;
        const moreModels = idx < models.length - 1;
        if (!moreAttempts && !moreModels) throw e;
        if (moreAttempts) {
          const delay = baseDelay * 2 ** attempt;
          log(`transient API error on ${model} (attempt ${attempt + 1}/${maxRetries + 1}): ${errMsg(e)}${delay ? ` — retrying in ${delay}ms` : ''}`);
          if (delay) await sleep(delay);
        } else {
          log(`transient API error on ${model} (retries exhausted): ${errMsg(e)} — falling back to ${models[idx + 1]}`);
          break;
        }
      }
    }
  }
  throw lastErr;
}

export async function runReviewAgent({ client, config, system, userMessage, root, log }) {
  const runTool = makeToolRunner({ root, config });
  const governor = createGovernor({ config });
  const tools = TOOL_DEFS;
  const logLevel = config.logLevel ?? 'info';
  const softFraction = config.softWindDownFraction ?? 0.75;
  const models = [config.model, config.fallbackModel].filter(Boolean);
  const maxRetries = config.maxTransientRetries ?? 3;
  const baseDelay = config.retryBaseDelayMs ?? 1000;
  let modelIdx = 0;

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
    const roundStart = Date.now();
    // When budget/rounds are about to be exceeded, give the model ONE final turn to submit the
    // findings it already has.
    if (!windingDown) {
      const overBudget = lastUsage && governor.wouldExceed(governor.projectNextRoundUsd(lastUsage, models[modelIdx]));
      const overRounds = rounds >= config.maxRounds;
      if (overBudget || overRounds) {
        governor.interrupt(overRounds ? 'max_rounds' : 'budget');
        if (logLevel !== 'quiet')
          log(`[wind-down] ${overRounds ? 'round cap' : 'budget'} reached at $${governor.spentUsd().toFixed(2)} — asking the model to submit and stop.`);
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
      const res = await streamRoundWithRetry({
        client,
        models,
        startIdx: modelIdx,
        maxRetries,
        baseDelay,
        params: { config, system, tools, messages },
        log,
      });
      msg = res.msg;
      modelIdx = res.idx;
    } catch (e) {
      if (rounds === 0) throw e;
      governor.interrupt('error');
      log(`model request failed after ${rounds} round(s) (retries + fallback exhausted); returning findings so far: ${errMsg(e)}`);
      break;
    }
    rounds += 1;
    lastUsage = msg.usage || null;
    governor.record(msg.usage, models[modelIdx]);

    const uses = findToolUses(msg.content);
    messages.push({ role: 'assistant', content: msg.content });
    if (uses.length === 0) {
      if (!nudgedToSubmit && !windingDown) {
        nudgedToSubmit = true;
        if (logLevel !== 'quiet')
          log(`round ${rounds}/${config.maxRounds}: model ended without a tool call — nudging it to call submit_findings.`);
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
      if (logLevel !== 'quiet') {
        log(`round ${rounds}/${config.maxRounds} · submit_findings → ${findings.length} finding(s) · spent $${governor.spentUsd().toFixed(2)}`);
        for (const f of findings) log(`  · ${f?.severity ?? '?'}/${f?.confidence ?? '?'} ${f?.title ?? '(untitled)'}`);
      }
      break;
    }

    // Force the stop in case the model keeps trying to explore more files (or just loops) after the wind-down turn.
    if (windingDown) {
      findings = findings ?? [];
      break;
    }

    const results = [];
    const outs = [];
    for (const use of uses) {
      toolCalls += 1;
      let out;
      if (toolCalls > config.maxToolCalls) {
        toolBudgetExhausted = true;
        out = { content: 'Tool-call budget exhausted. Call submit_findings now with what you have.', isError: true };
      } else {
        out = await runTool(use.name, use.input);
      }
      outs.push(out);
      results.push({ type: 'tool_result', tool_use_id: use.id, content: out.content, is_error: out.isError });
    }

    const frac = governor.budgetFraction();
    const budgetLine =
      `[budget] round ${rounds}/${config.maxRounds} · spent $${governor.spentUsd().toFixed(2)} of ` +
      `$${config.costCeilingUsd} (${Math.round(frac * 100)}%). ${budgetGuidance(frac, softFraction)}`;
    clearUserBreakpoints();
    messages.push({
      role: 'user',
      content: [...results, { type: 'text', text: budgetLine, cache_control: { type: 'ephemeral' } }],
    });

    logRound({
      log,
      logLevel,
      config,
      rounds,
      msg,
      uses,
      outs,
      spentUsd: governor.spentUsd(),
      frac,
      softFraction,
      elapsedMs: Date.now() - roundStart,
    });
  }

  return {
    findings: findings ?? [],
    usage: governor.totalUsage(),
    costUsd: governor.spentUsd(),
    usedFallback: modelIdx > 0,
    interruptedReason: governor.interruptedReason,
    rounds,
    toolBudgetExhausted,
    submitted,
  };
}
