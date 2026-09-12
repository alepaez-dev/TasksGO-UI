export interface ZipFileInput {
  name: string;
  bytes: Uint8Array;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

export function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// fixed 1980-01-01 (the ZIP epoch) keeps the util pure and output deterministic
const DOS_TIME = 0;
const DOS_DATE = 0x21;
const UTF8_FLAG = 0x0800;

function sanitizeEntryName(name: string): string {
  const flat = name.replace(/[/\\]/g, '_');
  return flat === '' ? 'file' : flat;
}

function withSuffix(name: string, n: number): string {
  const dot = name.lastIndexOf('.');
  if (dot > 0) return `${name.slice(0, dot)} (${n})${name.slice(dot)}`;
  return `${name} (${n})`;
}

function pack(size: number): { bytes: Uint8Array; view: DataView } {
  const bytes = new Uint8Array(size);
  return { bytes, view: new DataView(bytes.buffer) };
}

export function createZip(files: readonly ZipFileInput[]): Blob {
  const encoder = new TextEncoder();
  const taken = new Set<string>();
  const parts: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;

  const uniqueName = (base: string): string => {
    if (!taken.has(base)) {
      taken.add(base);
      return base;
    }
    for (let n = 2; ; n += 1) {
      const candidate = withSuffix(base, n);
      if (!taken.has(candidate)) {
        taken.add(candidate);
        return candidate;
      }
    }
  };

  for (const file of files) {
    const name = uniqueName(sanitizeEntryName(file.name));
    const nameBytes = encoder.encode(name);
    const checksum = crc32(file.bytes);
    const size = file.bytes.length;

    const local = pack(30 + nameBytes.length);
    local.view.setUint32(0, 0x04034b50, true);
    local.view.setUint16(4, 20, true);
    local.view.setUint16(6, UTF8_FLAG, true);
    local.view.setUint16(8, 0, true);
    local.view.setUint16(10, DOS_TIME, true);
    local.view.setUint16(12, DOS_DATE, true);
    local.view.setUint32(14, checksum, true);
    local.view.setUint32(18, size, true);
    local.view.setUint32(22, size, true);
    local.view.setUint16(26, nameBytes.length, true);
    local.view.setUint16(28, 0, true);
    local.bytes.set(nameBytes, 30);
    parts.push(local.bytes, file.bytes);

    const central = pack(46 + nameBytes.length);
    central.view.setUint32(0, 0x02014b50, true);
    central.view.setUint16(4, 20, true);
    central.view.setUint16(6, 20, true);
    central.view.setUint16(8, UTF8_FLAG, true);
    central.view.setUint16(10, 0, true);
    central.view.setUint16(12, DOS_TIME, true);
    central.view.setUint16(14, DOS_DATE, true);
    central.view.setUint32(16, checksum, true);
    central.view.setUint32(20, size, true);
    central.view.setUint32(24, size, true);
    central.view.setUint16(28, nameBytes.length, true);
    central.view.setUint32(42, offset, true);
    central.bytes.set(nameBytes, 46);
    centrals.push(central.bytes);

    offset += 30 + nameBytes.length + size;
  }

  const centralSize = centrals.reduce((sum, c) => sum + c.length, 0);
  const eocd = pack(22);
  eocd.view.setUint32(0, 0x06054b50, true);
  eocd.view.setUint16(8, centrals.length, true);
  eocd.view.setUint16(10, centrals.length, true);
  eocd.view.setUint32(12, centralSize, true);
  eocd.view.setUint32(16, offset, true);

  const out = new Uint8Array(offset + centralSize + 22);
  let cursor = 0;
  for (const part of [...parts, ...centrals, eocd.bytes]) {
    out.set(part, cursor);
    cursor += part.length;
  }
  return new Blob([out], { type: 'application/zip' });
}
