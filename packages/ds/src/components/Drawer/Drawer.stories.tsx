import { useCallback, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { withDefaultViewport } from '../../../.storybook/decorators';
import { mobileViewportOptions } from '../../../.storybook/preview';
import { Drawer } from './Drawer';
import { Sidebar } from '../Sidebar';
import { Selector } from '../Selector';
import { NavItem } from '../NavItem';
import { Avatar } from '../Avatar';
import { SectionHeader } from '../SectionHeader';
import { IconButton } from '../IconButton';
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

function DefaultRender(props: Partial<React.ComponentProps<typeof Drawer>>) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh' }}>
      <IconButton
        icon="menu"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      />
      <Drawer {...props} open={open} onClose={() => setOpen(false)}>
        <SidebarContent />
      </Drawer>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <DefaultRender {...args} />,
};

function RightSideRender(props: Partial<React.ComponentProps<typeof Drawer>>) {
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

function MobileRender(props: Partial<React.ComponentProps<typeof Drawer>>) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh' }}>
      <IconButton
        icon="menu"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      />
      <Drawer {...props} open={open} onClose={() => setOpen(false)}>
        <SidebarContent />
      </Drawer>
    </div>
  );
}

export const Mobile: Story = {
  render: (args) => <MobileRender {...args} />,
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions,
    },
  },
};
