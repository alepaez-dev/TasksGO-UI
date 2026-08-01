#!/usr/bin/env bash
set -euo pipefail

PR="${1:-}"
if [ -z "$PR" ] || [ "$PR" = "-h" ] || [ "$PR" = "--help" ]; then
  cat >&2 <<'USAGE'
Run Tier 3 against a real PR locally, from your WORKING TREE, posting nothing.

  usage: ./local-review.sh <pr-number>

Reviewer code comes from your working tree (edit prompts.mjs/tools.mjs/etc. and
re-run — no merge to main needed). The PR diff + head are pulled from GitHub.

Required env:
  ANTHROPIC_API_KEY   your Anthropic key (used for the real model calls)
  GITHUB_TOKEN        a token with READ access to the repo (or GH_TOKEN, or a
                      working `gh auth token`)

Optional env:
  REVIEWER_REPO       owner/repo override (default: derived from `origin`)
  REVIEWER_EFFORT     high | max        (default: config.json — high)
  REVIEWER_COST_CEILING  dollars        (default: config.json — 2)
USAGE
  exit 2
fi

# pwd -P resolves symlinks so the path we hand Node matches import.meta.url — Conductor workspaces are
# symlinks, and a logical path here makes review-agent.mjs's isEntrypoint check fail (main() never runs).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd -P)"

: "${ANTHROPIC_API_KEY:?set ANTHROPIC_API_KEY in your shell before running}"
TOKEN="${GITHUB_TOKEN:-${GH_TOKEN:-}}"
if [ -z "$TOKEN" ]; then TOKEN="$(gh auth token 2>/dev/null || true)"; fi
: "${TOKEN:?no GitHub token — export GITHUB_TOKEN (needs repo read access) or run: gh auth login}"

REPO_SLUG="${REVIEWER_REPO:-}"
if [ -z "$REPO_SLUG" ]; then
  url="$(git -C "$REPO_ROOT" remote get-url origin)"
  url="${url%.git}"
  if [[ "$url" == *"://"* ]]; then REPO_SLUG="${url#*://}"; REPO_SLUG="${REPO_SLUG#*/}"; else REPO_SLUG="${url#*:}"; fi
fi

echo "▶ fetching PR #$PR head from origin…"
git -C "$REPO_ROOT" fetch --quiet origin "refs/pull/$PR/head"
HEAD_SHA="$(git -C "$REPO_ROOT" rev-parse FETCH_HEAD)"

# pwd -P collapses any `//` (macOS $TMPDIR ends in a slash) and resolves symlinks, so HEAD_DIR is a
# clean physical path — confineToRepo() does a raw string prefix check that a non-normalized root breaks.
WORKDIR="$(cd "$(mktemp -d "${TMPDIR:-/tmp}/tier3-pr${PR}-XXXXXX")" && pwd -P)"
HEAD_DIR="$WORKDIR/head"
EVENT_FILE="$WORKDIR/event.json"
SUMMARY_FILE="$WORKDIR/summary.md"
cleanup() {
  git -C "$REPO_ROOT" worktree remove --force "$HEAD_DIR" >/dev/null 2>&1 || true
  rm -rf "$WORKDIR"
}
trap cleanup EXIT

git -C "$REPO_ROOT" worktree add --quiet --detach "$HEAD_DIR" "$HEAD_SHA"
printf '{ "pull_request": { "number": %s, "head": { "sha": "%s" } } }\n' "$PR" "$HEAD_SHA" > "$EVENT_FILE"
# @actions/core summary.write() access()-checks GITHUB_STEP_SUMMARY and throws if it doesn't exist
# (the CI runner pre-creates it); create it so the findings report renders.
: > "$SUMMARY_FILE"

echo "▶ Tier 3 DRY-RUN · $REPO_SLUG PR #$PR @ ${HEAD_SHA:0:9}"
echo "  reviewer code: working tree ($SCRIPT_DIR)"
echo "  head checkout: $HEAD_DIR"
echo "  (no comments, status, or resolves will be posted)"
echo

set +e
DRY_RUN=1 \
GITHUB_TOKEN="$TOKEN" \
GITHUB_REPOSITORY="$REPO_SLUG" \
GITHUB_EVENT_PATH="$EVENT_FILE" \
GITHUB_STEP_SUMMARY="$SUMMARY_FILE" \
HEAD_DIR="$HEAD_DIR" \
REVIEWER_EFFORT="${REVIEWER_EFFORT:-}" \
REVIEWER_COST_CEILING="${REVIEWER_COST_CEILING:-}" \
  node "$SCRIPT_DIR/review-agent.mjs"
status=$?
set -e

echo
echo "===================== FINDINGS REPORT (job summary) ====================="
[ -s "$SUMMARY_FILE" ] && cat "$SUMMARY_FILE" || echo "(job summary was empty)"
echo "========================================================================="
exit "$status"
