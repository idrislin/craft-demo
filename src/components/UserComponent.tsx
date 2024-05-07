import { useNode } from "@craftjs/core";
import clsx from "clsx";
import React from "react";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";

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
    name,
  } = useNode((node) => ({
    name: node.data.name,
    hasSelectedNode: node.events.selected,
    hasDraggedNode: node.events.dragged,
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
      <div
        className={clsx(
          hasSelectedNode ? "flex" : `hidden`,
          "absolute gap-1 items-center justify-center top-0 z-[9999] left-0 -translate-y-full text-sm text-white px-2 py-0.5 bg-blue-500"
        )}
      >
        <DragIndicatorOutlinedIcon className="max-h-4 max-w-4 cursor-grab" />
        {name}
      </div>
      {children}
    </Component>
  );
};

export default UserComponent;
