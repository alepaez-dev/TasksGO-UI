import { useState, useCallback, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { withDefaultViewport } from '../../../../.storybook/decorators';
import { mobileViewportOptions } from '../../../../.storybook/preview';
import { Header } from '../../../components/Header';
import { SearchInput } from '../../../components/SearchInput';
import { SearchPalette } from '../../../components/SearchPalette';
import { Avatar } from '../../../components/Avatar';
import { Icon } from '../../../components/Icon';
import { IconButton } from '../../../components/IconButton';
import { Fab } from '../../../components/Fab';
import { BottomTabBar } from '../../../components/BottomTabBar';
import { NavItem } from '../../../components/NavItem';
import { BottomSheet } from '../../../components/BottomSheet';
import { ProjectPicker } from '../../../components/ProjectPicker';
import { SectionHeader } from '../../../components/SectionHeader';
import { StatusDot } from '../../../components/StatusDot';
import { TaskSection } from '../../../components/TaskSection';
import { TaskRow } from '../../../components/TaskRow';
import { Selector } from '../../../components/Selector';
import { Drawer } from '../../../components/Drawer';
import {
  TaskDrawer,
  TaskDrawerField,
  TaskDrawerSection,
} from '../../../components/TaskDrawer';
import { PropertyRow } from '../../../components/PropertyRow';
import { RecentTaskList } from '../../../components/RecentTaskList';
import { Button } from '../../../components/Button';
import {
  orderByLabelStyle,
  orderByValueStyle,
} from '../../helpers/orderByStyles';
import {
  type TaskItem,
  defaultTasks,
  projectList,
  getProject,
  assigneeOptions,
  priorityOptions,
  ticketOptions,
  recentTasks,
  sortOptions,
  filterSearchResults,
} from './shared';
import { useTasksState } from './useTasksState';
import searchPillStyles from '../../helpers/searchPill.module.css';
import styles from './TasksMobile.module.css';

// Lift the FAB above the BottomTabBar; the default offset assumes no tab bar.
const fabOffsetOverride = {
  '--ds-space-fab-bottom-offset':
    'calc(var(--ds-space-bottom-tab-bar-height) + 24px)',
} as CSSProperties;

type MoreMenuView = 'menu' | 'picker';

function TasksMobileRender({
  initialTasks = defaultTasks,
}: {
  initialTasks?: readonly TaskItem[];
}) {
  const tasks = useTasksState(initialTasks);
  const {
    ref: assigneeRef,
    open: assigneeOpen,
    onOpenChange: onAssigneeChange,
  } = tasks.selectors.assignee;
  const {
    ref: priorityRef,
    open: priorityOpen,
    onOpenChange: onPriorityChange,
  } = tasks.selectors.priority;
  const {
    ref: ticketRef,
    open: ticketOpen,
    onOpenChange: onTicketChange,
  } = tasks.selectors.ticket;

  const [project, setProject] = useState('eng-core');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useCallback((node: HTMLInputElement | null) => {
    node?.focus();
  }, []);
  const searchGroups =
    searchQuery.length > 0 ? filterSearchResults(searchQuery) : [];
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreView, setMoreView] = useState<MoreMenuView>('menu');
  const [pickerQuery, setPickerQuery] = useState('');
  const [sortSheetOpen, setSortSheetOpen] = useState(false);

  function handleMoreToggle() {
    const next = !moreOpen;
    setMoreOpen(next);
    if (!next) {
      setMoreView('menu');
      setPickerQuery('');
    }
  }

  const activeProject = getProject(project);

  return (
    <div className={styles.shell} style={fabOffsetOverride}>
      <Header
        compact
        left={
          <div className={styles.projectRow}>
            <Avatar
              initial={activeProject.initial}
              variant="project"
              aria-label={activeProject.label}
            />
            <span className={styles.pageTitle}>Tasks</span>
          </div>
        }
        right={
          <>
            <IconButton
              icon="search"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            />
            <Avatar initial="AP" variant="profile" aria-label="Ale Paez" />
          </>
        }
      />

      <BottomSheet
        open={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setSearchQuery('');
        }}
        fullHeight
        aria-label="Search"
      >
        <div className={styles.searchSheetHeader}>
          <SearchInput
            ref={searchRef}
            placeholder="Jump to task"
            size="sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={searchQuery ? () => setSearchQuery('') : undefined}
            borderless
            className={searchPillStyles.searchPill}
            style={{ fontSize: 16 }}
          />
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery('');
            }}
          >
            Cancel
          </button>
        </div>

        {searchGroups.length > 0 ? (
          <SearchPalette
            groups={searchGroups}
            onResultSelect={(result) => {
              const task = initialTasks.find((t) => t.id === result.id);
              if (task) {
                tasks.handleTaskClick(task);
                setSearchOpen(false);
                setSearchQuery('');
              }
            }}
            variant="mobile"
            aria-label="Search results"
          />
        ) : (
          <>
            <SectionHeader headingLevel={3}>Jump to</SectionHeader>
            <nav aria-label="Jump to" className={styles.workspaceNav}>
              <NavItem icon="task_alt" label="All tasks" href="#tasks" />
              <NavItem
                icon="confirmation_number"
                label="All tickets"
                href="#tickets"
              />
              <NavItem icon="description" label="All docs" href="#docs" />
            </nav>
          </>
        )}
      </BottomSheet>

      <div className={styles.scrollArea}>
        <div className={styles.content}>
          {initialTasks.length === 0 ? (
            <p className={styles.emptyMessage}>No tasks yet</p>
          ) : (
            <div className={styles.taskList}>
              <TaskSection
                title="Tasks"
                count={tasks.activeTasks.length}
                compact
                open
                trailing={
                  <button
                    type="button"
                    className={styles.sortTrigger}
                    style={{ ...orderByLabelStyle, ...orderByValueStyle }}
                    onClick={() => setSortSheetOpen(true)}
                  >
                    {sortOptions.find((o) => o.value === tasks.sortBy)?.label}
                    <Icon name="expand_more" size="sm" />
                  </button>
                }
              >
                {tasks.activeTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    title={task.title}
                    checked={tasks.completedIds.has(task.id)}
                    onCheckedChange={(checked) =>
                      tasks.handleCheck(task.id, checked)
                    }
                    onClick={() => tasks.handleTaskClick(task)}
                    badge={task.badge}
                    refs={task.refs}
                    priority={task.priority}
                    refId={task.ticketId ?? task.id}
                    date={task.date}
                    layout="compact"
                  />
                ))}
              </TaskSection>

              <TaskSection
                title="Completed"
                count={tasks.completedTasks.length}
                open
              >
                {tasks.completedTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    title={task.title}
                    completed={tasks.completedIds.has(task.id)}
                    checked={tasks.completedIds.has(task.id)}
                    onCheckedChange={(checked) =>
                      tasks.handleCheck(task.id, checked)
                    }
                    onClick={() => tasks.handleTaskClick(task)}
                    badge={{ label: 'Done', variant: 'done' }}
                    refs={task.refs}
                    priority={task.priority}
                    refId={task.ticketId ?? task.id}
                    date={task.date}
                    layout="compact"
                  />
                ))}
              </TaskSection>
            </div>
          )}
        </div>
      </div>

      <Fab aria-label="New task" onClick={() => tasks.setDrawerOpen(true)} />

      <BottomTabBar aria-label="Main navigation">
        <NavItem
          icon="task_alt"
          activeIcon="check_circle"
          label="Tasks"
          href="#tasks"
          orientation="vertical"
          active
        />
        <NavItem
          icon="confirmation_number"
          activeIcon="confirmation_number_filled"
          label="Tickets"
          href="#tickets"
          orientation="vertical"
        />
        <NavItem
          icon="description"
          activeIcon="description_filled"
          label="Docs"
          href="#docs"
          orientation="vertical"
        />
        <NavItem
          icon="more_horiz"
          label="More"
          href="#more"
          orientation="vertical"
          onClick={(e) => {
            e.preventDefault();
            handleMoreToggle();
          }}
        />
      </BottomTabBar>

      <BottomSheet
        open={moreOpen}
        onClose={handleMoreToggle}
        aria-label={moreView === 'menu' ? 'More menu' : 'Switch project'}
      >
        <div style={{ overflowX: 'clip' }}>
          <div
            className={styles.slider}
            style={{
              transform:
                moreView === 'picker' ? 'translateX(-100%)' : 'translateX(0)',
            }}
          >
            <div
              className={styles.panel}
              inert={moreView !== 'menu' || undefined}
            >
              <div className={styles.section}>
                <SectionHeader headingLevel={3}>Project</SectionHeader>
                <button
                  type="button"
                  className={styles.moreProjectRow}
                  onClick={() => setMoreView('picker')}
                >
                  <Avatar
                    initial={activeProject.initial}
                    variant="project"
                    aria-label={activeProject.label}
                    style={
                      activeProject.avatarColor
                        ? { backgroundColor: activeProject.avatarColor }
                        : undefined
                    }
                  />
                  <span className={styles.moreProjectLabel}>
                    {activeProject.label}
                  </span>
                  <Icon name="chevron_right" size="sm" />
                </button>
              </div>

              <div className={styles.section}>
                <SectionHeader headingLevel={3}>Account</SectionHeader>
                <div className={styles.profileRow}>
                  <Avatar
                    initial="AP"
                    variant="profile"
                    aria-label="Ale Paez"
                  />
                  <div className={styles.nameBlock}>
                    <span className={styles.name}>Ale Paez</span>
                    <span className={styles.email}>ale@example.com</span>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <SectionHeader headingLevel={3}>Workspace</SectionHeader>
                <nav
                  aria-label="Workspace navigation"
                  className={styles.workspaceNav}
                >
                  <NavItem icon="settings" label="Settings" href="#settings" />
                  <NavItem icon="help" label="Support" href="#support" />
                </nav>
              </div>

              <div>
                <SectionHeader headingLevel={3}>System Status</SectionHeader>
                <div className={styles.statusRow}>
                  <StatusDot variant="active" label="Operational" />
                  <span className={styles.statusLabel}>Stable</span>
                </div>
              </div>
            </div>

            <div
              className={styles.panel}
              inert={moreView !== 'picker' || undefined}
            >
              {moreView === 'picker' && (
                <ProjectPicker
                  projects={projectList}
                  value={project}
                  onSelect={setProject}
                  onBack={() => {
                    setMoreView('menu');
                    setPickerQuery('');
                  }}
                  query={pickerQuery}
                  onQueryChange={setPickerQuery}
                />
              )}
            </div>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet
        open={sortSheetOpen}
        onClose={() => setSortSheetOpen(false)}
        aria-label="Sort by"
      >
        <SectionHeader headingLevel={3}>Sort by</SectionHeader>
        <div style={{ marginTop: 'var(--ds-space-scale-sm)' }}>
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={styles.sortOption}
              onClick={() => {
                tasks.setSortBy(opt.value);
                setSortSheetOpen(false);
              }}
            >
              {opt.label}
              {tasks.sortBy === opt.value && (
                <Icon name="check_circle" size="sm" />
              )}
            </button>
          ))}
        </div>
      </BottomSheet>

      <Drawer
        open={tasks.drawerOpen}
        onClose={tasks.handleDrawerClose}
        side="right"
        aria-label={tasks.drawerTitle}
      >
        <TaskDrawer
          title={tasks.drawerTitle}
          onCancel={tasks.handleDrawerClose}
          onSubmit={tasks.handleDrawerClose}
          submitLabel={tasks.drawerSubmitLabel}
        >
          <TaskDrawerField label="Task Title">
            <input
              type="text"
              value={tasks.form.title}
              onChange={(e) =>
                tasks.setForm((f) => ({ ...f, title: e.target.value }))
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
              value={tasks.form.description}
              onChange={(e) =>
                tasks.setForm((f) => ({ ...f, description: e.target.value }))
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
                  tasks.assigneeQuery
                    ? assigneeOptions.filter((m) =>
                        m.label
                          .toLowerCase()
                          .includes(tasks.assigneeQuery.toLowerCase()),
                      )
                    : assigneeOptions
                }
                value={tasks.form.assignee}
                onValueChange={(v) => {
                  tasks.setForm((f) => ({ ...f, assignee: v }));
                  tasks.setAssigneeQuery('');
                }}
                open={assigneeOpen}
                onOpenChange={onAssigneeChange}
                dropdownAlign="end"
                variant="inline"
                aria-label="Select assignee"
                header={
                  <SearchInput
                    value={tasks.assigneeQuery}
                    onChange={(e) => tasks.setAssigneeQuery(e.target.value)}
                    placeholder="Search members..."
                    size="sm"
                  />
                }
                emptyState="No members found"
                triggerPrefix={(() => {
                  const selected = assigneeOptions.find(
                    (m) => m.value === tasks.form.assignee,
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
                value={tasks.form.priority}
                onValueChange={(v) =>
                  tasks.setForm((f) => ({ ...f, priority: v }))
                }
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
                  tasks.ticketQuery
                    ? ticketOptions.filter(
                        (t) =>
                          t.label
                            .toLowerCase()
                            .includes(tasks.ticketQuery.toLowerCase()) ||
                          (t.prefix ?? '')
                            .toLowerCase()
                            .includes(tasks.ticketQuery.toLowerCase()),
                      )
                    : ticketOptions
                }
                value={tasks.form.linkedTicket}
                onValueChange={(v) => {
                  tasks.setForm((f) => ({ ...f, linkedTicket: v }));
                  tasks.setTicketQuery('');
                }}
                open={ticketOpen}
                onOpenChange={onTicketChange}
                placeholder="Search ticket..."
                header={
                  <SearchInput
                    value={tasks.ticketQuery}
                    onChange={(e) => tasks.setTicketQuery(e.target.value)}
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
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    layout: 'fullscreen',
    viewport: { options: mobileViewportOptions },
  },
};
export default meta;

type Story = StoryObj;

export const Mobile: Story = {
  render: () => <TasksMobileRender />,
};

export const MobileEmptyState: Story = {
  render: () => <TasksMobileRender initialTasks={[]} />,
};
