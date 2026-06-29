import { Fragment, forwardRef, type HTMLAttributes } from 'react';
import MarkdownRenderer, {
  RuleType,
  type MarkdownToJSX,
} from 'markdown-to-jsx';
import { cn } from '../../utils/cn';
import { sanitizeHref } from '../../utils/sanitizeHref';
import { parseScopeBlock } from '../../utils/markdown/parseScopeBlock';
import { ScopeBlock } from './blocks/ScopeBlock';
import styles from './Markdown.module.css';

export interface MarkdownProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  source: string;
}

const markdownOptions: MarkdownToJSX.Options = {
  forceBlock: true,
  disableParsingRawHTML: true,
  wrapper: Fragment,
  sanitizer: (value) => (sanitizeHref(value) === '#' ? null : value),
  renderRule(next, node, renderChildren, state) {
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
    if (node.type === RuleType.codeBlock && node.lang === 'scope') {
      const scope = parseScopeBlock(node.text);
      if (scope.included.length > 0 || scope.excluded.length > 0) {
        return <ScopeBlock key={state.key} {...scope} />;
      }
    }
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
    if (node.type === RuleType.table) {
      return (
        <div key={state.key} className={styles.tableWrap}>
          {next()}
        </div>
      );
    }
    return next();
  },
};

export const Markdown = forwardRef<HTMLDivElement, MarkdownProps>(
  ({ source, className, ...rest }, ref) => (
    <div ref={ref} className={cn(styles.prose, className)} {...rest}>
      <MarkdownRenderer options={markdownOptions}>{source}</MarkdownRenderer>
    </div>
  ),
);

Markdown.displayName = 'Markdown';
