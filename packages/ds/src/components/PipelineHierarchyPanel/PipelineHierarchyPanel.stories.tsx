import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  PipelineHierarchyPanel,
  type AddStageMessage,
  type PipelineHierarchyStage,
} from './PipelineHierarchyPanel';
import { toStageValue } from '../../utils/toStageValue';

const meta: Meta<typeof PipelineHierarchyPanel> = {
  title: 'Components/PipelineHierarchyPanel',
  component: PipelineHierarchyPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A bordered panel listing pipeline stages with per-stage status dots, an optional active highlight, and an optional add-stage footer. When `onReorder` is provided, each row gets a drag handle for pointer (mouse and touch) drag-and-drop reorder and supports keyboard reorder via `Alt+ArrowUp` / `Alt+ArrowDown` on the focused drag handle.',
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

function getAddStageMessage(
  draft: string,
  stages: readonly PipelineHierarchyStage[],
): AddStageMessage | undefined {
  const trimmed = draft.trim();
  if (trimmed.length === 0) return undefined;
  const draftValue = toStageValue(trimmed);
  if (draftValue === '') {
    return {
      kind: 'error',
      text: 'Stage name must include a letter or number',
    };
  }
  const exact = stages.find(
    (stage) =>
      stage.value === draftValue ||
      stage.label.toLowerCase() === trimmed.toLowerCase(),
  );
  if (exact) {
    return { kind: 'error', text: `"${exact.label}" already exists` };
  }
  const lower = trimmed.toLowerCase();
  const similar = stages.filter((stage) => {
    const other = stage.label.toLowerCase();
    return (
      lower.length >= 2 && (other.startsWith(lower) || lower.startsWith(other))
    );
  });
  if (similar.length > 0) {
    const list = similar.map((s) => `"${s.label}"`).join(' and ');
    return {
      kind: 'warning',
      text: `Similar to ${list} — still confirm?`,
    };
  }
  return undefined;
}

function ControlledPanel({
  initial,
}: {
  initial: readonly PipelineHierarchyStage[];
}) {
  const [stages, setStages] = useState(initial);
  const [active, setActive] = useState<string | undefined>('qa2');
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const message = isAdding ? getAddStageMessage(draft, stages) : undefined;
  const baseProps = {
    title: 'Pipeline Hierarchy',
    reorderHint: 'Drag to reorder',
    stages,
    activeValue: active,
    onSelect: setActive,
    onReorder: setStages,
    addLabel: 'Add environment',
    addStagePlaceholder: 'Prod-US',
    onAddStage: () => {
      setDraft('');
      setIsAdding(true);
    },
  };
  if (isAdding) {
    return (
      <PipelineHierarchyPanel
        {...baseProps}
        addingStage
        addStageValue={draft}
        addStageMessage={message}
        onAddStageValueChange={setDraft}
        onAddStageConfirm={(label) => {
          setStages((current) => {
            if (getAddStageMessage(label, current)?.kind === 'error')
              return current;
            return [
              ...current,
              { value: toStageValue(label), label, status: 'idle' },
            ];
          });
          setIsAdding(false);
          setDraft('');
        }}
        onAddStageCancel={() => {
          setIsAdding(false);
          setDraft('');
        }}
      />
    );
  }
  return <PipelineHierarchyPanel {...baseProps} />;
}

export const Default: Story = {
  render: () => <ControlledPanel initial={initialStages} />,
};

const staticEditorArgs = {
  title: 'Pipeline Hierarchy',
  reorderHint: 'Drag to reorder',
  stages: initialStages,
  activeValue: 'qa2',
  addLabel: 'Add environment',
  addStagePlaceholder: 'Prod-US',
  addingStage: true as const,
  onAddStageValueChange: () => {},
  onAddStageConfirm: () => {},
  onAddStageCancel: () => {},
  onReorder: () => {},
};

export const AddingEnvironment: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Static view of the panel with the inline add-environment editor open. The input is keyboard-focused on open; Enter confirms, Escape cancels.',
      },
    },
  },
  args: {
    ...staticEditorArgs,
    addStageValue: 'Staging-EU',
  },
};

export const AddingEnvironmentDuplicate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Error state — the typed value matches an existing stage. The confirm button is disabled and Enter is a no-op.',
      },
    },
  },
  args: {
    ...staticEditorArgs,
    addStageValue: 'QA1',
    addStageMessage: { kind: 'error', text: '"QA1" already exists' },
  },
};

export const AddingEnvironmentSimilar: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Warning state — the typed value is similar to existing stages but not a duplicate. The confirm button stays enabled so the user can proceed if they intend to.',
      },
    },
  },
  args: {
    ...staticEditorArgs,
    addStageValue: 'QA3',
    addStageMessage: {
      kind: 'warning',
      text: 'Similar to "QA1" and "QA2" — still confirm?',
    },
  },
};
