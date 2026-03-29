import type { ComponentType, SVGProps } from 'react';

export function createIcon(
  path: string,
  displayName: string,
): ComponentType<SVGProps<SVGSVGElement>> {
  function SvgIcon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        <path d={path} />
      </svg>
    );
  }
  SvgIcon.displayName = displayName;
  return SvgIcon;
}
