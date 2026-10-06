import { parser, RuleType, type MarkdownToJSX } from 'markdown-to-jsx';
import { isScopeBlock } from './parseScopeBlock';

const TEXT_TYPES = new Set<number>([
  RuleType.text,
  RuleType.codeInline,
  RuleType.codeBlock,
]);

const BLOCK_TYPES = new Set<number>([
  RuleType.blockQuote,
  RuleType.breakLine,
  RuleType.breakThematic,
  RuleType.codeBlock,
  RuleType.heading,
  RuleType.htmlBlock,
  RuleType.orderedList,
  RuleType.paragraph,
  RuleType.table,
  RuleType.unorderedList,
]);

export const markdownParserOptions: MarkdownToJSX.Options = {
  forceBlock: true,
  disableParsingRawHTML: true,
};

export type MarkdownTextNode =
  | MarkdownToJSX.TextNode
  | MarkdownToJSX.CodeInlineNode
  | MarkdownToJSX.CodeBlockNode;

export interface MarkdownVisitor {
  includeScopeBlocks: boolean;
  onText(node: object, text: string): void;
  onBlockBoundary(): void;
  onDetached(text: string): void;
}

export function isTextNode(
  node: MarkdownToJSX.ASTNode,
  includeScopeBlocks: boolean,
): node is MarkdownTextNode {
  if (!TEXT_TYPES.has(node.type)) return false;
  if (node.type === RuleType.codeBlock && !includeScopeBlocks) {
    return !isScopeBlock(node.lang, node.text);
  }
  return true;
}

export function walkMarkdown(
  source: string,
  visitor: MarkdownVisitor,
): MarkdownToJSX.ASTNode[] {
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node === null || typeof node !== 'object') return;

    const typed = node as Record<string, unknown>;
    const type = typeof typed.type === 'number' ? typed.type : undefined;

    if (type !== undefined) {
      const astNode = node as MarkdownToJSX.ASTNode;
      if (type === RuleType.codeBlock) {
        if (isTextNode(astNode, visitor.includeScopeBlocks)) {
          visitor.onBlockBoundary();
          visitor.onText(astNode, astNode.text);
          visitor.onBlockBoundary();
        }
        return;
      }
      if (isTextNode(astNode, visitor.includeScopeBlocks)) {
        visitor.onText(astNode, astNode.text);
        return;
      }
    }

    const isBlock = type !== undefined && BLOCK_TYPES.has(type);
    if (isBlock) visitor.onBlockBoundary();

    for (const key of ['children', 'content']) {
      if (typed[key] !== undefined) walk(typed[key]);
    }
    for (const key of ['items', 'header', 'cells']) {
      const rows = typed[key];
      if (Array.isArray(rows)) {
        for (const row of rows) {
          visitor.onBlockBoundary();
          walk(row);
          visitor.onBlockBoundary();
        }
      }
    }
    const refs = typed.refs;
    if (refs !== null && typeof refs === 'object') {
      for (const ref of Object.values(refs as Record<string, unknown>)) {
        const target = (ref as { target?: unknown } | null)?.target;
        if (typeof target === 'string' && target !== '') {
          visitor.onBlockBoundary();
          visitor.onDetached(target);
          visitor.onBlockBoundary();
        }
      }
    }
    if (isBlock) visitor.onBlockBoundary();
  };

  const ast = parser(source, markdownParserOptions);
  walk(ast);
  return ast;
}
