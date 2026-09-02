import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  TestScenarioCard,
  type TestScenarioCardProps,
  type TestScenarioStatus,
  type TestScenarioEvidence,
  type TestScenarioSection,
} from './TestScenarioCard';
import { WaiveScenarioDialog } from '../WaiveScenarioDialog';
import { ReopenPendingDialog } from '../ReopenPendingDialog';
import { FilePreviewOverlay } from '../FilePreviewOverlay';
import {
  CACHE_METRICS,
  CACHE_NOTES,
  EMPTY_ZIP,
  SOCKET_LOG_SHOT,
  svgShot,
  TEXT_LIKE_EVIDENCE,
  THREAD_DUMP,
} from '../../stories/helpers/evidenceFixtures';

const cleoShot = new URL('../../stories/assets/cleo.jpg', import.meta.url).href;

const RATE_429_SHOT = svgShot('#7d3b3b', '429 Too Many Requests');

const GATEWAY_LOG = [
  '12:41:02 WARN  burst threshold crossed (512 rps)',
  '12:41:02 ERROR stale body served for /v1/assets/hot',
  '12:41:03 INFO  Retry-After header missing',
].join('\n');

const ALL_EVIDENCE: readonly TestScenarioEvidence[] = [
  { label: 'socket_log.png', kind: 'image', url: SOCKET_LOG_SHOT },
  { label: 'thread_dump.txt', kind: 'file', text: THREAD_DUMP },
  { label: 'cleo.jpg', kind: 'image', url: cleoShot },
  { label: 'cache_metrics.json', kind: 'file', text: CACHE_METRICS },
  { label: 'notes.md', kind: 'file', text: CACHE_NOTES },
  { label: 'trace.zip', kind: 'file', url: EMPTY_ZIP },
];

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
  const [evidence, setEvidence] = useState<readonly TestScenarioEvidence[]>(
    props.evidence ?? [],
  );
  const [actual, setActual] = useState(props.actual);
  const [waiveOpen, setWaiveOpen] = useState(false);
  const [reasonDraft, setReasonDraft] = useState('');
  const [waiveReason, setWaiveReason] = useState(props.waiveReason ?? '');
  const [reopenOpen, setReopenOpen] = useState(false);
  const [actualDraft, setActualDraft] = useState('');
  const [editingSections, setEditingSections] = useState<
    readonly TestScenarioSection[]
  >(props.editingSections ?? []);
  const [description, setDescription] = useState(props.description);
  const [expected, setExpected] = useState(props.expected);
  const [steps, setSteps] = useState<readonly string[]>(props.steps ?? []);
  const [stepsExpanded, setStepsExpanded] = useState(false);
  const [title, setTitle] = useState(props.title);

  const handleStatusChange = (next: TestScenarioStatus) => {
    if (next === 'waived') {
      setSelectOpen(false);
      setReasonDraft('');
      setWaiveOpen(true);
      return;
    }
    if (next === 'pending' && (status === 'passed' || status === 'waived')) {
      setSelectOpen(false);
      setActualDraft('');
      setReopenOpen(true);
      return;
    }
    setStatus(next);
  };

  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const handleAddEvidence = (files: readonly File[]) => {
    void Promise.all(
      files.map(async (file): Promise<TestScenarioEvidence> => {
        const item: TestScenarioEvidence = {
          label: file.name,
          kind: file.type.startsWith('image/') ? 'image' : 'file',
          url: URL.createObjectURL(file),
        };
        if (
          file.type.startsWith('text/') ||
          TEXT_LIKE_EVIDENCE.test(file.name)
        ) {
          return { ...item, text: await file.text() };
        }
        return item;
      }),
    ).then((items) => {
      const room =
        props.maxEvidence != null
          ? Math.max(0, props.maxEvidence - evidence.length)
          : items.length;
      items.slice(room).forEach((dropped) => {
        if (dropped.url?.startsWith('blob:')) URL.revokeObjectURL(dropped.url);
      });
      const accepted = items.slice(0, room);
      if (accepted.length > 0) setEvidence((prev) => [...prev, ...accepted]);
    });
  };

  const handleRemoveEvidence = (index: number) => {
    const removed = evidence[index];
    if (removed?.url?.startsWith('blob:')) URL.revokeObjectURL(removed.url);
    setEvidence((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <TestScenarioCard
        {...props}
        title={title}
        status={status}
        waiveReason={waiveReason}
        actual={actual}
        description={description}
        expected={expected}
        steps={steps}
        evidence={evidence}
        open={open}
        onOpenChange={setOpen}
        statusSelectOpen={selectOpen}
        onStatusSelectOpenChange={setSelectOpen}
        onStatusChange={handleStatusChange}
        evidenceExpanded={evidenceExpanded}
        onEvidenceExpandedChange={setEvidenceExpanded}
        onAddEvidence={handleAddEvidence}
        onRemoveEvidence={handleRemoveEvidence}
        onOpenEvidence={setPreviewIndex}
        maxEvidence={props.maxEvidence}
        addEvidenceDisabled={
          props.maxEvidence != null && evidence.length >= props.maxEvidence
        }
        editingSections={editingSections}
        onEditingSectionsChange={setEditingSections}
        onTitleChange={setTitle}
        onWaiveReasonChange={setWaiveReason}
        onDescriptionChange={setDescription}
        onExpectedChange={setExpected}
        onActualChange={setActual}
        onStepsChange={setSteps}
        stepsExpanded={stepsExpanded}
        onStepsExpandedChange={setStepsExpanded}
      />
      <WaiveScenarioDialog
        open={waiveOpen}
        scenarioTitle={title}
        reason={reasonDraft}
        onReasonChange={setReasonDraft}
        onCancel={() => setWaiveOpen(false)}
        onConfirm={() => {
          setStatus('waived');
          setWaiveReason(reasonDraft);
          setWaiveOpen(false);
        }}
      />
      <ReopenPendingDialog
        open={reopenOpen}
        scenarioTitle={title}
        actualResult={actualDraft}
        onActualResultChange={setActualDraft}
        actualResultPlaceholder={actual}
        onCancel={() => setReopenOpen(false)}
        onConfirm={() => {
          setStatus('pending');
          setActual(actualDraft);
          setReopenOpen(false);
        }}
      />
      <FilePreviewOverlay
        files={evidence}
        open={previewIndex != null}
        activeIndex={previewIndex ?? 0}
        onActiveIndexChange={setPreviewIndex}
        onClose={() => setPreviewIndex(null)}
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
      assigneeColor="var(--ds-color-avatar-tone-profile-steel)"
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
      assigneeColor="var(--ds-color-avatar-tone-profile-tan)"
      description="Requests exceeding the burst threshold on `/v1/assets` should return 429."
      steps={[
        'Deploy recent build to `QA-01` environment',
        'Fire 500 rps against `/v1/assets/hot` for 30s',
        'Inspect response headers once burst limit is crossed',
      ]}
      evidence={[
        { label: 'rate_429.png', kind: 'image', url: RATE_429_SHOT },
        { label: 'gateway.log', kind: 'file', text: GATEWAY_LOG },
      ]}
      expected="Gateway returns `429 Too Many Requests` with `Retry-After` and never serves a stale body."
      actual="Stale cached body returned with `200 OK` for ~1.4s after TTL expiry; no `Retry-After` header present."
      open
    />
  ),
};

export const AllEvidenceTypes: Story = {
  render: () => (
    <Controlled
      caseId="TC-409"
      title="WebSocket Connection Persistence"
      status="failed"
      byline="Failed by Jordan D. · 5m ago"
      assigneeInitial="JD"
      assigneeLabel="Jordan D."
      assigneeColor="var(--ds-color-avatar-tone-profile-sage)"
      description="WebSocket connections automatically reconnect after a network interruption of < 500ms without dropping session context."
      steps={[
        'Deploy recent build to `QA-01` environment',
        'Trigger concurrent updates via `/api/v1/sync` endpoint',
        'Monitor cache TTL expiration logs in Datadog',
      ]}
      evidence={ALL_EVIDENCE}
      maxEvidence={6}
      expected="Connection re-established within 500ms with the original session context intact."
      actual="Session context dropped on reconnect; client forced to re-authenticate."
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
      assigneeColor="var(--ds-color-avatar-tone-profile-sage)"
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
      byline="Waived by Ale P. · 1d ago"
      assigneeInitial="AP"
      assigneeLabel="Ale P."
      assigneeColor="var(--ds-color-avatar-tone-profile-plum)"
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
      ]}
      maxEvidence={6}
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
      assigneeColor="var(--ds-color-avatar-tone-profile-tan)"
      description="An SNS publish purges the matching edge cache keys within 5 seconds."
      expected="Subsequent request is a `MISS` then repopulates."
    />
  ),
};

export const ConnectedList: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--ds-color-border-default)',
        borderRadius: 'var(--ds-radius-xl)',
        backgroundColor: 'var(--ds-color-surface-primary)',
      }}
    >
      <Controlled
        position="first"
        caseId="TC-402"
        title="Verify Cache Hit on /v1/assets"
        status="passed"
        byline="Verified by Sarah K. · 2h ago"
        assigneeInitial="SK"
        assigneeLabel="Sarah K."
        description="A second request within the TTL window is served from the edge cache."
        expected="Response carries `X-Cache: HIT`."
      />
      <Controlled
        position="middle"
        caseId="TC-418"
        title="Rate Limit Edge Case"
        status="failed"
        byline="Failed by Mike R. · 3d ago"
        assigneeInitial="MR"
        assigneeLabel="Mike R."
        description="Requests exceeding the burst threshold should return 429."
        expected="Gateway returns `429 Too Many Requests`."
        actual="Stale cached body returned with `200 OK`."
        open
      />
      <Controlled
        position="last"
        caseId="TC-431"
        title="Browser-side TTL override persistence"
        status="pending"
        byline="Not run yet"
        assigneeInitial="JD"
        assigneeLabel="Jordan D."
        description="Client TTL override should persist across reloads."
        expected="Override survives a hard reload."
      />
    </div>
  ),
};

export const Editing: Story = {
  render: () => (
    <Controlled
      caseId="TC-409"
      title="WebSocket Connection Persistence"
      status="waived"
      byline="Waived by Ale P. · 1d ago"
      assigneeInitial="AP"
      assigneeLabel="Ale P."
      assigneeColor="var(--ds-color-avatar-tone-profile-plum)"
      description="Ensure WebSocket connections reconnect after a network interruption."
      waiveReason="Dev confirmed out of scope for this ticket; tracked under `ENG-2871`."
      steps={[
        'Deploy recent build to `QA-01` environment',
        'Trigger concurrent updates via `/api/v1/sync`',
      ]}
      expected="Connection should recover within 2 seconds without session state loss."
      actual="Not run — scenario waived before execution."
      editingSections={[
        'title',
        'waiveReason',
        'description',
        'steps',
        'expected',
        'actual',
      ]}
      open
    />
  ),
};
