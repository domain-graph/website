import React from 'react';

export const Logo = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement>
>((props, ref) => (
  <svg
    ref={ref}
    width="500"
    height="500"
    viewBox="0 0 500 500"
    {...props}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="250" cy="250" r="250" stroke="none" fill="#81b29a" />
    <path
      d="M300 120 L120 300"
      stroke-width="25"
      stroke="#e07a5f"
      fill="none"
    />
    <path
      d="M120 300 L300 380"
      stroke-width="25"
      stroke="#3d405b"
      fill="none"
    />
    <circle
      cx="300"
      cy="120"
      r="60"
      stroke="#e07a5f"
      fill="#f4f1de"
      stroke-width="25"
    />
    <circle
      cx="120"
      cy="300"
      r="60"
      stroke="#e07a5f"
      fill="#f4f1de"
      stroke-width="25"
    />
    <circle
      cx="300"
      cy="380"
      r="60"
      stroke="#3d405b"
      fill="#f4f1de"
      stroke-width="25"
    />
  </svg>
));
