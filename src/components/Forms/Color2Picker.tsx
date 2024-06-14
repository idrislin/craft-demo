import { ColorLensOutlined } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { ChromePicker } from "react-color";

interface ColorPickerProps {
  label: string;
  value: string;
  labelHidden?: boolean;
  onChange: (value: string) => void;
}

const Color2Picker: React.FC<ColorPickerProps> = (props) => {
  const { label, value, labelHidden = false, onChange } = props;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      setActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      {!labelHidden && (
        <label className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
      )}
      <div className="relative flex flex-col items-center" ref={wrapperRef}>
        <div
          onClick={() => setActive(true)}
          className="flex items-center w-full px-2 border border-gray-300 border-solid rounded focus:ring-2 focus:ring-inset focus:ring-indigo-600"
        >
          <ColorLensOutlined style={{ color: value, width: 18 }} />
          <input
            value={value}
            className="textfield !ring-0"
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
        {active && (
          <ChromePicker
            color={value}
            className="!shadow-xl top-9 absolute z-[999]"
            onChange={(color) => onChange(color.hex)}
          />
        )}
      </div>
    </div>
  );
};

export default Color2Picker;
