import type { Meta, StoryObj } from '@storybook/react';
import { RefLabel } from './RefLabel';

const meta = {
  title: 'Components/RefLabel',
  component: RefLabel,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['attachment', 'doc', 'general'],
    },
    icon: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    children: 'INCIDENT ARTIFACT',
  },
} satisfies Meta<typeof RefLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Attachment: Story = {
  args: {
    variant: 'attachment',
    icon: 'link',
    children: 'ARCHITECTURE-SPEC-V2.MD',
  },
};

export const Doc: Story = {
  args: {
    variant: 'doc',
    children: 'DR-PLAN-2024.MD',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-scale-sm)',
      }}
    >
      <RefLabel variant="attachment" icon="link">
        ARCHITECTURE-SPEC-V2.MD
      </RefLabel>
      <RefLabel variant="attachment" icon="attachment">
        IAM-POLICY-DRAFT.JSON
      </RefLabel>
      <RefLabel variant="doc">DR-PLAN-2024.MD</RefLabel>
      <RefLabel>INCIDENT ARTIFACT</RefLabel>
    </div>
  ),
};
