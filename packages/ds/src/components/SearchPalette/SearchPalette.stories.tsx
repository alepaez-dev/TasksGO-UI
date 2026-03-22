import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchPalette, type SearchPaletteGroup } from './SearchPalette';

const sampleGroups: SearchPaletteGroup[] = [
  {
    title: 'Jump to Task',
    results: [
      { id: 'r1', label: 'Update login flow', refId: 'TSK-042', type: 'task' },
      {
        id: 'r2',
        label: 'Fix auth token expiry',
        refId: 'TSK-041',
        type: 'task',
      },
      {
        id: 'r3',
        label: 'Refactor dashboard layout',
        refId: 'TSK-039',
        type: 'task',
      },
    ],
  },
  {
    title: 'Jump to Ticket',
    results: [
      {
        id: 'r4',
        label: 'Login timeout on slow networks',
        refId: 'TKT-15',
        type: 'ticket',
      },
    ],
  },
  {
    title: 'Jump to Doc',
    results: [
      { id: 'r5', label: 'Authentication guide', refId: 'DOC-7', type: 'doc' },
    ],
  },
];

function InteractiveRender() {
  const [activeId, setActiveId] = useState<string | undefined>();
  return (
    <SearchPalette
      groups={sampleGroups}
      activeResultId={activeId}
      onResultSelect={(result) => setActiveId(result.id)}
      aria-label="Search results"
    />
  );
}

const meta: Meta<typeof SearchPalette> = {
  title: 'Components/SearchPalette',
  component: SearchPalette,
  tags: ['autodocs'],
  argTypes: {
    activeResultId: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div
        style={{ position: 'relative', maxWidth: '320px', paddingTop: '48px' }}
      >
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SearchPalette>;

export const Default: Story = {
  render: () => <InteractiveRender />,
};

export const SingleGroup: Story = {
  args: {
    groups: [sampleGroups[0]],
    'aria-label': 'Search results',
  },
};
