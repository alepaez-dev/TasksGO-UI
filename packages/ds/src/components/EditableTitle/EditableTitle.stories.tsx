import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EditableTitle, type EditableTitleProps } from './EditableTitle';

const meta: Meta<typeof EditableTitle> = {
  title: 'Components/EditableTitle',
  component: EditableTitle,
  parameters: { layout: 'padded' },
  argTypes: {
    as: { control: 'select', options: ['h1', 'h2', 'h3', 'span'] },
    editButton: {
      control: 'inline-radio',
      options: ['none', 'hover', 'always'],
    },
    clickToEdit: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    value: { control: false },
    editing: { control: false },
    onChange: { control: false },
    onEditingChange: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof EditableTitle>;

function Controlled(props: Partial<EditableTitleProps>) {
  const [value, setValue] = useState(props.value ?? 'Rate Limit Edge Case');
  const [editing, setEditing] = useState(props.editing ?? false);
  return (
    <EditableTitle
      as="h2"
      {...props}
      value={value}
      editing={editing}
      onEditingChange={setEditing}
      onChange={setValue}
    />
  );
}

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
  args: { as: 'h2', editButton: 'hover', clickToEdit: false, fullWidth: false },
};

export const AlwaysButton: Story = {
  render: () => <Controlled editButton="always" />,
};

export const Editing: Story = {
  render: () => <Controlled editing editButton="always" />,
};

export const ClickToEdit: Story = {
  render: () => <Controlled as="h1" fullWidth clickToEdit />,
};

export const EditingHeading: Story = {
  render: () => <Controlled as="h1" fullWidth editing clickToEdit />,
};

export const EmptyClickToEdit: Story = {
  render: () => (
    <Controlled
      as="h1"
      fullWidth
      clickToEdit
      value=""
      aria-label="Ticket title"
    />
  ),
};
