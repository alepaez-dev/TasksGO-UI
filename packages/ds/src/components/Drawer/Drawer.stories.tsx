import { useCallback, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor } from 'storybook/test';
import { withDefaultViewport } from '../../../.storybook/decorators';
import { mobileViewportOptions } from '../../../.storybook/preview';
import { Drawer } from './Drawer';
import { Sidebar } from '../Sidebar';
import { Selector } from '../Selector';
import { NavItem } from '../NavItem';
import { Avatar } from '../Avatar';
import { SectionHeader } from '../SectionHeader';
import { IconButton } from '../IconButton';
import { FloatingSearch } from '../FloatingSearch';
import { MobileSearchSheet } from '../MobileSearchSheet';
import type { SearchPaletteGroup } from '../SearchPalette';
import { useClickOutside } from '../../hooks/useClickOutside';

const projects = [
  { value: 'eng-core', label: 'Engineering Core' },
  { value: 'mudatec', label: 'Mudatec' },
  { value: 'tasksgo', label: 'TasksGo' },
];

const avatars: Record<string, { initial: string; label: string }> = {
  'eng-core': { initial: 'E', label: 'Engineering Core' },
  mudatec: { initial: 'M', label: 'Mudatec' },
  tasksgo: { initial: 'T', label: 'TasksGo' },
};

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof Drawer>;

function SidebarContent() {
  const [project, setProject] = useState('eng-core');
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('tasks');
  const selectorRef = useRef<HTMLDivElement>(null);
  const closeSelector = useCallback(() => setSelectorOpen(false), []);
  useClickOutside(selectorRef, closeSelector, selectorOpen);
  const avatar = avatars[project];
  const navClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveNav(id);
  };

  return (
    <Sidebar
      header={
        <Selector
          ref={selectorRef}
          options={projects}
          value={project}
          onValueChange={setProject}
          open={selectorOpen}
          onOpenChange={setSelectorOpen}
          triggerPrefix={
            <Avatar initial={avatar.initial} aria-label={avatar.label} />
          }
          action={{
            label: 'Add project',
            icon: 'add',
            onClick: () => {},
          }}
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
  );
}

function DefaultRender(
  props: Omit<
    Partial<React.ComponentProps<typeof Drawer>>,
    'aria-label' | 'aria-labelledby'
  >,
) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh' }}>
      <IconButton
        icon="menu"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      />
      <Drawer
        {...props}
        open={open}
        onClose={() => setOpen(false)}
        aria-label="Navigation menu"
      >
        <SidebarContent />
      </Drawer>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <DefaultRender {...args} />,
};

function RightSideRender(
  props: Omit<
    Partial<React.ComponentProps<typeof Drawer>>,
    'aria-label' | 'aria-labelledby'
  >,
) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh' }}>
      <IconButton
        icon="menu"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      />
      <Drawer
        {...props}
        open={open}
        onClose={() => setOpen(false)}
        side="right"
        aria-label="Details panel"
      >
        <div style={{ padding: '48px 24px 24px' }}>
          <p>Right-side drawer content</p>
        </div>
      </Drawer>
    </div>
  );
}

export const RightSide: Story = {
  args: { side: 'right' },
  render: (args) => <RightSideRender {...args} />,
};

export const Mobile: Story = {
  render: (args) => <DefaultRender {...args} />,
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions,
    },
  },
};

const searchGroups: SearchPaletteGroup[] = [
  {
    title: 'Jump to Task',
    results: [
      {
        id: 'r1',
        label: 'Refactor Kubernetes service discovery',
        refId: 'T-104',
        type: 'task',
      },
      {
        id: 'r2',
        label: 'Implement Redis cache for metadata',
        refId: 'T-42',
        type: 'task',
      },
    ],
  },
  {
    title: 'Jump to Ticket',
    results: [
      {
        id: 'r3',
        label: 'Audit IAM permissions for staging',
        refId: 'ENG-902',
        type: 'ticket',
      },
    ],
  },
];

function filterGroups(query: string): SearchPaletteGroup[] {
  const q = query.toLowerCase();
  return searchGroups
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

function WithFloatingSearchRender(
  props: Omit<
    Partial<React.ComponentProps<typeof Drawer>>,
    'aria-label' | 'aria-labelledby'
  >,
) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useState('');
  const groups = query.length > 0 ? filterGroups(query) : searchGroups;

  return (
    <div style={{ minHeight: '200vh', position: 'relative' }}>
      <IconButton
        icon="menu"
        aria-label="Open menu"
        onClick={() => setDrawerOpen(true)}
      />
      <div style={{ padding: '64px 16px' }}>
        {Array.from({ length: 30 }, (_, i) => (
          <p
            key={i}
            style={{
              margin: '16px 0',
              color: 'var(--ds-color-text-secondary)',
            }}
          >
            Scrollable content line {i + 1}
          </p>
        ))}
      </div>
      <FloatingSearch
        placeholder="Search tasks..."
        shortcutHint="⌘K"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!sheetOpen) setSheetOpen(true);
        }}
        onFocus={() => setSheetOpen(true)}
      />
      <MobileSearchSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        groups={groups}
        emptyState="No results found"
      />
      <Drawer
        {...props}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        aria-label="Navigation menu"
      >
        <SidebarContent />
      </Drawer>
    </div>
  );
}

export const WithFloatingSearch: Story = {
  render: (args) => <WithFloatingSearchRender {...args} />,
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions,
    },
    scrollLock: true,
  },
  play: async ({ canvasElement }) => {
    const searchInput = canvasElement.querySelector<HTMLInputElement>(
      'input[placeholder="Search tasks..."]',
    );
    if (!searchInput) throw new Error('Search input not found');
    await userEvent.click(searchInput);

    await waitFor(() => {
      const sheet = canvasElement.ownerDocument.querySelector(
        '[aria-label="Search results"]',
      );
      expect(sheet).toBeTruthy();
    });

    const doc = canvasElement.ownerDocument;
    expect(doc.body.style.overflow).toBe('hidden');
  },
};
