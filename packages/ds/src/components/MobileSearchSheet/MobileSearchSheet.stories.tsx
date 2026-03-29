import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { withDefaultViewport } from '../../../.storybook/decorators';
import { mobileViewportOptions } from '../../../.storybook/preview';
import { MobileSearchSheet } from './MobileSearchSheet';
import { FloatingSearch } from '../FloatingSearch';
import type { SearchPaletteGroup } from '../SearchPalette';

const allGroups: SearchPaletteGroup[] = [
  {
    title: 'Jump to Task',
    results: [
      {
        id: 'r1',
        label: 'Refactor Kubernetes service discovery',
        refId: 'T-104',
        type: 'task',
      },
      {
        id: 'r2',
        label: 'Implement Redis cache for metadata',
        refId: 'T-42',
        type: 'task',
      },
    ],
  },
  {
    title: 'Jump to Ticket',
    results: [
      {
        id: 'r3',
        label: 'Audit IAM permissions for staging',
        refId: 'ENG-902',
        type: 'ticket',
      },
    ],
  },
  {
    title: 'Jump to Doc',
    results: [
      {
        id: 'r4',
        label: 'Architecture Overview',
        refId: 'architecture.md',
        type: 'doc',
      },
      {
        id: 'r5',
        label: 'Onboarding Guide',
        refId: 'setup.md',
        type: 'doc',
      },
    ],
  },
];

function filterGroups(query: string): SearchPaletteGroup[] {
  const q = query.toLowerCase();
  return allGroups
    .map((group) => ({
      ...group,
      results: group.results.filter(
        (r) =>
          r.label.toLowerCase().includes(q) ||
          r.refId.toLowerCase().includes(q),
      ),
    }))
    .filter((group) => group.results.length > 0);
}

const meta: Meta<typeof MobileSearchSheet> = {
  title: 'Components/MobileSearchSheet',
  component: MobileSearchSheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof MobileSearchSheet>;

function DefaultRender() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const groups = query.length > 0 ? filterGroups(query) : allGroups;

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <FloatingSearch
        placeholder="Search tasks or commands..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      <MobileSearchSheet
        open={open}
        onClose={() => setOpen(false)}
        groups={groups}
        emptyState="No results found"
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultRender />,
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions,
    },
  },
};
