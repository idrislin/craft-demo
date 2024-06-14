import React from "react";
import { UserComponent as CUserComponent, useNode } from "@craftjs/core";

import LayoutSettingsPanel, {
  BaseElementsProps,
} from "~/components/LayoutSettingsPanel";
import Accordion from "~/components/Animation/Accordion";
import { Resizer } from "~/components/Craftjs/Resizer";
import { Color2Picker, Radio, SelectMenus, Slider } from "~/components/Forms";

interface ContainerProps extends BaseElementsProps {
  children?: React.ReactNode;
  background?: string;
  color?: string;
  borderRadius?: number;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  width?: string;
  height?: string;
  shadow?: string;
}

export const ContainerSettings = () => {
  const {
    actions: { setProp },
    padding,
    background,
    margin,
    color,
    borderRadius,
    flexDirection,
    alignItems,
    justifyContent,
  } = useNode<ContainerProps>((node) => ({ ...node.data.props }));

  const direction = ["column", "row", "column-reverse", "row-reverse"];
  const align = ["start", "center", "end"];
  const shadow = ["none", "sm", "base", "md", "lg", "xl", "2xl"];

  return (
    <div className="flex flex-col gap-2">
      <Accordion label="颜色">
        <Color2Picker
          label="背景颜色"
          value={background ?? "#ffffff"}
          onChange={(color) => {
            setProp((props: ContainerProps) => {
              props.background = color;
            }, 500);
          }}
        />
        <Color2Picker
          label="字体颜色"
          value={color ?? "#333333"}
          onChange={(c) => {
            setProp((props: ContainerProps) => {
              props.color = c;
            }, 500);
          }}
        />
      </Accordion>
      <Accordion label="布局" className="gap-2">
        <LayoutSettingsPanel
          margin={margin}
          padding={padding}
          onMarginChange={(v) => {
            setProp((props: ContainerProps) => {
              props.margin = v;
            });
          }}
          onPaddingChange={(v) => {
            setProp((props: ContainerProps) => {
              props.padding = v;
            });
          }}
        />
        <Slider
          min={0}
          max={32}
          label="圆角"
          value={Number(borderRadius ?? "0")}
          onChange={(v) => {
            setProp((props: ContainerProps) => {
              props.borderRadius = v;
            });
          }}
        />
        <SelectMenus
          label="阴影"
          defaultSelected="sm"
          options={shadow.map((v) => ({
            name: v,
            value: v,
          }))}
          onChange={(v) => {
            setProp((props: ContainerProps) => {
              props.shadow = v;
            });
          }}
        />
      </Accordion>
      <Accordion label="对齐" className="grid grid-cols-2 gap-2">
        <div className="flex flex-col col-span-2">
          <p className="text-xs text-gray-500">Flex Direction</p>
          {direction.map((v) => (
            <Radio
              key={v}
              label={v}
              checked={flexDirection === v}
              onChange={() => {
                setProp((props: ContainerProps) => {
                  props.flexDirection = v;
                });
              }}
            />
          ))}
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-gray-500">Align Items</p>
          {align.map((v) => (
            <Radio
              key={v}
              label={v}
              checked={alignItems === v}
              onChange={() => {
                setProp((props: ContainerProps) => {
                  props.alignItems = v;
                });
              }}
            />
          ))}
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-gray-500">Justify Content</p>
          {align.map((v) => (
            <Radio
              key={v}
              label={v}
              id={"justifContent" + v}
              checked={justifyContent === v}
              onChange={() => {
                setProp((props: ContainerProps) => {
                  props.justifyContent = v;
                });
              }}
            />
          ))}
        </div>
      </Accordion>
    </div>
  );
};

type FlexDirection = "column" | "column-reverse" | "row" | "row-reverse";

const Container: CUserComponent<ContainerProps> = (props) => {
  const {
    margin = [0, 0, 0, 0],
    padding = [0, 0, 0, 0],
    background,
    color,
    borderRadius,
    flexDirection,
    alignItems,
    justifyContent,
    shadow,
  } = props;

  const shadowMap = new Map([
    ["none", "none"],
    ["sm", "0 1px 2px 0 rgb(0 0 0 / 0.05)"],
    ["base", "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"],
    ["md", "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"],
    [
      "lg",
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    ],
    [
      "xl",
      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    ],
    ["2xl", "0 25px 50px -12px rgb(0 0 0 / 0.25)"],
  ]);

  return (
    <Resizer
      style={{
        color,
        background,
        alignItems,
        justifyContent,
        borderRadius: borderRadius + "px",
        margin: margin.join("px ") + "px",
        padding: padding.join("px ") + "px",
        flexDirection: flexDirection as FlexDirection,
        boxShadow:
          shadow && shadow !== "none"
            ? `0 0 #0000, 0 0 #0000, ${shadowMap.get(shadow)}`
            : "none",
      }}
      className="min-w-[100px] h-full w-full flex min-h-[100px]"
    >
      {props.children}
    </Resizer>
  );
};

Container.craft = {
  displayName: "Container",
  defaultProps: {
    padding: [16, 16, 16, 16],
    background: "transparent",
    color: "#333333",
    borderRadius: 0,
    flexDirection: "column",
    justifyContent: "start",
    alignItems: "start",
    width: "100%",
    height: "auto",
  },
  rules: { canDrag: () => true },
  related: { settings: ContainerSettings },
};

export default Container;
