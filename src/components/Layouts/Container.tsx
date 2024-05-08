import React from "react";
import UserComponent from "../UserComponent";
import { UserComponent as CUserComponent, useNode } from "@craftjs/core";
import Color2Picker from "../Form/Color2Picker";
import Slider from "../Form/Slider";
import { BaseElementsProps } from "../LayoutSettingsPanel";
import { first } from "lodash";

interface ContainerProps extends BaseElementsProps {
  children?: React.ReactNode;
  background?: string;
}

export const ContainerContent: CUserComponent = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode();
  return <div ref={(ref) => ref && connect(ref)}>{children}</div>;
};

const Container: CUserComponent<ContainerProps> = (props) => {
  const { margin = [0, 0, 0, 0], padding = [0, 0, 0, 0], background } = props;

  return (
    <UserComponent
      style={{
        padding: padding.join("px "),
        margin: margin.join("px "),
        background,
      }}
      className="min-w-[100px] !w-full min-h-[100px]"
    >
      {props.children}
    </UserComponent>
  );
};

export default Container;

export const ContainerSettings = () => {
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
        value={first(padding) ?? 16}
        onChange={(v) => {
          setProp((props: ContainerProps) => (props.padding = [v, v, v, v]));
        }}
      />
    </div>
  );
};

Container.craft = {
  displayName: "Container",
  props: {
    padding: [16, 16, 16, 16],
    background: "transparent",
  },
  rules: { canDrag: () => true },
  related: { settings: ContainerSettings },
};
