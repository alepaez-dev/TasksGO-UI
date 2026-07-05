import type { ReactNode } from 'react';
import { RuleType, type MarkdownToJSX } from 'markdown-to-jsx';
import { sanitizeHref } from '../sanitizeHref';

export function linkRenderRule(
  node: MarkdownToJSX.ASTNode,
  renderChildren: MarkdownToJSX.ASTRender,
  state: MarkdownToJSX.State,
): ReactNode | undefined {
  if (node.type === RuleType.link) {
    return (
      <a
        key={state.key}
        href={node.target == null ? '#' : sanitizeHref(node.target)}
        title={node.title || undefined}
        rel="noopener noreferrer"
      >
        {renderChildren(node.children, state)}
      </a>
    );
  }
  return undefined;
}
