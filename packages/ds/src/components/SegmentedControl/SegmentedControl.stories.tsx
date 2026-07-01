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
          'A controlled pill toggle for switching between two views of the same content (e.g. Write/Preview). Built on the WAI-ARIA tablist pattern with roving tabindex and arrow-key navigation. Pair it with tabpanels via `idPrefix` + `getSegmentPanelId`.',
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
