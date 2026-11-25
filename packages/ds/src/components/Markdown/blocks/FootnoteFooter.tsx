import {
  Children,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { HighlightedText } from '../../HighlightedText';
import type { MatchRange } from '../../../utils/matchRanges';

export interface FootnoteFooterProps extends HTMLAttributes<HTMLElement> {
  labelRanges: ReadonlyMap<string, readonly MatchRange[]>;
}

export function FootnoteFooter({
  labelRanges,
  children,
  ...rest
}: FootnoteFooterProps) {
  return (
    <footer {...rest}>
      {Children.map(children, (note) => {
        if (!isValidElement<{ children?: ReactNode }>(note)) return note;
        const [label, ...body] = Children.toArray(note.props.children);
        if (typeof label !== 'string') return note;
        const ranges = labelRanges.get(label);
        if (ranges === undefined) return note;
        return cloneElement(
          note,
          undefined,
          <HighlightedText text={label} ranges={ranges} />,
          ...body,
        );
      })}
    </footer>
  );
}
