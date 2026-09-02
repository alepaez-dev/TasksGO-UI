import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilePreviewOverlay } from './FilePreviewOverlay';
import type { EvidenceItem } from '../../types/evidence';
import {
  CACHE_METRICS,
  CACHE_NOTES,
  EMPTY_ZIP,
  SOCKET_LOG_SHOT,
  svgShot,
  THREAD_DUMP,
} from '../../stories/helpers/evidenceFixtures';

const SCREEN_SHOT = svgShot('#4c5560', 'screen_01.jpg');

const SIX_FILES: readonly EvidenceItem[] = [
  { label: 'socket_log.png', kind: 'image', url: SOCKET_LOG_SHOT },
  { label: 'thread_dump.txt', kind: 'file', text: THREAD_DUMP },
  { label: 'screen_01.jpg', kind: 'image', url: SCREEN_SHOT },
  { label: 'cache_metrics.json', kind: 'file', text: CACHE_METRICS },
  { label: 'notes.md', kind: 'file', text: CACHE_NOTES },
  { label: 'trace.zip', kind: 'file', url: EMPTY_ZIP },
];

const meta: Meta<typeof FilePreviewOverlay> = {
  title: 'Components/FilePreviewOverlay',
  component: FilePreviewOverlay,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    files: { control: false },
    activeIndex: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof FilePreviewOverlay>;

function Controlled({
  files,
  initialIndex = 0,
}: {
  files: readonly EvidenceItem[];
  initialIndex?: number;
}) {
  const [open, setOpen] = useState(true);
  const [index, setIndex] = useState(initialIndex);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open preview
      </button>
      <FilePreviewOverlay
        files={files}
        open={open}
        activeIndex={index}
        onActiveIndexChange={setIndex}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const indexOf = (label: string) =>
  SIX_FILES.findIndex((file) => file.label === label);

export const Default: Story = {
  render: () => <Controlled files={SIX_FILES} />,
};

export const JsonPreview: Story = {
  render: () => (
    <Controlled
      files={SIX_FILES}
      initialIndex={indexOf('cache_metrics.json')}
    />
  ),
};

export const MarkdownPreview: Story = {
  render: () => (
    <Controlled files={SIX_FILES} initialIndex={indexOf('notes.md')} />
  ),
};

export const TextPreview: Story = {
  render: () => (
    <Controlled files={SIX_FILES} initialIndex={indexOf('thread_dump.txt')} />
  ),
};

export const NoPreview: Story = {
  render: () => (
    <Controlled files={SIX_FILES} initialIndex={indexOf('trace.zip')} />
  ),
};

export const SingleFile: Story = {
  render: () => <Controlled files={[SIX_FILES[0]]} />,
};
