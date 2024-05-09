import React from "react";

interface RadioProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

const Radio: React.FC<RadioProps> = (props) => {
  return (
    <div className="flex items-center">
      <input
        type="radio"
        checked={props.checked}
        onChange={(event) => props.onChange(event.target.checked)}
        className="w-4 h-4 text-indigo-600 border-gray-300 cursor-pointer focus:ring-indigo-600"
      />
      <label className="block ml-2 text-sm font-medium leading-6 text-gray-900">
        {props.label}
      </label>
    </div>
  );
};

export default Radio;
