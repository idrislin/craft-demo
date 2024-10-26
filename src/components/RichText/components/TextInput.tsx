import React, { HTMLInputTypeAttribute } from 'react';

interface TextInputProps {
  label: string;
  value: string;
  placeholder?: string;
  'data-test-id'?: string;
  type?: HTMLInputTypeAttribute;
  onChange: (val: string) => void;
}

const TextInput: React.FC<TextInputProps> = (props) => {
  const {
    label,
    value,
    onChange,
    type = 'text',
    placeholder = '',
    'data-test-id': dataTestId,
  } = props;

  return (
    <div className="flex items-center mb-2.5 gap-3">
      <label className="flex flex-1 text-[#666]">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        data-test-id={dataTestId}
        onChange={(e) => onChange(e.target.value)}
        className="flex flex-[2] border border-solid border-[#999] py-2 px-2.5 rounded min-w-[250px]"
      />
    </div>
  );
};

export default TextInput;
