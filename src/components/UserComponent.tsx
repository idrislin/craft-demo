import { useNode } from "@craftjs/core";
import clsx from "clsx";
import React from "react";

interface UserComponentProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

const UserComponent: React.FC<UserComponentProps> = (props) => {
  const { as = "div", children, className, ...leftProps } = props;
  const Component = as;

  const {
    connectors: { connect, drag },
    hasSelectedNode,
  } = useNode((node) => ({
    name: node.data.name,
    hasSelectedNode: node.events.selected,
  }));

  return (
    <Component
      ref={(ref: HTMLElement) => ref && connect(drag(ref))}
      className={clsx(
        hasSelectedNode ? "outline-blue-500" : "outline-transparent",
        "relative  w-min outline-dashed outline-1",

        className
      )}
      {...leftProps}
    >
      {children}
    </Component>
  );
};

export default UserComponent;
