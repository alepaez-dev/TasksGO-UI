import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EditableMarkdown } from './EditableMarkdown';
import { useMarkdownEditor } from '../../hooks/useMarkdownEditor';

const SAMPLE = [
  '## Description',
  '',
  'We need to introduce a caching layer at the edge for read-heavy routes.',
  '',
  '## Why',
  '',
  '- Faster TTFB for global users',
  '- Lower database load during sync windows',
].join('\n');

const uploadImage = (file: File) => Promise.resolve(URL.createObjectURL(file));

function Demo({ startEditing = false }: { startEditing?: boolean }) {
  const [editing, setEditing] = useState(startEditing);
  const [value, setValue] = useState(SAMPLE);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const snapshot = useRef(value);
  const { wordCount, isUploading, textareaRef, applyAction, insertImageFiles } =
    useMarkdownEditor({ value, setValue, onImageUpload: uploadImage });

  return (
    <div style={{ maxWidth: 640 }}>
      <EditableMarkdown
        editing={editing}
        value={value}
        onChange={setValue}
        onRequestEdit={() => {
          snapshot.current = value;
          setEditing(true);
        }}
        onCancel={() => {
          setValue(snapshot.current);
          setEditing(false);
        }}
        onSave={() => setEditing(false)}
        textareaRef={textareaRef}
        editButtonRef={editButtonRef}
        onAction={applyAction}
        wordCount={wordCount}
        isUploading={isUploading}
        onInsertImageFiles={insertImageFiles}
        editLabel="Edit description"
      />
    </div>
  );
}

const meta: Meta<typeof EditableMarkdown> = {
  title: 'Components/EditableMarkdown',
  component: EditableMarkdown,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof EditableMarkdown>;

export const Default: Story = { render: () => <Demo /> };
export const Editing: Story = { render: () => <Demo startEditing /> };
