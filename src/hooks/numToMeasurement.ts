export const isPercentage = (val: string) => {
  return typeof val === "string" && val.indexOf("%") > -1;
};

export const percentToPx = (value: string, comparativeValue: number) => {
  if (!value) return;
  if (value.indexOf("px") > -1 || value === "auto" || !comparativeValue)
    return value;
  const percent = parseInt(value);
  return (percent / 100) * comparativeValue + "px";
};
export const pxToPercent = (value: number, comparativeValue: number) => {
  const val = (Math.abs(value) / comparativeValue) * 100;
  if (value < 0) return -1 * val;
  else return Math.min(100, Math.round(val));
};
export const getElementDimensions = (element: HTMLElement) => {
  const computedStyle = getComputedStyle(element);

  let height = element.clientHeight,
    width = element.clientWidth; // width with padding

  height -=
    parseFloat(computedStyle.paddingTop) +
    parseFloat(computedStyle.paddingBottom);
  width -=
    parseFloat(computedStyle.paddingLeft) +
    parseFloat(computedStyle.paddingRight);

  return { width, height };
};
