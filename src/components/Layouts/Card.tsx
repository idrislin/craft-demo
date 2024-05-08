import React from "react";
import UserComponent from "../UserComponent";
import { UserComponent as CUserComponent, useNode } from "@craftjs/core";
import Color2Picker from "../Form/Color2Picker";
import LayoutSettingsPanel, { BaseElementsProps } from "../LayoutSettingsPanel";
import Slider from "../Form/Slider";

interface CardProps extends BaseElementsProps {
  children?: React.ReactNode;
  background?: string;
  borderRadius?: number;
}

const Card: CUserComponent<CardProps> = (props) => {
  const {
    margin = [0, 0, 0, 0],
    padding = [0, 0, 0, 0],
    background,
    borderRadius,
  } = props;

  return (
    <UserComponent
      style={{
        padding: padding.join("px "),
        margin: margin.join("px "),
        background,
        borderRadius: borderRadius + "px",
      }}
      className="!w-full p-4 bg-white sm:rounded-lg sm:shadow"
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
  } = useNode<CardProps>((node) => ({
    actions: node.data.props.actions,
    background: node.data.props.background,
    padding: node.data.props.padding,
    margin: node.data.props.margin,
    borderRadius: node.data.props.borderRadius,
  }));

  return (
    <div className="flex flex-col gap-2">
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
        value={borderRadius ?? 8}
        onChange={(v) => {
          setProp((props: CardProps) => (props.borderRadius = v));
        }}
      />
      <Color2Picker
        label="背景颜色"
        value={background ?? ""}
        defaultValue="#FFFFFF"
        onChange={(color) => {
          setProp((props: CardProps) => (props.background = color), 500);
        }}
      />
    </div>
  );
};

Card.craft = {
  props: {
    padding: [16, 16, 16, 16],
    background: "#FFFFFF",
    borderRadius: 8,
  },
  related: {
    settings: CardSettings,
  },
};
