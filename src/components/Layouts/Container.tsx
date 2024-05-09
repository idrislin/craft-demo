import React from "react";
import UserComponent from "../UserComponent";
import { UserComponent as CUserComponent, useNode } from "@craftjs/core";
import Color2Picker from "../Form/Color2Picker";
import Slider from "../Form/Slider";
import LayoutSettingsPanel, { BaseElementsProps } from "../LayoutSettingsPanel";
import Accordion from "../Animation/Accordion";
import Radio from "../Form/Radio";
import clsx from "clsx";

interface ContainerProps extends BaseElementsProps {
  children?: React.ReactNode;
  background?: string;
  color?: string;
  borderRadius?: number;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
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

  const direction = ["row", "col", "row-reverse", "col-reverse"];
  const align = ["start", "center", "end"];

  return (
    <div className="flex flex-col gap-2">
      <Accordion label="颜色">
        <Color2Picker
          label="背景颜色"
          value={background ?? "#ffffff"}
          onChange={(color) => {
            setProp((props: ContainerProps) => (props.background = color), 500);
          }}
        />
        <Color2Picker
          label="字体颜色"
          value={color ?? "#333333"}
          onChange={(c) => {
            setProp((props: ContainerProps) => (props.color = c), 500);
          }}
        />
      </Accordion>
      <Accordion label="布局" className="gap-2">
        <LayoutSettingsPanel
          margin={margin}
          padding={padding}
          onMarginChange={(v) => {
            setProp((props: ContainerProps) => (props.margin = v));
          }}
          onPaddingChange={(v) => {
            setProp((props: ContainerProps) => (props.padding = v));
          }}
        />
        <Slider
          label="圆角"
          max={32}
          min={0}
          value={Number(borderRadius ?? "0")}
          onChange={(v) => {
            setProp((props: ContainerProps) => (props.borderRadius = v));
          }}
        />
      </Accordion>
      <Accordion label="对齐" className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <p className="text-xs text-gray-500">Flex Direction</p>
          {direction.map((v) => (
            <Radio
              label={v}
              key={v}
              checked={flexDirection === `flex-${v}`}
              onChange={() => {
                setProp(
                  (props: ContainerProps) => (props.flexDirection = `flex-${v}`)
                );
              }}
            />
          ))}
        </div>
        <div />
        <div className="flex flex-col">
          <p className="text-xs text-gray-500">Align Items</p>
          {align.map((v) => (
            <Radio
              label={v}
              key={v}
              checked={alignItems === `items-${v}`}
              onChange={() => {
                setProp(
                  (props: ContainerProps) => (props.alignItems = `items-${v}`)
                );
              }}
            />
          ))}
        </div>
        <div className="flex flex-col">
          <p className="text-xs text-gray-500">Justify Content</p>
          {align.map((v) => (
            <Radio
              label={v}
              key={v}
              checked={justifyContent === `justify-${v}`}
              onChange={() => {
                setProp(
                  (props: ContainerProps) =>
                    (props.justifyContent = `justify-${v}`)
                );
              }}
            />
          ))}
        </div>
      </Accordion>
    </div>
  );
};

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
  } = props;

  return (
    <UserComponent
      style={{
        padding: padding.join("px ") + "px",
        margin: margin.join("px ") + "px",
        background,
        color,
        borderRadius: borderRadius + "px",
      }}
      className={clsx(
        "min-w-[100px] flex !w-[unset] min-h-[100px]",
        flexDirection,
        alignItems,
        justifyContent
      )}
    >
      {props.children}
    </UserComponent>
  );
};

Container.craft = {
  displayName: "Container",
  props: {
    padding: [16, 16, 16, 16],
    background: "transparent",
    color: "#333333",
    borderRadius: 0,
    flexDirection: "col",
    justifyContent: "justify-start",
    alignItems: "items-start",
  },
  rules: { canDrag: () => true },
  related: { settings: ContainerSettings },
};

export default Container;
