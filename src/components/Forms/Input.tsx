import React from "react";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const Input: React.FC<InputProps> = (props) => {
  const { label, value, onChange, ...leftProps } = props;
  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <input
        value={value}
        className="textfield"
        onChange={(event) => onChange(event.target.value)}
        {...leftProps}
      />
    </div>
  );
};

export default Input;
