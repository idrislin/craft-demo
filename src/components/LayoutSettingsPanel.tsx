import React from "react";
import Slider from "./Form/Slider";
import { first } from "lodash";

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
    <div>
      <Slider
        label="外边距"
        max={100}
        min={0}
        value={first(margin) ?? 0}
        onChange={(v) => onMarginChange([v, v, v, v])}
      />
      <Slider
        label="内边距"
        max={100}
        min={0}
        value={first(padding) ?? 0}
        onChange={(v) => onPaddingChange([v, v, v, v])}
      />
    </div>
  );
};

export default LayoutSettingsPanel;
