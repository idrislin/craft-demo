import React, { useState } from "react";
import clsx from "clsx";

interface AccordionProps {
  children: React.ReactNode;
  label: string;
  rightContent?: React.ReactNode;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = (props) => {
  const { children, label, rightContent, className } = props;
  const [visible, setVisible] = useState(false);

  return (
    <div className="w-full px-4 pb-2 border-b border-gray-200 border-solid">
      <button
        className="flex items-center justify-between w-full text-sm h-9"
        onClick={() => setVisible(!visible)}
      >
        <p className="font-semibold">{label}</p>
        {rightContent}
      </button>
      {visible && (
        <div className={clsx("flex flex-col w-full", className)}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
