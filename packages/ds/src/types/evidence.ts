export interface EvidenceItem {
  label: string;
  /**
   * Picks the icon and marks the item as an image: image kinds (or image
   * file extensions) preview from `url`; everything else previews from
   * `text`.
   */
  kind: 'image' | 'file';
  /**
   * Image preview source and the preferred Download source. Must be an
   * app-controlled origin (object URL, data: URL, or the app's own file
   * host). Browsers ignore `download` for cross-origin URLs, so an
   * untrusted value opens as a navigation instead of a download.
   */
  url?: string;
  /**
   * Preview source for non-image items (pretty-printed for `.json`, rendered
   * as markdown for `.md`, plain text otherwise) and the Download fallback
   * when `url` is absent. Remote images in markdown are fetched on preview;
   * apps that must prevent this should enforce a CSP `img-src`.
   */
  text?: string;
}
