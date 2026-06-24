# AI Reviewer 🤖

A Claude-powered, **bug-focused** pull-request reviewer that runs as a GitHub Action. It reads
the PR diff, finds real bugs (with extra attention to **frontend** correctness and **security**),
and posts inline comments — and it never re-posts an issue it already commented on.

It is modeled on tools like Cursor's bug bot, but the review rules live in this repo and are
maintained by you.

---

## How it works

1. A maintainer applies the **`ai-reviewer`** label to a PR (and it re-runs on every new commit
   while the label is present).
2. The action ([`.github/workflows/ai-reviewer.yml`](../workflows/ai-reviewer.yml)) fetches the
   PR's changed files via the GitHub API, builds an annotated diff, and sends it to Claude along
   with your rules (`rules.md`) and the project guide (`CLAUDE.md`).
3. Claude returns structured findings. The script filters them by confidence/severity, drops
   anything already reported, and posts the rest as inline review comments (with a hidden
   fingerprint marker used for de-duplication).
4. Re-runs read those markers back, so the **same issue is never posted twice** — even across
   commits and re-labels.
5. On each re-run it also **re-checks every open thread it owns** against the current code and the
   full PR diff, and **auto-resolves** the ones Claude confirms are fixed (see
   [Auto-resolving fixed findings](#auto-resolving-fixed-findings)).

Everything is in `.github/ai-reviewer/`:

| File | What it is |
|---|---|
| `review.mjs` | The reviewer (single Node ESM script, no build step). |
| `prompts.mjs` | **The engine's system prompts** (bug-finding + resolution-verification), kept separate so the wording is easy to tune. |
| `rules.md` | **The rules you maintain.** Plain Markdown, sent to Claude every run. |
| `config.json` | Thresholds and knobs (model, confidence floor, ignore globs, …). |
| `package.json` / `package-lock.json` | Pinned dependencies (`@anthropic-ai/sdk`, `@actions/*`). |

---

## Tuning the reviewer

### `rules.md` — your rules (primary knob)

Edit [`rules.md`](./rules.md). It's sent verbatim to Claude as authoritative project guidance.
When the bot reports a false positive, add a line describing the intentional pattern so it stops.
When you want it to watch for something specific, add a rule. Concrete beats verbose.

> **`rules.md` vs `prompts.mjs`:** `rules.md` is *your* project guidance (an injected, cacheable
> context block) and is the knob you'll reach for most. [`prompts.mjs`](./prompts.mjs) holds the
> *engine's* system prompts — the bug-finding and resolution-verification instructions. Edit those
> only to change how the reviewer fundamentally behaves; for day-to-day tuning, prefer `rules.md`.

### `config.json` — thresholds

| Key | Default | Meaning |
|---|---|---|
| `model` | `claude-opus-4-8` | Claude model id. |
| `effort` | `high` | Reasoning effort: `low` \| `medium` \| `high` \| `xhigh` \| `max`. |
| `maxOutputTokens` | `64000` | Cap on Claude's **response** (its thinking + the findings JSON). A ceiling you only pay for what's used, so generous is safe; raise it if huge PRs ever fail with "max_tokens reached". |
| `minConfidence` | `medium` | Only post findings at/above this confidence (`low`/`medium`/`high`). Raise to `high` for less noise. |
| `minSeverity` | `low` | Only post at/above this severity (`low`/`medium`/`high`/`critical`). |
| `maxFindings` | `25` | Hard cap on findings posted per run. |
| `maxFilePatchChars` | `30000` | Skip reviewing a single file whose diff is larger than this (it's noted as skipped). |
| `maxTotalDiffChars` | `400000` | **Input** budget (~100k tokens) — the file-count knob. Once the diff exceeds this, later files are dropped (and Claude is told). ~400k chars comfortably covers ~40 files; raise it for bigger PRs (Opus 4.8 has a 1M-token context window). |
| `maxInputTokens` | `150000` | **Hard spend cap.** Before any billable call, `count_tokens` (free) measures the prompt; if it's over this, the run is **skipped with no request made**. `null` disables. |
| `costWarnUsd` | `null` | Soft alarm: log a warning if a run's estimated cost exceeds this (USD). `null` = off. |
| `pricing` | see file | Per-model `$/1M tokens` (`input`/`output`), used for cost reporting + the worst-case ceiling. Edit if pricing changes. |
| `includeProjectGuide` | `true` | Feed `CLAUDE.md` to Claude as conventions context. |
| `postSummaryComment` | `true` | Post findings that can't attach to a changed line as one summary comment. |
| `maxSummaryChars` | `60000` | Per-comment size cap (GitHub rejects bodies over ~65,536). When the off-diff findings don't fit in one comment they're **split across multiple** comments — every finding is posted (with its dedup marker), nothing is dropped, so an oversized body can't fail to post and wedge the per-commit idempotency (which would re-bill the same commit on every re-trigger). |
| `postRunStatusComment` | `true` | Keep one **sticky** comment on the PR showing the latest run's findings, token usage, and estimated cost. Upserted (updated in place), so no spam. `false` keeps cost only in the run log/summary. |
| `skipIfHeadUnchanged` | `true` | Skip already-done work when the PR's head commit hasn't changed. The status comment stores **two** SHAs: `sha` (findings reviewed) and `vsha` (verification completed). Re-applying the label on the same commit is a **free no-op only when both match** — if the findings review is done but verification was left incomplete (cap-deferred, over its own budget, or failed), the re-trigger re-checks threads **without re-billing the findings review**. Keep `postRunStatusComment` on (the SHAs live in that comment). To force a full re-review: set `false`, push an empty commit, or edit `rules.md` and push. |
| `botActor` | `github-actions[bot]` | The exact comment-author **login** trusted as the source of de-dup markers. Defaults to the login the standard `GITHUB_TOKEN` posts as. Set to your bot/user login if you post with a PAT/App token. Set to `null` to trust **any** bot author — looser; only safe on a private repo where no untrusted GitHub App can comment. |
| `verifyResolutions` | `true` | Master switch for re-checking open threads and auto-resolving the fixed ones. `false` disables the whole step (no extra API/Claude calls). |
| `resolveVerifiedFixes` | `true` | Actually run the `resolveReviewThread` mutation on a confirmed fix. Set `false` to only post the ✅ reply without collapsing the thread. |
| `resolveOnlyForTrustedAuthors` | `true` | Only auto-resolve on PRs whose author is `OWNER`/`MEMBER`/`COLLABORATOR`. Untrusted/fork PRs get the reply but their threads stay open for a human. `false` to auto-resolve regardless of author. |
| `postResolutionReplies` | `true` | Leave a short `✅ verified fixed` / `🤔 couldn't verify` reply explaining each outcome. |
| `maxVerifyThreads` | `20` | Max threads re-checked per run. Never-checked and outdated threads are verified first; any beyond the cap mark verification *incomplete* for this commit, so a later push **or re-label** re-runs the verification pass (without re-billing findings) to cover the rest. Raise it to cover more at once. |
| `verifyWindowLines` | `40` | Lines of current code shown around each finding's location during verification. |
| `maxVerifyFileChars` | `60000` | Cap on the per-file code excerpt sent to Claude during verification. |
| `maxVerifyOutputTokens` | `24000` | Output cap for the verify call (its output is small JSON). Smaller than `maxOutputTokens` to lower the worst-case ceiling; keep it big enough to cover adaptive thinking over `maxVerifyThreads` findings, or the call truncates and resolves nothing. |
| `ignore` | see file | Glob list of paths never reviewed (lockfiles, generated CSS, assets, …). |

**Too noisy?** Set `minConfidence: "high"` (and/or `minSeverity: "medium"`).
**Too quiet?** Lower them, and add focus areas to `rules.md`.

---

## Cost controls

The job `timeout-minutes` only bounds wall-clock — it does **not** bound spend (a request can spend
fast, and you're billed for tokens already generated when it's killed). The real ceilings are token
caps and the pre-flight gate, which make the **maximum cost per run deterministic**:

- **`maxInputTokens` (hard, free to enforce):** before any paid call, a free `count_tokens`
  measures the exact prompt. If it's over the cap, the run is **skipped without calling Claude** —
  zero spend. This is the precise version of `maxTotalDiffChars`. If `count_tokens` itself is
  unavailable (rate-limit/5xx), the gate does **not** fail open — it falls back to a conservative
  char-based estimate (`~3.5` chars/token) so an oversized prompt is still skipped (best-effort when
  the exact count can't be obtained, rather than billing blindly).
- **`maxOutputTokens` (hard):** the API will not generate beyond this. You only pay for tokens
  actually produced, but it can never exceed the cap.
- **Worst-case ceiling:** with both caps + `pricing`, the review call's max cost is
  `maxInputTokens × input$ + maxOutputTokens × output$` — at the defaults (Opus 4.8, 150k in / 64k
  out), **≈ $2.35**. With `verifyResolutions` on, a run makes a **second** bounded call (the
  resolution check), also gated by `maxInputTokens` but with its own smaller `maxVerifyOutputTokens`
  (24k) — **≈ $1.35** — so the per-run worst case is **≈ $3.70**. `worstCaseCostUsd` reports this
  combined figure. Typical runs cost far less (~$0.30–0.60 each), and the **actual** combined
  input/output/$ is reported every run.
- **`costWarnUsd` (soft):** logs a ⚠️ if a run's estimated cost (review + verification) exceeds it.

**Where cost shows up:** every run prints `input / cache-read / output tokens → ≈ $X` in the Actions
log *and* the job summary, and (with `postRunStatusComment: true`) updates a single sticky comment on
the PR with the latest run's tokens + cost. **Both** the review call and the verification call are
summed into that figure, so it reflects the run's true total spend. The Anthropic API returns exact **token counts** in
`usage`, not dollars — the `$` is computed from the `pricing` table, so it's only as accurate as
those rates (token counts are exact).

**Two quick pushes?** `cancel-in-progress` cancels the older run when the newer one starts. A run
spends ~30–45s on checkout + install before it ever calls Claude, so a second push within seconds
almost always cancels the first *before* any billable call — you pay for one review, of the latest
commit (the free `count_tokens` pre-flight also costs nothing).

**Label removed and re-added repeatedly?** Applying the label only *starts* a run if the user has
**write/admin** access — a guard step enforces this, because GitHub's Triage role can apply labels
without write access (so the label alone is not a trust boundary). `cancel-in-progress` collapses
rapid toggles into ~one run, and `skipIfHeadUnchanged` makes a toggle on an **already-reviewed +
verified commit a free no-op**. The expensive **findings review** runs at most once per distinct
commit; a re-label can re-run only the cheaper **verification** pass (if it was left incomplete), and
never re-bills the findings review for an unchanged commit. So cost is bounded by the number of
*distinct commits* labeled by a maintainer, each ≤ the per-run ceiling.

Cheaper without losing much:

| Lever | Effect |
|---|---|
| `effort: "medium"` | Fewer thinking tokens (the main output-cost driver). Often the best quality-preserving cut. |
| `model: "claude-sonnet-4-6"` | ~40% cheaper per token and faster; still strong at bug-finding. Opus 4.8 is the most thorough — your call. |
| Drop `synchronize` from the workflow trigger | Review only when a maintainer (re)applies the label, instead of on every push. Fewest runs. |
| Lower `maxInputTokens` / `maxTotalDiffChars` | Reviews less of very large PRs (and skips the giant ones), capping the input bill. |

`cancel-in-progress: true` (already set) means rapid pushes don't pile up — superseded runs are
cancelled so you don't pay for reviews that a newer commit obsoletes.

---

## De-duplication

Each posted comment ends with a hidden marker:

```html
<!-- ai-reviewer v1 {"fp":"…","file":"…","line":…,"title":"…"} -->
```

On each run the script reads existing **bot-authored** review/issue comments (see `botActor`),
collects those fingerprints, and:

- **Deterministically** skips any finding whose `fingerprint(file + normalized title)` already
  exists (catches exact repeats across commits).
- **Semantically** passes the list of already-reported titles to Claude with an instruction not
  to repeat or reword them (catches near-duplicates).

Markers are only trusted from the bot's own comments, so a PR author cannot forge a marker to
suppress a real finding. So re-labeling or pushing new commits only ever surfaces **new** issues.

---

## Auto-resolving fixed findings

On each re-run, after surfacing new issues, the bot **re-checks every still-open thread it
authored** and resolves the ones that are genuinely fixed — so a PR doesn't accumulate stale,
already-addressed comments.

Claude classifies each as:

| Verdict | What happens |
|---|---|
| **fixed** (positively confirmed gone) | Thread is **resolved**, with a `✅ Verified fixed in <sha>` reply. |
| **still-present** (positively confirmed) | Thread stays **open** (no reply — the open thread is the signal). |
| **unsure** (can't confirm) | Thread stays **open** with a one-time `🤔 couldn't auto-verify` reply, so a human settles it. |

Four guarantees by design:

- **One-directional.** The bot moves a thread **open → resolved** only. It **never re-opens** a
  thread — if a human resolved one (even "wrongly"), that decision is final and untouched.
- **Precision-first.** A thread is resolved **only** on a positive "fixed". Anything less keeps it
  open, so an uncertain check never hides a real bug. *Resolved = Claude is certain it's fixed;
  open = still broken or unconfirmed.*
- **Complete diff only.** Auto-resolve requires the *whole* change to be visible. If any file was
  dropped for size (`maxFilePatchChars`) or the diff was truncated (`maxTotalDiffChars`), the code
  could have moved into a file Claude can't see — so the bot still judges and replies (*"looks fixed,
  but the diff is incomplete — confirm and resolve manually"*) but does **not** collapse the thread.
  Claude is also told the diff is incomplete so it leans `unsure`. (A skip-induced *empty* diff
  likewise does **not** mark the commit "reviewed" — the findings pass never ran.)
- **Trusted authors only.** Auto-resolve trusts Claude's read of code that, on a fork/external PR,
  is **attacker-influenced** — and a resolved thread is **hidden by default** in the GitHub UI. So a
  thread is only auto-resolved when the PR author is `OWNER`/`MEMBER`/`COLLABORATOR` (the same set
  the workflow trusts for auto re-runs). On an untrusted PR the bot still posts a "✅ looks fixed —
  left open for a maintainer to confirm" reply, but **leaves the thread open** so a human decides.
  Disable this stricter gate with `resolveOnlyForTrustedAuthors: false` (only if every author who
  can open a PR here is fully trusted).

A removed file is treated as a confirmed fix **without** a Claude call only when the PR contains **no
non-removed files at all** (an all-deletions PR) — then there's genuinely nowhere the flagged code
could have moved. This is judged from the **raw `listFiles` set**, not the diff, because the diff omits
ignored/binary/too-large/truncated files — so an *empty diff* does **not** mean *no other changes*. If
any file was added or modified (including a **rename/move**, which GitHub often reports as a delete+add
rather than `renamed`), the removed-path finding goes to **Claude**, and if the diff doesn't clearly
show the code is gone (it may have moved into a file omitted for size), Claude answers `unsure` and the
thread stays open. Same for a renamed/moved file or any transient fetch error — never auto-resolved on a
404 alone. Reading current file content uses the GitHub API as **data** — the bot still never checks out
or executes PR head code, so this stays within the `pull_request_target` security model. Verification
adds a second Claude call per run over the open threads (bounded by `maxVerifyThreads` and the same
`maxInputTokens` gate, with its own `maxVerifyOutputTokens` output cap); turn the whole step off with
`verifyResolutions: false`. Verification tracks its own completion SHA (`vsha`) separately from the
findings SHA, so if a run leaves it incomplete (cap-deferred, over its own budget, or failed), a new
commit **or a re-label** re-runs just the verification pass — without re-billing the findings review.
Once both are complete at a head, re-triggering is a free no-op.

> **Permissions:** the workflow grants only `contents: read` + `pull-requests: write`. Resolving a
> review *thread* (`resolveReviewThread`) is a comment operation under `pull-requests: write` — it is
> **not** resolving, closing, or merging the *pull request*. The bot has no `contents: write`, so it
> **cannot** push, merge, or modify code, and it never calls any PR-state API (`pulls.merge`,
> `pulls.update`) — only comment/thread reads and writes.

> **Timing:** the workflow runs on label / new commit / reopen — *not* when someone clicks "Resolve".
> So a fix is recognized on the **next push or label re-apply**, not the instant the code lands.

