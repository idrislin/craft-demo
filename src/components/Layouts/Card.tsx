import React from "react";
import UserComponent from "../UserComponent";
import {
  UserComponent as CUserComponent,
  Element,
  useNode,
} from "@craftjs/core";
import Text from "../Elements/Text";
import Button from "../Elements/Button";
import Color2Picker from "../Form/Color2Picker";
import Slider from "../Form/Slider";

interface CardProps {
  children?: React.ReactNode;
  background?: string;
  padding?: number;
}

export const CardTop: CUserComponent = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode();
  return <div ref={(ref) => ref && connect(ref)}>{children}</div>;
};

CardTop.craft = {
  rules: {
    canMoveIn: (incomingNodes) =>
      incomingNodes.every((incomingNode) => incomingNode.data.type === Text),
  },
};

export const CardBottom: CUserComponent = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode();
  return <div ref={(ref) => ref && connect(ref)}>{children}</div>;
};

CardBottom.craft = {
  rules: {
    canMoveIn: (incomingNodes) =>
      incomingNodes.every((incomingNode) => incomingNode.data.type === Button),
  },
};

const Card: CUserComponent<CardProps> = (props) => {
  const { padding, background } = props;

  return (
    <UserComponent
      style={{ padding: padding + "px", background }}
      className="!w-full p-4 bg-white sm:rounded-lg sm:shadow"
    >
      <Element id="text" is={CardTop} canvas>
        <Text text="Title" />
        <Text text="Subtitle" />
      </Element>
      <Element id="buttons" is={CardBottom} canvas>
        <Button size="sm" text="Learn more" />
      </Element>
    </UserComponent>
  );
};

export default Card;

export const CardSettings = () => {
  const {
    actions: { setProp },
    padding,
    background,
  } = useNode<CardProps>((node) => ({
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
          setProp((props: CardProps) => (props.background = color), 500);
        }}
      />
      <Slider
        label="内边距"
        max={100}
        min={0}
        value={padding ?? 16}
        onChange={(v) => {
          setProp((props: CardProps) => (props.padding = v));
        }}
      />
    </div>
  );
};

Card.craft = {
  props: {
    padding: 16,
    background: "#FFFFFF",
  },
  related: {
    settings: CardSettings,
  },
};
