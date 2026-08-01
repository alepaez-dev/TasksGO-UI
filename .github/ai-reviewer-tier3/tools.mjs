import { readFile, readdir, stat, realpath } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { join, relative, extname, sep, resolve } from 'node:path';
import { confineToRepo, FINDINGS_SCHEMA, globToRegExp, isIgnored } from '../ai-reviewer/review.mjs';

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'storybook-static', '.next', 'coverage']);
const PER_FILE_MATCH_CAP = 50;
const MAX_FILES_WALKED = 20000;


const SHARED_ITEM = FINDINGS_SCHEMA.properties.findings.items;
const TIER3_FINDINGS = {
  ...FINDINGS_SCHEMA.properties.findings,
  items: {
    ...SHARED_ITEM,
    properties: {
      ...SHARED_ITEM.properties,
      severity: {
        ...SHARED_ITEM.properties.severity,
        description:
          'Whether USERS ARE LIKELY TO OBSERVE it. This is the ONLY field that carries rarity: a defect that surfaces ' +
          'only on a retry, an error branch, a rare config, or a model-dependent path is `low` or `medium` HERE. ' +
          'Recording rarity here is correct; recording it in `confidence` is not.',
      },
      confidence: {
        ...SHARED_ITEM.properties.confidence,
        description:
          'Whether YOUR EXPLANATION OF THE IMPLEMENTATION IS CORRECT — nothing else. ' +
          '`high` = you read the deciding lines and the mechanism is directly verified from code. ' +
          '`medium` = one unverified assumption remains. `low` = you could not read the deciding code. ' +
          'Rare bugs still deserve high confidence when the mechanism is directly verified from code. ' +
          'NEVER REDUCE CONFIDENCE because the triggering condition is uncommon, cosmetic, low-impact, or model-dependent — ' +
          'that is severity. "It only breaks if the model omits the field on retry" does NOT lower confidence; ' +
          'if you read the code and the asymmetry is there, the explanation is correct and this is `high`.',
      },
      confidenceBasis: {
        type: 'string',
        description:
          'The `path:LINE` you READ that verifies the mechanism, or a statement of what you could not check. ' +
          'If you can name a line here, `confidence` must be `high`. Only "could not check X" justifies `low`.',
      },
    },
    required: [...SHARED_ITEM.required, 'confidenceBasis'],
  },
};

const SUBMIT_FINDINGS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    callSiteAudit: {
      type: 'array',
      description:
        'REQUIRED. Record of work you have ALREADY done — never a reason to make new tool calls; quote only lines you already saw. ' +
        'When this PR changed the call shape of a shared symbol (added/changed a field, parameter, or return shape), list EVERY call site of that symbol, one entry each. ' +
        'A verdict about the SYMBOL ("the field is optional, callers may omit it") never disposes of a SITE — judge sites one at a time, by destination. ' +
        '"It is optional" and "it falls back to the default" are NOT clearances: they name the mechanism, not the effect. To clear a site, say what the default DOES there — ' +
        'benign when the destination is computed fresh and no sibling writer supplies the field; a BUG when the write REPLACES persistent or shared state ' +
        '(a sticky comment, cached record, merged config, rewritten file) that a SIBLING path DOES supply it to, because there the default does not mean "absent", it means "erased". ' +
        'Note an omission is invisible to a grep for the new field, and a matched line that is only `fn(` tells you nothing about its arguments. ' +
        'Send an empty array when the PR changed no shared call shape.',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          symbol: { type: 'string', description: 'The shared symbol whose call shape changed.' },
          file: { type: 'string', description: 'Repo-relative path of the call site.' },
          line: { type: 'integer', description: '1-based line of the call site.' },
          quotedLine: { type: 'string', description: 'The call-site line verbatim, exactly as you saw it.' },
          verdict: {
            type: 'string',
            enum: ['passes', 'safely_unaffected', 'bug', 'not_examined'],
            description: 'passes = supplies the field; safely_unaffected = omits it with no effect at this destination; bug = omission changes what this destination produces; not_examined = you did not check.',
          },
          why: { type: 'string', description: 'One line: what the omission or default actually DOES at this destination.' },
        },
        required: ['file', 'quotedLine', 'verdict'],
      },
    },
    // Let's force the model to "think" about the suppressed concerns before it decides what goes in "findings" (structured CoT)
    confirmSuppressed: {
      type: 'array',
      description:
        'REQUIRED, and resolve it BEFORE you decide what goes in `findings`. List EVERY concern you formed and are NOT reporting — ' +
        'not a chosen few, and not only the ones that still worry you. Each entry must complete the FIVE-STEP CLEARANCE GATE in order. ' +
        'All five must succeed; if any one fails, the verdict is `is-a-bug-moved-to-findings` and the concern goes in `findings`. ' +
        'There is no third option and no "minor"/"cosmetic"/"unlikely" exemption — severity belongs on the finding, not on the decision to report it. ' +
        'Empty array ONLY on a change so trivial you formed no concern at all.',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          claim: { type: 'string', description: 'The defect you were about to leave out.' },
          predictedFailure: {
            type: 'string',
            description: 'STEP 1. The concrete failure you predicted: the inputs or state, and the wrong outcome they produce. An outcome, not a topic.',
          },
          invariant: { type: 'string', description: 'STEP 2. The invariant that, if it holds, prevents that failure.' },
          enforcingCode: {
            type: 'string',
            description:
              'STEP 3. Where that invariant is ENFORCED: `path/to/file.ext:LINE` followed by the line verbatim, from code you actually read. ' +
              'Naming a mechanism ("it is optional", "it defaults", "it is sanitized") is NOT a citation. ' +
              'If you cannot cite a line you have read, step 3 has FAILED and the verdict is `is-a-bug-moved-to-findings`.',
          },
          coversThisPath: {
            type: 'string',
            description:
              'STEP 4. Why that invariant covers THIS execution path — the specific branch the concern is about (the retry, the rejection, ' +
              'the error branch, the early return), not the happy path. If it only covers the happy path, step 4 has FAILED.',
          },
          counterexample: {
            type: 'string',
            description:
              'STEP 5. Your attempt to construct an input or execution path where the invariant does NOT hold, and what happened. ' +
              '"I did not try" means step 5 FAILED. Succeeding at building a counterexample means the concern is a BUG. ' +
              'ONE serious attempt is enough — once this and `enforcingCode` are filled, the concern is settled; do not stack further ' +
              'confirmations of a mechanism you have already cited.',
          },
          verdict: {
            type: 'string',
            enum: ['cleared-all-five-passed', 'is-a-bug-moved-to-findings'],
          },
        },
        required: ['claim', 'predictedFailure', 'invariant', 'enforcingCode', 'coversThisPath', 'counterexample', 'verdict'],
      },
    },
    // Last on purpose. The model has already thought about the suppressed concerns and callSiteAudit, so the response should be richer (structured CoT)
    findings: TIER3_FINDINGS,
  },
  required: [...FINDINGS_SCHEMA.required, 'callSiteAudit', 'confirmSuppressed'],
};

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
    input_schema: SUBMIT_FINDINGS_SCHEMA,
  },
];

function err(msg) {
  return { content: msg, isError: true };
}

async function countLines(abs) {
  const input = createReadStream(abs, { encoding: 'utf8' });
  const rl = createInterface({ input, crlfDelay: Infinity });
  let n = 0;
  try {
    for await (const _line of rl) n += 1;
  } catch {
    return n;
  } finally {
    rl.close();
    input.destroy();
  }
  return n;
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
  const maxExpandBytes = Math.min(config.maxWholeFileExpandBytes ?? 40000, maxBytes);
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

    // A self-chosen window is how a reviewer misses the initializer or the bank/stash just outside it.
    // For a small file there is nothing to trade off, so ignore the slice and return it all.
    if (st.size <= maxExpandBytes) {
      const lines = (await readFile(abs, 'utf8')).split('\n');
      const body = lines.map((l, i) => `${i + 1}: ${l}`).join('\n');
      const note =
        `\n\nNOTE: you asked for lines ${startLine ?? 1}-${endLine ?? 'EOF'}, but ${path} is ${lines.length} lines / ` +
        `${Math.max(1, Math.round(st.size / 1024))} KB and fits under the read cap, so this returned the WHOLE file. ` +
        `Read it all: an initializer, a bank/stash, or an early return outside your window can invert your verdict.`;
      return { content: (body || '(empty file)') + note, isError: false };
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
    // Too big to hand back whole, so the window stands — but say how much of the file it excludes.
    const totalLines = await countLines(abs);
    const seen = `${from}-${Math.min(to === Infinity ? totalLines : to, totalLines)}`;
    const note =
      `\n\nNOTE: you read lines ${seen} of ${path}, which is ${totalLines} lines / ` +
      `${Math.max(1, Math.round(st.size / 1024))} KB. The rest is UNSEEN — an initializer, a bank/stash, or an ` +
      `early return outside this window can invert your verdict, so read the ranges you are reasoning about.`;
    return {
      content: out.join('\n') + (truncated ? '\n… (slice truncated at the byte cap)' : '') + note,
      isError: false,
    };
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
