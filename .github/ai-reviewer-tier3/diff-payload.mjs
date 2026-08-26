const SIZE_BANDS = [
  { maxTokens: 15000, label: '<15k', usdPerRound: 0.036 },
  { maxTokens: 25000, label: '15-25k', usdPerRound: 0.106 },
  { maxTokens: 35000, label: '25-35k', usdPerRound: 0.117 },
  { maxTokens: 50000, label: '35-50k', usdPerRound: 0.136 },
  { maxTokens: Infinity, label: '>50k', usdPerRound: null },
];

export function sizeBand(promptTokens, ceilingUsd) {
  const band = SIZE_BANDS.find((b) => promptTokens < b.maxTokens) ?? SIZE_BANDS[SIZE_BANDS.length - 1];
  const rounds = band.usdPerRound && ceilingUsd ? Math.floor(ceilingUsd / band.usdPerRound) : null;
  return { ...band, estimatedRounds: rounds };
}

export function changedRatio(additions, deletions, headLineCount) {
  if (!headLineCount || headLineCount <= 0) return 0;
  return ((additions ?? 0) + (deletions ?? 0)) / headLineCount;
}

export function deletedLinesByHeadLine(patch) {
  const map = new Map();
  let headLine = 0;
  for (const line of String(patch ?? '').split('\n')) {
    const hunk = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunk) {
      headLine = Number(hunk[1]);
      continue;
    }
    if (line === '') continue;
    const flag = line[0];
    if (flag === '-') {
      const at = map.get(headLine);
      if (at) at.push(line.slice(1));
      else map.set(headLine, [line.slice(1)]);
    } else if (flag !== '\\') {
      headLine += 1; // '+' and context both advance the head cursor; "\ No newline" does not
    }
  }
  return map;
}

export function renderWholeFileBlock(content, commentable = new Set(), deletions = new Map()) {
  const lines = content.split('\n');
  const out = [];
  const emitDeleted = (at) => {
    for (const removed of deletions.get(at) ?? []) out.push(`-         ${removed}`);
  };
  for (let i = 0; i < lines.length; i++) {
    emitDeleted(i + 1);
    out.push(`${commentable.has(i + 1) ? '+' : ' '} ${String(i + 1).padStart(6)}  ${lines[i]}`);
  }
  emitDeleted(lines.length + 1);
  return (
    `NOTE: most of this file changed, so this is the WHOLE FILE at the PR head, not a patch. ` +
    `Line numbers are head line numbers. Lines marked \`+\` are the lines this PR added — they are the ONLY ` +
    `lines an inline finding can be anchored to; a finding on any other line is reported without a location. ` +
    `Lines marked \`-\` are what this PR REMOVED, shown where they used to be; they do not exist at head. ` +
    `You do not need to read it again with read_file.\n${out.join('\n')}`
  );
}
