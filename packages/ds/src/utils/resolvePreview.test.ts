import { describe, expect, it } from 'vitest';
import { evidenceIcon, resolvePreview } from './resolvePreview';

describe('resolvePreview', () => {
  it('resolves image extensions with a url to an image preview', () => {
    expect(
      resolvePreview({ label: 'shot.png', kind: 'image', url: 'blob:a' }),
    ).toEqual({ type: 'image', url: 'blob:a' });
  });

  it('is case-insensitive about the extension', () => {
    expect(
      resolvePreview({ label: 'SHOT.PNG', kind: 'image', url: 'blob:a' }),
    ).toEqual({ type: 'image', url: 'blob:a' });
  });

  it('resolves an image extension without a url to none, even with text', () => {
    expect(
      resolvePreview({ label: 'shot.png', kind: 'image', text: 'x' }),
    ).toEqual({ type: 'none' });
  });

  it('trusts kind over an unknown image extension', () => {
    expect(
      resolvePreview({ label: 'IMG_0421.heic', kind: 'image', url: 'blob:a' }),
    ).toEqual({ type: 'image', url: 'blob:a' });
  });

  it('trusts kind for extension-less labels', () => {
    expect(
      resolvePreview({
        label: 'pasted-screenshot',
        kind: 'image',
        url: 'blob:a',
      }),
    ).toEqual({ type: 'image', url: 'blob:a' });
  });

  it('never falls back to text for image kinds without a url', () => {
    expect(
      resolvePreview({ label: 'photo', kind: 'image', text: 'not a preview' }),
    ).toEqual({ type: 'none' });
  });

  it('pretty-prints valid JSON', () => {
    expect(
      resolvePreview({ label: 'm.json', kind: 'file', text: '{"hits":12}' }),
    ).toEqual({ type: 'json', text: '{\n  "hits": 12\n}' });
  });

  it('falls back to the raw text for invalid JSON', () => {
    expect(
      resolvePreview({ label: 'm.json', kind: 'file', text: '{oops' }),
    ).toEqual({ type: 'json', text: '{oops' });
  });

  it('resolves .md with text to markdown', () => {
    expect(
      resolvePreview({ label: 'notes.md', kind: 'file', text: '# Hi' }),
    ).toEqual({ type: 'markdown', text: '# Hi' });
  });

  it('resolves unknown extensions with text to text', () => {
    expect(
      resolvePreview({ label: 'gateway.log', kind: 'file', text: 'boom' }),
    ).toEqual({ type: 'text', text: 'boom' });
  });

  it('resolves extension-less labels with text to text', () => {
    expect(
      resolvePreview({ label: 'LICENSE', kind: 'file', text: 'MIT' }),
    ).toEqual({ type: 'text', text: 'MIT' });
  });

  it('resolves items with no content to none', () => {
    expect(resolvePreview({ label: 'trace.zip', kind: 'file' })).toEqual({
      type: 'none',
    });
  });

  it('ignores url for non-image files', () => {
    expect(
      resolvePreview({ label: 'trace.zip', kind: 'file', url: 'blob:a' }),
    ).toEqual({ type: 'none' });
  });
});

describe('evidenceIcon', () => {
  it('uses the image icon for image kinds and extensions', () => {
    expect(evidenceIcon({ label: 'shot.png', kind: 'image' })).toBe('image');
    expect(evidenceIcon({ label: 'photo.JPG', kind: 'file' })).toBe('image');
  });

  it('uses the code icon for json', () => {
    expect(evidenceIcon({ label: 'metrics.json', kind: 'file' })).toBe('code');
  });

  it('uses the zipped-folder icon for archives', () => {
    expect(evidenceIcon({ label: 'trace.zip', kind: 'file' })).toBe(
      'folder_zip',
    );
    expect(evidenceIcon({ label: 'dump.tar', kind: 'file' })).toBe(
      'folder_zip',
    );
    expect(evidenceIcon({ label: 'logs.gz', kind: 'file' })).toBe('folder_zip');
  });

  it('uses the document icon for markdown, text and everything else', () => {
    expect(evidenceIcon({ label: 'notes.md', kind: 'file' })).toBe(
      'description',
    );
    expect(evidenceIcon({ label: 'thread_dump.txt', kind: 'file' })).toBe(
      'description',
    );
    expect(evidenceIcon({ label: 'LICENSE', kind: 'file' })).toBe(
      'description',
    );
  });
});
