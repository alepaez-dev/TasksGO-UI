import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor } from 'storybook/test';
import { useSelectorGroup } from '../../hooks/useSelector';
import { Drawer } from '../Drawer';
import { TaskDrawer, TaskDrawerField, TaskDrawerSection } from './TaskDrawer';
import { PropertyRow } from '../PropertyRow';
import { RecentTaskList } from '../RecentTaskList';
import { Selector } from '../Selector';
import { SearchInput } from '../SearchInput';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { Button } from '../Button';
import type { RecentTaskItem } from '../RecentTaskList';
import { withDefaultViewport } from '../../../.storybook/decorators';
import { mobileViewportOptions } from '../../../.storybook/preview';

const assigneeOptions = [
  { value: 'ale', label: 'Ale H.', initial: 'AH', color: '#7D9B84' },
  { value: 'cleo', label: 'Cleo H.', initial: 'CH', color: '#C38E70' },
  { value: 'vader', label: 'Vader P.', initial: 'VP', color: '#6C89A8' },
  { value: 'loki', label: 'Loki P.', initial: 'LP', color: '#7B6FA0' },
];

const ticketOptions = [
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

const meta: Meta<typeof TaskDrawer> = {
  title: 'Features/Tasks/TaskDrawer',
  component: TaskDrawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof TaskDrawer>;

function DefaultRender() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('ale');
  const [priority, setPriority] = useState('high');
  const [linkedTicket, setLinkedTicket] = useState<string | undefined>(
    undefined,
  );
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

  return (
    <div style={{ minHeight: '100vh', padding: '64px' }}>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        <Icon name="add" size="sm" />
        New task
      </Button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        aria-label="New task"
      >
        <TaskDrawer
          title="New task"
          onCancel={() => setOpen(false)}
          onSubmit={() => setOpen(false)}
        >
          <TaskDrawerField label="Task Title">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Describe the task..."
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={4}
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
                value={assignee}
                onValueChange={(v) => {
                  setAssignee(v);
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
                triggerPrefix={
                  <Avatar
                    variant="profile"
                    initial={
                      assigneeOptions.find((m) => m.value === assignee)
                        ?.initial ?? '?'
                    }
                    aria-label={
                      assigneeOptions.find((m) => m.value === assignee)
                        ?.label ?? 'No assignee'
                    }
                    style={{
                      backgroundColor: assigneeOptions.find(
                        (m) => m.value === assignee,
                      )?.color,
                    }}
                  />
                }
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
                value={priority}
                onValueChange={setPriority}
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
                value={linkedTicket}
                onValueChange={(v) => {
                  setLinkedTicket(v);
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

export const Default: Story = {
  render: () => <DefaultRender />,
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    if (!button) throw new Error('Trigger button not found');
    await userEvent.click(button);

    await waitFor(() => {
      const dialog =
        canvasElement.ownerDocument.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
    });

    const doc = canvasElement.ownerDocument;
    const heading = doc.querySelector('h2');
    expect(heading?.textContent).toBe('New task');

    const footer = doc.querySelector('button');
    expect(footer).toBeTruthy();
  },
};

const longDescription = Array(20)
  .fill(
    'Detailed implementation notes for refactoring the edge-caching logic to handle multi-value headers and ensure compatibility with legacy upstream services.',
  )
  .join('\n\n');

function LongContentRender() {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ minHeight: '100vh', padding: '64px' }}>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        aria-label="New task"
      >
        <TaskDrawer
          title="New task"
          onCancel={() => setOpen(false)}
          onSubmit={() => {}}
        >
          <TaskDrawerField label="Task Title">
            <input
              type="text"
              defaultValue="Refactor edge-caching header mutation logic"
              aria-label="Task title"
            />
          </TaskDrawerField>

          <TaskDrawerField label="Description">
            <textarea
              defaultValue={longDescription}
              rows={4}
              aria-label="Description"
            />
          </TaskDrawerField>
        </TaskDrawer>
      </Drawer>
    </div>
  );
}

export const LongContent: Story = {
  render: () => <LongContentRender />,
};

export const Mobile: Story = {
  render: () => <DefaultRender />,
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: { options: mobileViewportOptions },
  },
};
