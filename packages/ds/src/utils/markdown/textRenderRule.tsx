import {
  Fragment,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { RuleType, type MarkdownToJSX } from 'markdown-to-jsx';
import { HighlightedText } from '../../components/HighlightedText';
import { Mention } from '../../components/Markdown/inline/Mention';
import { sliceRanges, type MatchRange } from '../matchRanges';
import { mentionRanges } from '../mentionRanges';
import type { HighlightPlan } from './highlightPlan';
import { isTextRunNode } from './textRuns';

export interface TextRenderContext {
  plan: HighlightPlan;
  mentions: readonly string[];
}

type SegmentKind = 'mention' | 'plain';

function renderMentionSegments(
  text: string,
  marks: readonly MatchRange[],
  mentions: readonly MatchRange[],
): ReactNode[] {
  const parts: ReactNode[] = [];

  const pushSegment = (start: number, end: number, kind: SegmentKind): void => {
    if (start >= end) return;
    const piece = text.slice(start, end);
    const marked = (
      <HighlightedText
        text={piece}
        ranges={sliceRanges(marks, start, end - start)}
      />
    );
    parts.push(
      kind === 'mention' ? (
        <Mention key={start}>{marked}</Mention>
      ) : (
        <Fragment key={start}>{marked}</Fragment>
      ),
    );
  };

  let cursor = 0;
  for (const mention of mentions) {
    pushSegment(cursor, mention.start, 'plain');
    pushSegment(mention.start, mention.end, 'mention');
    cursor = mention.end;
  }
  pushSegment(cursor, text.length, 'plain');

  return parts;
}

export function textRenderRule(
  next: () => ReactNode,
  node: MarkdownToJSX.ASTNode,
  state: MarkdownToJSX.State,
  { plan, mentions }: TextRenderContext,
): ReactNode | undefined {
  if (!isTextRunNode(node)) return undefined;

  const nodeRanges = plan.byNode.get(node) ?? plan.byText.get(node.text);

  if (node.type === RuleType.text) {
    const handles = mentionRanges(node.text, mentions);
    const marks = nodeRanges ?? [];
    if (handles.length === 0 && marks.length === 0) return undefined;
    return (
      <Fragment key={state.key}>
        {renderMentionSegments(node.text, marks, handles)}
      </Fragment>
    );
  }

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
  const rendered = next();
  if (!isValidElement(rendered)) return undefined;
  return cloneElement(rendered as ReactElement, undefined, marked);
}
