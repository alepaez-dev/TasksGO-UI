import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { HighlightedText } from './HighlightedText';
import { Badge } from '../Badge';
import { TimelineEvent } from '../TimelineEvent';
import { TimelineGroup } from '../TimelineGroup';

const QUERY = 'needs';

const meta = {
  title: 'Components/HighlightedText',
  component: HighlightedText,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Marks every whitespace-separated term of `query` wherever it appears in `text`, ignoring case. Query characters match literally, so `c++` marks `C++` and `a.b` does not match `axb`. Takes `text` as a string and returns a fragment, so it drops inline into a sentence, a `Badge` or a row. The mark inherits font family, size and weight from its container, and sets its own background and text colour. Term splitting is shared with the activity filter; that filter matches across every field of a row at once while this component sees one string, so wrap every field you display.',
      },
    },
  },
  argTypes: {
    text: { control: 'text' },
    query: { control: 'text' },
  },
  args: {
    text: 'Jordan D. added label needs-qa',
    query: 'jordan',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 620,
          fontFamily: 'var(--ds-font-family-sans)',
          fontSize: 'var(--ds-text-timeline-event-font-size)',
          color: 'var(--ds-color-text-secondary)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HighlightedText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MultipleTerms: Story = {
  args: { text: 'Build #1847 passed on QA-01', query: 'qa build' },
};

export const PartOfAWord: Story = {
  args: { text: 'needs-qa', query: 'needs' },
  parameters: {
    docs: {
      description: {
        story:
          'Matching is substring, not word-boundary, so only the matched run of a label is marked.',
      },
    },
  },
};

export const SpecialCharacters: Story = {
  args: { text: 'use C++ or a.b here', query: 'c++' },
  parameters: {
    docs: {
      description: {
        story: '`c++` marks `C++`; `a.b` does not match `axb`.',
      },
    },
  },
};

export const NoMatch: Story = {
  args: { text: 'Alex M. assigned this ticket', query: 'jordan' },
};

export const InABadge: Story = {
  render: (args) => (
    <Badge variant="progress">
      <HighlightedText {...args} />
    </Badge>
  ),
  args: { text: 'needs-qa', query: 'needs' },
};

function SearchResultsFeed() {
  const [open, setOpen] = useState(true);
  return (
    <ul
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 24,
        background: 'var(--ds-color-surface-secondary)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-timeline-event-row-gap)',
      }}
    >
      <TimelineGroup
        count={2}
        summary={
          <>
            <b>Jordan D.</b> performed 2 updates
          </>
        }
        meta="· labels, sprint · 1d 2h ago"
        matchLabel="1 of 2 match"
        open={open}
        onOpenChange={setOpen}
      >
        <TimelineEvent
          variant="nested"
          icon="tag"
          timestamp="1d 2h ago"
          onPin={() => {}}
        >
          added label{' '}
          <Badge variant="progress">
            <HighlightedText text="needs-qa" query={QUERY} />
          </Badge>
        </TimelineEvent>
      </TimelineGroup>
      <TimelineEvent icon="science" timestamp="40m ago" onPin={() => {}}>
        <b>Mike R.</b> asked{' '}
        <HighlightedText
          text="What TTL are we defaulting to? QA needs a number."
          query={QUERY}
        />
      </TimelineEvent>
    </ul>
  );
}

export const InSearchResults: Story = {
  render: () => <SearchResultsFeed />,
  parameters: {
    docs: {
      description: {
        story:
          'A search for "needs" across an expanded run and a standalone event, with the match count and a Pin on every hit.',
      },
    },
  },
};
