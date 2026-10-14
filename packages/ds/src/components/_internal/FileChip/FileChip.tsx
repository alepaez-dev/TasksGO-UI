import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '../../Icon';
import { RefLabel } from '../../RefLabel';
import { cn } from '../../../utils/cn';
import { evidenceIcon } from '../../../utils/resolvePreview';
import controls from '../controls.module.css';
import styles from './FileChip.module.css';

export interface FileChipProps {
  label: string;
  kind: 'image' | 'file';
  onOpen?: () => void;
  onRemove?: () => void;
  uploadFraction?: number;
}

export function FileChip({
  label,
  kind,
  onOpen,
  onRemove,
  uploadFraction,
}: FileChipProps): ReactNode {
  const refLabel = (
    <RefLabel
      className={styles.label}
      variant={kind === 'image' ? 'attachment' : 'doc'}
      icon={evidenceIcon({ label, kind })}
      title={label}
    >
      <span className={styles.labelText}>{label}</span>
    </RefLabel>
  );

  const ratio =
    uploadFraction !== undefined && Number.isFinite(uploadFraction)
      ? Math.min(1, Math.max(0, uploadFraction))
      : undefined;
  const percent = ratio === undefined ? '' : `${Math.round(ratio * 100)}%`;

  return (
    <span
      className={cn(
        styles.chip,
        onOpen && styles.clickable,
        ratio !== undefined && styles.uploading,
      )}
    >
      {onOpen ? (
        <button type="button" className={styles.open} onClick={onOpen}>
          {refLabel}
        </button>
      ) : (
        refLabel
      )}
      {ratio !== undefined && <span className={styles.percent}>{percent}</span>}
      {onRemove && (
        <button
          type="button"
          className={cn(controls.removeButton, styles.remove)}
          aria-label={`Remove ${label}`}
          data-file-chip-remove=""
          onClick={onRemove}
        >
          <Icon name="close" size="xs" />
        </button>
      )}
      {ratio !== undefined && (
        <span
          data-progress-bar=""
          className={styles.bar}
          style={{ '--ds-file-chip-progress': ratio } as CSSProperties}
        />
      )}
    </span>
  );
}
