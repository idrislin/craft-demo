import React from "react";

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

const Slider: React.FC<SliderProps> = (props) => {
  const { label, value, onChange, ...leftProps } = props;

  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>

      <div className="flex items-center gap-2">
        <input
          value={value}
          type="range"
          className="w-full"
          onChange={(e) => onChange(Math.ceil(parseFloat(e.target.value)))}
          {...leftProps}
        />
        <input
          value={value}
          onChange={(event) => {
            if (/\D/.test(event.target.value)) {
              return;
            }
            onChange(Math.ceil(parseFloat(event.target.value)));
          }}
          {...leftProps}
          className="outline-none px-2 block w-12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};

export default Slider;
