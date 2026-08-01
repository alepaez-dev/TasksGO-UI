import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProjectPicker, type ProjectPickerProject } from './ProjectPicker';

const projects: ProjectPickerProject[] = [
  {
    value: 'eng-core',
    label: 'Engineering Core',
    initial: 'E',
    avatarColor: 'var(--ds-color-avatar-tone-project-ocean)',
  },
  {
    value: 'mudatec',
    label: 'Mudatec',
    initial: 'M',
    avatarColor: 'var(--ds-color-avatar-tone-project-warm)',
  },
  {
    value: 'tasksgo',
    label: 'TasksGo',
    initial: 'T',
    avatarColor: 'var(--ds-color-avatar-tone-project-slate)',
  },
];

const meta: Meta<typeof ProjectPicker> = {
  title: 'Components/ProjectPicker',
  component: ProjectPicker,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof ProjectPicker>;

function DefaultRender() {
  const [value, setValue] = useState('eng-core');
  const [query, setQuery] = useState('');

  return (
    <div style={{ width: 340 }}>
      <ProjectPicker
        projects={projects}
        value={value}
        onSelect={setValue}
        onBack={() => {}}
        query={query}
        onQueryChange={setQuery}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultRender />,
};
