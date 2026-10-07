import { Fragment, forwardRef, useMemo, type HTMLAttributes } from 'react';
import { astToJSX, RuleType, type MarkdownToJSX } from 'markdown-to-jsx/react';
import { cn } from '../../utils/cn';
import { sanitizeHref } from '../../utils/sanitizeHref';
import { linkRenderRule } from '../../utils/markdown/linkRenderRule';
import {
  textRenderRule,
  type TextRenderContext,
} from '../../utils/markdown/textRenderRule';
import { buildHighlightPlan } from '../../utils/markdown/highlightPlan';
import { parseScopeFence } from '../../utils/markdown/parseScopeBlock';
import { ScopeBlock } from './blocks/ScopeBlock';
import styles from './Markdown.module.css';

export interface MarkdownProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  source: string;
  query?: string;
  mentions?: readonly string[];
}

function buildOptions(ctx: TextRenderContext): MarkdownToJSX.Options {
  return {
    forceBlock: true,
    disableParsingRawHTML: true,
    wrapper: Fragment,
    sanitizer: (value) => (sanitizeHref(value) === '#' ? null : value),
    renderRule(next, node, renderChildren, state) {
      if (node.type === RuleType.codeBlock) {
        const scope = parseScopeFence(node.lang, node.text);
        if (scope) return <ScopeBlock key={state.key} {...scope} />;
      }
      const text = textRenderRule(next, node, state, ctx);
      if (text) return text;
      const link = linkRenderRule(node, renderChildren, state);
      if (link) return link;
      if (node.type === RuleType.gfmTask) {
        return (
          <input
            key={state.key}
            type="checkbox"
            checked={node.completed}
            readOnly
            aria-label={node.completed ? 'Completed' : 'Not completed'}
          />
        );
      }
      return next();
    },
  };
}

const NO_MENTIONS: readonly string[] = [];

export const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(
  ({ source, query = '', mentions = NO_MENTIONS, className, ...rest }, ref) => {
    const { ast, plan } = useMemo(
      () => buildHighlightPlan(source, query),
      [source, query],
    );
    const options = useMemo(
      () => buildOptions({ plan, mentions }),
      [plan, mentions],
    );
    const rendered = useMemo(
      () => astToJSX(ast as MarkdownToJSX.ASTNode[], options),
      [ast, options],
    );
    return (
      <div ref={ref} className={cn(styles.prose, className)} {...rest}>
        {rendered}
      </div>
    );
  },
);

Markdown.displayName = 'Markdown';
