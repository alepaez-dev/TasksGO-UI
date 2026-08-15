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

export function renderWholeFileBlock(content) {
  const body = content
    .split('\n')
    .map((l, i) => `${String(i + 1).padStart(6)}: ${l}`)
    .join('\n');
  return (
    `NOTE: most of this file changed, so this is the WHOLE FILE at the PR head, not a patch. ` +
    `Line numbers are head line numbers. You do not need to read it again with read_file.\n${body}`
  );
}
