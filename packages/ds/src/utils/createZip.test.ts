import { describe, expect, it } from 'vitest';
import { createZip, crc32 } from './createZip';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

interface ZipEntry {
  name: string;
  data: Uint8Array;
  crc: number;
}

function blobBytes(blob: Blob): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

async function readZip(blob: Blob): Promise<ZipEntry[]> {
  const bytes = await blobBytes(blob);
  const view = new DataView(bytes.buffer);
  const entries: ZipEntry[] = [];
  let offset = 0;
  while (view.getUint32(offset, true) === 0x04034b50) {
    const crc = view.getUint32(offset + 14, true);
    const size = view.getUint32(offset + 18, true);
    const nameLength = view.getUint16(offset + 26, true);
    const nameStart = offset + 30;
    entries.push({
      name: decoder.decode(bytes.slice(nameStart, nameStart + nameLength)),
      data: bytes.slice(nameStart + nameLength, nameStart + nameLength + size),
      crc,
    });
    offset = nameStart + nameLength + size;
  }
  return entries;
}

describe('crc32', () => {
  it('matches known vectors', () => {
    expect(crc32(new Uint8Array())).toBe(0);
    expect(crc32(encoder.encode('hello'))).toBe(0x3610a686);
    expect(crc32(encoder.encode('123456789'))).toBe(0xcbf43926);
  });
});

describe('createZip', () => {
  it('produces a well-formed single-entry archive', async () => {
    const blob = createZip([{ name: 'a.txt', bytes: encoder.encode('hi') }]);
    expect(blob.type).toBe('application/zip');
    // local (30+5) + data (2) + central (46+5) + end record (22)
    expect(blob.size).toBe(110);

    const bytes = await blobBytes(blob);
    const view = new DataView(bytes.buffer);
    expect(view.getUint32(37, true)).toBe(0x02014b50);
    expect(view.getUint32(88, true)).toBe(0x06054b50);
    expect(view.getUint16(96, true)).toBe(1);

    const [entry] = await readZip(blob);
    expect(entry.name).toBe('a.txt');
    expect(decoder.decode(entry.data)).toBe('hi');
    expect(entry.crc).toBe(crc32(encoder.encode('hi')));
  });

  it('stores every file with its exact bytes', async () => {
    const blob = createZip([
      { name: 'shot.png', bytes: new Uint8Array([1, 2, 3]) },
      { name: 'log.txt', bytes: encoder.encode('line') },
    ]);
    const entries = await readZip(blob);
    expect(entries.map((e) => e.name)).toEqual(['shot.png', 'log.txt']);
    expect([...entries[0].data]).toEqual([1, 2, 3]);
    expect(decoder.decode(entries[1].data)).toBe('line');
  });

  it('dedupes duplicate names with a numeric suffix', async () => {
    const blob = createZip([
      { name: 'gateway.log', bytes: encoder.encode('a') },
      { name: 'gateway.log', bytes: encoder.encode('b') },
      { name: 'gateway.log', bytes: encoder.encode('c') },
    ]);
    const entries = await readZip(blob);
    expect(entries.map((e) => e.name)).toEqual([
      'gateway.log',
      'gateway (2).log',
      'gateway (3).log',
    ]);
  });

  it('sanitizes path separators out of entry names', async () => {
    const blob = createZip([
      { name: '../../evil.txt', bytes: encoder.encode('x') },
      { name: 'a/b\\c.txt', bytes: encoder.encode('y') },
      { name: '', bytes: encoder.encode('z') },
    ]);
    const entries = await readZip(blob);
    expect(entries.map((e) => e.name)).toEqual([
      '.._.._evil.txt',
      'a_b_c.txt',
      'file',
    ]);
  });

  it('round-trips unicode names', async () => {
    const blob = createZip([
      { name: 'café résumé.txt', bytes: encoder.encode('x') },
    ]);
    const entries = await readZip(blob);
    expect(entries[0].name).toBe('café résumé.txt');
  });
});
