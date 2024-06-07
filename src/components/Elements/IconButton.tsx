import React from "react";

interface IconButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { onClick, children } = props;
  return (
    <button
      onClick={onClick}
      className="px-1.5 text-gray-400 cursor-pointer hover:text-primary"
    >
      {children}
    </button>
  );
};

export default IconButton;
