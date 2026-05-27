import type { Meta, StoryObj } from '@storybook/react';
import { desktopViewports } from '../../../.storybook/preview';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { FloatingActionBar } from './FloatingActionBar';

const meta: Meta<typeof FloatingActionBar> = {
  title: 'Components/FloatingActionBar',
  component: FloatingActionBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A pill-shaped, fixed-position toolbar that floats near the bottom of the viewport. Holds short, related actions (e.g. "Create task", "Linked tasks") that need to remain reachable while the user scrolls through a long piece of content. Children are rendered horizontally with a thin divider between each pair. Designed for short label sets (1–3 actions); on viewports narrower than the bar\'s natural width the trailing actions clip.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof FloatingActionBar>;

export const Default: Story = {
  parameters: { viewport: { options: desktopViewports } },
  render: () => (
    <FloatingActionBar aria-label="Scratchpad actions">
      <Button variant="ghost" size="sm">
        <Icon name="add" size="sm" />
        Create task
      </Button>
      <Button variant="ghost" size="sm">
        <Icon name="link" size="sm" />
        Linked tasks (2)
      </Button>
    </FloatingActionBar>
  ),
};

export const SingleAction: Story = {
  parameters: { viewport: { options: desktopViewports } },
  render: () => (
    <FloatingActionBar aria-label="Page actions">
      <Button variant="ghost" size="sm">
        <Icon name="add" size="sm" />
        Create task
      </Button>
    </FloatingActionBar>
  ),
};

export const ThreeActions: Story = {
  parameters: { viewport: { options: desktopViewports } },
  render: () => (
    <FloatingActionBar aria-label="Scratchpad actions">
      <Button variant="ghost" size="sm">
        <Icon name="add" size="sm" />
        Create task
      </Button>
      <Button variant="ghost" size="sm">
        <Icon name="link" size="sm" />
        Linked tasks (2)
      </Button>
      <Button variant="ghost" size="sm">
        <Icon name="more_horiz" size="sm" />
        More
      </Button>
    </FloatingActionBar>
  ),
};
