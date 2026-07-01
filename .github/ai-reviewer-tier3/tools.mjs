import { readFile, readdir, stat, realpath } from 'node:fs/promises';
import { join, relative, extname, sep, resolve } from 'node:path';
import { confineToRepo, FINDINGS_SCHEMA, globToRegExp, isIgnored } from '../ai-reviewer/review.mjs';

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'storybook-static', '.next', 'coverage']);
const PER_FILE_MATCH_CAP = 50;
const MAX_FILES_WALKED = 20000;

export const TOOL_DEFS = [
  {
    name: 'read_file',
    description:
      'Read a UTF-8 source file from the PR head, with line numbers. Use to read whole functions and surrounding control flow, not just changed lines. Optionally pass startLine/endLine (1-based, inclusive) to read a slice of a large file.',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Repo-relative path, e.g. src/components/Button/Button.tsx' },
        startLine: { type: 'integer', description: '1-based first line (optional)' },
        endLine: { type: 'integer', description: '1-based last line, inclusive (optional)' },
      },
      required: ['path'],
    },
  },
  {
    name: 'grep',
    description:
      'Search the PR head for a JavaScript regular expression. Use to find every caller/definition/usage of a symbol so you can trace control flow across files. Returns file:line:matched-line, capped.',
    input_schema: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'A JavaScript regular expression source (no flags).' },
        pathGlob: { type: 'string', description: 'Optional glob to limit the search, e.g. src/**/*.ts' },
      },
      required: ['pattern'],
    },
  },
  {
    name: 'list_dir',
    description: 'List the entries of a directory in the PR head (one level).',
    input_schema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'Repo-relative directory path, e.g. src/hooks' } },
      required: ['path'],
    },
  },
  {
    name: 'submit_findings',
    description:
      'Submit your complete list of findings (or an empty list) and END the review. Call this exactly once when you are done exploring.',
    input_schema: FINDINGS_SCHEMA,
  },
];

function err(msg) {
  return { content: msg, isError: true };
}

async function* walkFiles(rootDir) {
  const stack = [rootDir];
  let seen = 0;
  while (stack.length) {
    const cur = stack.pop();
    let entries;
    try {
      entries = await readdir(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = join(cur, e.name);
      if (e.isDirectory()) {
        if (!SKIP_DIRS.has(e.name)) stack.push(full);
      } else if (e.isFile()) {
        if (++seen > MAX_FILES_WALKED) return;
        yield full;
      }
    }
  }
}

export function makeToolRunner({ root, config }) {
  const maxBytes = config.maxFileReadBytes ?? 200000;
  const grepMaxBytes = config.maxGrepFileBytes ?? 2000000;
  const maxMatches = config.maxGrepMatches ?? 200;
  const exts = config.toolExtensions ?? null;
  const ignore = config.ignore ?? [];

  let realRootPromise;
  const realRoot = () => (realRootPromise ??= realpath(root).catch(() => resolve(root)));

  async function resolveInRepo(rel) {
    const abs = confineToRepo(root, rel);
    if (!abs) return { error: `Path "${rel}" is outside the repository; not allowed.` };
    let real;
    try {
      real = await realpath(abs);
    } catch (e) {
      if (e && e.code === 'ENOENT') return { error: `Not found: ${rel}` };
      return { error: `Could not resolve "${rel}".` };
    }
    const rr = await realRoot();
    if (real !== rr && !real.startsWith(rr + sep)) {
      return { error: `Path "${rel}" resolves outside the repository (symlink); not allowed.` };
    }
    return { abs: real };
  }

  async function readFileTool({ path, startLine, endLine }) {
    const resolved = await resolveInRepo(path);
    if (resolved.error) return err(resolved.error);
    const abs = resolved.abs;
    let st;
    try {
      st = await stat(abs);
    } catch {
      return err(`File not found: ${path}`);
    }
    if (!st.isFile()) return err(`Not a file: ${path}`);
    if (st.size > maxBytes) {
      return err(`File too large (${st.size} bytes > ${maxBytes}); pass startLine/endLine to read a slice.`);
    }
    const text = await readFile(abs, 'utf8');
    const lines = text.split('\n');
    const from = Number.isInteger(startLine) ? Math.max(1, startLine) : 1;
    const to = Number.isInteger(endLine) ? Math.min(lines.length, endLine) : lines.length;
    const body = lines
      .slice(from - 1, to)
      .map((l, i) => `${from + i}: ${l}`)
      .join('\n');
    return { content: body || '(empty file)', isError: false };
  }

  async function grepTool({ pattern, pathGlob }) {
    let re;
    try {
      re = new RegExp(pattern);
    } catch (e) {
      return err(`Invalid regular expression: ${e && e.message ? e.message : 'parse error'}`);
    }
    const globRe = pathGlob ? globToRegExp(pathGlob) : null;
    const out = [];
    let total = 0;
    let skippedLarge = 0;
    for await (const full of walkFiles(root)) {
      const relPosix = relative(root, full).split(sep).join('/');
      if (exts && !exts.includes(extname(relPosix))) continue;
      if (isIgnored(relPosix, ignore)) continue;
      if (globRe && !globRe.test(relPosix)) continue;
      let text;
      try {
        const st = await stat(full);
        if (st.size > grepMaxBytes) {
          skippedLarge += 1; // bound per-file memory/time; noted below so it is not a silent skip
          continue;
        }
        text = await readFile(full, 'utf8');
      } catch {
        continue;
      }
      const lines = text.split('\n');
      let perFile = 0;
      for (let i = 0; i < lines.length; i++) {
        if (re.test(lines[i])) {
          total += 1;
          if (out.length < maxMatches) out.push(`${relPosix}:${i + 1}:${lines[i].slice(0, 300)}`);
          if (++perFile >= PER_FILE_MATCH_CAP) break;
        }
      }
    }
    if (total === 0 && skippedLarge === 0) return { content: '(no matches)', isError: false };
    const notes = [];
    if (total > out.length) notes.push(`${total - out.length} more matches truncated`);
    if (skippedLarge > 0) notes.push(`${skippedLarge} file(s) not searched — larger than ${grepMaxBytes} bytes`);
    const suffix = notes.length ? `\n… (${notes.join('; ')})` : '';
    return { content: (out.length ? out.join('\n') : '(no matches)') + suffix, isError: false };
  }

  async function listDirTool({ path }) {
    const resolved = await resolveInRepo(path);
    if (resolved.error) return err(resolved.error);
    const abs = resolved.abs;
    let entries;
    try {
      entries = await readdir(abs, { withFileTypes: true });
    } catch {
      return err(`Directory not found: ${path}`);
    }
    const rr = await realRoot();
    const listing = entries
      .map((e) => `${e.isDirectory() ? 'dir ' : 'file'}  ${join(relative(rr, abs), e.name) || e.name}`)
      .join('\n');
    return { content: listing || '(empty directory)', isError: false };
  }

  return async function run(name, input) {
    try {
      if (name === 'read_file') return await readFileTool(input || {});
      if (name === 'grep') return await grepTool(input || {});
      if (name === 'list_dir') return await listDirTool(input || {});
      return err(`Unknown tool: ${name}`);
    } catch (e) {
      return err(`Tool ${name} failed: ${e && e.message ? e.message : 'unknown error'}`);
    }
  };
}
