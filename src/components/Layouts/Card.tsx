import React from "react";
import UserComponent from "../UserComponent";
import { UserComponent as CUserComponent, useNode } from "@craftjs/core";
import Color2Picker from "../Form/Color2Picker";
import LayoutSettingsPanel, { BaseElementsProps } from "../LayoutSettingsPanel";
import Slider from "../Form/Slider";
import Accordion from "../Animation/Accordion";
import SelectMenus from "../Form/SelectMenus";
import clsx from "clsx";

interface CardProps extends BaseElementsProps {
  children?: React.ReactNode;
  background?: string;
  borderRadius?: number;
  color?: string;
  shadow?: string;
}

const Card: CUserComponent<CardProps> = (props) => {
  const {
    margin = [0, 0, 0, 0],
    padding = [0, 0, 0, 0],
    background,
    borderRadius,
    color,
    shadow = "base",
  } = props;

  const shadowMap = new Map([
    ["none", "shdow-none"],
    ["sm", "shadow-sm"],
    ["base", "shadow"],
    ["md", "shdow-md"],
    ["lg", "shdow-lg"],
    ["xl", "shdow-xl"],
    ["2xl", "shdow-2xl"],
  ]);

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
        "!w-auto p-4 bg-white sm:rounded-lg",
        shadowMap.get(shadow)
      )}
    >
      {props.children}
    </UserComponent>
  );
};

export default Card;

export const CardSettings = () => {
  const {
    actions: { setProp },
    padding,
    background,
    margin,
    borderRadius,
    color,
  } = useNode<CardProps>((node) => ({ ...node.data.props }));

  return (
    <div className="flex flex-col gap-2">
      <Accordion label="颜色">
        <Color2Picker
          label="背景颜色"
          value={background ?? "#ffffff"}
          onChange={(color) => {
            setProp((props: CardProps) => (props.background = color), 500);
          }}
        />
        <Color2Picker
          label="字体颜色"
          value={color ?? "#333333"}
          onChange={(c) => {
            setProp((props: CardProps) => (props.color = c), 500);
          }}
        />
      </Accordion>
      <Accordion label="布局" className="gap-2">
        <LayoutSettingsPanel
          margin={margin}
          padding={padding}
          onMarginChange={(v) => {
            setProp((props: CardProps) => (props.margin = v));
          }}
          onPaddingChange={(v) => {
            setProp((props: CardProps) => (props.padding = v));
          }}
        />
        <Slider
          label="圆角"
          max={32}
          min={0}
          value={Number(borderRadius ?? "0")}
          onChange={(v) => {
            setProp((props: CardProps) => (props.borderRadius = v));
          }}
        />
        <SelectMenus
          onChange={(v) => {
            setProp((props: CardProps) => {
              return (props.shadow = v);
            });
          }}
          label="阴影"
          defaultSelected="sm"
          options={[
            {
              name: "none",
              value: "none",
            },
            {
              name: "sm",
              value: "sm",
            },
            {
              name: "base",
              value: "base",
            },
            {
              name: "md",
              value: "md",
            },
            {
              name: "lg",
              value: "lg",
            },
            {
              name: "xl",
              value: "xl",
            },
            {
              name: "2xl",
              value: "2xl",
            },
          ]}
        />
      </Accordion>
    </div>
  );
};

Card.craft = {
  props: {
    padding: [16, 16, 16, 16],
    background: "#FFFFFF",
    borderRadius: 8,
    shadow: "sm",
  },
  related: {
    settings: CardSettings,
  },
};
