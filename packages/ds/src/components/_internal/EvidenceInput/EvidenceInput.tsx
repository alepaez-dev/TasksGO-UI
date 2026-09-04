import { useRef, type ChangeEvent, type ReactNode } from 'react';
import { Icon } from '../../Icon';
import { RefLabel } from '../../RefLabel';
import { cn } from '../../../utils/cn';
import { type EvidenceItem } from '../../../types/evidence';
import controls from '../controls.module.css';
import styles from './EvidenceInput.module.css';

export interface EvidenceInputProps {
  items: readonly EvidenceItem[];
  onAddFiles?: (files: readonly File[]) => void;
  onRemove?: (index: number) => void;
  /** Slots for the `Limit reached` label. Display only — does not disable Add. */
  limitLabel?: number;
  accept?: string;
  addDisabled?: boolean;
  previewCount?: number;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  // called when removing the last chip leaves nothing here to focus
  onFocusFallback?: () => void;
}

export function EvidenceInput({
  items,
  onAddFiles,
  onRemove,
  limitLabel,
  accept,
  addDisabled = false,
  previewCount,
  expanded = false,
  onExpandedChange,
  onFocusFallback,
}: EvidenceInputProps): ReactNode {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);

  const canToggle = previewCount != null && items.length > previewCount;
  const visible =
    previewCount != null && !expanded ? items.slice(0, previewCount) : items;
  const hiddenCount = previewCount != null ? items.length - previewCount : 0;
  const atLimit = limitLabel != null && items.length >= limitLabel;

  const removeAt = (index: number) => {
    const target = index > 0 ? index - 1 : 0;
    onRemove?.(index);
    // rAF: chips re-render after the parent commits; then move focus to the
    // previous remove button, or the Add control when none remain.
    requestAnimationFrame(() => {
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>(
        '[data-evidence-remove]',
      );
      const el = buttons?.[target];
      if (el) el.focus();
      else if (addRef.current && !addRef.current.disabled)
        addRef.current.focus();
      else onFocusFallback?.();
    });
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) onAddFiles?.(Array.from(files));
    event.target.value = '';
  };

  return (
    <div ref={listRef} className={styles.evidence}>
      {visible.map((item, index) => (
        <span key={index} className={styles.evidenceChip}>
          <RefLabel
            className={styles.evidenceLabel}
            variant={item.kind === 'image' ? 'attachment' : 'doc'}
            icon={item.kind === 'image' ? 'image' : 'description'}
            title={item.label}
          >
            <span className={styles.evidenceLabelText}>{item.label}</span>
          </RefLabel>
          {onRemove && (
            <button
              type="button"
              className={controls.removeButton}
              aria-label={`Remove ${item.label}`}
              data-evidence-remove=""
              onClick={() => removeAt(index)}
            >
              <Icon name="close" size="xs" />
            </button>
          )}
        </span>
      ))}
      {canToggle && (
        <button
          type="button"
          className={styles.evidenceMore}
          aria-expanded={expanded}
          onClick={() => onExpandedChange?.(!expanded)}
        >
          <Icon
            name="expand_more"
            size="xs"
            className={cn(controls.chevron, expanded && controls.chevronOpen)}
          />
          {expanded ? 'Show less' : `+${hiddenCount} more`}
        </button>
      )}
      {onAddFiles && (
        <>
          <button
            ref={addRef}
            type="button"
            className={styles.addEvidence}
            onClick={() => fileInputRef.current?.click()}
            disabled={addDisabled}
          >
            <Icon name="file_upload" size="sm" />
            {addDisabled && atLimit ? 'Limit reached' : 'Add evidence'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple
            className={styles.addEvidenceInput}
            onChange={handleFiles}
            tabIndex={-1}
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
}
