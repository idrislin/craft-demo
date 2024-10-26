import * as React from 'react';
import type { SVGProps } from 'react';
const SvgBackgound = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 48 48"
    {...props}
  >
    <path fill="#fff" fillOpacity={0.01} d="M0 0h48v48H0z" />
    <path
      fill="#777"
      fillRule="evenodd"
      d="M37 37a4 4 0 0 0 4-4q0-2.21-4-6-4 3.79-4 6a4 4 0 0 0 4 4"
      clipRule="evenodd"
    />
    <path
      stroke="#777"
      strokeLinecap="round"
      strokeWidth={4}
      d="m20.854 5.504 3.535 3.536"
    />
    <path
      stroke="#777"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M23.682 8.333 8.125 23.889 19.44 35.203l15.556-15.557z"
    />
    <path
      stroke="#777"
      strokeLinecap="round"
      strokeWidth={4}
      d="m12 20.073 16.961 5.577M4 43h40"
    />
  </svg>
);
export default SvgBackgound;
