import type { Meta, StoryObj } from '@storybook/react';
import { SectionHeader } from './SectionHeader';
import { NavItem } from '../NavItem';

const meta = {
  title: 'Components/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
  },
  args: {
    children: 'Project Artifacts',
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SectionHeader>Project Artifacts</SectionHeader>
      <SectionHeader>Active Tasks</SectionHeader>
      <SectionHeader>Completed Tasks</SectionHeader>
    </div>
  ),
};

export const InSidebarContext: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-nav-list-gap)',
        width: '240px',
      }}
    >
      <div style={{ padding: '0 12px', marginBottom: '8px' }}>
        <SectionHeader>Project Artifacts</SectionHeader>
      </div>
      <NavItem icon="task_alt" label="Tasks" href="#" active />
      <NavItem icon="confirmation_number" label="Tickets" href="#" />
      <NavItem icon="description" label="Docs" href="#" />
    </div>
  ),
};
