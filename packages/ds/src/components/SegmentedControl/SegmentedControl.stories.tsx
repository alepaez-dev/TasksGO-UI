import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SegmentedControl,
  type SegmentedControlOption,
  type SegmentedControlProps,
} from './SegmentedControl';

const writePreview: readonly SegmentedControlOption[] = [
  { value: 'write', label: 'Write' },
  { value: 'preview', label: 'Preview' },
];

const Controlled = (args: SegmentedControlProps) => {
  const [value, setValue] = useState(args.value);
  return <SegmentedControl {...args} value={value} onValueChange={setValue} />;
};

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    variant: {
      control: 'inline-radio',
      options: ['toggle', 'filter', 'filter-compact'],
    },
    value: { control: false },
    onValueChange: { control: false },
  },
  args: {
    options: writePreview,
    value: 'write',
    size: 'md',
    onValueChange: () => {},
    'aria-label': 'Editor mode',
  },
  parameters: {
    docs: {
      description: {
        component:
          'A controlled pill toggle for switching between two views of the same content (e.g. Write/Preview). Built on the WAI-ARIA tablist pattern with roving tabindex and arrow-key navigation. Pair it with tabpanels via `idPrefix` + `getSegmentPanelId`. The `filter` variant restyles it for a filter bar — sentence-case labels, an optional `count` per option, and one fixed height. The `filter-compact` variant is that same filter sized for a narrow screen — separate bordered chips that scroll horizontally instead of sitting on one track (`size` applies to the `toggle` variant only).',
      },
    },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
};

export const PreviewActive: Story = {
  args: { value: 'preview' },
  render: (args) => <Controlled {...args} />,
};

export const Small: Story = {
  args: { size: 'sm' },
  render: (args) => <Controlled {...args} />,
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'write', label: 'Write' },
      { value: 'preview', label: 'Preview', disabled: true },
    ],
  },
  render: (args) => <Controlled {...args} />,
};

export const ActivityFilter: Story = {
  args: {
    variant: 'filter',
    value: 'all',
    'aria-label': 'Filter activity',
    options: [
      { value: 'all', label: 'All', count: 28 },
      { value: 'comments', label: 'Comments & Asks', count: 4 },
      { value: 'system', label: 'System', count: 24 },
    ],
  },
  render: (args) => <Controlled {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'The `filter` variant: sentence-case labels with a count per segment. Counts are plain text inside the button, so a segment announces as "All 28".',
      },
    },
  },
};

export const EmptyCounts: Story = {
  args: {
    variant: 'filter',
    value: 'all',
    'aria-label': 'Filter activity',
    options: [
      { value: 'all', label: 'All', count: 0 },
      { value: 'comments', label: 'Comments & Asks', count: 0 },
      { value: 'system', label: 'System', count: 0 },
    ],
  },
  render: (args) => <Controlled {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'A zero shows as `0` and stays selectable — choosing an empty filter is how a consumer reaches its empty state.',
      },
    },
  },
};

export const ActivityChips: Story = {
  args: {
    variant: 'filter-compact',
    value: 'all',
    'aria-label': 'Filter activity',
    options: [
      { value: 'all', label: 'All', count: 28 },
      { value: 'comments', label: 'Comments', count: 4 },
      { value: 'system', label: 'System', count: 24 },
    ],
  },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Controlled {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The mobile filter row — the same filter as `filter`, not a different control: same tablist semantics, same counts, same single selection. Each chip carries its own border instead of sitting on a shared track, the selection inverts to a solid fill, and the row scrolls horizontally with a fade when the chips outrun the screen.',
      },
    },
  },
};
