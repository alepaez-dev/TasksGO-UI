import { walkMarkdown } from './walkMarkdown';

export function plainText(source: string): string {
  let out = '';
  try {
    walkMarkdown(source, {
      includeScopeBlocks: true,
      onText: (_node, text) => {
        out += text;
      },
      onBlockBoundary: () => {
        out += '\n';
      },
      onDetached: (text) => {
        out += `${text}\n`;
      },
    });
  } catch {
    return source;
  }
  return out
    .replace(/[ \t]+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
}
