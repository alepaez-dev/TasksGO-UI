import type { EvidenceItem } from '../types/evidence';
import type { IconName } from '../icons';

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']);

const ARCHIVE_EXTENSIONS = new Set(['zip', 'tar', 'gz', 'rar', '7z']);

export type ResolvedPreview =
  | { type: 'image'; url: string }
  | { type: 'json'; text: string }
  | { type: 'markdown'; text: string }
  | { type: 'text'; text: string }
  | { type: 'none' };

function extensionOf(label: string): string {
  const dot = label.lastIndexOf('.');
  return dot > 0 ? label.slice(dot + 1).toLowerCase() : '';
}

function prettyJson(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

export function resolvePreview(item: EvidenceItem): ResolvedPreview {
  const extension = extensionOf(item.label);
  if (item.kind === 'image' || IMAGE_EXTENSIONS.has(extension)) {
    return item.url != null
      ? { type: 'image', url: item.url }
      : { type: 'none' };
  }
  if (item.text == null) return { type: 'none' };
  if (extension === 'json') {
    return { type: 'json', text: prettyJson(item.text) };
  }
  if (extension === 'md') return { type: 'markdown', text: item.text };
  return { type: 'text', text: item.text };
}

export function evidenceIcon(item: EvidenceItem): IconName {
  const extension = extensionOf(item.label);
  if (item.kind === 'image' || IMAGE_EXTENSIONS.has(extension)) return 'image';
  if (extension === 'json') return 'code';
  if (ARCHIVE_EXTENSIONS.has(extension)) return 'folder_zip';
  return 'description';
}
