# AI Reviewer — Tier 3 (autonomous, agentic)

A Cursor-Bugbot-class deep PR reviewer. Where Tier 2 (`.github/ai-reviewer/`, label `ai-reviewer`)
reviews a **fixed, pre-assembled context** in a single pass, Tier 3 is **autonomous**: it explores the
repository at the PR head with read-only tools, reasons about whole-system control flow, and decides
for itself what to read. It exists to catch the bugs a diff-only pass misses — early returns that skip
required work, guards derived from incomplete data, state advanced on an error/skip path.

- **Label:** `ai-reviewer-tier3` (new, separate from Tier 2's `ai-reviewer`).
- **Model:** `claude-opus-4-8` (1M context), `effort: max`, adaptive thinking.
- **Budget:** target ~$2/run, **hard ceiling $3** — enforced deterministically (see below). (for now, I'll reduce it I just want to see how far it can go)

## How it works

A manual Anthropic tool-use loop (`agent-loop.mjs`) gives the model four tools (`tools.mjs`):

| Tool | What it does |
|---|---|
| `read_file(path, [startLine, endLine])` | Read a head file (with line numbers), or a slice. |
| `grep(pattern, [pathGlob])` | Regex search across the head (pure-Node walk — **no external ripgrep dependency**). |
| `list_dir(path)` | List a directory. |
| `submit_findings({ findings })` | Terminal tool — submit findings (or an empty list) and end. |

The model explores until confident, then calls `submit_findings`. Findings flow through Tier 2's
existing **filter → de-dup → post → verify/auto-resolve** machinery (reused, not duplicated).

**Reporting scope is anchored-plus:** prefer a changed (`+`) line, but a bug in *unchanged* code that
the PR makes wrong/reachable may be reported too (routed through Tier 2's off-diff high-confidence
guard). It is not a whole-repo audit — every finding traces back to the PR's change.

## Cost governance (the $2 / $3 contract)

Three layers, plus a loud interrupt:

1. **`max_tokens`** per response caps output spend.
2. **Task Budget** (beta `task-budgets-2026-03-13`) — the model sees a cumulative-token countdown
   (`taskBudgetTokens`) and self-moderates.
3. **Code-side projected-spend abort** (`cost-governor.mjs`) — before each round, if
   `spent + projected-next-round > costCeilingUsd`, the loop gives the model **one final forced
   `submit_findings` turn** to capture whatever it has confirmed, then records
   `interruptedReason: "budget"` and stops. That wrap-up turn is mostly cache-reads, but it is one call
   *past* the gate, so a cut-short run can land modestly over the ceiling. If `spent` already exceeds
   the ceiling, the wrap-up is skipped and the loop stops cold (no findings).

**Scope of the ceiling:** `costCeilingUsd` bounds the **findings loop** only. The verify/auto-resolve
pass runs *after* the loop and is **not** gated by the ceiling — it is bounded instead by
`maxVerifyThreads` (≤ 20) plus its own `maxInputTokens` pre-flight gate, so it adds a bounded amount
(roughly $0.30–1.00) on top. That amount **is** included in the reported total (sticky PR comment + job
summary), so the spend you see is accurate — only the deterministic abort excludes it, so a run's true
total can land somewhat above `costCeilingUsd`. (If verify ever runs too hot, it can be folded into the
budget — see the `TODO(budget)` in `review-agent.mjs`.)

Caching is load-bearing: the loop keeps a cache-stable prefix (system + diff + accumulated reads) so
re-reads bill at 0.1×, which is what keeps ~1.5M cumulative tokens near $2 instead of $7.50. The model
id is `claude-opus-4-8` — **never** `claude-opus-4-8[1m]` (that's a session label, not an API id); its
context window is already 1M, and a single request is hard-capped at 1M input tokens.

**When a run is cut short for budget** (or hits `maxRounds`), it is flagged **loudly** so it is never
mistaken for a clean pass:
- a `core.warning(...)` in the run log,
- a `> ⚠️ …` banner in the **job summary**,
- and the same banner on the **sticky PR status comment** and the first off-diff summary comment.

It also does **not** mark the commit "reviewed." Re-applying the label runs a **fresh review, billed
again** (there is no exploration memory across runs) — the partial findings already posted persist and
are de-duplicated, but a PR large enough to hit the ceiling is best handled by raising `costCeilingUsd`
or splitting the PR, not by re-labeling.

## Independence from Tier 2

Tier 3 uses its own comment namespace (`markerPrefix: "ai-reviewer-tier3"`): its own finding markers,
its own sticky status comment, its own verify/resolve threads. This is implemented by a
behavior-preserving `markerPrefix` parameter threaded through the shared helpers in
`../ai-reviewer/review.mjs` (default `'ai-reviewer'` → Tier 2 is byte-identical, guarded by its
54-test suite).

Consequences:
- **Run Tier 2 → don't like it → run Tier 3:** works. Tier 3 does a fresh, independent review; it is
  *not* fooled into skipping by Tier 2's "already reviewed" status, and it won't dedup against or
  resolve Tier 2's threads. Tier 2's comments stay put (remove the `ai-reviewer` label / its comments
  if you want them gone).
- **Both labels on the same PR at once:** unsupported. Use one tier per PR.

## Security model

Runs under `pull_request_target` (so it has the API key + write to comment), gated by the
`ai-reviewer-tier3` label **plus** an allow-list guard — only listed GitHub usernames can trigger a run
(on label events and on push/reopen auto re-runs), and on a `labeled` event the user must also have
write access. Edit `ALLOWLIST` in the workflow to widen it. The PR head is checked out **read-only** into `_head` and only read with the tools —
**never executed** (no `npm ci`/build/scripts on head; `persist-credentials: false`). Tier 3's own
script + deps come from the trusted base and install with `--ignore-scripts`. The tools are read-only,
repo-confined (reuse `confineToRepo`), with no shell and no network, so secrets cannot be exfiltrated.

## Files

| File | Responsibility |
|---|---|
| `review-agent.mjs` | Entry point: diff → agentic loop → filter → post → verify → job summary (+ budget banner). |
| `agent-loop.mjs` | The manual tool-use loop (task budget + spend abort + `interruptedReason`). |
| `tools.mjs` | Read-only repo-confined tools + their schemas. |
| `cost-governor.mjs` | Spend accumulation + projected-spend abort. |
| `prompts.mjs` | Tier 3 system prompt; re-exports Tier 2's verify prompt. |
| `config.json` | Model, effort, budgets, ceiling, marker prefix. |
| `*.test.mjs` | `node --test` unit tests (tools, governor, loop, namespace). |

## Key config knobs (`config.json`)

| Key | Default | Meaning |
|---|---|---|
| `effort` | `"max"` | Thinking/agentic depth. Drop to `"xhigh"` if spend runs hot. |
| `costCeilingUsd` | `3` | Hard per-run spend ceiling (deterministic abort). |
| `costWarnUsd` | `2` | Warn when a run exceeds this. |
| `taskBudgetTokens` | `1200000` | Cumulative-token budget the model self-moderates against (≥ 20000). |
| `maxInputTokens` | `1000000` | Per-request hard cap on the **initial** prompt (graceful skip, not truncation). |
| `maxRounds` / `maxToolCalls` | `40` / `120` | Loop backstops. |
| `markerPrefix` | `"ai-reviewer-tier3"` | Comment namespace (keeps it independent of Tier 2). |

## Tests

```bash
cd .github/ai-reviewer-tier3 && npm ci --ignore-scripts && npm test
```

The live path (the actual Claude call) requires `ANTHROPIC_API_KEY` and is exercised on a real PR;
the offline tests cover tool sandboxing, the spend abort, the loop control flow, and namespace
disjointness with a stubbed client.
