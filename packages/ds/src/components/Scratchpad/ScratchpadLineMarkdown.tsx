import { createElement, Fragment, type ReactNode } from 'react';
import MarkdownRenderer, { type MarkdownToJSX } from 'markdown-to-jsx';
import { sanitizeHref } from '../../utils/sanitizeHref';
import { linkRenderRule } from '../../utils/markdown/linkRenderRule';
import { splitLineTokens } from './tokens';
import { TokenBadge, type TokenBadgeHandlers } from './TokenBadge';

const HEADING = /^(#{1,6})\s+/;

const renderRule: NonNullable<MarkdownToJSX.Options['renderRule']> = (
  next,
  node,
  renderChildren,
  state,
) => {
  const link = linkRenderRule(node, renderChildren, state);
  return link ?? next();
};

// Each physical line renders as INLINE markdown so inline marks (bold, italic,
// code, links) work, while block markers on later lines (e.g. `##`, `- `) stay
// literal — a whole row is one block, matching how a heading/paragraph behaves.
const inlineOptions: MarkdownToJSX.Options = {
  forceInline: true,
  disableParsingRawHTML: true,
  wrapper: Fragment,
  sanitizer: (value) => (sanitizeHref(value) === '#' ? null : value),
  renderRule,
};

function inlineLine(key: string, value: string): ReactNode {
  return (
    <MarkdownRenderer key={key} options={inlineOptions}>
      {value}
    </MarkdownRenderer>
  );
}

export interface ScratchpadLineMarkdownProps extends TokenBadgeHandlers {
  lineId: string;
  text: string;
  highlightBadges: boolean;
}

export function ScratchpadLineMarkdown({
  lineId,
  text,
  highlightBadges,
  ...handlers
}: ScratchpadLineMarkdownProps): ReactNode {
  const heading = HEADING.exec(text);
  // Physical lines (soft breaks within one row) render on their own line.
  const lines = text.split('\n');

  if (heading) {
    const level = heading[1].length;
    // Strip only the first line's marker: the whole row is one heading of that
    // level and later lines keep their literal text.
    lines[0] = lines[0].slice(heading[0].length);
    return createElement(
      `h${level}`,
      null,
      lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {inlineLine(`${lineId}:L${i}`, line)}
        </Fragment>
      )),
    );
  }

  const renderLineBody = (line: string, i: number): ReactNode => {
    if (!highlightBadges) return inlineLine(`${lineId}:L${i}`, line);
    const scope = lines.length > 1 ? `${lineId}:L${i}` : lineId;
    return splitLineTokens(scope, line).map((seg) =>
      seg.type === 'text' ? (
        inlineLine(seg.key, seg.value)
      ) : (
        <TokenBadge
          key={seg.id}
          id={seg.id}
          tokenKey={seg.tokenKey}
          {...handlers}
        />
      ),
    );
  };

  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {renderLineBody(line, i)}
        </Fragment>
      ))}
    </>
  );
}
