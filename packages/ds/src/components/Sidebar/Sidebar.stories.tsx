import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';
import { Selector } from '../Selector';
import { NavItem } from '../NavItem';
import { Avatar } from '../Avatar';
import { SectionHeader } from '../SectionHeader';
import { useSelectorState } from '../../hooks/useSelector';

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

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

function DefaultRender() {
  const [project, setProject] = useState('eng-core');
  const [activeNav, setActiveNav] = useState('tasks');
  const { ref, open, onOpenChange } = useSelectorState();
  const avatar = avatars[project];
  const navClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveNav(id);
  };
  return (
    <Sidebar
      header={
        <Selector
          ref={ref}
          options={projects}
          value={project}
          onValueChange={setProject}
          open={open}
          onOpenChange={onOpenChange}
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
  );
}

export const Default: Story = {
  render: () => <DefaultRender />,
};
