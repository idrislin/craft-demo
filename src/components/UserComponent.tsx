import { useNode } from "@craftjs/core";
import clsx from "clsx";
import React from "react";

type UserComponentProps<T extends React.ElementType> = {
  children?: React.ReactNode;
  as?: T;
  className?: string;
  style?: React.CSSProperties;
} & React.ComponentProps<T>;

function UserComponent<T extends React.ElementType>(
  props: UserComponentProps<T>
) {
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
}

export default UserComponent;
