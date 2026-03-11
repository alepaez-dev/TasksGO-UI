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
