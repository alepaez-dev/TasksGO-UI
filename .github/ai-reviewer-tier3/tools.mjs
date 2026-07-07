import { readFile, readdir, stat, realpath } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
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

    const wantsSlice = Number.isInteger(startLine) || Number.isInteger(endLine);

    // Whole-file read: only when it fits the cap (it goes straight into the model's context). Over the
    // cap, tell the model to slice — which now actually works, via the streaming path below.
    if (!wantsSlice) {
      if (st.size > maxBytes) {
        return err(`File too large (${st.size} bytes > ${maxBytes}); pass startLine/endLine to read a slice.`);
      }
      const lines = (await readFile(abs, 'utf8')).split('\n');
      const body = lines.map((l, i) => `${i + 1}: ${l}`).join('\n');
      return { content: body || '(empty file)', isError: false };
    }

    // Sliced read: stream just the requested line range so an over-cap file can still be sliced, with
    // memory bounded to the slice (maxBytes of output), not the whole file.
    const from = Number.isInteger(startLine) ? Math.max(1, startLine) : 1;
    const to = Number.isInteger(endLine) ? endLine : Infinity;
    const input = createReadStream(abs, { encoding: 'utf8' });
    const rl = createInterface({ input, crlfDelay: Infinity });
    const out = [];
    let n = 0;
    let bytes = 0;
    let truncated = false;
    try {
      for await (const line of rl) {
        n += 1;
        if (n < from) continue;
        if (n > to) break;
        const numbered = `${n}: ${line}`;
        bytes += numbered.length + 1;
        if (bytes > maxBytes) {
          truncated = true;
          break;
        }
        out.push(numbered);
      }
    } catch (e) {
      return err(`Could not read ${path}: ${e && e.message ? e.message : 'read error'}`);
    } finally {
      rl.close();
      input.destroy();
    }
    if (out.length === 0) {
      return {
        content: truncated
          ? '(line(s) in range exceed the byte cap; narrow the range or read fewer lines)'
          : '(no lines in range)',
        isError: false,
      };
    }
    return { content: out.join('\n') + (truncated ? '\n… (slice truncated at the byte cap)' : ''), isError: false };
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
    const cappedFiles = [];
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
      let perFile = 0; // ALL matches in this file — accurate count even past the display cap
      let shownForFile = 0;
      for (let i = 0; i < lines.length; i++) {
        if (re.test(lines[i])) {
          total += 1;
          perFile += 1;
          if (out.length < maxMatches && shownForFile < PER_FILE_MATCH_CAP) {
            out.push(`${relPosix}:${i + 1}:${lines[i].slice(0, 300)}`);
            shownForFile += 1;
          }
        }
      }
      if (perFile > PER_FILE_MATCH_CAP) cappedFiles.push({ file: relPosix, count: perFile });
    }
    if (total === 0 && skippedLarge === 0) return { content: '(no matches)', isError: false };
    const notes = [];
    if (total > out.length) notes.push(`${total - out.length} more matches truncated`);
    if (cappedFiles.length) {
      const top = cappedFiles.sort((a, b) => b.count - a.count).slice(0, 10);
      const list = top.map((c) => `${c.file} (${c.count})`).join(', ');
      const more = cappedFiles.length - top.length;
      notes.push(`dense file(s) — read directly for full usage: ${list}${more > 0 ? `, +${more} more` : ''}`);
    }
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
