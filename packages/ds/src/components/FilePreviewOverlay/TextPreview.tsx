import styles from './FilePreviewOverlay.module.css';

export interface TextPreviewProps {
  label: string;
  text: string;
}

export function TextPreview({ label, text }: TextPreviewProps) {
  return (
    <div
      className={styles.stageScroll}
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      <pre className={styles.textPreview}>{text}</pre>
    </div>
  );
}
