import type { DevPullRequest } from './shared';

export function filterPullRequests(
  pullRequests: readonly DevPullRequest[],
  query: string,
): readonly DevPullRequest[] {
  const q = query.trim().toLowerCase();
  if (q === '') return pullRequests;
  return pullRequests.filter(
    (pr) =>
      pr.title.toLowerCase().includes(q) ||
      pr.number.toLowerCase().includes(q) ||
      pr.author.toLowerCase().includes(q),
  );
}
