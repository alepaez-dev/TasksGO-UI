import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from './Popover';
import { Button } from '../Button';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A portal-rendered floating surface anchored to a consumer-provided ref. Non-modal — no backdrop, focus is moved into the popover on open and returned to the previously focused element on close. Dismissible via Escape or click outside (clicks on the anchor are ignored — the anchor handles its own toggling). Set `manageFocus={false}` for hover-triggered surfaces (e.g. a hover card) so the popover does not steal focus from whatever the user is interacting with.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '64px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Popover>;

function BasicTrigger({
  placement,
}: {
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button ref={anchorRef} onClick={() => setOpen((o) => !o)}>
        Toggle popover
      </Button>
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchorRef={anchorRef}
        placement={placement}
        aria-label="Demo popover"
      >
        <div
          style={{
            padding: 'var(--ds-space-scale-md)',
            minWidth: '240px',
          }}
        >
          <p style={{ margin: 0 }}>Popover content goes here.</p>
        </div>
      </Popover>
    </>
  );
}

function OpenRender() {
  const anchorRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={anchorRef}>Anchor</Button>
      <Popover
        open
        onOpenChange={() => {}}
        anchorRef={anchorRef}
        placement="bottom-start"
        aria-label="Demo popover"
      >
        <div
          style={{
            padding: 'var(--ds-space-scale-md)',
            minWidth: '240px',
          }}
        >
          <p style={{ margin: 0 }}>Popover content goes here.</p>
        </div>
      </Popover>
    </>
  );
}

function HoverTrigger() {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        ref={anchorRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        Hover me
      </Button>
      <Popover
        open={open}
        onOpenChange={setOpen}
        anchorRef={anchorRef}
        manageFocus={false}
        aria-label="Hover card"
      >
        <div style={{ padding: 'var(--ds-space-scale-md)', minWidth: '240px' }}>
          <p style={{ margin: 0 }}>
            This card appears on hover and does not steal focus.
          </p>
        </div>
      </Popover>
    </>
  );
}

export const Open: Story = {
  render: () => <OpenRender />,
};

export const BottomStart: Story = {
  render: () => <BasicTrigger placement="bottom-start" />,
};

export const WithoutFocusManagement: Story = {
  render: () => <HoverTrigger />,
};

export const BottomEnd: Story = {
  render: () => <BasicTrigger placement="bottom-end" />,
};

export const TopStart: Story = {
  render: () => (
    <div style={{ marginTop: '300px' }}>
      <BasicTrigger placement="top-start" />
    </div>
  ),
};

export const TopEnd: Story = {
  render: () => (
    <div style={{ marginTop: '300px' }}>
      <BasicTrigger placement="top-end" />
    </div>
  ),
};
