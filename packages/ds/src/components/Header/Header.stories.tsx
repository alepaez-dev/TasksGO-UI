import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { withDefaultViewport } from '../../../.storybook/decorators';
import {
  desktopViewports,
  mobileViewportOptions,
} from '../../../.storybook/preview';
import { Header } from './Header';
import { Breadcrumb } from '../Breadcrumb';
import { SearchInput } from '../SearchInput';
import {
  SearchPalette,
  getSearchPaletteOptionId,
  type SearchPaletteGroup,
} from '../SearchPalette';
import { FloatingSearch } from '../FloatingSearch';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Icon } from '../Icon';

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
            aria-activedescendant={
              activeId
                ? getSearchPaletteOptionId('search-palette', activeId)
                : undefined
            }
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
      right={
        <>
          <Button size="sm">
            <Icon name="add" size="sm" />
            New task
          </Button>
          <Avatar initial="AD" variant="profile" aria-label="Alejandra D" />
        </>
      }
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
  parameters: { viewport: { options: desktopViewports } },
};

export const LeftOnly: Story = {
  parameters: { viewport: { options: desktopViewports } },
  args: {
    left: (
      <Breadcrumb
        segments={[
          { label: 'Tasks', href: '/tasks' },
          { label: 'Calm Execution' },
        ]}
      />
    ),
    right: (
      <>
        <Button size="sm">
          <Icon name="add" size="sm" />
          New task
        </Button>
        <Avatar
          initial="AH"
          variant="profile"
          aria-label="Alejandra Hernandez"
        />
      </>
    ),
  },
};

function MobileRender() {
  const [query, setQuery] = useState('');

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header
        compact
        left={
          // TODO: replace with ghost Button variant when available
          <button
            aria-label="Menu"
            style={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: -8,
              borderRadius: '9999px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ds-color-text-primary)',
            }}
          >
            <Icon name="menu" size="md" />
          </button>
        }
        center="Project / Infrastructure"
        right={
          <>
            <Button size="sm" aria-label="New task">
              <Icon name="add" size="sm" />
            </Button>
            <Avatar initial="AD" variant="profile" aria-label="Alejandra D" />
          </>
        }
      />
      <FloatingSearch
        placeholder="Search tasks or commands..."
        shortcutHint="⌘K"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}

export const Mobile: Story = {
  render: () => <MobileRender />,
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions,
    },
  },
};
