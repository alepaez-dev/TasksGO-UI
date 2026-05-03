import { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { desktopViewports } from '../../../../.storybook/preview';
import { useSelectorGroup, useSelectorState } from '../../../hooks/useSelector';
import { Sidebar } from '../../../components/Sidebar';
import { Selector } from '../../../components/Selector';
import { NavItem } from '../../../components/NavItem';
import { Avatar } from '../../../components/Avatar';
import { SectionHeader } from '../../../components/SectionHeader';
import { StatusDot } from '../../../components/StatusDot';
import { Header } from '../../../components/Header';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { SearchInput } from '../../../components/SearchInput';
import {
  SearchPalette,
  getSearchPaletteOptionId,
} from '../../../components/SearchPalette';
import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import { Footer } from '../../../components/Footer';
import { TaskSection } from '../../../components/TaskSection';
import { TaskRow } from '../../../components/TaskRow';
import { Drawer } from '../../../components/Drawer';
import {
  TaskDrawer,
  TaskDrawerField,
  TaskDrawerSection,
} from '../../../components/TaskDrawer';
import { PropertyRow } from '../../../components/PropertyRow';
import { RecentTaskList } from '../../../components/RecentTaskList';
import {
  orderByLabelStyle,
  orderByPrefixStyle,
  orderByValueStyle,
} from '../../helpers/orderByStyles';
import {
  type TaskItem,
  type DrawerFormState,
  initialForm,
  seedCompleted,
  defaultTasks,
  projectList,
  getProject,
  assigneeOptions,
  priorityOptions,
  ticketOptions,
  recentTasks,
  sortOptions,
  sortTasks,
  filterSearchResults,
} from './shared';
import styles from './TasksDesktop.module.css';

function TasksPageRender({
  initialTasks = defaultTasks,
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
          .filter((t) => seedCompleted.some((s) => s.id === t.id))
          .map((t) => t.id),
      ),
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | undefined>();
  const [form, setForm] = useState<DrawerFormState>(initialForm);
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
    setForm(initialForm);
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
    ? `Edit task \u00b7 ${editingTask.ticketId ?? editingTask.id}`
    : 'New task';
  const drawerSubmitLabel = editingTaskId ? 'Save' : 'Create Task';

  const activeProject = getProject(project);
  const navClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveNav(id);
  };

  return (
    <div className={styles.shell}>
      <Sidebar
        aria-label="Sidebar navigation"
        header={
          <>
            <Selector
              ref={projectRef}
              options={projectList}
              value={project}
              onValueChange={setProject}
              open={projectOpen}
              onOpenChange={onProjectChange}
              triggerPrefix={
                <Avatar
                  initial={activeProject.initial}
                  aria-label={activeProject.label}
                />
              }
              action={{ label: 'Add project', icon: 'add', onClick: () => {} }}
            />
            <div style={{ marginTop: 'var(--ds-space-sidebar-section-gap)' }}>
              <span
                style={{
                  fontFamily: 'var(--ds-text-section-header-font-family)',
                  fontSize: 'var(--ds-text-section-header-font-size)',
                  fontWeight: 'var(--ds-font-weight-medium)',
                  letterSpacing: 'var(--ds-text-section-header-letter-spacing)',
                  textTransform: 'uppercase' as const,
                  color: 'var(--ds-color-text-secondary)',
                }}
              >
                Active Workspace
              </span>
              <p
                style={{
                  margin: 'var(--ds-space-scale-sm) 0 var(--ds-space-scale-sm)',
                  fontFamily: 'var(--ds-font-family-sans)',
                  fontSize: 'var(--ds-text-page-title-font-size)',
                  fontWeight: 'var(--ds-font-weight-bold)',
                  color: 'var(--ds-color-text-primary)',
                  lineHeight: 'var(--ds-text-page-title-line-height)',
                }}
              >
                Project / {activeProject.label}
              </p>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--ds-space-scale-sm)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--ds-font-family-mono)',
                    fontSize: 'var(--ds-text-section-header-font-size)',
                    color: 'var(--ds-color-text-secondary)',
                    letterSpacing: '0.05em',
                    padding:
                      'var(--ds-space-badge-padding-y) var(--ds-space-badge-padding-x)',
                    borderRadius: 'var(--ds-radius-lg)',
                    backgroundColor: 'var(--ds-color-border-default)',
                  }}
                >
                  v4.1.0-alpha
                </span>
                <StatusDot variant="active" label="Healthy" />
              </span>
            </div>
          </>
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
        <SectionHeader>Project Artifacts</SectionHeader>
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
              <Avatar initial="AP" variant="profile" aria-label="Ale Paez" />
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
