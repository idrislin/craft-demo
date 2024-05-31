import React from "react";
import { UserComponent as CUserComponent, useNode } from "@craftjs/core";

import { Resizer } from "../Resizer";
import Text from "../Elements/Text";
import { BaseElementsProps } from "../LayoutSettingsPanel";

interface HeaderProps extends BaseElementsProps {
  children?: React.ReactNode;
  alignItems?: string;
  justifyContent?: string;
}

const Header: CUserComponent<HeaderProps> = (props) => {
  const {
    margin = [0, 0, 0, 0],
    padding = [0, 0, 0, 0],
    alignItems,
    justifyContent = "center",
  } = props;

  return (
    <Resizer
      style={{
        alignItems,
        justifyContent,
        margin: margin.join("px ") + "px",
        padding: padding.join("px ") + "px",
      }}
      className="!w-full flex"
      enable={{
        top: false,
        right: false,
        bottom: true,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
    >
      <Text text="Title" />
    </Resizer>
  );
};

export default Header;

Header.craft = {
  displayName: "Header",
  defaultProps: {
    alignItems: "center",
    justifyContent: "center",
  },
};
