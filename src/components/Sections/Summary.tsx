import { UserComponent as CUserComponent, useNode } from "@craftjs/core";
import {
  FormatBoldOutlined,
  FormatItalicOutlined,
  FormatUnderlined,
} from "@mui/icons-material";

import { BaseElementsProps } from "../LayoutSettingsPanel";
import Text from "../Elements/TextV2";
import { Resizer } from "../Resizer";

interface SummaryProps extends BaseElementsProps {
  title?: string;
  content?: string;
}

const Summary: CUserComponent<SummaryProps> = (props) => {
  const {
    margin = [0, 0, 0, 0],
    padding = [0, 0, 0, 0],
    title,
    content,
  } = props;
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
      <div className="w-full h-px bg-[#030303] my-1" />
      <Text
        value={content ?? ""}
        className="w-full text-sm font-normal text-black whitespace-pre-wrap text-start"
      />
    </Resizer>
  );
};

export default Summary;

const SummarySettings = () => {
  const {
    actions: { setProp },
  } = useNode<SummaryProps>((node) => ({ ...node.data.props }));

  return (
    <div className="flex flex-col gap-2 p-5 text-sm">
      <div></div>
    </div>
  );
};

Summary.craft = {
  displayName: "Summary",
  defaultProps: {
    padding: [6, 12, 6, 12],
    margin: [0, 0, 6, 0],
  },
  related: { settings: SummarySettings },
};
