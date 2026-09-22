const RANK = { absent: 0, green: 1, pending: 2, red: 3 };

function classifyChecks(runs, wanted) {
  const states = new Map(wanted.map((n) => [n, 'absent']));
  for (const r of runs ?? []) {
    if (!r || !states.has(r.name)) continue;
    const s = r.status === 'completed' ? (r.conclusion === 'success' ? 'green' : 'red') : 'pending';
    if (RANK[s] > RANK[states.get(r.name)]) states.set(r.name, s);
  }
  return states;
}

function decideGate({ states, seen, graceExpired, timedOut }) {
  const names = [...states.keys()];
  const red = names.filter((n) => states.get(n) === 'red');
  if (red.length) return { action: 'skip', reason: `${red.join(', ')} did not succeed.`, dropped: [] };
  let wanted = names;
  let dropped = [];
  if (graceExpired) {
    dropped = names.filter((n) => states.get(n) === 'absent' && !seen.has(n));
    wanted = names.filter((n) => !dropped.includes(n));
    if (wanted.length === 0) {
      return { action: 'pass', reason: 'none of the watched checks run on this PR — nothing to gate on.', dropped };
    }
  }
  const pending = wanted.filter((n) => states.get(n) !== 'green');
  if (pending.length === 0) {
    return { action: 'pass', reason: 'all watched checks succeeded — running the review.', dropped };
  }
  if (timedOut) {
    return { action: 'skip', reason: `${pending.join(', ')} still not finished after the wait timeout.`, dropped };
  }
  return { action: 'wait', reason: `Waiting for: ${pending.join(', ')}`, dropped };
}

module.exports = { classifyChecks, decideGate };
