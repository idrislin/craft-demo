import React from "react";

interface SliderProps {
  label: string;
  labelHidden?: boolean;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

const Slider: React.FC<SliderProps> = (props) => {
  const { label, value, labelHidden = false, onChange, ...leftProps } = props;

  return (
    <div className="w-full">
      {!labelHidden && (
        <label className="block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}

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
            if (/\D/.test(event.target.value)) return;
            onChange(Math.ceil(parseFloat(event.target.value)));
          }}
          {...leftProps}
          className="textfield !w-10 !text-xs"
        />
      </div>
    </div>
  );
};

export default Slider;
