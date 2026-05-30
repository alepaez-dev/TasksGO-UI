import { useCallback, useEffect, useState } from 'react';
import type { PipelineHierarchyStage } from '../../../components/PipelineHierarchyPanel';
import {
  useSelectorGroup,
  useSelectorState,
  type UseSelectorStateReturn,
  type SelectorGroupEntry,
} from '../../../hooks/useSelector';
import { ticket } from './shared';

const BRANCH_COPIED_FLASH_MS = 2000;

export interface UseTicketOverviewState {
  project: string;
  setProject: (value: string) => void;
  projectSelector: UseSelectorStateReturn;
  activeNav: string;
  setActiveNav: (id: string) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
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
}

export function useTicketOverviewState(): UseTicketOverviewState {
  const [project, setProject] = useState('eng-core');
  const projectSelector = useSelectorState();
  const [activeNav, setActiveNav] = useState('tickets');
  const [activeTab, setActiveTab] = useState('overview');
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
  const togglePipelineOpen = () => setPipelineOpen((current) => !current);

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
  };
}
