import type { TaskRowProps } from '../../../components/TaskRow';
import type { RecentTaskItem } from '../../../components/RecentTaskList';
import type { SearchPaletteGroup } from '../../../components/SearchPalette';
import type { ProjectPickerProject } from '../../../components/ProjectPicker';

export type TaskItem = Pick<
  TaskRowProps,
  'title' | 'badge' | 'refs' | 'priority' | 'date'
> & {
  id: string;
  ticketId?: string;
};

export interface DrawerFormState {
  title: string;
  description: string;
  assignee: string;
  priority: string;
  linkedTicket: string | undefined;
}

export const initialForm: DrawerFormState = {
  title: '',
  description: '',
  assignee: 'alex',
  priority: 'high',
  linkedTicket: undefined,
};

export const seedTasks: readonly TaskItem[] = [
  {
    id: 'TSK-1',
    title: 'Refactor Kubernetes service discovery logic for edge nodes',
    badge: { label: 'In Progress', variant: 'progress' },
    refs: [{ label: 'architecture-spec-v2.md', variant: 'doc' }],
    priority: 'high',
    ticketId: 'ENG-902',
    date: { label: 'Mar 28', dateTime: '2026-03-28' },
  },
  {
    id: 'TSK-2',
    title: 'Audit IAM permissions for the staging database cluster',
    badge: { label: 'Todo', variant: 'todo' },
    refs: [{ label: 'iam-policy-draft.json', variant: 'attachment' }],
    priority: 'medium',
    ticketId: 'INFRA-441',
    date: { label: 'Mar 30', dateTime: '2026-03-30' },
  },
  {
    id: 'TSK-3',
    title: 'Investigate intermittent TLS handshake timeouts in US-WEST-2',
    badge: { label: 'In Progress', variant: 'progress' },
    refs: [{ label: 'incident artifact' }],
    priority: 'high',
    ticketId: 'OPS-112',
    date: { label: 'Today', dateTime: '2026-04-03', urgent: true },
  },
  {
    id: 'TSK-4',
    title: 'Configure auto-scaling for ingestion pipeline',
    badge: { label: 'Todo', variant: 'todo' },
    refs: [{ label: 'pipeline-config.yaml', variant: 'attachment' }],
    priority: 'medium',
    date: { label: 'Apr 1', dateTime: '2026-04-01' },
  },
  {
    id: 'TSK-5',
    title: 'Address memory leak in production API cluster',
    badge: { label: 'In Progress', variant: 'progress' },
    refs: [{ label: 'heap-dump-analysis' }],
    priority: 'critical',
    date: { label: 'Today', dateTime: '2026-04-03', urgent: true },
  },
];

export const seedCompleted: readonly TaskItem[] = [
  {
    id: 'TSK-6',
    title: 'Update root CA certificates for all build agents',
    badge: { label: 'Done', variant: 'done' },
    priority: 'low',
    ticketId: 'SEC-22',
    date: { label: 'Jan 12', dateTime: '2026-01-12' },
  },
];

export const defaultTasks: readonly TaskItem[] = [
  ...seedTasks,
  ...seedCompleted,
];

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

export const assigneeOptions = [
  { value: 'alex', label: 'Alex H.', initial: 'AH', color: '#7D9B84' },
  { value: 'cleo', label: 'Cleo H.', initial: 'CH', color: '#C38E70' },
  { value: 'vader', label: 'Vader P.', initial: 'VP', color: '#6C89A8' },
];

export const priorityOptions = [
  {
    value: 'critical',
    label: 'Critical',
    icon: 'flag' as const,
    iconColor: 'var(--ds-color-status-critical)',
  },
  {
    value: 'high',
    label: 'High',
    icon: 'flag' as const,
    iconColor: 'var(--ds-color-status-high)',
  },
  {
    value: 'medium',
    label: 'Medium',
    icon: 'flag' as const,
    iconColor: 'var(--ds-color-status-medium)',
  },
  {
    value: 'low',
    label: 'Low',
    icon: 'flag' as const,
    iconColor: 'var(--ds-color-status-low)',
  },
];

export const ticketOptions = [
  {
    value: 'T-42',
    label: 'Implement dynamic edge-caching...',
    prefix: 'T-42',
  },
  {
    value: 'T-104',
    label: 'Implement unit tests for cache logic',
    prefix: 'T-104',
  },
  {
    value: 'T-105',
    label: 'Update staging environment config',
    prefix: 'T-105',
  },
];

export const recentTasks: readonly RecentTaskItem[] = [
  {
    ticketId: 'TSK-104',
    title: 'Implement unit tests for cache logic',
    timeAgo: '2h ago',
  },
  {
    ticketId: 'TSK-105',
    title: 'Update staging environment config',
    timeAgo: '1d ago',
  },
  {
    ticketId: 'TSK-98',
    title: 'Fix DNS resolution in edge proxy',
    timeAgo: '3d ago',
  },
];

export const sortOptions = [
  { value: 'priority', label: 'Priority' },
  { value: 'due-date', label: 'Due date' },
];

const PRIORITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function sortTasks(
  tasks: readonly TaskItem[],
  by: string,
): readonly TaskItem[] {
  const sorted = [...tasks];
  switch (by) {
    case 'priority':
      return sorted.sort(
        (a, b) =>
          (PRIORITY_ORDER[a.priority ?? 'low'] ?? 4) -
          (PRIORITY_ORDER[b.priority ?? 'low'] ?? 4),
      );
    case 'due-date':
      return sorted.sort((a, b) =>
        (b.date?.dateTime ?? '').localeCompare(a.date?.dateTime ?? ''),
      );
    default:
      return sorted;
  }
}

const searchResults: SearchPaletteGroup[] = [
  {
    title: 'Jump to Task',
    results: seedTasks.map((t) => ({
      id: t.id,
      label: t.title,
      badge: t.ticketId ?? t.id,
      type: 'task' as const,
    })),
  },
];

export function filterSearchResults(query: string): SearchPaletteGroup[] {
  const q = query.toLowerCase();
  return searchResults
    .map((group) => ({
      ...group,
      results: group.results.filter(
        (r) =>
          r.label.toLowerCase().includes(q) ||
          (r.badge?.toLowerCase().includes(q) ?? false),
      ),
    }))
    .filter((group) => group.results.length > 0);
}
