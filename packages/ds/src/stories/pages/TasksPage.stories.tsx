import { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { desktopViewports } from '../../../.storybook/preview';
import { useSelectorGroup, useSelectorState } from '../../hooks/useSelector';
import { Sidebar } from '../../components/Sidebar';
import { Selector } from '../../components/Selector';
import { NavItem } from '../../components/NavItem';
import { Avatar } from '../../components/Avatar';
import { SectionHeader } from '../../components/SectionHeader';
import { Header } from '../../components/Header';
import { Breadcrumb } from '../../components/Breadcrumb';
import { SearchInput } from '../../components/SearchInput';
import {
  SearchPalette,
  getSearchPaletteOptionId,
  type SearchPaletteGroup,
} from '../../components/SearchPalette';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Footer } from '../../components/Footer';
import { TaskSection } from '../../components/TaskSection';
import { TaskRow, type TaskRowProps } from '../../components/TaskRow';
import { Drawer } from '../../components/Drawer';
import {
  TaskDrawer,
  TaskDrawerField,
  TaskDrawerSection,
} from '../../components/TaskDrawer';
import { PropertyRow } from '../../components/PropertyRow';
import { RecentTaskList } from '../../components/RecentTaskList';
import type { RecentTaskItem } from '../../components/RecentTaskList';
import {
  orderByLabelStyle,
  orderByPrefixStyle,
  orderByValueStyle,
} from '../helpers/orderByStyles';
import styles from './TasksPage.module.css';

type TaskItem = Pick<
  TaskRowProps,
  'title' | 'badge' | 'refs' | 'priority' | 'date'
> & {
  id: string;
  ticketId?: string;
};

const SEED_TASKS: readonly TaskItem[] = [
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

const SEED_COMPLETED: readonly TaskItem[] = [
  {
    id: 'TSK-6',
    title: 'Update root CA certificates for all build agents',
    badge: { label: 'Done', variant: 'done' },
    priority: 'low',
    ticketId: 'SEC-22',
    date: { label: 'Jan 12', dateTime: '2026-01-12' },
  },
];

const projects = [
  { value: 'eng-core', label: 'Engineering Core' },
  { value: 'tasksgo', label: 'TasksGO' },
  { value: 'mudatec', label: 'Mudatec' },
];

const avatars: Record<string, { initial: string; label: string }> = {
  'eng-core': { initial: 'P', label: 'Engineering Core' },
  tasksgo: { initial: 'M', label: 'TasksGO' },
  mudatec: { initial: 'M', label: 'Mudatec' },
};

const assigneeOptions = [
  { value: 'alex', label: 'Alex H.', initial: 'AH', color: '#7D9B84' },
  { value: 'cleo', label: 'Cleo H.', initial: 'CH', color: '#C38E70' },
  { value: 'vader', label: 'Vader P.', initial: 'VP', color: '#6C89A8' },
];

const priorityOptions = [
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

const ticketOptions = [
  { value: 'T-42', label: 'Implement dynamic edge-caching...', prefix: 'T-42' },
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

const recentTasks: readonly RecentTaskItem[] = [
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

const searchResults: SearchPaletteGroup[] = [
  {
    title: 'Jump to Task',
    results: SEED_TASKS.map((t) => ({
      id: t.id,
      label: t.title,
      refId: t.ticketId ?? t.id,
      type: 'task' as const,
    })),
  },
];

function filterSearchResults(query: string): SearchPaletteGroup[] {
  const q = query.toLowerCase();
  return searchResults
    .map((group) => ({
      ...group,
      results: group.results.filter(
        (r) =>
          r.label.toLowerCase().includes(q) ||
          r.refId.toLowerCase().includes(q),
      ),
    }))
    .filter((group) => group.results.length > 0);
}

const sortOptions = [
  { value: 'priority', label: 'Priority' },
  { value: 'due-date', label: 'Due date' },
];

const PRIORITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function sortTasks(
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

interface DrawerFormState {
  title: string;
  description: string;
  assignee: string;
  priority: string;
  linkedTicket: string | undefined;
}

const INITIAL_FORM: DrawerFormState = {
  title: '',
  description: '',
  assignee: 'alex',
  priority: 'high',
  linkedTicket: undefined,
};

const DEFAULT_TASKS: readonly TaskItem[] = [...SEED_TASKS, ...SEED_COMPLETED];

function TasksPageRender({
  initialTasks = DEFAULT_TASKS,
}: {
  initialTasks?: readonly TaskItem[];
}) {
  const [project, setProject] = useState('eng-core');
  const [activeNav, setActiveNav] = useState('tasks');
  const {
    ref: projectRef,
    open: projectOpen,
    onOpenChange: onProjectChange,
  } = useSelectorState();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchActiveId, setSearchActiveId] = useState<string | undefined>();
  const searchGroups =
    searchQuery.length > 0 ? filterSearchResults(searchQuery) : [];

  const [filterQuery, setFilterQuery] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const {
    ref: sortRef,
    open: sortOpen,
    onOpenChange: onSortChange,
  } = useSelectorState();
  const [completedIds, setCompletedIds] = useState<ReadonlySet<string>>(
    () =>
      new Set(
        initialTasks
          .filter((t) => SEED_COMPLETED.some((s) => s.id === t.id))
          .map((t) => t.id),
      ),
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | undefined>();
  const [form, setForm] = useState<DrawerFormState>(INITIAL_FORM);
  const selectors = useSelectorGroup('assignee', 'priority', 'ticket');
  const {
    ref: assigneeRef,
    open: assigneeOpen,
    onOpenChange: onAssigneeChange,
  } = selectors.assignee;
  const {
    ref: priorityRef,
    open: priorityOpen,
    onOpenChange: onPriorityChange,
  } = selectors.priority;
  const {
    ref: ticketRef,
    open: ticketOpen,
    onOpenChange: onTicketChange,
  } = selectors.ticket;
  const [assigneeQuery, setAssigneeQuery] = useState('');
  const [ticketQuery, setTicketQuery] = useState('');

  const allTasks = initialTasks;

  const activeTasks = useMemo(() => {
    const q = filterQuery.toLowerCase();
    const filtered = allTasks
      .filter((t) => !completedIds.has(t.id))
      .filter((t) => (q ? t.title.toLowerCase().includes(q) : true));
    return sortTasks(filtered, sortBy);
  }, [allTasks, completedIds, filterQuery, sortBy]);

  // Completed tasks are not sorted here — the consumer will usually want to
  // apply a default sort like most-recently-completed-first.
  const completedTasks = useMemo(() => {
    const q = filterQuery.toLowerCase();
    return allTasks
      .filter((t) => completedIds.has(t.id))
      .filter((t) => (q ? t.title.toLowerCase().includes(q) : true));
  }, [allTasks, completedIds, filterQuery]);

  function handleCheck(taskId: string, checked: boolean) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(taskId);
      } else {
        next.delete(taskId);
      }
      return next;
    });
  }

  function handleDrawerClose() {
    setDrawerOpen(false);
    setEditingTaskId(undefined);
    setForm(INITIAL_FORM);
    setAssigneeQuery('');
    setTicketQuery('');
  }

  function handleTaskClick(task: TaskItem) {
    setEditingTaskId(task.id);
    setForm({
      title: task.title,
      description: '',
      assignee: 'alex',
      priority: task.priority ?? 'medium',
      linkedTicket: undefined,
    });
    setDrawerOpen(true);
  }

  const editingTask = editingTaskId
    ? allTasks.find((t) => t.id === editingTaskId)
    : undefined;
  const drawerTitle = editingTask
    ? `Edit task · ${editingTask.ticketId ?? editingTask.id}`
    : 'New task';
  const drawerSubmitLabel = editingTaskId ? 'Save' : 'Create Task';

  const avatar = avatars[project];
  const navClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveNav(id);
  };

  return (
    <div className={styles.shell}>
      <Sidebar
        header={
          <Selector
            ref={projectRef}
            options={projects}
            value={project}
            onValueChange={setProject}
            open={projectOpen}
            onOpenChange={onProjectChange}
            triggerPrefix={
              <Avatar initial={avatar.initial} aria-label={avatar.label} />
            }
            action={{ label: 'Add project', icon: 'add', onClick: () => {} }}
          />
        }
        footer={
          <>
            <NavItem
              icon="settings"
              label="Settings"
              href="/settings"
              size="sm"
            />
            <NavItem icon="help" label="Support" href="/support" size="sm" />
            <span
              style={{
                display: 'block',
                marginTop: '16px',
                padding: '0 12px',
                fontSize: '9px',
                fontFamily: 'var(--ds-font-family-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--ds-color-text-secondary)',
              }}
            >
              System Stable
            </span>
          </>
        }
      >
        <SectionHeader title="Project Artifacts" />
        <NavItem
          icon="task_alt"
          label="Tasks"
          href="/tasks"
          active={activeNav === 'tasks'}
          onClick={navClick('tasks')}
        />
        <NavItem
          icon="confirmation_number"
          label="Tickets"
          href="/tickets"
          active={activeNav === 'tickets'}
          onClick={navClick('tickets')}
        />
        <NavItem
          icon="description"
          label="Docs"
          href="/docs"
          active={activeNav === 'docs'}
          onClick={navClick('docs')}
        />
      </Sidebar>

      <div className={styles.main}>
        <Header
          left={<Breadcrumb segments={[{ label: 'Tasks' }]} />}
          center={
            <>
              <SearchInput
                role="combobox"
                placeholder="Search or command..."
                shortcutHint="⌘K"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchActiveId(undefined);
                }}
                aria-expanded={searchGroups.length > 0}
                aria-controls={
                  searchGroups.length > 0 ? 'header-search-palette' : undefined
                }
                aria-activedescendant={
                  searchActiveId
                    ? getSearchPaletteOptionId(
                        'header-search-palette',
                        searchActiveId,
                      )
                    : undefined
                }
              />
              {searchGroups.length > 0 && (
                <SearchPalette
                  id="header-search-palette"
                  groups={searchGroups}
                  activeResultId={searchActiveId}
                  onResultSelect={(result) => {
                    const task = allTasks.find((t) => t.id === result.id);
                    if (task) {
                      handleTaskClick(task);
                      setSearchQuery('');
                      setSearchActiveId(undefined);
                    }
                  }}
                  aria-label="Search results"
                />
              )}
            </>
          }
          right={
            <>
              <Button size="sm" onClick={() => setDrawerOpen(true)}>
                <Icon name="add" size="sm" />
                New task
              </Button>
              <Avatar initial="AD" variant="profile" aria-label="Alex D." />
            </>
          }
        />

        <div className={styles.scrollArea}>
          <div className={styles.content}>
            <div className={styles.filterRow}>
              <SearchInput
                placeholder="Filter tasks..."
                size="sm"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>

            {allTasks.length === 0 ? (
              <p className={styles.emptyMessage}>No tasks yet</p>
            ) : filterQuery &&
              activeTasks.length === 0 &&
              completedTasks.length === 0 ? (
              <div className={styles.emptyMessage}>
                <p>No tasks match &ldquo;{filterQuery}&rdquo;</p>
                <p className={styles.emptyHint}>
                  Try a different search or clear the filter.
                </p>
              </div>
            ) : (
              <div className={styles.taskList}>
                <TaskSection
                  title="Active Tasks"
                  count={activeTasks.length}
                  badgeVariant="progress"
                  open
                  trailing={
                    <Selector
                      ref={sortRef}
                      variant="inline"
                      options={sortOptions}
                      value={sortBy}
                      onValueChange={setSortBy}
                      open={sortOpen}
                      onOpenChange={onSortChange}
                      renderTriggerLabel={(opt) => (
                        <span style={orderByLabelStyle}>
                          <span style={orderByPrefixStyle}>Order by: </span>
                          <span style={orderByValueStyle}>{opt.label}</span>
                        </span>
                      )}
                      renderOptionIndicator={() => null}
                      aria-label="Sort tasks by"
                    />
                  }
                >
                  {activeTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      title={task.title}
                      checked={completedIds.has(task.id)}
                      onCheckedChange={(checked) =>
                        handleCheck(task.id, checked)
                      }
                      onClick={() => handleTaskClick(task)}
                      badge={task.badge}
                      refs={task.refs}
                      priority={task.priority}
                      refId={task.ticketId ?? task.id}
                      date={task.date}
                    />
                  ))}
                </TaskSection>

                <TaskSection
                  title="Completed Tasks"
                  count={completedTasks.length}
                  badgeVariant="done"
                  open
                >
                  {completedTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      title={task.title}
                      completed={completedIds.has(task.id)}
                      checked={completedIds.has(task.id)}
                      onCheckedChange={(checked) =>
                        handleCheck(task.id, checked)
                      }
                      onClick={() => handleTaskClick(task)}
                      badge={{ label: 'Done', variant: 'done' }}
                      refs={task.refs}
                      priority={task.priority}
                      refId={task.ticketId ?? task.id}
                      date={task.date}
                    />
                  ))}
                </TaskSection>
              </div>
            )}
          </div>
        </div>

        <Footer left={<span>Task Sync: Active</span>} />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        side="right"
        aria-label={drawerTitle}
      >
        <TaskDrawer
          title={drawerTitle}
          onCancel={handleDrawerClose}
          onSubmit={handleDrawerClose}
          submitLabel={drawerSubmitLabel}
        >
          <TaskDrawerField label="Task Title">
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Describe the task..."
              aria-label="Task title"
            />
          </TaskDrawerField>

          <TaskDrawerField
            label="Description"
            action={
              <Button variant="ai" size="sm">
                <Icon name="auto_awesome" size="sm" />
                Generate with AI
              </Button>
            }
          >
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Add details..."
              rows={4}
              aria-label="Description"
            />
          </TaskDrawerField>

          <TaskDrawerSection label="Properties">
            <PropertyRow icon="person" label="Assignee">
              <Selector
                ref={assigneeRef}
                options={
                  assigneeQuery
                    ? assigneeOptions.filter((m) =>
                        m.label
                          .toLowerCase()
                          .includes(assigneeQuery.toLowerCase()),
                      )
                    : assigneeOptions
                }
                value={form.assignee}
                onValueChange={(v) => {
                  setForm((f) => ({ ...f, assignee: v }));
                  setAssigneeQuery('');
                }}
                open={assigneeOpen}
                onOpenChange={onAssigneeChange}
                dropdownAlign="end"
                variant="inline"
                aria-label="Select assignee"
                header={
                  <SearchInput
                    value={assigneeQuery}
                    onChange={(e) => setAssigneeQuery(e.target.value)}
                    placeholder="Search members..."
                    size="sm"
                  />
                }
                emptyState="No members found"
                triggerPrefix={(() => {
                  const selected = assigneeOptions.find(
                    (m) => m.value === form.assignee,
                  );
                  return (
                    <Avatar
                      variant="profile"
                      initial={selected?.initial ?? '?'}
                      aria-label={selected?.label ?? 'No assignee'}
                      style={
                        selected?.color
                          ? { backgroundColor: selected.color }
                          : undefined
                      }
                    />
                  );
                })()}
                renderTriggerLabel={(opt) => opt.label}
                renderOptionIndicator={(opt) => {
                  const member = assigneeOptions.find(
                    (m) => m.value === opt.value,
                  );
                  return member ? (
                    <Avatar
                      variant="profile"
                      size="sm"
                      initial={member.initial}
                      aria-label={member.label}
                      style={{ backgroundColor: member.color }}
                    />
                  ) : null;
                }}
              />
            </PropertyRow>

            <PropertyRow icon="signal_cellular_alt" label="Priority">
              <Selector
                ref={priorityRef}
                options={priorityOptions}
                value={form.priority}
                onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}
                open={priorityOpen}
                onOpenChange={onPriorityChange}
                dropdownAlign="end"
                variant="inline"
                aria-label="Select priority"
              />
            </PropertyRow>

            <PropertyRow icon="confirmation_number" label="Linked Ticket">
              <Selector
                ref={ticketRef}
                options={
                  ticketQuery
                    ? ticketOptions.filter(
                        (t) =>
                          t.label
                            .toLowerCase()
                            .includes(ticketQuery.toLowerCase()) ||
                          (t.prefix ?? '')
                            .toLowerCase()
                            .includes(ticketQuery.toLowerCase()),
                      )
                    : ticketOptions
                }
                value={form.linkedTicket}
                onValueChange={(v) => {
                  setForm((f) => ({ ...f, linkedTicket: v }));
                  setTicketQuery('');
                }}
                open={ticketOpen}
                onOpenChange={onTicketChange}
                placeholder="Search ticket..."
                header={
                  <SearchInput
                    value={ticketQuery}
                    onChange={(e) => setTicketQuery(e.target.value)}
                    placeholder="Search tickets..."
                    size="sm"
                  />
                }
                variant="inline"
                dropdownAlign="end"
                action={{
                  label: 'Create new ticket',
                  icon: 'add',
                  onClick: () => {},
                }}
                emptyState="No results found"
                aria-label="Linked ticket"
              />
            </PropertyRow>
          </TaskDrawerSection>

          <TaskDrawerSection label="Recent Tasks">
            <RecentTaskList items={recentTasks} />
          </TaskDrawerSection>
        </TaskDrawer>
      </Drawer>
    </div>
  );
}

const meta: Meta = {
  title: 'Pages/Tasks',
  parameters: {
    layout: 'fullscreen',
    viewport: { options: desktopViewports },
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <TasksPageRender />,
};

export const WithDrawerOpen: Story = {
  render: () => <TasksPageRender />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const newTaskButton = canvas.getByRole('button', { name: /new task/i });
    await userEvent.click(newTaskButton);
    await waitFor(() => {
      expect(
        canvasElement.ownerDocument.querySelector('[role="dialog"]'),
      ).toBeTruthy();
    });
  },
};

export const EmptyState: Story = {
  render: () => <TasksPageRender initialTasks={[]} />,
};
