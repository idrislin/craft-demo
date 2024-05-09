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
  } = useNode((node) => ({ name: node.data.name }));

  return (
    <Component
      {...leftProps}
      className={clsx("w-min", className)}
      ref={(ref: HTMLElement) => ref && connect(drag(ref))}
    >
      {children}
    </Component>
  );
};

export default UserComponent;
