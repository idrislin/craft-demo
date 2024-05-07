import React from "react";
import UserComponent from "../UserComponent";
import {
  UserComponent as CUserComponent,
  Element,
  useNode,
} from "@craftjs/core";
import Color2Picker from "../Form/Color2Picker";
import Slider from "../Form/Slider";

interface ContainerProps {
  children?: React.ReactNode;
  background?: string;
  padding?: number;
}

const Container: CUserComponent<ContainerProps> = (props) => {
  return (
    <UserComponent>
      <Element is="div" className="mx-auto max-w-none">
        {props.children}
      </Element>
    </UserComponent>
  );
};

export default Container;

export const CardSettings = () => {
  const {
    actions: { setProp },
    padding,
    background,
  } = useNode<ContainerProps>((node) => ({
    actions: node.data.props.actions,
    background: node.data.props.background,
    padding: node.data.props.padding,
  }));

  return (
    <div className="flex flex-col gap-2">
      <Color2Picker
        label="背景颜色"
        value={background ?? ""}
        defaultValue="#FFFFFF"
        onChange={(color) => {
          setProp((props: ContainerProps) => (props.background = color), 500);
        }}
      />
      <Slider
        label="内边距"
        max={100}
        min={0}
        value={padding ?? 16}
        onChange={(v) => {
          setProp((props: ContainerProps) => (props.padding = v));
        }}
      />
    </div>
  );
};

Container.craft = {
  props: {
    padding: 16,
    background: "#FFFFFF",
  },
  related: {
    settings: CardSettings,
  },
};
