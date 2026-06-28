import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as core from '@actions/core';
import * as github from '@actions/github';
import Anthropic from '@anthropic-ai/sdk';

import { REVIEW_AGENT_SYSTEM_PROMPT } from './prompts.mjs';
import { runReviewAgent } from './agent-loop.mjs';
import { TOOL_DEFS } from './tools.mjs';
import {
  DEFAULT_CONFIG,
  buildDiffContext,
  filterFindings,
  reviewFullySurfaced,
  renderStatusBody,
  renderInlineBody,
  chunkSummaryComments,
  parseMarkers,
  isTrustedMarkerComment,
  statusMarkerRe,
  parseStatusReviewedSha,
  parseStatusVerifiedSha,
  verificationComplete,
  isTrustedAuthor,
  diffIsComplete,
  estimateCostUsd,
  formatUsage,
  addUsage,
  estimateInputTokens,
  sanitizeText,
  verifyAndResolveThreads,
  writeJobSummary,
} from '../ai-reviewer/review.mjs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '..', '..');

function loadConfig() {
  const raw = JSON.parse(readFileSync(resolve(SCRIPT_DIR, 'config.json'), 'utf8'));
  return { ...DEFAULT_CONFIG, ...raw };
}

function loadTextFile(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return '';
  }
}

// Plain-text note for an over-budget / over-rounds interrupt (writeJobSummary wraps it as `> ⚠️ …`;
// the PR comments prepend it as a `> ⚠️ …` banner). Null when the run finished normally.
function interruptNote(result, config) {
  if (!result.interruptedReason) return null;
  const spent = estimateCostUsd(result.usage, config.model, config.pricing);
  const spend = `≈ ${formatUsage(result.usage)}${spent != null ? ` (≈ $${spent.toFixed(2)})` : ''}`;
  if (result.interruptedReason === 'budget') {
    return (
      `Tier 3 stopped early — hit the $${config.costCeilingUsd} budget ceiling after ${spend}. ` +
      `Findings may be incomplete; re-apply the \`${config.markerPrefix ?? 'ai-reviewer-tier3'}\` label to continue.`
    );
  }
  if (result.interruptedReason === 'error') {
    return `Tier 3 stopped early — a model request failed mid-review (after ${spend}). Findings may be incomplete; see the run log.`;
  }
  return `Tier 3 stopped early — hit the maxRounds limit (${config.maxRounds}) after ${spend}. Findings may be incomplete.`;
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    core.setFailed('ANTHROPIC_API_KEY is not set. Add it as a repository secret and pass it to this workflow.');
    return;
  }
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    core.setFailed('GITHUB_TOKEN is not set. Pass `secrets.GITHUB_TOKEN` to the review step.');
    return;
  }
  const headDir = process.env.HEAD_DIR;
  if (!headDir) {
    core.setFailed('HEAD_DIR (a read-only checkout of the PR head) is not set; see ai-reviewer-tier3.yml.');
    return;
  }

  const prPayload = github.context.payload.pull_request;
  if (!prPayload) {
    core.info('No pull_request in the event payload; nothing to review.');
    return;
  }

  const config = loadConfig();
  const markerPrefix = config.markerPrefix ?? 'ai-reviewer-tier3';
  const octokit = github.getOctokit(token);
  const { owner, repo } = github.context.repo;
  const pull_number = prPayload.number;

  const pr = {
    number: pull_number,
    title: prPayload.title || '',
    body: prPayload.body || '',
    base: prPayload.base?.ref || 'base',
    headSha: prPayload.head?.sha,
    authorAssociation: prPayload.author_association || 'NONE',
  };
  try {
    const { data } = await octokit.rest.pulls.get({ owner, repo, pull_number });
    pr.headSha = data.head?.sha || pr.headSha;
    pr.base = data.base?.ref || pr.base;
    pr.title = data.title ?? pr.title;
    pr.body = data.body ?? pr.body;
    pr.authorAssociation = data.author_association ?? pr.authorAssociation;
  } catch (err) {
    core.warning(`Could not fetch live PR; using event payload values. (${err.message})`);
  }
  if (!pr.headSha) {
    core.setFailed('Could not determine the PR head SHA.');
    return;
  }

  core.info(`Tier 3 reviewing PR #${pull_number} (${owner}/${repo}) at ${pr.headSha}`);

  const files = await octokit.paginate(octokit.rest.pulls.listFiles, { owner, repo, pull_number, per_page: 100 });
  const { diffText, commentableByFile, skippedForSize, truncated } = buildDiffContext(files, config);

  const fileStatusByPath = new Map();
  for (const f of files) {
    fileStatusByPath.set(f.filename, f.status);
    if (f.status === 'renamed' && f.previous_filename) fileStatusByPath.set(f.previous_filename, 'renamed');
  }
  const prHasNonRemovedFiles = files.some((f) => f.status !== 'removed');

  const [reviewComments, issueComments] = await Promise.all([
    octokit.paginate(octokit.rest.pulls.listReviewComments, { owner, repo, pull_number, per_page: 100 }),
    octokit.paginate(octokit.rest.issues.listComments, { owner, repo, issue_number: pull_number, per_page: 100 }),
  ]);
  const trusted = (c) => isTrustedMarkerComment(c, config.botActor);
  const priorMarkers = [
    ...reviewComments.filter(trusted).flatMap((c) => parseMarkers(c.body, markerPrefix)),
    ...issueComments.filter(trusted).flatMap((c) => parseMarkers(c.body, markerPrefix)),
  ];
  const seenFingerprints = new Set(priorMarkers.map((m) => m.fp).filter(Boolean));
  core.info(`Found ${seenFingerprints.size} previously reported tier-3 finding(s) to de-duplicate against.`);

  const statusComment = issueComments.find((c) => trusted(c) && statusMarkerRe(markerPrefix).test(c.body || '')) ?? null;
  const statusCommentId = statusComment?.id ?? null;
  const lastReviewedSha = parseStatusReviewedSha(statusComment?.body, markerPrefix);
  const lastVerifiedSha = parseStatusVerifiedSha(statusComment?.body, markerPrefix);
  const runUrl =
    process.env.GITHUB_SERVER_URL && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${owner}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : null;

  const upsertStatus = async (stats, banner = null) => {
    if (!config.postRunStatusComment) return;
    const body =
      (banner ? `${banner}\n\n` : '') +
      renderStatusBody({ model: config.model, runUrl, seenCount: seenFingerprints.size, markerPrefix, ...stats });
    try {
      if (statusCommentId) await octokit.rest.issues.updateComment({ owner, repo, comment_id: statusCommentId, body });
      else await octokit.rest.issues.createComment({ owner, repo, issue_number: pull_number, body });
    } catch (err) {
      core.warning(`Could not update status comment: ${err.message}`);
    }
  };

  const client = new Anthropic({ apiKey });
  const allowResolve = config.resolveOnlyForTrustedAuthors === false || isTrustedAuthor(pr.authorAssociation);
  const idempotent = config.skipIfHeadUnchanged !== false;
  const needVerify = config.verifyResolutions && (!idempotent || lastVerifiedSha !== pr.headSha);

  const verifyOnlyAndFinish = async ({ reviewedSha, note, skipped = false, inputTokens = null }) => {
    let verifyOnly = null;
    if (needVerify) {
      try {
        verifyOnly = await verifyAndResolveThreads(octokit, client, {
          owner, repo, pull_number, pr, diffText, config, allowResolve, fileStatusByPath, prHasNonRemovedFiles, skippedForSize, truncated,
        });
      } catch (err) {
        verifyOnly = { complete: false };
        core.warning(`Thread verification step failed: ${err.message}`);
      }
    }
    const resolved = verifyOnly?.resolved ?? 0;
    const verifiedSha = verificationComplete(verifyOnly) ? pr.headSha : lastVerifiedSha;
    await writeJobSummary({ findings: [], config, seenCount: seenFingerprints.size, inputTokens, note, resolved });
    await upsertStatus({ skipped, note, inputTokens, posted: 0, findingsCount: 0, reviewedSha, verifiedSha, resolved });
  };

  const findingsDone = idempotent && Boolean(lastReviewedSha) && lastReviewedSha === pr.headSha;
  const verifyDone = idempotent && Boolean(lastVerifiedSha) && lastVerifiedSha === pr.headSha;
  if (findingsDone && verifyDone) {
    core.info(`Head ${pr.headSha.slice(0, 7)} already reviewed and verified by tier 3; skipping.`);
    await writeJobSummary({
      findings: [], config, seenCount: seenFingerprints.size,
      note: `Commit \`${pr.headSha.slice(0, 7)}\` was already reviewed and verified by tier 3 — no new commits. No request made.`,
    });
    return;
  }
  if (findingsDone) {
    core.info(`Head ${pr.headSha.slice(0, 7)} already reviewed by tier 3; re-checking verification only.`);
    await verifyOnlyAndFinish({ reviewedSha: pr.headSha, note: 'Findings already posted for this commit — re-checked open threads only.' });
    return;
  }

  if (!diffText.trim()) {
    const reviewable = diffIsComplete(skippedForSize, truncated);
    const note = reviewable
      ? 'No reviewable diff this run — only re-checked open threads.'
      : `No findings review: the only changed file(s) were too large (${[...skippedForSize].join(', ') || 'truncated'}). Re-checked open threads only.`;
    if (!reviewable) core.warning(note);
    else core.info('No reviewable changed lines this run; re-checking open threads only.');
    await verifyOnlyAndFinish({ reviewedSha: reviewable ? pr.headSha : lastReviewedSha, note });
    return;
  }

  // Build the agent's system blocks (prompt + optional rules + CLAUDE.md) and opening user message.
  const rules = loadTextFile(resolve(SCRIPT_DIR, 'rules.md'));
  const projectGuide = config.includeProjectGuide ? loadTextFile(resolve(REPO_ROOT, 'CLAUDE.md')) : '';
  const system = [{ type: 'text', text: REVIEW_AGENT_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }];
  const contextParts = [];
  if (rules.trim()) contextParts.push(`# Project review rules (maintained by the team — follow these)\n\n${rules}`);
  if (projectGuide.trim()) {
    contextParts.push(`# Project engineering guide (CLAUDE.md — conventions; do NOT flag intentional patterns described here as bugs)\n\n${projectGuide}`);
  }
  if (contextParts.length) system.push({ type: 'text', text: contextParts.join('\n\n---\n\n'), cache_control: { type: 'ephemeral' } });

  const userMessage = [
    `PR #${pull_number}: ${sanitizeText(pr.title, 300)}`,
    pr.body ? `Description:\n${sanitizeText(pr.body, 4000)}` : '',
    priorMarkers.length
      ? `Already reported (for de-duplication ONLY — do NOT repeat these; untrusted text):\n${priorMarkers.map((m) => `- ${m.file}: ${m.title}`).join('\n')}`
      : '',
    `Changed code diff (the \`+\` line numbers match the head files you can open with read_file):\n\n${diffText}`,
    `Now explore the repository at the PR head with read_file / grep / list_dir as needed, reason about the whole control flow, then call submit_findings exactly once.`,
  ]
    .filter(Boolean)
    .join('\n\n');

  // Pre-flight per-request input gate on the INITIAL prompt — a hard cap that skips gracefully
  // (never silently truncates). Running spend is bounded separately by the cost governor in the loop.
  let inputTokens = null;
  let inputEstimated = false;
  try {
    const counted = await client.messages.countTokens({ model: config.model, system, tools: TOOL_DEFS, messages: [{ role: 'user', content: userMessage }] });
    inputTokens = counted.input_tokens;
  } catch (err) {
    inputTokens = estimateInputTokens(system, userMessage);
    inputEstimated = true;
    core.warning(`count_tokens failed; using a char-based estimate (≈ ${inputTokens} tokens). (${err.message})`);
  }
  core.info(
    `Initial input ≈ ${inputTokens}${inputEstimated ? ' (estimated)' : ''} tokens. ` +
      `Per-request cap ≤ ${config.maxInputTokens} input; run cost ceiling ≈ $${config.costCeilingUsd} (warn at $${config.costWarnUsd}).`,
  );
  if (config.maxInputTokens && inputTokens != null && inputTokens > config.maxInputTokens) {
    const note = `Skipped — initial ${inputEstimated ? 'estimated ' : ''}input ${inputTokens} tokens exceeds maxInputTokens (${config.maxInputTokens}). Split the PR or raise the cap.`;
    core.warning(note);
    await verifyOnlyAndFinish({ reviewedSha: lastReviewedSha, note, skipped: true, inputTokens });
    return;
  }

  // Run the autonomous agentic review. Tool reads happen against the read-only head checkout.
  const result = await runReviewAgent({ client, config, system, userMessage, root: headDir, log: (m) => core.info(m) });
  const reviewCostUsd = estimateCostUsd(result.usage, config.model, config.pricing);
  core.info(`Agentic review: ${result.rounds} round(s) · ${formatUsage(result.usage)}${reviewCostUsd != null ? ` → ≈ $${reviewCostUsd.toFixed(3)}` : ''}.`);

  const note = interruptNote(result, config);
  const banner = note ? `> ⚠️ ${note}` : null;
  if (result.interruptedReason === 'budget') {
    core.warning(`Tier 3 stopped early at the $${config.costCeilingUsd} ceiling (≈ $${reviewCostUsd?.toFixed(3)}); findings may be incomplete.`);
  } else if (result.interruptedReason === 'max_rounds') {
    core.warning(`Tier 3 hit maxRounds (${config.maxRounds}); findings may be incomplete.`);
  } else if (result.interruptedReason === 'error') {
    core.warning('Tier 3 stopped early after a model API error; findings may be incomplete (see the run log).');
  }
  if (result.toolBudgetExhausted) {
    core.warning(`Tier 3 hit the tool-call budget (maxToolCalls=${config.maxToolCalls}); the model was asked to wrap up, so exploration may be incomplete.`);
  }
  if (config.costWarnUsd != null && reviewCostUsd != null && reviewCostUsd > config.costWarnUsd) {
    core.warning(`This run cost ≈ $${reviewCostUsd.toFixed(3)}, over costWarnUsd ($${config.costWarnUsd}).`);
  }

  const { findings, dropped, capped, offDiffDropped } = filterFindings(result.findings, { config, commentableByFile, seenFingerprints });
  core.info(
    `Kept ${findings.length} new finding(s). Dropped — confidence:${dropped.byConfidence} severity:${dropped.bySeverity} ` +
      `unchanged-file:${dropped.byFile} duplicate:${dropped.duplicate} invalid:${dropped.invalid} off-diff:${dropped.offDiff}${capped ? ` (capped at ${config.maxFindings})` : ''}.`,
  );
  for (const d of offDiffDropped) {
    core.info(`  off-diff drop (not on a changed line; needs high confidence): [${d.category}/${d.confidence}] ${d.file}:${d.line ?? '?'} — "${d.title}"`);
  }

  // Verify & auto-resolve prior tier-3 threads (reuse Tier 2; its usage adds to the total cost).
  // TODO(budget): the verify pass is NOT bounded by costCeilingUsd — only by maxVerifyThreads and its
  // own maxInputTokens gate. Its cost IS included in the reported total (addUsage below + the job
  // summary + sticky comment), so the complete report is accurate; only the deterministic ceiling
  // excludes it. If verify ever runs too hot/high fold it into the governor: skip the verify Claude call
  // when the loop already reached the ceiling, setting verifyStats = { complete: false } so
  // verifiedSha does not advance (re-label retries verification).
  let verifyStats = null;
  if (needVerify) {
    try {
      verifyStats = await verifyAndResolveThreads(octokit, client, {
        owner, repo, pull_number, pr, diffText, config, allowResolve, fileStatusByPath, prHasNonRemovedFiles, skippedForSize, truncated,
      });
    } catch (err) {
      verifyStats = { complete: false };
      core.warning(`Thread verification step failed (continuing): ${err.message}`);
    }
  }
  const resolvedCount = verifyStats?.resolved ?? 0;
  const verifiedSha = verificationComplete(verifyStats) ? pr.headSha : lastVerifiedSha;
  const usage = addUsage(result.usage, verifyStats?.usage);
  const costUsd = estimateCostUsd(usage, config.model, config.pricing);

  // A budget/round interrupt means the review did NOT finish — do not mark this commit reviewed,
  // so re-applying the label resumes instead of skipping.
  const reviewComplete = !result.interruptedReason;

  if (findings.length === 0) {
    core.info('No new tier-3 issues to post. Done.');
    await writeJobSummary({ findings, dropped, capped, config, seenCount: seenFingerprints.size, inputTokens, usage, costUsd, note, resolved: resolvedCount });
    await upsertStatus(
      { posted: 0, findingsCount: 0, inputTokens, usage, costUsd, reviewedSha: reviewComplete ? pr.headSha : lastReviewedSha, verifiedSha, resolved: resolvedCount },
      banner,
    );
    return;
  }

  // Post inline comments; collect any that could not be placed inline.
  const general = [];
  let postedInline = 0;
  let failedInline = 0;
  for (const finding of findings) {
    if (!finding.inline || finding.line == null) {
      general.push(finding);
      continue;
    }
    try {
      await octokit.rest.pulls.createReviewComment({
        owner, repo, pull_number, commit_id: pr.headSha, path: finding.file, line: finding.line, side: 'RIGHT',
        body: renderInlineBody(finding, markerPrefix),
      });
      postedInline += 1;
    } catch (err) {
      const hint = err.status === 422 ? " (line not in this commit's diff — head may have advanced)" : '';
      core.warning(`Could not post inline comment on ${finding.file}:${finding.line}${hint} (${err.status || ''} ${err.message}). Moving to summary.`);
      general.push(finding);
      failedInline += 1;
    }
  }

  // Post the leftovers as summary comment(s); put the budget banner on the first chunk.
  let postedGeneral = 0;
  if (general.length && config.postSummaryComment) {
    const chunks = chunkSummaryComments(general, config.maxSummaryChars ?? 60000, markerPrefix);
    for (let i = 0; i < chunks.length; i += 1) {
      const body = (i === 0 && banner ? `${banner}\n\n` : '') + chunks[i].body;
      try {
        await octokit.rest.issues.createComment({ owner, repo, issue_number: pull_number, body });
        postedGeneral += chunks[i].findings.length;
      } catch (err) {
        core.warning(`Could not post a summary comment (${chunks[i].findings.length} finding(s)): ${err.message}`);
      }
    }
    if (chunks.length > 1) core.info(`Off-diff summary split into ${chunks.length} comments to fit GitHub's size limit.`);
  } else if (general.length) {
    core.warning(`${general.length} off-diff/fallback finding(s) were NOT posted because postSummaryComment is disabled.`);
  }

  core.info(`Posted ${postedInline} inline comment(s)${postedGeneral ? ` and ${postedGeneral} finding(s) in a summary comment` : ''}.`);

  const fullySurfaced = reviewFullySurfaced({ postSummaryComment: config.postSummaryComment, generalCount: general.length, postedGeneral, failedInline });
  // Only mark the commit reviewed if the agent finished AND every finding was surfaced.
  const reviewedSha = reviewComplete && fullySurfaced ? pr.headSha : lastReviewedSha;
  if (!reviewComplete) core.warning(`Tier 3 was interrupted (${result.interruptedReason}); not marking ${pr.headSha.slice(0, 7)} reviewed so a re-run resumes.`);

  await writeJobSummary({ findings, dropped, capped, config, postedInline, postedGeneral, seenCount: seenFingerprints.size, inputTokens, usage, costUsd, note, resolved: resolvedCount });
  await upsertStatus(
    { posted: postedInline + postedGeneral, findingsCount: findings.length, inputTokens, usage, costUsd, reviewedSha, verifiedSha, resolved: resolvedCount },
    banner,
  );
}

const isEntrypoint = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntrypoint) {
  main().catch((e) => core.setFailed(e && e.stack ? e.stack : String(e)));
}
