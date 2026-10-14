import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ActivityComposer,
  type ActivityComposerMode,
  type ActivityComposerAttachment,
} from './ActivityComposer';
import { useMarkdownEditor } from '../../hooks/useMarkdownEditor';
import { JORDAN } from '../../utils/activity/testFixtures';

interface StatefulComposerProps {
  initialValue?: string;
  initialMode?: ActivityComposerMode;
  withAttach?: boolean;
  submitting?: boolean;
  uploadingDemo?: boolean;
}

const StatefulComposer = ({
  initialValue = '',
  initialMode = 'comment',
  withAttach = false,
  submitting = false,
  uploadingDemo = false,
}: StatefulComposerProps) => {
  const [value, setValue] = useState(initialValue);
  const [mode, setMode] = useState<ActivityComposerMode>(initialMode);
  const [posted, setPosted] = useState<readonly string[]>([]);
  const [attachments, setAttachments] = useState<
    readonly ActivityComposerAttachment[]
  >(
    uploadingDemo
      ? [
          { id: 'u1', name: 'k6-p95-latency.png', kind: 'image' },
          {
            id: 'u2',
            name: 'k6-staging-run-0412.csv',
            kind: 'file',
            uploadFraction: 0.64,
          },
        ]
      : [],
  );
  const { textareaRef, applyAction } = useMarkdownEditor({ value, setValue });

  return (
    <div style={{ maxWidth: 720, display: 'grid', gap: 16 }}>
      <ActivityComposer
        actor={JORDAN}
        mode={mode}
        value={value}
        textareaRef={textareaRef}
        onModeChange={setMode}
        onChange={setValue}
        onAction={applyAction}
        attachments={attachments}
        onAttach={
          withAttach || uploadingDemo
            ? (files) =>
                setAttachments((all) => [
                  ...all,
                  ...files.map((file) => ({
                    id: `${file.name}-${all.length}`,
                    name: file.name,
                    kind: file.type.startsWith('image/')
                      ? ('image' as const)
                      : ('file' as const),
                  })),
                ])
            : undefined
        }
        onRemoveAttachment={(id) =>
          setAttachments((all) => all.filter((entry) => entry.id !== id))
        }
        submitting={submitting}
        onSubmit={() => {
          setPosted((all) => [...all, `${mode}: ${value}`]);
          setValue('');
        }}
      />
      {posted.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, opacity: 0.7 }}>
          {posted.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const meta = {
  title: 'Components/ActivityComposer',
  component: ActivityComposer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The box at the foot of the activity feed for posting a comment or an ask. Stateless and fully controlled — the draft, the mode and the submitting flag belong to the caller, which supplies `textareaRef` and `onAction` from the `useMarkdownEditor` hook (as these stories do). The mode switch is a radio group, so arrow keys move and select. Submitting is blocked while the draft is blank, by the button and by ⌘↵ alike. Pass `onAttach` to offer the attach button.',
      },
    },
  },
} satisfies Meta<typeof ActivityComposer>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <StatefulComposer />,
  parameters: {
    docs: {
      description: {
        story:
          'Type to enable the submit button; the toolbar and ⌘↵ work. Posting clears the draft and lists what was sent.',
      },
    },
  },
};

export const WithDraft: Story = {
  render: () => (
    <StatefulComposer initialValue="Looking into the **edge-caching** strategy now." />
  ),
};

export const AskMode: Story = {
  render: () => (
    <StatefulComposer
      initialMode="ask"
      initialValue="What TTL are we defaulting to for `/v1/assets`?"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Ask tints the active tab and the submit button, and the button reads Ask.',
      },
    },
  },
};

export const WithAttach: Story = {
  render: () => (
    <StatefulComposer initialValue="See the trace attached." withAttach />
  ),
};

export const Submitting: Story = {
  render: () => (
    <StatefulComposer initialValue="Posting this one…" submitting />
  ),
  parameters: {
    docs: {
      description: {
        story: 'While submitting, both the button and ⌘↵ are blocked.',
      },
    },
  },
};

export const Uploading: Story = {
  render: () => (
    <StatefulComposer initialValue="Trace attached." uploadingDemo />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A file still uploading dims, shows its percentage and draws a progress bar.',
      },
    },
  },
};
