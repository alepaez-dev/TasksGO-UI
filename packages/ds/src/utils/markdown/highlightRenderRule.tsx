import {
  Fragment,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { RuleType, type MarkdownToJSX } from 'markdown-to-jsx';
import { HighlightedText } from '../../components/HighlightedText';
import type { HighlightPlan } from './highlightPlan';
import { isTextRunNode } from './textRuns';

export function highlightRenderRule(
  next: () => ReactNode,
  node: MarkdownToJSX.ASTNode,
  state: MarkdownToJSX.State,
  plan: HighlightPlan,
): ReactNode | undefined {
  if (!isTextRunNode(node)) return undefined;

  const nodeRanges = plan.byNode.get(node) ?? plan.byText.get(node.text);
  if (nodeRanges === undefined || nodeRanges.length === 0) return undefined;

  const marked = <HighlightedText text={node.text} ranges={nodeRanges} />;

  if (node.type === RuleType.codeBlock) {
    const rendered = next();
    if (!isValidElement(rendered)) return undefined;
    const pre = rendered as ReactElement<{ children?: ReactNode }>;
    const code = pre.props.children;
    if (!isValidElement(code)) return undefined;
    return cloneElement(
      pre,
      undefined,
      cloneElement(code as ReactElement, undefined, marked),
    );
  }
  if (node.type === RuleType.codeInline) {
    const rendered = next();
    if (!isValidElement(rendered)) return undefined;
    return cloneElement(rendered as ReactElement, undefined, marked);
  }
  return <Fragment key={state.key}>{marked}</Fragment>;
}
