import * as React from "react";
import type { SVGProps } from "react";
const SvgAdd = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    viewBox="0 0 10 17"
    {...props}
  >
    <path d="M10 7H6V3H4v4H0v2h4v4h2V9h4z" />
  </svg>
);
export default SvgAdd;
