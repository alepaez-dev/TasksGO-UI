import type { PipelineHierarchyStage } from '../../../components/PipelineHierarchyPanel';
import type { BreadcrumbSegment } from '../../../components/Breadcrumb';
import type { TabItem } from '../../../components/Tabs';
import type { BadgeProps } from '../../../components/Badge';
import type { TicketTitleBlockBadge } from '../../../components/TicketTitleBlock';
import type { ProjectPickerProject } from '../../../components/ProjectPicker';
import type { ScratchpadTaskRef } from '../../../components/Scratchpad';
import type {
  TestScenarioStatus,
  TestScenarioEvidence,
} from '../../../components/TestScenarioCard';
import type { IconName } from '../../../icons';
import type { PersonOption } from '../tasks/shared';

export const devScratchpadTask: ScratchpadTaskRef = {
  id: 'TSK-217',
  title: 'Add multi-value header support to edge cache',
  status: 'In progress',
  createdAgo: 'Created 2h ago',
  description: 'Handle multi-value response headers when mutating cache keys.',
  href: '#',
};

export interface NavLink {
  id: string;
  icon: IconName;
  label: string;
  href: string;
}

export interface ScopeList {
  title: string;
  items: readonly string[];
}

export interface ChecklistItem {
  id: string;
  status: 'passed' | 'failed' | 'pending';
  label: string;
  meta: string;
  metaVariant?: BadgeProps['variant'];
}

export function countFailedScenarios(items: readonly ChecklistItem[]): number {
  return items.filter((item) => item.status === 'failed').length;
}

export interface StatusOption {
  value: string;
  label: string;
  variant: BadgeProps['variant'];
}

export interface PriorityOption {
  value: 'critical' | 'high' | 'medium' | 'low';
  label: string;
}

export type { PersonOption };

export const PR_BADGE = {
  open: 'progress',
  draft: 'default',
  merged: 'success',
  closed: 'critical',
} as const satisfies Record<DevPullRequest['state'], BadgeProps['variant']>;

export interface DevCommitAuthor {
  name: string;
  initial: string;
  color: string;
}

export interface DevPullRequest {
  id: string;
  number: string;
  title: string;
  href: string;
  state: 'open' | 'draft' | 'merged' | 'closed';
  author: string;
  when: string;
  checks: string;
  reviewer: { initial: string; color: string };
}

export interface DevCommit {
  sha: string;
  title: string;
  href: string;
  author: DevCommitAuthor;
  when: string;
}

export interface DevData {
  repository: {
    name: string;
    url: string;
    branch: string;
    branchUrl: string;
    ci: {
      status: 'passing' | 'failing' | 'running';
      label: string;
      build: string;
    };
  };
  pullRequests: readonly DevPullRequest[];
  commits: {
    total: number;
    onBranch: string;
    viewAllHref: string;
    items: readonly DevCommit[];
  };
}

export type QaPipelineStatus = 'passing' | 'pending' | 'unstable' | 'failing';

export interface QaPipeline {
  label: string;
  status: QaPipelineStatus;
}

export type QaScenarioByline =
  | { action: string; person?: never; when?: never }
  | { action: string; person: string; when: string };

export interface QaScenario {
  id: string;
  title: string;
  status: TestScenarioStatus;
  byline: QaScenarioByline;
  assigneeInitial: string;
  assigneeLabel: string;
  assigneeColor?: string;
  description: string;
  steps?: readonly string[];
  evidence?: readonly TestScenarioEvidence[];
  expected: string;
  actual?: string;
  waiveReason?: string;
}

export interface QaEnvironment {
  value: string;
  label: string;
  health: 'stable' | 'unstable' | 'degraded';
  reviewStatus: string;
  lastDeployment: string;
  pipeline: QaPipeline;
}

export interface QaTabData {
  environments: readonly QaEnvironment[];
  activeEnvironment: string;
  scenarios: readonly QaScenario[];
}

export interface TicketMeta {
  id: string;
  title: string;
  breadcrumb: readonly BreadcrumbSegment[];
  badges: readonly TicketTitleBlockBadge[];
  description: string;
  why: readonly string[];
  scope: { included: ScopeList; excluded: ScopeList };
  metadata: {
    assigneeValue: string;
    reporterValue: string;
    statusValue: string;
    priorityValue: string;
  };
  dev: DevData;
  qaSummary: {
    title: string;
    lastChecked: string;
  };
  pipeline: {
    title: string;
    reorderHint: string;
    addLabel: string;
    addStagePlaceholder: string;
    initialActiveStage: string;
    stages: readonly PipelineHierarchyStage[];
  };
  qa: QaTabData;
  footer: {
    ticketIdLabel: string;
    lastEdited: string;
  };
}

export const projectList: ProjectPickerProject[] = [
  {
    value: 'eng-core',
    label: 'Engineering Core',
    initial: 'E',
    avatarColor: '#4f6f8f',
  },
  {
    value: 'tasksgo',
    label: 'TasksGO',
    initial: 'T',
    avatarColor: '#5e778f',
  },
  {
    value: 'mudatec',
    label: 'Mudatec',
    initial: 'M',
    avatarColor: '#856D4A',
  },
];

export function getProject(value: string): ProjectPickerProject {
  return projectList.find((p) => p.value === value) ?? projectList[0];
}

export const navItems: readonly NavLink[] = [
  { id: 'tasks', icon: 'task_alt', label: 'Tasks', href: '/tasks' },
  {
    id: 'tickets',
    icon: 'confirmation_number',
    label: 'Tickets',
    href: '/tickets',
  },
  { id: 'docs', icon: 'description', label: 'Docs', href: '/docs' },
];

export const peopleOptions: readonly PersonOption[] = [
  { value: 'jordan', label: 'Jordan D.', initial: 'JD', color: '#7D9B84' },
  { value: 'alex-m', label: 'Alex M.', initial: 'AM', color: '#C38E70' },
  { value: 'cleo', label: 'Cleo H.', initial: 'CH', color: '#6C89A8' },
  { value: 'vader', label: 'Vader P.', initial: 'VP', color: '#856D4A' },
];

export function getPerson(value: string): PersonOption {
  return peopleOptions.find((p) => p.value === value) ?? peopleOptions[0];
}

export const statusOptions: readonly StatusOption[] = [
  { value: 'todo', label: 'Todo', variant: 'todo' },
  { value: 'in-progress', label: 'In progress', variant: 'progress' },
  { value: 'done', label: 'Done', variant: 'done' },
  { value: 'blocked', label: 'Blocked', variant: 'critical' },
];

export const priorityOptions: readonly PriorityOption[] = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function getStatusOption(value: string): StatusOption {
  return statusOptions.find((o) => o.value === value) ?? statusOptions[0];
}

export function getPriorityOption(value: string): PriorityOption {
  return priorityOptions.find((o) => o.value === value) ?? priorityOptions[0];
}

export const tabs: readonly TabItem[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'dev', label: 'Dev' },
  { value: 'qa', label: 'QA' },
  { value: 'activity', label: 'Activity' },
];

export const ticket: TicketMeta = {
  id: 'T-43',
  title: 'Implement dynamic edge-caching for API gateway responses',
  breadcrumb: [
    { label: 'Project', href: '/project' },
    { label: 'Tickets', href: '/tickets' },
    { label: 'T-43' },
  ],
  badges: [
    { label: 'In Progress', variant: 'progress' },
    { label: 'High Prio', variant: 'high' },
  ],
  description:
    'We need to introduce a caching layer at the edge for specific API gateway routes that are read-heavy and computationally expensive. This will significantly reduce latency for global users and decrease pressure on our core database clusters during traffic spikes.',
  why: [
    'Current TTFB for /v1/assets exceeds 400ms in AP-South-1.',
    'Database CPU peaks at 85% during morning sync windows.',
    'Projected cost savings of $2.4k/mo on data transfer.',
  ],
  scope: {
    included: {
      title: 'Included',
      items: [
        'GET /v1/assets/*',
        'GET /v1/metadata/*',
        'Cache invalidation via SNS',
      ],
    },
    excluded: {
      title: 'Excluded',
      items: ['WebSocket streams', 'POST/PUT operations'],
    },
  },
  metadata: {
    assigneeValue: 'jordan',
    reporterValue: 'alex-m',
    statusValue: 'in-progress',
    priorityValue: 'high',
  },
  dev: {
    repository: {
      name: 'edge-gateway-service',
      url: 'https://github.com/example/edge-gateway-service',
      branch: 'feat/dynamic-edge-caching',
      branchUrl:
        'https://github.com/example/edge-gateway-service/tree/feat/dynamic-edge-caching',
      ci: { status: 'passing', label: 'Passing', build: '#1287' },
    },
    pullRequests: [
      {
        id: 'pr-892',
        number: '#892',
        title: 'feat: add edge-caching layer for gateway responses',
        href: 'https://github.com/example/pull/892',
        state: 'open',
        author: 'Jordan D.',
        when: '2h ago',
        checks: 'Checks passed',
        reviewer: { initial: 'AM', color: '#c98a6b' },
      },
      {
        id: 'pr-884',
        number: '#884',
        title: 'refactor: extract header mutation helpers',
        href: 'https://github.com/example/pull/884',
        state: 'draft',
        author: 'Jordan D.',
        when: '1d ago',
        checks: 'Checks passed',
        reviewer: { initial: 'SK', color: '#4a90a4' },
      },
      {
        id: 'pr-871',
        number: '#871',
        title: 'test: gateway TTL inheritance coverage',
        href: 'https://github.com/example/pull/871',
        state: 'merged',
        author: 'Mike R.',
        when: '3d ago',
        checks: 'Checks passed',
        reviewer: { initial: 'JD', color: '#6a8759' },
      },
    ],
    commits: {
      total: 37,
      onBranch: 'on this branch',
      viewAllHref: 'https://github.com/example/commits',
      items: [
        {
          sha: 'a3f9c1d',
          title: 'feat: add TTL inheritance from origin headers',
          href: 'https://github.com/example/commit/a3f9c1d',
          author: { name: 'Jordan D.', initial: 'JD', color: '#6a8759' },
          when: '2h ago',
        },
        {
          sha: '7e21b04',
          title: 'fix: guard SNS invalidation race on warm start',
          href: 'https://github.com/example/commit/7e21b04',
          author: { name: 'Sam K.', initial: 'SK', color: '#4a90a4' },
          when: '5h ago',
        },
        {
          sha: 'cbd0a52',
          title: 'chore: bump edge runtime to 2.4.1',
          href: 'https://github.com/example/commit/cbd0a52',
          author: { name: 'Alex M.', initial: 'AM', color: '#c98a6b' },
          when: '1d ago',
        },
      ],
    },
  },
  qaSummary: {
    title: 'Scenarios Checklist',
    lastChecked: 'Last checked 2h ago',
  },
  pipeline: {
    title: 'Pipeline Hierarchy',
    reorderHint: 'Drag to reorder',
    addLabel: 'Add environment',
    addStagePlaceholder: 'Prod-US',
    initialActiveStage: 'qa2',
    stages: [
      { value: 'qa1', label: 'QA1', status: 'success' },
      { value: 'qa2', label: 'QA2', status: 'in-progress' },
      { value: 'staging', label: 'Staging', status: 'idle' },
      { value: 'prod', label: 'Prod', status: 'idle' },
    ],
  },
  qa: {
    activeEnvironment: 'qa-01',
    environments: [
      {
        value: 'qa-01',
        label: 'QA-01',
        health: 'unstable',
        reviewStatus: 'In review',
        lastDeployment: '24 mins ago',
        pipeline: { label: 'Unstable', status: 'unstable' },
      },
      {
        value: 'qa-02',
        label: 'QA-02',
        health: 'stable',
        reviewStatus: 'Reviewed',
        lastDeployment: '1h ago',
        pipeline: { label: 'Stable', status: 'passing' },
      },
      {
        value: 'staging',
        label: 'STAGING',
        health: 'unstable',
        reviewStatus: 'Pending check',
        lastDeployment: '3h ago',
        pipeline: { label: 'Pending', status: 'pending' },
      },
      {
        value: 'production',
        label: 'PRODUCTION',
        health: 'stable',
        reviewStatus: 'Reviewed',
        lastDeployment: '2d ago',
        pipeline: { label: 'Healthy', status: 'passing' },
      },
    ],
    scenarios: [
      {
        id: 'TC-402',
        title: 'Verify Cache Hit on /v1/assets',
        status: 'passed',
        byline: { action: 'Verified by', person: 'Sarah K.', when: '2h ago' },
        assigneeInitial: 'SK',
        assigneeLabel: 'Sarah K.',
        assigneeColor: 'var(--ds-color-avatar-tone-profile-steel)',
        description:
          'A second request for the same asset within the TTL window is served from the edge cache.',
        expected: 'Response carries `X-Cache: HIT` and TTFB drops below 40ms.',
      },
      {
        id: 'TC-418',
        title: 'Rate Limit Edge Case',
        status: 'failed',
        byline: { action: 'Failed by', person: 'Mike R.', when: '3d ago' },
        assigneeInitial: 'MR',
        assigneeLabel: 'Mike R.',
        assigneeColor: 'var(--ds-color-avatar-tone-profile-tan)',
        description:
          'Requests exceeding the burst threshold on `/v1/assets` should return 429.',
        steps: [
          'Deploy recent build to `QA-01` environment',
          'Fire 500 rps against `/v1/assets/hot` for 30s',
          'Inspect response headers once burst limit is crossed',
        ],
        evidence: [
          { label: 'rate_429.png', kind: 'image' },
          { label: 'gateway.log', kind: 'file' },
        ],
        expected: 'Gateway returns `429 Too Many Requests` with `Retry-After`.',
        actual:
          'Stale cached body returned with `200 OK` for ~1.4s after TTL expiry.',
      },
      {
        id: 'TC-431',
        title: 'Browser-side TTL override persistence',
        status: 'pending',
        byline: { action: 'Not run yet' },
        assigneeInitial: 'JD',
        assigneeLabel: 'Jordan D.',
        assigneeColor: 'var(--ds-color-avatar-tone-profile-sage)',
        description:
          'Client TTL override should persist across reloads within the max-age window.',
        expected:
          'Override survives a hard reload and is reflected in `Cache-Control`.',
        actual: 'Not run yet.',
      },
      {
        id: 'TC-409',
        title: 'WebSocket Connection Persistence',
        status: 'waived',
        byline: { action: 'Waived by', person: 'Ale P.', when: '1d ago' },
        assigneeInitial: 'AP',
        assigneeLabel: 'Ale P.',
        assigneeColor: 'var(--ds-color-avatar-tone-profile-plum)',
        description:
          'Ensure WebSocket connections reconnect after a network interruption of < 500ms.',
        waiveReason:
          'Dev confirmed out of scope for this ticket; tracked separately under `ENG-2871`.',
        expected:
          'Connection recovers within 2 seconds without session state loss.',
        actual: 'Not run — scenario waived before execution.',
      },
      {
        id: 'TC-405',
        title: 'Cache Invalidation via SNS Topic',
        status: 'passed',
        byline: { action: 'Verified by', person: 'Mike R.', when: '4h ago' },
        assigneeInitial: 'MR',
        assigneeLabel: 'Mike R.',
        assigneeColor: 'var(--ds-color-avatar-tone-profile-tan)',
        description:
          'An SNS publish purges the matching edge cache keys within 5 seconds.',
        expected: 'Subsequent request is a `MISS` then repopulates.',
      },
    ],
  },
  footer: {
    ticketIdLabel: 'T-43 LORE',
    lastEdited: 'Last edited: 2h ago',
  },
};
