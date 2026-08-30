import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EditToggle } from './EditToggle';

const meta: Meta<typeof EditToggle> = {
  title: 'Components/EditToggle',
  component: EditToggle,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof EditToggle>;

function Controlled() {
  const [editing, setEditing] = useState(false);
  return <EditToggle editing={editing} onEditingChange={setEditing} />;
}

export const Default: Story = { render: () => <Controlled /> };
export const Editing: Story = {
  render: () => <EditToggle editing onEditingChange={() => {}} />,
};

export const Disabled: Story = {
  render: () => (
    <EditToggle editing={false} onEditingChange={() => {}} disabled />
  ),
};
