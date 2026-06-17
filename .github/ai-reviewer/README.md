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

Everything is in `.github/ai-reviewer/`:

| File | What it is |
|---|---|
| `review.mjs` | The reviewer (single Node ESM script, no build step). |
| `rules.md` | **The rules you maintain.** Plain Markdown, sent to Claude every run. |
| `config.json` | Thresholds and knobs (model, confidence floor, ignore globs, …). |
| `package.json` / `package-lock.json` | Pinned dependencies (`@anthropic-ai/sdk`, `@actions/*`). |

---

## Tuning the reviewer

### `rules.md` — your rules (primary knob)

Edit [`rules.md`](./rules.md). It's sent verbatim to Claude as authoritative project guidance.
When the bot reports a false positive, add a line describing the intentional pattern so it stops.
When you want it to watch for something specific, add a rule. Concrete beats verbose.

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
| `postRunStatusComment` | `true` | Keep one **sticky** comment on the PR showing the latest run's findings, token usage, and estimated cost. Upserted (updated in place), so no spam. `false` keeps cost only in the run log/summary. |
| `skipIfHeadUnchanged` | `true` | Skip the (billable) review when the PR's head commit hasn't changed since the last completed review — so removing and re-adding the label on the same commit is a **free no-op**. Stores the reviewed SHA in the status comment, so keep `postRunStatusComment` on. To force a re-review of the same commit: set `false`, push an empty commit, or edit `rules.md` and push. |
| `botActor` | `github-actions[bot]` | The exact comment-author **login** trusted as the source of de-dup markers. Defaults to the login the standard `GITHUB_TOKEN` posts as. Set to your bot/user login if you post with a PAT/App token. Set to `null` to trust **any** bot author — looser; only safe on a private repo where no untrusted GitHub App can comment. |
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
  zero spend. This is the precise version of `maxTotalDiffChars`.
- **`maxOutputTokens` (hard):** the API will not generate beyond this. You only pay for tokens
  actually produced, but it can never exceed the cap.
- **Worst-case ceiling:** with both caps + `pricing`, the max possible cost is
  `maxInputTokens × input$ + maxOutputTokens × output$`. At the defaults (Opus 4.8, 150k in / 64k
  out) that's **≈ $2.35/run** — printed in the run log and job summary. Typical runs cost far less
  (~$0.30–0.60) and the **actual** input/output/$ is reported every run.
- **`costWarnUsd` (soft):** logs a ⚠️ if a run's estimated cost exceeds it (visibility, not a block).

**Where cost shows up:** every run prints `input / cache-read / output tokens → ≈ $X` in the Actions
log *and* the job summary, and (with `postRunStatusComment: true`) updates a single sticky comment on
the PR with the latest run's tokens + cost. The Anthropic API returns exact **token counts** in
`usage`, not dollars — the `$` is computed from the `pricing` table, so it's only as accurate as
those rates (token counts are exact).

**Two quick pushes?** `cancel-in-progress` cancels the older run when the newer one starts. A run
spends ~30–45s on checkout + install before it ever calls Claude, so a second push within seconds
almost always cancels the first *before* any billable call — you pay for one review, of the latest
commit (the free `count_tokens` pre-flight also costs nothing).

**Label removed and re-added repeatedly?** Only users with write/triage access can touch labels (not
external contributors). `cancel-in-progress` collapses rapid toggles into ~one run, and
`skipIfHeadUnchanged` makes any toggle on an **already-reviewed commit a free no-op** — the bot
reviews each commit at most once, no matter how many times the label flips. So the cost is bounded
by the number of *distinct commits* labeled, each ≤ the per-run ceiling.

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

