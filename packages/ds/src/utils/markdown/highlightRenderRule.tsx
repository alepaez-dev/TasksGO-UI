import {
  Fragment,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { RuleType, type MarkdownToJSX } from 'markdown-to-jsx';
import { HighlightedText } from '../../components/HighlightedText';
import type { MatchRange } from '../matchRanges';
import type { HighlightPlan } from './highlightPlan';
import { isTextRunNode } from './textRuns';

function nextOccurrence(
  plan: HighlightPlan,
  seen: Map<string, number>,
  text: string,
): MatchRange[] | undefined {
  const index = seen.get(text) ?? 0;
  seen.set(text, index + 1);
  return plan.byText.get(text)?.[index];
}

export function highlightRenderRule(
  next: () => ReactNode,
  node: MarkdownToJSX.ASTNode,
  state: MarkdownToJSX.State,
  plan: HighlightPlan,
  seen: Map<string, number>,
): ReactNode | undefined {
  if (!isTextRunNode(node)) return undefined;

  const nodeRanges = plan.inTree.has(node)
    ? plan.byNode.get(node)
    : nextOccurrence(plan, seen, node.text);
  if (nodeRanges === undefined || nodeRanges.length === 0) return undefined;

  const marked = <HighlightedText text={node.text} ranges={nodeRanges} />;

  if (
    node.type === RuleType.codeBlock ||
    node.type === RuleType.footnoteReference
  ) {
    const rendered = next();
    if (!isValidElement(rendered)) return undefined;
    const outer = rendered as ReactElement<{ children?: ReactNode }>;
    const inner = outer.props.children;
    if (!isValidElement(inner)) return undefined;
    return cloneElement(
      outer,
      undefined,
      cloneElement(inner as ReactElement, undefined, marked),
    );
  }
  if (node.type === RuleType.codeInline) {
    const rendered = next();
    if (!isValidElement(rendered)) return undefined;
    return cloneElement(rendered as ReactElement, undefined, marked);
  }
  return <Fragment key={state.key}>{marked}</Fragment>;
}
