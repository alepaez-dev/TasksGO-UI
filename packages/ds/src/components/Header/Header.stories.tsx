import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';
import { Breadcrumb } from '../Breadcrumb';
import { SearchInput } from '../SearchInput';
import { SearchPalette, type SearchPaletteGroup } from '../SearchPalette';
import { Avatar } from '../Avatar';

const allResults: SearchPaletteGroup[] = [
  {
    title: 'Jump to Task',
    results: [
      {
        id: 'r1',
        label: 'Update login flow',
        refId: 'TSK-042',
        type: 'task',
      },
      {
        id: 'r2',
        label: 'Fix auth token expiry',
        refId: 'TSK-041',
        type: 'task',
      },
    ],
  },
  {
    title: 'Jump to Ticket',
    results: [
      {
        id: 'r3',
        label: 'Login timeout on slow networks',
        refId: 'TKT-15',
        type: 'ticket',
      },
    ],
  },
  {
    title: 'Jump to Doc',
    results: [
      {
        id: 'r4',
        label: 'Authentication guide',
        refId: 'DOC-7',
        type: 'doc',
      },
    ],
  },
];

function filterGroups(query: string): SearchPaletteGroup[] {
  const q = query.toLowerCase();
  return allResults
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

function DefaultRender() {
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | undefined>();
  const groups = query.length > 0 ? filterGroups(query) : [];

  return (
    <Header
      left={
        <Breadcrumb
          segments={[
            { label: 'Tasks', href: '/tasks' },
            { label: 'Calm Execution' },
          ]}
        />
      }
      center={
        <>
          <SearchInput
            role="combobox"
            placeholder="Search or command..."
            shortcutHint="⌘K"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveId(undefined);
            }}
            aria-expanded={groups.length > 0}
            aria-controls={groups.length > 0 ? 'search-palette' : undefined}
            aria-activedescendant={activeId}
          />
          {groups.length > 0 && (
            <SearchPalette
              id="search-palette"
              groups={groups}
              activeResultId={activeId}
              onResultSelect={(result) => {
                setActiveId(result.id);
                setQuery(result.label);
              }}
              aria-label="Search results"
            />
          )}
        </>
      }
      right={<Avatar initial="AD" aria-label="Alejandra D" />}
    />
  );
}

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  render: () => <DefaultRender />,
};

export const WithoutSearch: Story = {
  args: {
    left: (
      <Breadcrumb
        segments={[
          { label: 'Tasks', href: '/tasks' },
          { label: 'Calm Execution' },
        ]}
      />
    ),
    right: <Avatar initial="AD" aria-label="Alejandra D" />,
  },
};
