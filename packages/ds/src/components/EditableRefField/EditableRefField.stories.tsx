import type { Meta, StoryObj } from '@storybook/react';
import { EditableRefField } from './EditableRefField';

const meta: Meta<typeof EditableRefField> = {
  title: 'Components/EditableRefField',
  component: EditableRefField,
  tags: ['autodocs'],
  args: {
    icon: 'fork_right',
    value: 'feat/dynamic-edge-caching',
    onStartEdit: () => {},
    onCopy: () => {},
  },
  argTypes: {
    icon: { control: 'text' },
    value: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof EditableRefField>;

export const Resting: Story = {};

export const LongValueTruncates: Story = {
  args: {
    value: 'feat/dynamic-edge-caching-with-an-unusually-long-branch-name',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 220 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithoutCopy: Story = {
  args: {
    onCopy: undefined,
  },
};

export const Empty: Story = {
  args: {
    value: '',
    placeholder: 'Add branch',
  },
};

export const Editing: Story = {
  args: {
    editing: true,
    draftValue: 'feat/dynamic-edge-caching',
    inputAriaLabel: 'Branch name',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const EditingDisabledConfirm: Story = {
  args: {
    editing: true,
    draftValue: '',
    inputAriaLabel: 'Branch name',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const Copied: Story = {
  args: {
    copied: true,
  },
};
