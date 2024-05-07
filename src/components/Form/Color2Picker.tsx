import React from "react";
import ColorPicker from "material-ui-color-picker";

interface ColorPickerProps {
  label: string;
  value: string;
  defaultValue?: string;
  onChange: (value: string) => void;
}

const Color2Picker: React.FC<ColorPickerProps> = (props) => {
  const { label, value, onChange, defaultValue } = props;
  return (
    <div>
      <label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="relative">
        <p className="absolute bottom-1 left-2">{value?.toUpperCase()}</p>
        <ColorPicker
          className="w-full text-transparent"
          inputProps={{ className: "!text-transparent" }}
          defaultValue={defaultValue}
          onChange={(color) => {
            if (!color) return;
            onChange(color);
          }}
        />
      </div>
    </div>
  );
};

export default Color2Picker;
