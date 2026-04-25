import type { Meta, StoryObj } from '@storybook/react';
import { NavItem } from './NavItem';

const meta = {
  title: 'Components/NavItem',
  component: NavItem,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'text' },
    label: { control: 'text' },
    active: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    href: { control: 'text' },
  },
  args: {
    icon: 'task_alt',
    label: 'Tasks',
    href: '#',
  },
} satisfies Meta<typeof NavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: { active: true },
};

export const Small: Story = {
  args: { icon: 'settings', label: 'Settings', size: 'sm' },
};

export const SmallActive: Story = {
  args: { icon: 'settings', label: 'Settings', size: 'sm', active: true },
};

export const Vertical: Story = {
  args: { icon: 'task_alt', label: 'Tasks', orientation: 'vertical' },
};

export const VerticalActive: Story = {
  args: {
    icon: 'task_alt',
    activeIcon: 'check_circle',
    label: 'Tasks',
    orientation: 'vertical',
    active: true,
  },
};

export const VerticalLongLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', width: '72px' }}>
      <NavItem
        icon="task_alt"
        label="Notifications"
        href="#"
        orientation="vertical"
      />
    </div>
  ),
};

export const VerticalRow: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        width: '360px',
      }}
    >
      <NavItem
        icon="task_alt"
        activeIcon="check_circle"
        label="Tasks"
        href="#"
        orientation="vertical"
        active
      />
      <NavItem
        icon="confirmation_number"
        activeIcon="confirmation_number_filled"
        label="Tickets"
        href="#"
        orientation="vertical"
      />
      <NavItem
        icon="description"
        activeIcon="description_filled"
        label="Docs"
        href="#"
        orientation="vertical"
      />
      <NavItem icon="more_horiz" label="More" href="#" orientation="vertical" />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-nav-list-gap)',
        width: '240px',
      }}
    >
      <NavItem icon="task_alt" label="Tasks" href="#" active />
      <NavItem icon="confirmation_number" label="Tickets" href="#" />
      <NavItem icon="description" label="Docs" href="#" />
      <NavItem icon="settings" label="Settings" href="#" size="sm" />
      <NavItem icon="help" label="Support" href="#" size="sm" />
    </div>
  ),
};
