export const svgShot = (background: string, title: string) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480"><rect width="800" height="480" fill="${background}"/><text x="400" y="248" font-family="monospace" font-size="26" fill="#ffffff" text-anchor="middle">${title}</text></svg>`,
  );

export const SOCKET_LOG_SHOT = svgShot('#3b3f46', 'socket_log.png');

export const THREAD_DUMP = [
  '"gateway-worker-3" #41 waiting on condition',
  '  java.lang.Thread.State: WAITING (parking)',
  '  at jdk.internal.misc.Unsafe.park',
].join('\n');

export const CACHE_METRICS =
  '{"hits":1204,"misses":88,"ttl_ms":500,"stale_served":3}';

export const CACHE_NOTES = [
  '# Cache notes',
  '',
  'Reconnect must finish in **under 500ms**.',
  '',
  '- TTL expiry observed at 480ms',
  '- No session drop on `QA-01`',
].join('\n');

export const EMPTY_ZIP =
  'data:application/zip;base64,UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==';

export const TEXT_LIKE_EVIDENCE = /\.(md|txt|log|json|csv)$/i;
