import React from 'react';

interface RadioProps {
  label: string;
  id?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

const Radio: React.FC<RadioProps> = (props) => {
  return (
    <div className="flex items-center">
      <input
        type="radio"
        id={props.id ?? props.label}
        checked={props.checked}
        onChange={(event) => props.onChange(event.target.checked)}
        className="w-4 h-4 cursor-pointer custom-radio"
      />
      <label
        htmlFor={props.id ?? props.label}
        className="block ml-2 text-[14px] font-medium leading-6 text-gray-900"
      >
        {props.label}
      </label>
    </div>
  );
};

export default Radio;
