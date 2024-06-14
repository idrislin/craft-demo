import React, { useState } from "react";
import { useImmer } from "use-immer";
import { useUpdateEffect } from "ahooks";
import { first } from "lodash";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

import { Slider } from "~/components/Forms";

export interface BaseElementsProps {
  margin?: number[];
  padding?: number[];
}

interface LayoutSettingsPanelProps extends BaseElementsProps {
  onPaddingChange: (props: number[]) => void;
  onMarginChange: (props: number[]) => void;
}

const LayoutSettingsPanel: React.FC<LayoutSettingsPanelProps> = (props) => {
  const { margin, padding, onMarginChange, onPaddingChange } = props;
  return (
    <>
      <LayoutSlider
        label="外边距"
        value={margin ?? [0, 0, 0, 0]}
        onChange={(v) => onMarginChange(v)}
      />
      <LayoutSlider
        label="内边距"
        value={padding ?? [0, 0, 0, 0]}
        onChange={(v) => onPaddingChange(v)}
      />
    </>
  );
};

export default LayoutSettingsPanel;

const LayoutSlider: React.FC<{
  value: number[];
  label: string;
  onChange: (v: number[]) => void;
}> = ({ value, label, onChange }) => {
  const [more, setMore] = useState(true);
  const [details, setDetails] = useImmer(value);

  useUpdateEffect(() => {
    onChange(details);
  }, [details]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-medium text-gray-900">
            {label}
          </label>
          <p className="text-xs text-gray-500">{value.join("px ") + "px"}</p>
        </div>
        <button
          className="text-gray-500 hover:text-gray-400"
          onClick={() => setMore((prev) => !prev)}
        >
          {more ? (
            <AddCircleOutline className="max-w-5" />
          ) : (
            <RemoveCircleOutline className="max-w-5" />
          )}
        </button>
      </div>
      {more && (
        <Slider
          label=""
          max={100}
          min={0}
          labelHidden
          value={first(value) ?? 0}
          onChange={(v) => onChange([v, v, v, v])}
        />
      )}
      {!more && (
        <div className="grid grid-cols-2 gap-2">
          {value.map((v, i) => (
            <Slider
              key={i}
              label=""
              max={100}
              min={0}
              labelHidden
              value={v}
              onChange={(v) => {
                setDetails((draft) => {
                  draft[i] = v;
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
