import { type MarkdownToJSX } from 'markdown-to-jsx';
import {
  isTextNode,
  walkMarkdown,
  type MarkdownTextNode,
} from './walkMarkdown';

const BLOCK_SEPARATOR = '\n';

export type TextRunNode = MarkdownTextNode;

export interface DetachedRun {
  text: string;
  offset: number;
}

export interface TextRunLayout {
  runs: string[];
  offsets: number[];
  nodes: object[];
  detached: DetachedRun[];
  joined: string;
  ast: MarkdownToJSX.ASTNode[];
}

export function isTextRunNode(
  node: MarkdownToJSX.ASTNode,
): node is TextRunNode {
  return isTextNode(node, false);
}

export function textRunLayout(source: string): TextRunLayout {
  const runs: string[] = [];
  const offsets: number[] = [];
  const nodes: object[] = [];
  const detached: DetachedRun[] = [];
  let joined = '';

  const separate = (): void => {
    if (joined !== '' && !joined.endsWith(BLOCK_SEPARATOR)) {
      joined += BLOCK_SEPARATOR;
    }
  };

  try {
    const ast = walkMarkdown(source, {
      includeScopeBlocks: false,
      onText: (node, text) => {
        runs.push(text);
        offsets.push(joined.length);
        nodes.push(node);
        joined += text;
      },
      onBlockBoundary: separate,
      onDetached: (text) => {
        detached.push({ text, offset: joined.length });
        joined += text;
      },
    });
    return { runs, offsets, nodes, detached, joined, ast };
  } catch {
    return {
      runs: [source],
      offsets: [0],
      nodes: [],
      detached: [],
      joined: source,
      ast: [],
    };
  }
}

export function textRuns(source: string): string[] {
  return textRunLayout(source).runs;
}
