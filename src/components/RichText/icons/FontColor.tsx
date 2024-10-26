import * as React from 'react';
import type { SVGProps } from 'react';
const SvgFontColor = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    viewBox="0 0 512 512"
    {...props}
  >
    <path
      fill="#777"
      d="M221.631 109 109.92 392h58.055l24.079-61h127.892l24.079 61h58.055L290.369 109Zm-8.261 168L256 169l42.63 108Z"
    />
  </svg>
);
export default SvgFontColor;
