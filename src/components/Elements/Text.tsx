import ContentEditable from "react-contenteditable";
import { UserComponent, useNode } from "@craftjs/core";
import SelectMenus from "../Form/SelectMenus";
import Color2Picker from "../Form/Color2Picker";
import clsx from "clsx";
import DragIndicatorOutlinedIcon from "@mui/icons-material/DragIndicatorOutlined";
import Slider from "../Form/Slider";

interface TextProps {
  text: string;
  fontSize?: string;
  color?: string;
  fontWeight?: string;
  margin?: { t: number; l: number; r: number; b: number };
}

const TEXTRGX = /<\/?[^>]+(>|$)/g;

//- 组件主题
const Text: UserComponent<TextProps> = (props) => {
  const {
    color,
    fontWeight,
    text,
    fontSize,
    margin = { t: 0, l: 0, r: 0, b: 0 },
  } = props;

  const {
    connectors: { connect, drag },
    actions: { setProp },
    hasSelectedNode,
    name,
  } = useNode((node) => ({
    name: node.data.name,
    hasSelectedNode: node.events.selected,
    hasDraggedNode: node.events.dragged,
  }));

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      style={{
        marginTop: margin.t + "px",
        marginRight: margin.r + "px",
        marginBottom: margin.b + "px",
        marginLeft: margin.l + "px",
      }}
      className={clsx(
        hasSelectedNode ? "outline-blue-500" : "outline-transparent",
        "relative group outline-dashed outline-1"
      )}
    >
      <div
        className={clsx(
          hasSelectedNode ? "flex" : "hidden",
          "absolute gap-1 items-center justify-center top-0 z-[9999] left-0 -translate-y-full text-sm text-white px-2 py-0.5 bg-blue-500"
        )}
      >
        <DragIndicatorOutlinedIcon className="max-h-4 max-w-4 cursor-grab" />
        {name}
      </div>
      <ContentEditable
        html={text}
        tagName="p"
        className="outline-blue-500 focus:outline-dashed hover:outline-gray-500"
        style={{ fontSize, color, fontWeight }}
        onChange={(e) => {
          setProp((props: TextProps) => {
            return (props.text = e.target.value.replace(TEXTRGX, ""));
          });
        }}
      />
    </div>
  );
};

export default Text;

//- 组件编辑样式
export const TextSettings = () => {
  const {
    actions: { setProp },
    color,
    margin,
  } = useNode<TextProps>((node) => ({
    text: node.data.props.text,
    margin: node.data.props.margin,
    fontSize: node.data.props.fontSize,
    color: node.data.props.color,
    fontWeight: node.data.props.fontWeight,
  }));

  return (
    <div className="flex flex-col gap-2">
      {/**TODO: 公共属性 */}
      <Slider
        label="外边距"
        max={100}
        min={0}
        value={margin?.t ?? 0}
        onChange={(v) => {
          setProp(
            (props: TextProps) => (props.margin = { t: v, r: v, b: v, l: v })
          );
        }}
      />

      <SelectMenus
        onChange={(v) => {
          setProp((props: TextProps) => {
            return (props.fontSize = v);
          });
        }}
        label="字体大小"
        defaultSelected="14px"
        options={[
          { name: "12px", value: "12px" },
          { name: "14px", value: "14px" },
          { name: "16px", value: "16px" },
          { name: "18px", value: "18px" },
          { name: "20px", value: "20px" },
          { name: "22px", value: "22px" },
          { name: "28px", value: "28px" },
          { name: "32px", value: "32px" },
          { name: "40px", value: "40px" },
        ]}
      />
      <Color2Picker
        label="字体颜色"
        value={color ?? "#000000"}
        defaultValue="#000000"
        onChange={(color) => {
          setProp((props: TextProps) => (props.color = color), 500);
        }}
      />
      <SelectMenus
        onChange={(v) => {
          setProp((props: TextProps) => {
            return (props.fontWeight = v);
          });
        }}
        label="字体权重"
        defaultSelected="400"
        options={[
          { name: "thin", value: "100" },
          { name: "extralight", value: "200" },
          { name: "light", value: "300" },
          { name: "normal", value: "400" },
          { name: "medium", value: "500" },
          { name: "semibold", value: "600" },
          { name: "bold", value: "700" },
          { name: "extrabold", value: "800" },
          { name: "black", value: "900" },
        ]}
      />
    </div>
  );
};

Text.craft = {
  name: "Text",
  displayName: "Text",
  props: {
    fontSize: "14px",
    color: "#000000",
    fontWeight: "400",
    text: "文本内容...",
  },
  related: {
    settings: TextSettings,
  },
};
