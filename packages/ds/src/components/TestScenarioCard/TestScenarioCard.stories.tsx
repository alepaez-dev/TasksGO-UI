import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  TestScenarioCard,
  type TestScenarioCardProps,
  type TestScenarioStatus,
} from './TestScenarioCard';
import { WaiveScenarioDialog } from '../WaiveScenarioDialog';

const meta: Meta<typeof TestScenarioCard> = {
  title: 'Components/TestScenarioCard',
  component: TestScenarioCard,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof TestScenarioCard>;

function Controlled(props: TestScenarioCardProps) {
  const [open, setOpen] = useState(props.open ?? false);
  const [status, setStatus] = useState<TestScenarioStatus>(props.status);
  const [selectOpen, setSelectOpen] = useState(false);
  const [evidenceExpanded, setEvidenceExpanded] = useState(false);
  const [waiveOpen, setWaiveOpen] = useState(false);
  const [reasonDraft, setReasonDraft] = useState('');
  const [waiveReason, setWaiveReason] = useState(props.waiveReason ?? '');

  const handleStatusChange = (next: TestScenarioStatus) => {
    if (next === 'waived') {
      setSelectOpen(false);
      setReasonDraft('');
      setWaiveOpen(true);
      return;
    }
    setStatus(next);
  };

  return (
    <>
      <TestScenarioCard
        {...props}
        status={status}
        waiveReason={waiveReason}
        open={open}
        onOpenChange={setOpen}
        statusSelectOpen={selectOpen}
        onStatusSelectOpenChange={setSelectOpen}
        onStatusChange={handleStatusChange}
        evidenceExpanded={evidenceExpanded}
        onEvidenceExpandedChange={setEvidenceExpanded}
      />
      <WaiveScenarioDialog
        open={waiveOpen}
        scenarioTitle={props.title}
        reason={reasonDraft}
        onReasonChange={setReasonDraft}
        onCancel={() => setWaiveOpen(false)}
        onConfirm={() => {
          setStatus('waived');
          setWaiveReason(reasonDraft);
          setWaiveOpen(false);
        }}
      />
    </>
  );
}

export const Passed: Story = {
  render: () => (
    <Controlled
      caseId="TC-402"
      title="Verify Cache Hit on /v1/assets"
      status="passed"
      byline="Verified by Sarah K. · 2h ago"
      assigneeInitial="SK"
      assigneeLabel="Sarah K."
      assigneeColor="#6C89A8"
      description="A second request for the same asset within the TTL window is served from the edge cache."
      expected="Response carries `X-Cache: HIT` and TTFB drops below 40ms."
      open
    />
  ),
};

export const Failed: Story = {
  render: () => (
    <Controlled
      caseId="TC-418"
      title="Rate Limit Edge Case"
      status="failed"
      byline="Failed by Mike R. · 3d ago"
      assigneeInitial="MR"
      assigneeLabel="Mike R."
      assigneeColor="#C38E70"
      description="Requests exceeding the burst threshold on `/v1/assets` should return 429."
      steps={[
        'Deploy recent build to `QA-01` environment',
        'Fire 500 rps against `/v1/assets/hot` for 30s',
        'Inspect response headers once burst limit is crossed',
      ]}
      evidence={[
        { label: 'rate_429.png', kind: 'image' },
        { label: 'gateway.log', kind: 'file' },
      ]}
      expected="Gateway returns `429 Too Many Requests` with `Retry-After` and never serves a stale body."
      actual="Stale cached body returned with `200 OK` for ~1.4s after TTL expiry; no `Retry-After` header present."
      open
    />
  ),
};

export const Pending: Story = {
  render: () => (
    <Controlled
      caseId="TC-431"
      title="Browser-side TTL override persistence"
      status="pending"
      byline="Not run yet"
      assigneeInitial="JD"
      assigneeLabel="Jordan D."
      assigneeColor="#7D9B84"
      description="Client TTL override should persist across reloads within the max-age window."
      expected="Override survives a hard reload and is reflected in `Cache-Control`."
      actual="Not run yet."
      open
    />
  ),
};

export const Waived: Story = {
  render: () => (
    <Controlled
      caseId="TC-409"
      title="WebSocket Connection Persistence"
      status="waived"
      byline="Waived by Alex T. · 1d ago"
      assigneeInitial="AT"
      assigneeLabel="Alex T."
      assigneeColor="#856D4A"
      description="Ensure WebSocket connections reconnect after a network interruption of < 500ms without dropping session context."
      waiveReason="Dev confirmed out of scope for this ticket; tracked separately under `ENG-2871`."
      steps={[
        'Deploy recent build to `QA-01` environment',
        'Trigger concurrent updates via `/api/v1/sync` endpoint',
        'Monitor cache TTL expiration logs in Datadog',
        'Observe WebSocket reconnection attempts after simulated network drop',
      ]}
      evidence={[
        { label: 'socket_log.png', kind: 'image' },
        { label: 'thread_dump.txt', kind: 'file' },
        { label: 'screen_01.jpg', kind: 'image' },
        { label: 'console.log', kind: 'file' },
        { label: 'network.har', kind: 'file' },
        { label: 'trace.json', kind: 'file' },
        { label: 'heap.prof', kind: 'file' },
      ]}
      expected="Connection should recover within 2 seconds without session state loss."
      actual="Not run — scenario waived before execution."
      open
    />
  ),
};

export const Collapsed: Story = {
  render: () => (
    <Controlled
      caseId="TC-405"
      title="Cache Invalidation via SNS Topic"
      status="passed"
      byline="Verified by Mike R. · 4h ago"
      assigneeInitial="MR"
      assigneeLabel="Mike R."
      assigneeColor="#C38E70"
      description="An SNS publish purges the matching edge cache keys within 5 seconds."
      expected="Subsequent request is a `MISS` then repopulates."
    />
  ),
};
