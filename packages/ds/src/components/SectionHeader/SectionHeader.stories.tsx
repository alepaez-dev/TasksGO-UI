import type { Meta, StoryObj } from '@storybook/react';
import { SectionHeader } from './SectionHeader';
import { NavItem } from '../NavItem';

const meta = {
  title: 'Components/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    subtitle: { control: 'text' },
    headingLevel: { control: 'select', options: [2, 3, 4, 5, 6] },
  },
  args: {
    children: 'Project Artifacts',
  },
  parameters: {
    docs: {
      description: {
        component:
          'Uppercase-mono section heading with an optional subtitle line. The `headingLevel` prop (default `3`) lets consumers pick the semantic heading element; `h1` is intentionally excluded since it is reserved for page titles. Consumers are responsible for maintaining a correct document outline — if a parent section already has an `h2` sibling, pick a deeper level here to avoid flat/broken heading hierarchies.',
      },
    },
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSubtitle: Story = {
  args: {
    children: 'My tasks',
    subtitle: '12 open · 3 in progress',
    headingLevel: 2,
  },
};

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
