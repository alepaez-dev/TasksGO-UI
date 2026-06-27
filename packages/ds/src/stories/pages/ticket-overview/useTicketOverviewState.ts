import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type {
  AddStageMessage,
  PipelineHierarchyStage,
} from '../../../components/PipelineHierarchyPanel';
import {
  useSelectorGroup,
  useSelectorState,
  type UseSelectorStateReturn,
  type SelectorGroupEntry,
} from '../../../hooks/useSelector';
import { toStageValue } from '../../../utils/toStageValue';
import { ticket } from './shared';
import { serializeTicketBody } from './serializeTicketBody';

export type BodyMode = 'template' | 'freeform';

const BRANCH_COPIED_FLASH_MS = 2000;

function getAddStageMessage(
  draft: string,
  stages: readonly PipelineHierarchyStage[],
): AddStageMessage | undefined {
  const trimmed = draft.trim();
  if (trimmed.length === 0) return undefined;
  const draftValue = toStageValue(trimmed);
  if (draftValue === '') {
    return {
      kind: 'error',
      text: 'Stage name must include a letter or number',
    };
  }
  const exact = stages.find(
    (stage) =>
      stage.value === draftValue ||
      stage.label.toLowerCase() === trimmed.toLowerCase(),
  );
  if (exact) {
    return { kind: 'error', text: `"${exact.label}" already exists` };
  }
  const lower = trimmed.toLowerCase();
  const similar = stages.filter((stage) => {
    const other = stage.label.toLowerCase();
    return (
      lower.length >= 2 && (other.startsWith(lower) || lower.startsWith(other))
    );
  });
  if (similar.length > 0) {
    const list = similar.map((s) => `"${s.label}"`).join(' and ');
    return {
      kind: 'warning',
      text: `Similar to ${list} — still confirm?`,
    };
  }
  return undefined;
}

export interface UseTicketOverviewState {
  project: string;
  setProject: (value: string) => void;
  projectSelector: UseSelectorStateReturn;
  activeNav: string;
  setActiveNav: (id: string) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  body: string;
  setBody: Dispatch<SetStateAction<string>>;
  bodyMode: BodyMode;
  setBodyMode: Dispatch<SetStateAction<BodyMode>>;
  assignee: string;
  setAssignee: (value: string) => void;
  assigneeSelector: SelectorGroupEntry;
  reporter: string;
  setReporter: (value: string) => void;
  reporterSelector: SelectorGroupEntry;
  status: string;
  setStatus: (value: string) => void;
  statusSelector: SelectorGroupEntry;
  priority: string;
  setPriority: (value: string) => void;
  prioritySelector: SelectorGroupEntry;
  pipelineStages: readonly PipelineHierarchyStage[];
  setPipelineStages: (stages: readonly PipelineHierarchyStage[]) => void;
  activeStage: string;
  setActiveStage: (value: string) => void;
  pipelineOpen: boolean;
  togglePipelineOpen: () => void;
  branch: string;
  branchDraft: string;
  branchEditing: boolean;
  branchCopied: boolean;
  startEditBranch: () => void;
  changeBranchDraft: (next: string) => void;
  confirmBranch: () => void;
  cancelBranch: () => void;
  copyBranch: () => void;
  addingStage: boolean;
  addStageDraft: string;
  addStageMessage: AddStageMessage | undefined;
  openAddStage: () => void;
  setAddStageDraft: (value: string) => void;
  confirmAddStage: (label: string) => void;
  cancelAddStage: () => void;
}

export function useTicketOverviewState(): UseTicketOverviewState {
  const [project, setProject] = useState('eng-core');
  const projectSelector = useSelectorState();
  const [activeNav, setActiveNav] = useState('tickets');
  const [activeTab, setActiveTab] = useState('overview');
  const [bodyMode, setBodyMode] = useState<BodyMode>('template');
  const [body, setBody] = useState(() => serializeTicketBody(ticket));
  const [assignee, setAssignee] = useState(ticket.metadata.assigneeValue);
  const [reporter, setReporter] = useState(ticket.metadata.reporterValue);
  const [status, setStatus] = useState(ticket.metadata.statusValue);
  const [priority, setPriority] = useState(ticket.metadata.priorityValue);
  const metadataSelectors = useSelectorGroup(
    'assignee',
    'reporter',
    'status',
    'priority',
  );
  const [pipelineStages, setPipelineStages] = useState<
    readonly PipelineHierarchyStage[]
  >(ticket.pipeline.stages);
  const [activeStage, setActiveStage] = useState(
    ticket.pipeline.initialActiveStage,
  );
  const [pipelineOpen, setPipelineOpen] = useState(false);
  const [addingStage, setAddingStage] = useState(false);
  const [addStageDraft, setAddStageDraft] = useState('');
  const openAddStage = () => {
    setAddStageDraft('');
    setAddingStage(true);
  };
  const cancelAddStage = () => {
    setAddingStage(false);
    setAddStageDraft('');
  };
  const togglePipelineOpen = () => {
    if (pipelineOpen) cancelAddStage();
    setPipelineOpen((current) => !current);
  };
  const addStageMessage = addingStage
    ? getAddStageMessage(addStageDraft, pipelineStages)
    : undefined;
  const confirmAddStage = (label: string) => {
    if (getAddStageMessage(label, pipelineStages)?.kind === 'error') return;
    setPipelineStages((current) => {
      if (getAddStageMessage(label, current)?.kind === 'error') return current;
      return [
        ...current,
        { value: toStageValue(label), label, status: 'idle' },
      ];
    });
    setAddingStage(false);
    setAddStageDraft('');
  };

  const [branch, setBranch] = useState(ticket.metadata.branchValue);
  const [branchDraft, setBranchDraft] = useState('');
  const [branchEditing, setBranchEditing] = useState(false);
  const [branchCopied, setBranchCopied] = useState(false);
  const [branchCopyTick, setBranchCopyTick] = useState(0);

  const startEditBranch = useCallback(() => {
    setBranchDraft(branch);
    setBranchEditing(true);
  }, [branch]);

  const changeBranchDraft = useCallback((next: string) => {
    setBranchDraft(next);
  }, []);

  const confirmBranch = useCallback(() => {
    const trimmed = branchDraft.trim();
    if (trimmed === '') return;
    setBranch(trimmed);
    setBranchEditing(false);
  }, [branchDraft]);

  const cancelBranch = useCallback(() => {
    setBranchEditing(false);
  }, []);

  const copyBranch = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(branch).then(
      () => {
        setBranchCopied(true);
        setBranchCopyTick((tick) => tick + 1);
      },
      () => {},
    );
  }, [branch]);

  useEffect(() => {
    if (!branchCopied) return;
    const timer = setTimeout(
      () => setBranchCopied(false),
      BRANCH_COPIED_FLASH_MS,
    );
    return () => clearTimeout(timer);
  }, [branchCopied, branchCopyTick]);

  return {
    project,
    setProject,
    projectSelector,
    activeNav,
    setActiveNav,
    activeTab,
    setActiveTab,
    body,
    setBody,
    bodyMode,
    setBodyMode,
    assignee,
    setAssignee,
    assigneeSelector: metadataSelectors.assignee,
    reporter,
    setReporter,
    reporterSelector: metadataSelectors.reporter,
    status,
    setStatus,
    statusSelector: metadataSelectors.status,
    priority,
    setPriority,
    prioritySelector: metadataSelectors.priority,
    pipelineStages,
    setPipelineStages,
    activeStage,
    setActiveStage,
    pipelineOpen,
    togglePipelineOpen,
    branch,
    branchDraft,
    branchEditing,
    branchCopied,
    startEditBranch,
    changeBranchDraft,
    confirmBranch,
    cancelBranch,
    copyBranch,
    addingStage,
    addStageDraft,
    addStageMessage,
    openAddStage,
    setAddStageDraft,
    confirmAddStage,
    cancelAddStage,
  };
}
