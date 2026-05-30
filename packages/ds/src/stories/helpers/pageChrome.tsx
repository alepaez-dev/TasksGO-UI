import type { ReactNode } from 'react';
import { Badge } from '../../components/Badge';
import { StatusDot, type StatusDotProps } from '../../components/StatusDot';
import styles from './pageChrome.module.css';

export interface SidebarWorkspaceHeaderProps {
  projectLabel: string;
  version: string;
  status: { variant: StatusDotProps['variant']; label: string };
}

export function SidebarWorkspaceHeader({
  projectLabel,
  version,
  status,
}: SidebarWorkspaceHeaderProps) {
  return (
    <div className={styles.workspaceHeader}>
      <span className={styles.workspaceEyebrow}>Active Workspace</span>
      <p className={styles.workspaceTitle}>Project / {projectLabel}</p>
      <span className={styles.workspaceStatusRow}>
        <Badge variant="reference">{version}</Badge>
        <StatusDot variant={status.variant} label={status.label} />
      </span>
    </div>
  );
}

export interface SidebarStatusLabelProps {
  children: ReactNode;
}

export function SidebarStatusLabel({ children }: SidebarStatusLabelProps) {
  return <span className={styles.sidebarStatusLabel}>{children}</span>;
}

export interface LastEditedLabelProps {
  children: ReactNode;
}

export function LastEditedLabel({ children }: LastEditedLabelProps) {
  return <span className={styles.lastEditedLabel}>{children}</span>;
}
