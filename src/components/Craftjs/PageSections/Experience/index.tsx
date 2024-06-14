import {
  UserComponent as CUserComponent,
  Element,
  useNode,
} from "@craftjs/core";

import ExperienceEntry, {
  EmptyExperienceEntry,
  ExperienceEntryParams,
} from "./ExperienceEntry";

import { BaseElementsProps } from "@/components/LayoutSettingsPanel";
import { Resizer } from "@/components/Craftjs/Resizer";
import { Slider, Text } from "@/components/Forms";

interface ExperienceProps extends BaseElementsProps {
  title?: string;
  dividerColor?: string;
  entries?: ExperienceEntryParams[];
  gap?: string;
}

const Experience: CUserComponent<ExperienceProps> = (props) => {
  const {
    margin = [0, 0, 0, 0],
    padding = [0, 0, 0, 0],
    title,
    dividerColor,
    entries,
    gap = "0px",
  } = props;

  return (
    <Resizer
      className="!w-full flex flex-col justify-start min-h-[80px]"
      style={{
        margin: margin.join("px ") + "px",
        padding: padding.join("px ") + "px",
      }}
      enable={false}
    >
      <Text
        value={title ?? ""}
        className="w-full text-lg font-medium text-center text-black whitespace-pre-wrap"
      />
      <div
        className="w-full h-px my-1 bg-[#030303]"
        style={{ backgroundColor: dividerColor }}
      />
      <div className="flex flex-col w-full" style={{ gap }}>
        {entries?.map((entry) => (
          <Element
            entry={entry}
            is={ExperienceEntry}
            id={entry.id}
            key={entry.id}
          />
        ))}
      </div>
    </Resizer>
  );
};

export default Experience;

const ExperienceSettings = () => {
  const {
    actions: { setProp },
    entries,
    gap,
  } = useNode<ExperienceProps>((node) => ({
    entries: node.data.props.entries,
    gap: node.data.props.gap,
  }));

  return (
    <div className="flex flex-col gap-3 p-5 text-sm">
      <Slider
        min={0}
        max={100}
        label="Gap(px)"
        value={Number(gap?.replace("px", ""))}
        onChange={(v) => {
          setProp((props: ExperienceProps) => {
            props.gap = v + "px";
          });
        }}
      />
      <button
        className="outlinedButton"
        onClick={() => {
          if (!entries) return;
          const res = [...entries];
          res.push({
            ...EmptyExperienceEntry,
            id: `Entry ${entries.length + 1}`,
          });
          setProp((props: ExperienceProps) => {
            props.entries = res;
          });
        }}
      >
        New Entry
      </button>
    </div>
  );
};

Experience.craft = {
  displayName: "Experience",
  defaultProps: {
    padding: [6, 12, 6, 12],
    margin: [0, 0, 6, 0],
    gap: "0px",
    entries: [EmptyExperienceEntry],
  },
  related: { settings: ExperienceSettings },
};
