import { SectionHeader } from '../../../components/SectionHeader';
import { PropertyRow } from '../../../components/PropertyRow';
import { RefLink } from '../../../components/RefLink';
import { ActivityRow } from '../../../components/ActivityRow';
import { Badge } from '../../../components/Badge';
import { ExternalLink } from '../../../components/ExternalLink';
import { Avatar } from '../../../components/Avatar';
import { Icon } from '../../../components/Icon';
import { cn } from '../../../utils/cn';
import type { IconName } from '../../../icons';
import { PR_BADGE, type DevData, type DevPullRequest } from './shared';
import styles from './DevDetailsPanel.module.css';

export interface DevDetailsPanelProps {
  dev: DevData;
  branchCopied: boolean;
  onCopyBranch: () => void;
}

type CiStatus = DevData['repository']['ci']['status'];

const CI_ICON: Record<CiStatus, IconName> = {
  passing: 'check_circle',
  failing: 'cancel',
  running: 'schedule',
};
const CI_CLASS: Record<CiStatus, string> = {
  passing: styles.ciPassing,
  failing: styles.ciFailing,
  running: styles.ciRunning,
};

const PR_ICON_CLASS: Record<DevPullRequest['state'], string> = {
  open: styles.prIconInfo,
  draft: styles.prIconMuted,
  merged: styles.prIconSuccess,
  closed: styles.prIconDanger,
};

export function DevDetailsPanel({
  dev,
  branchCopied,
  onCopyBranch,
}: DevDetailsPanelProps) {
  const { repository: repo, commits } = dev;
  const { ci } = repo;

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <SectionHeader headingLevel={3}>Repository</SectionHeader>
        <div className={styles.rows}>
          <ExternalLink icon="code" href={repo.url} className={styles.repoLink}>
            {repo.name}
          </ExternalLink>
          <PropertyRow
            icon="fork_right"
            label="Branch"
            className={styles.branchRow}
          >
            <RefLink
              boxed
              value={repo.branch}
              href={repo.branchUrl}
              copied={branchCopied}
              onCopy={onCopyBranch}
              copyAriaLabel="Copy branch"
            />
          </PropertyRow>
          <PropertyRow
            icon="check_circle"
            label="CI / Build"
            className={styles.ciRow}
          >
            <span className={cn(styles.ci, CI_CLASS[ci.status])}>
              <Icon name={CI_ICON[ci.status]} size="sm" />
              {ci.label}
              <span className={styles.build}>{ci.build}</span>
            </span>
          </PropertyRow>
        </div>
      </div>

      <div className={styles.section}>
        <SectionHeader headingLevel={3}>
          Pull Requests{' '}
          <span className={styles.count}>· {dev.pullRequests.length}</span>
        </SectionHeader>
        {dev.pullRequests.length === 0 ? (
          <p className={styles.empty}>No pull requests</p>
        ) : (
          <ul className={styles.list}>
            {dev.pullRequests.map((pr) => (
              <li key={pr.id} className={styles.prCard}>
                <span className={cn(styles.prIcon, PR_ICON_CLASS[pr.state])}>
                  <Icon name="call_merge" size="sm" />
                </span>
                <div className={styles.prBody}>
                  <ExternalLink href={pr.href}>{pr.title}</ExternalLink>
                  <div className={styles.prMeta}>
                    <span>{pr.number}</span>
                    <Badge variant={PR_BADGE[pr.state]}>{pr.state}</Badge>
                    <span aria-hidden="true">·</span>
                    <span>{pr.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{pr.when}</span>
                  </div>
                  <div className={styles.prFooter}>
                    <span className={styles.checks}>
                      <Icon name="check_circle" size="sm" />
                      {pr.checks}
                    </span>
                    <span className={styles.review}>
                      Review
                      <Avatar
                        variant="profile"
                        size="sm"
                        initial={pr.reviewer.initial}
                        aria-label={`Reviewer ${pr.reviewer.initial}`}
                        style={{ backgroundColor: pr.reviewer.color }}
                      />
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.section}>
        <SectionHeader headingLevel={3}>Recent Commits</SectionHeader>
        <ul className={styles.list}>
          {commits.items.map((c) => (
            <ActivityRow
              key={c.sha}
              leading={
                <Avatar
                  variant="profile"
                  size="sm"
                  initial={c.author.initial}
                  aria-label={c.author.name}
                  style={{ backgroundColor: c.author.color }}
                />
              }
              meta={[c.sha, c.when]}
            >
              {c.title}
            </ActivityRow>
          ))}
          <ActivityRow
            className={styles.commitSummary}
            leading={<Badge variant="count">{String(commits.total)}</Badge>}
            trailing={
              <ExternalLink href={commits.viewAllHref} size="sm">
                View all
              </ExternalLink>
            }
          >
            {`${commits.total} commits ${commits.onBranch}`}
          </ActivityRow>
        </ul>
      </div>
    </div>
  );
}
