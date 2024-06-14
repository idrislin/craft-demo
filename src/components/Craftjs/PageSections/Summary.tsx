import { UserComponent as CUserComponent, useNode } from "@craftjs/core";
import { SwapVertOutlined } from "@mui/icons-material";
import { first } from "lodash";

import { BaseElementsProps } from "@/components/LayoutSettingsPanel";
import { Resizer } from "@/components/Craftjs/Resizer";
import DragDrop from "@/components/DragDrop/Sortable";
import { Color2Picker, Text, Slider, Radio } from "@/components/Forms";

type FlexDirection = "column" | "column-reverse" | "row" | "row-reverse";

interface SummaryProps extends BaseElementsProps {
  title?: string;
  placeholder?: string;
  dividerColor?: string;
  entries?: { id: string; value: string }[];
  gap?: string;
  flexDirection?: FlexDirection;
}

const Summary: CUserComponent<SummaryProps> = (props) => {
  const {
    margin = [0, 0, 0, 0],
    padding = [0, 0, 0, 0],
    title,
    placeholder,
    dividerColor,
    entries,
    gap = "0px",
    flexDirection = "column",
  } = props;

  const {
    actions: { setProp },
  } = useNode();

  return (
    <Resizer
      className="!w-full flex flex-col justify-start min-h-[80px]"
      style={{
        margin: margin.join("px ") + "px",
        padding: padding.join("px ") + "px",
      }}
      enable={{
        top: false,
        right: false,
        bottom: true,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
    >
      <Text
        value={title ?? ""}
        className="w-full text-lg font-medium text-center text-black whitespace-pre-wrap"
      />
      <div
        className="w-full h-px my-1 bg-[#030303]"
        style={{ backgroundColor: dividerColor }}
      />
      <div className="flex" style={{ gap, flexDirection }}>
        {entries?.map((entry, i) => (
          <Text
            key={entry.id}
            value={entry.value}
            onChange={(v) => {
              if (!entries) return;
              const res = [...entries];
              res.splice(i, 1, { id: entry.id, value: v });
              setProp((props: SummaryProps) => {
                props.entries = res;
              });
            }}
            placeholder={placeholder}
            className="w-full text-sm font-normal text-black break-all whitespace-pre-wrap text-start"
          />
        ))}
      </div>
    </Resizer>
  );
};

export default Summary;

const SummarySettings = () => {
  const {
    actions: { setProp },
    dividerColor = "#030303",
    id,
    entries,
    gap,
    flexDirection,
  } = useNode<SummaryProps>((node) => ({
    flexDirection: node.data.props.flexDirection,
    dividerColor: node.data.props.dividerColor,
    entries: node.data.props.entries,
    gap: node.data.props.gap,
    dom: node.dom,
    node: node,
  }));
  const direction = ["column", "row"];

  return (
    <div className="flex flex-col gap-3 p-5 text-sm">
      <Color2Picker
        label="Divider Background"
        value={dividerColor}
        onChange={(value) => {
          setProp((props: SummaryProps) => {
            props.dividerColor = value;
          });
        }}
      />
      <div>
        <div className="flex items-center mb-1">
          <p>Sort Entry</p>
          <SwapVertOutlined className="!w-5 !h-5" />
        </div>
        <div className="flex flex-col border border-gray-300 border-solid divide-y rounded-lg">
          <DragDrop
            id={"summary" + id}
            renderItem={(item) => <div>{item}</div>}
            items={(entries ?? []).map((entry) => entry.id)}
            onDragEnd={(actityIndex, overIndex) => {
              const res = [...(entries ?? [])];
              const spliceValue = first(res.splice(actityIndex, 1));
              if (!spliceValue) return;
              res.splice(overIndex, 0, spliceValue);
              setProp((props: SummaryProps) => {
                props.entries = res;
              });
            }}
          />
        </div>
      </div>
      <div>
        <p className="">Entry Direction</p>
        <div className="grid grid-cols-2">
          {direction.map((v) => (
            <Radio
              key={v}
              label={v}
              checked={flexDirection === v}
              onChange={() => {
                setProp((props: SummaryProps) => {
                  props.flexDirection = v as FlexDirection;
                });
              }}
            />
          ))}
        </div>
      </div>
      <Slider
        min={0}
        max={100}
        label="Gap(px)"
        value={Number(gap?.replace("px", ""))}
        onChange={(v) => {
          setProp((props: SummaryProps) => {
            props.gap = v + "px";
          });
        }}
      />
      <button
        className="outlinedButton"
        onClick={() => {
          if (!entries) return;
          const res = [...entries];
          res.push({ id: `Entry ${entries.length + 1}`, value: "" });
          setProp((props: SummaryProps) => {
            props.entries = res;
          });
        }}
      >
        New Entry
      </button>
    </div>
  );
};

Summary.craft = {
  displayName: "Summary",
  defaultProps: {
    padding: [6, 12, 6, 12],
    margin: [0, 0, 6, 0],
    gap: "0px",
    entries: [{ id: "Entry 1", value: "" }],
  },
  related: { settings: SummarySettings },
};
