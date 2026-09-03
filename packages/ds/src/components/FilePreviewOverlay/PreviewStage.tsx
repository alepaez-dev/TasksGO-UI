import { Icon } from '../Icon';
import { Markdown } from '../Markdown';
import { evidenceIcon, resolvePreview } from '../../utils/resolvePreview';
import { type EvidenceItem } from '../../types/evidence';
import { TextPreview } from './TextPreview';
import styles from './FilePreviewOverlay.module.css';

export interface PreviewStageProps {
  file: EvidenceItem;
}

export function PreviewStage({ file }: PreviewStageProps) {
  const preview = resolvePreview(file);
  if (preview.type === 'image') {
    return (
      <img className={styles.stageImage} src={preview.url} alt={file.label} />
    );
  }
  if (preview.type === 'markdown') {
    return (
      <div
        className={styles.stageScroll}
        role="region"
        aria-label={file.label}
        tabIndex={0}
      >
        <Markdown source={preview.text} />
      </div>
    );
  }
  if (preview.type === 'json' || preview.type === 'text') {
    return <TextPreview label={file.label} text={preview.text} />;
  }
  return (
    <div className={styles.stageFallback}>
      <span className={styles.fallbackIcon} aria-hidden="true">
        <Icon name={evidenceIcon(file)} size="md" />
      </span>
      <span className={styles.fallbackLabel}>{file.label}</span>
      <span className={styles.fallbackHint}>
        No preview available for this file.
      </span>
    </div>
  );
}
