import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MarkdownEditor, type MarkdownEditorStatus } from './MarkdownEditor';
import { Markdown } from '../Markdown';
import { useMarkdownEditor } from '../../hooks/useMarkdownEditor';
import styles from './MarkdownEditor.stories.module.css';

const VADER =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Star_Wars_-_Darth_Vader.jpg/500px-Star_Wars_-_Darth_Vader.jpg';

const sampleDoc = [
  '## Description',
  '',
  'Introduce a caching layer at the edge for read-heavy routes, staged behind `edge_cache_v1`.',
  '',
  '## Why',
  '',
  '- Lower TTFB in AP-South-1',
  '- Reduce database CPU during sync windows',
  '',
  '```scope',
  'included:',
  '- GET /v1/assets/*',
  '- GET /v1/metadata/*',
  'excluded:',
  '- WebSocket streams',
  '```',
  '',
  '## Reference',
  '',
  `![Lord Vader](${VADER})`,
].join('\n');

interface StatefulEditorProps {
  initialValue?: string;
  uploadsVader?: boolean;
  status?: MarkdownEditorStatus;
  withPreview?: boolean;
}

const StatefulEditor = ({
  initialValue = '',
  uploadsVader = false,
  status,
  withPreview = false,
}: StatefulEditorProps) => {
  const [value, setValue] = useState(initialValue);
  const onImageUpload = uploadsVader
    ? () =>
        new Promise<string>((resolve) => setTimeout(() => resolve(VADER), 700))
    : undefined;
  const { wordCount, isUploading, textareaRef, applyAction, insertImageFiles } =
    useMarkdownEditor({ value, setValue, onImageUpload });

  const editor = (
    <div className={styles.frame}>
      <MarkdownEditor
        value={value}
        onChange={setValue}
        textareaRef={textareaRef}
        onAction={applyAction}
        wordCount={wordCount}
        status={status}
        isUploading={isUploading}
        onInsertImageFiles={onImageUpload ? insertImageFiles : undefined}
      />
    </div>
  );

  if (!withPreview) return <div className={styles.single}>{editor}</div>;

  return (
    <div className={styles.split}>
      {editor}
      <div className={styles.previewPane}>
        <div className={styles.previewLabel}>Preview</div>
        <Markdown source={value} />
      </div>
    </div>
  );
};

const meta = {
  title: 'Components/MarkdownEditor',
  component: MarkdownEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Freeform markdown editor surface: a formatting toolbar with a live word count and an auto-growing textarea. Chromeless by design — the consumer frames it (here, a bordered card). An optional `header` slot renders above the toolbar and stays pinned with it (sticky) while the editor is focused. Stateless and fully controlled via the `useMarkdownEditor` hook. It edits raw markdown only — the rendered "preview" is the separate `<Markdown>` component (see the **With Live Preview** story). Images are inserted via the toolbar (file picker), drag-drop, or paste; the consumer supplies `onImageUpload` to turn a file into a hosted URL (the Storybook mock resolves to a fixed image).',
      },
    },
  },
} satisfies Meta<typeof MarkdownEditor>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <StatefulEditor initialValue={sampleDoc} />,
};

export const Empty: Story = {
  render: () => <StatefulEditor />,
};

export const WithImageUpload: Story = {
  render: () => <StatefulEditor uploadsVader status="saved" />,
  parameters: {
    docs: {
      description: {
        story:
          'Click the image button (or drag-drop / paste a file): the editor inserts an "Uploading…" placeholder, calls the consumer `onImageUpload`, and swaps in the returned URL. This mock always resolves to Lord Vader. The textarea shows the raw `![alt](url)` markdown — to see it rendered as an image, see **With Live Preview**.',
      },
    },
  },
};

export const WithLivePreview: Story = {
  render: () => (
    <StatefulEditor initialValue={sampleDoc} uploadsVader withPreview />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The two markdown components composed the way a consumer pairs them: `MarkdownEditor` edits the raw string on the left, `<Markdown>` renders the same string on the right. Edit the text or insert an image and the preview updates live — markdown images render as real images (the sample includes one).',
      },
    },
  },
};
