import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor } from 'storybook/test';
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
  const [priority, setPriority] = useState('high');
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [linkedTicket, setLinkedTicket] = useState<string | undefined>(
    undefined,
  );
  const [ticketOpen, setTicketOpen] = useState(false);

  const openPriority = (v: boolean) => {
    setPriorityOpen(v);
    if (v) setTicketOpen(false);
  };
  const openTicket = (v: boolean) => {
    setTicketOpen(v);
    if (v) setPriorityOpen(false);
  };
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
            <PropertyRow icon="person" label="Assignee" onClick={() => {}}>
              <Avatar initial="AD" aria-label="Alex D." variant="profile" />
              <span>Alex D.</span>
            </PropertyRow>

            <PropertyRow icon="signal_cellular_alt" label="Priority">
              <Selector
                options={priorityOptions}
                value={priority}
                onValueChange={setPriority}
                open={priorityOpen}
                onOpenChange={openPriority}
                dropdownAlign="end"
                aria-label="Select priority"
              />
            </PropertyRow>

            <PropertyRow icon="confirmation_number" label="Linked Ticket">
              <Selector
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
                onOpenChange={openTicket}
                placeholder="Search ticket..."
                header={
                  <SearchInput
                    value={ticketQuery}
                    onChange={(e) => setTicketQuery(e.target.value)}
                    placeholder="Search tickets..."
                    size="sm"
                  />
                }
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
