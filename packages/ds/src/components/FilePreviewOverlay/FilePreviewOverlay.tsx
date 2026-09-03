import { forwardRef, useEffect, useRef, type HTMLAttributes } from 'react';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { OverlayShell } from '../_internal/OverlayShell';
import { cn } from '../../utils/cn';
import { createZip, type ZipFileInput } from '../../utils/createZip';
import { evidenceIcon } from '../../utils/resolvePreview';
import { isScriptScheme } from '../../utils/sanitizeHref';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { type TransitionDuration } from '../../tokens/interaction';
import { type EvidenceItem } from '../../types/evidence';
import { Filmstrip } from './Filmstrip';
import { PreviewStage } from './PreviewStage';
import styles from './FilePreviewOverlay.module.css';

function downloadHref(file: EvidenceItem): string | undefined {
  if (file.url != null) {
    // data:/blob: are legitimate here (image + zip evidence) and safe under a
    // download anchor; only script-executing schemes are dangerous. (consumer should handle this)
    return isScriptScheme(file.url) ? undefined : file.url;
  }
  if (file.text != null) {
    return `data:text/plain;charset=utf-8,${encodeURIComponent(file.text)}`;
  }
  return undefined;
}

// mirrors downloadHref: url wins (when not script-scheme), then raw text
async function zipEntryFor(item: EvidenceItem): Promise<ZipFileInput | null> {
  if (item.url != null) {
    if (isScriptScheme(item.url)) return null;
    try {
      const response = await fetch(item.url);
      if (!response.ok) return null;
      return {
        name: item.label,
        bytes: new Uint8Array(await response.arrayBuffer()),
      };
    } catch {
      return null;
    }
  }
  if (item.text != null) {
    return { name: item.label, bytes: new TextEncoder().encode(item.text) };
  }
  return null;
}

export type FilePreviewOverlayProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'aria-label' | 'aria-labelledby'
> & {
  files: readonly EvidenceItem[];
  open: boolean;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onClose: () => void;
  downloadAllName?: string;
  duration?: TransitionDuration;
  forceMount?: boolean;
  onOpened?: () => void;
  onClosed?: () => void;
};

export const FilePreviewOverlay = forwardRef<
  HTMLDivElement,
  FilePreviewOverlayProps
>(
  (
    {
      files,
      open,
      activeIndex,
      onActiveIndexChange,
      onClose,
      downloadAllName = 'evidence.zip',
      duration = 'normal',
      forceMount = false,
      onOpened,
      onClosed,
      className,
      ...rest
    },
    ref,
  ) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    useFocusTrap(panelRef, open, { autoFocus: false });

    function setRefs(node: HTMLDivElement | null) {
      panelRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) Object.assign(ref, { current: node });
    }

    const lastIndex = files.length - 1;
    const index = Math.min(Math.max(activeIndex, 0), Math.max(lastIndex, 0));

    useEffect(() => {
      if (!open || files.length === 0) return;
      function handleKeyDown(e: KeyboardEvent) {
        if (e.defaultPrevented) return;
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        const next = index + (e.key === 'ArrowLeft' ? -1 : 1);
        if (next < 0 || next > lastIndex) return;
        e.preventDefault();
        onActiveIndexChange(next);
      }
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, files.length, index, lastIndex, onActiveIndexChange]);

    function handleOpened() {
      if (onOpened) {
        onOpened();
        return;
      }
      closeRef.current?.focus();
    }

    const file = files.length > 0 ? files[index] : null;
    const href = file != null ? downloadHref(file) : undefined;
    const downloadableCount = files.reduce(
      (count, item) => (downloadHref(item) != null ? count + 1 : count),
      0,
    );

    async function handleDownloadAll() {
      const entries = await Promise.all(files.map(zipEntryFor));
      const zipFiles = entries.filter((entry): entry is ZipFileInput =>
        Boolean(entry),
      );
      if (zipFiles.length === 0) return;
      const zipUrl = URL.createObjectURL(createZip(zipFiles));
      const anchor = document.createElement('a');
      anchor.href = zipUrl;
      anchor.download = downloadAllName;
      anchor.click();
      // deferred: revoking synchronously can abort the still-starting download
      window.setTimeout(() => URL.revokeObjectURL(zipUrl), 1000);
    }

    return (
      <OverlayShell
        open={open}
        onClose={onClose}
        duration={duration}
        forceMount={forceMount}
        onOpened={handleOpened}
        onClosed={onClosed}
      >
        {({ visible }) => (
          <div
            ref={setRefs}
            {...rest}
            role="dialog"
            aria-modal="true"
            aria-label={
              file != null
                ? `${file.label}, file ${index + 1} of ${files.length}`
                : 'File preview'
            }
            className={cn(styles.viewer, visible && styles.open, className)}
          >
            <div className={styles.topBar}>
              {file != null && (
                <span className={styles.fileInfo}>
                  <Icon name={evidenceIcon(file)} size="sm" />
                  <span className={styles.fileName}>{file.label}</span>
                  <span className={styles.counter}>
                    {index + 1} / {files.length}
                  </span>
                </span>
              )}
              <span className={styles.topActions}>
                {downloadableCount > 1 && (
                  <button
                    type="button"
                    className={styles.downloadAll}
                    onClick={() => void handleDownloadAll()}
                  >
                    <Icon name="download" size="sm" />
                    Download all
                  </button>
                )}
                {file != null && href != null && (
                  <a
                    className={styles.download}
                    href={href}
                    download={file.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="download" size="sm" />
                    Download
                  </a>
                )}
                <IconButton
                  ref={closeRef}
                  icon="close"
                  aria-label="Close preview"
                  className={styles.overlayControl}
                  onClick={onClose}
                />
              </span>
            </div>

            {file != null && (
              <div className={styles.stage}>
                <div className={styles.stageCard}>
                  <PreviewStage file={file} />
                </div>
              </div>
            )}

            {file != null && (
              <>
                <IconButton
                  icon="chevron_left"
                  aria-label="Previous file"
                  className={cn(
                    styles.overlayControl,
                    styles.nav,
                    styles.navPrev,
                  )}
                  aria-disabled={index === 0 || undefined}
                  onClick={() => {
                    if (index > 0) onActiveIndexChange(index - 1);
                  }}
                />
                <IconButton
                  icon="chevron_right"
                  aria-label="Next file"
                  className={cn(
                    styles.overlayControl,
                    styles.nav,
                    styles.navNext,
                  )}
                  aria-disabled={index === lastIndex || undefined}
                  onClick={() => {
                    if (index < lastIndex) onActiveIndexChange(index + 1);
                  }}
                />
                <Filmstrip
                  files={files}
                  activeIndex={index}
                  onSelect={onActiveIndexChange}
                />
              </>
            )}
          </div>
        )}
      </OverlayShell>
    );
  },
);

FilePreviewOverlay.displayName = 'FilePreviewOverlay';
