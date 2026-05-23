import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  PipelineHierarchyPanel,
  type PipelineHierarchyStage,
} from './PipelineHierarchyPanel';

const meta: Meta<typeof PipelineHierarchyPanel> = {
  title: 'Components/PipelineHierarchyPanel',
  component: PipelineHierarchyPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A bordered panel listing pipeline stages with per-stage status dots, an optional active highlight, and an optional add-stage footer. When `onReorder` is provided, each row gets a drag handle for mouse drag-and-drop reorder and supports keyboard reorder via `Alt+ArrowUp` / `Alt+ArrowDown` on the focused drag handle. Touch reorder is not yet supported.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px', maxWidth: '320px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PipelineHierarchyPanel>;

const initialStages: readonly PipelineHierarchyStage[] = [
  { value: 'qa1', label: 'QA1', status: 'success' },
  { value: 'qa2', label: 'QA2', status: 'in-progress' },
  { value: 'staging', label: 'Staging', status: 'idle' },
  { value: 'prod', label: 'Prod', status: 'idle' },
];

function ControlledPanel({
  initial,
}: {
  initial: readonly PipelineHierarchyStage[];
}) {
  const [stages, setStages] = useState(initial);
  const [active, setActive] = useState<string | undefined>('qa2');
  return (
    <PipelineHierarchyPanel
      title="Pipeline Hierarchy"
      reorderHint="Drag to reorder"
      stages={stages}
      activeValue={active}
      onSelect={setActive}
      onReorder={setStages}
      addLabel="Add environment"
      onAddStage={() => {
        console.log('Add stage clicked');
      }}
    />
  );
}

export const Default: Story = {
  render: () => <ControlledPanel initial={initialStages} />,
};
