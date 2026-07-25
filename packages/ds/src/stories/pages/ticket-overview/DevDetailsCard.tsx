import { useId, type ReactNode } from 'react';
import { Icon } from '../../../components/Icon';
import { useOverlayLifecycle } from '../../../hooks/useOverlayLifecycle';
import { cn } from '../../../utils/cn';
import styles from './DevDetailsCard.module.css';

export interface DevDetailsCardProps {
  open: boolean;
  onToggle: () => void;
  summary: string;
  children: ReactNode;
}

export function DevDetailsCard({
  open,
  onToggle,
  summary,
  children,
}: DevDetailsCardProps) {
  const bodyId = useId();
  const { shouldRender, isVisible, backdropRef } = useOverlayLifecycle({
    open,
    duration: 'slow',
  });

  return (
    <div className={cn(styles.card, isVisible && styles.cardOpen)}>
      <button
        type="button"
        className={styles.header}
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={onToggle}
      >
        <Icon name="code" size="sm" className={styles.headerIcon} />
        <span className={styles.title}>Dev Details</span>
        <span className={styles.summary}>{summary}</span>
        <Icon name="expand_more" size="sm" className={styles.chevron} />
      </button>
      <div id={bodyId} ref={backdropRef} className={styles.collapse}>
        <div className={styles.collapseInner}>{shouldRender && children}</div>
      </div>
    </div>
  );
}
