#!/usr/bin/env bash
set -euo pipefail

# Download the Playwright chromium browser binaries with a per-attempt timeout
# and retries. The download occasionally stalls after fetching the first binary;
# without a timeout a stalled attempt silently consumes the entire job budget.
attempts=3
per_attempt_timeout=180

for attempt in $(seq 1 "$attempts"); do
  echo "::group::playwright install chromium (attempt ${attempt}/${attempts})"
  if timeout "${per_attempt_timeout}" npx playwright install chromium; then
    echo "::endgroup::"
    exit 0
  fi
  status=$?
  echo "::endgroup::"
  if [ "${status}" -eq 124 ]; then
    echo "Attempt ${attempt} timed out after ${per_attempt_timeout}s."
  else
    echo "Attempt ${attempt} failed with exit code ${status}."
  fi
  sleep 5
done

echo "Playwright chromium install failed after ${attempts} attempts." >&2
exit 1
