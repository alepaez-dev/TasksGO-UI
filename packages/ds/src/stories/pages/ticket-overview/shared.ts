import type { PipelineHierarchyStage } from '../../../components/PipelineHierarchyPanel';
import type { BreadcrumbSegment } from '../../../components/Breadcrumb';
import type { TabItem } from '../../../components/Tabs';
import type { BadgeProps } from '../../../components/Badge';
import type { TicketTitleBlockBadge } from '../../../components/TicketTitleBlock';
import type { ProjectPickerProject } from '../../../components/ProjectPicker';
import type { IconName } from '../../../icons';

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

export interface StatusOption {
  value: string;
  label: string;
  variant: BadgeProps['variant'];
}

export interface PriorityOption {
  value: 'critical' | 'high' | 'medium' | 'low';
  label: string;
}

export interface PersonOption {
  value: string;
  label: string;
  initial: string;
  color: string;
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
    branchValue: string;
  };
  qaSummary: {
    title: string;
    failedCount: number;
    lastChecked: string;
    items: readonly ChecklistItem[];
  };
  pipeline: {
    title: string;
    reorderHint: string;
    addLabel: string;
    addStagePlaceholder: string;
    initialActiveStage: string;
    stages: readonly PipelineHierarchyStage[];
  };
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
    branchValue: 'feat/dynamic-edge-caching',
  },
  qaSummary: {
    title: 'Scenarios Checklist',
    failedCount: 1,
    lastChecked: 'Last checked 2h ago',
    items: [
      {
        id: 'cache-hit-ratio',
        status: 'passed',
        label: 'Cache hit ratio check on US-East-1 staging',
        meta: 'Verified by JD',
      },
      {
        id: 'invalidation-latency',
        status: 'failed',
        label: 'Invalidation latency under 200ms',
        meta: 'Failed',
        metaVariant: 'critical',
      },
      {
        id: 'browser-ttl',
        status: 'pending',
        label: 'Browser-side TTL override persistence',
        meta: 'Not verified',
      },
      {
        id: 'waf-integration',
        status: 'passed',
        label: 'WAF integration compatibility',
        meta: 'Verified by JD',
      },
    ],
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
  footer: {
    ticketIdLabel: 'T-43 LORE',
    lastEdited: 'Last edited: 2h ago',
  },
};
