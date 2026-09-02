import { Icon } from '../Icon';
import { cn } from '../../utils/cn';
import { evidenceIcon, resolvePreview } from '../../utils/resolvePreview';
import { type EvidenceItem } from '../../types/evidence';
import styles from './FilePreviewOverlay.module.css';

export interface FilmstripProps {
  files: readonly EvidenceItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function Filmstrip({ files, activeIndex, onSelect }: FilmstripProps) {
  return (
    <div className={styles.filmstrip} role="group" aria-label="All files">
      {files.map((file, index) => {
        const preview = resolvePreview(file);
        return (
          <button
            key={`${file.label}-${index}`}
            type="button"
            className={cn(
              styles.filmstripItem,
              index === activeIndex && styles.filmstripActive,
            )}
            aria-current={index === activeIndex || undefined}
            aria-label={file.label}
            onClick={() => onSelect(index)}
          >
            {preview.type === 'image' ? (
              <img className={styles.filmstripThumb} src={preview.url} alt="" />
            ) : (
              <Icon name={evidenceIcon(file)} size="sm" />
            )}
          </button>
        );
      })}
    </div>
  );
}
