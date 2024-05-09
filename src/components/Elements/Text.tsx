import ContentEditable from "react-contenteditable";
import { UserComponent as CUserComponent, useNode } from "@craftjs/core";
import SelectMenus from "../Form/SelectMenus";
import Color2Picker from "../Form/Color2Picker";
import clsx from "clsx";
import LayoutSettingsPanel, { BaseElementsProps } from "../LayoutSettingsPanel";
import Input from "../Form/Input";
import UserComponent from "../UserComponent";
import Accordion from "../Animation/Accordion";

interface TextProps extends BaseElementsProps {
  text: string;
  fontSize?: string;
  color?: string;
  fontWeight?: string;
  lineLimit?: number;
}

const TEXTRGX = /<\/?[^>]+(>|$)/g;

//- 组件主题
const Text: CUserComponent<TextProps> = (props) => {
  const {
    color,
    fontWeight,
    text,
    fontSize,
    margin = [0, 0, 0, 0],
    padding = [0, 0, 0, 0],
    lineLimit = 0,
  } = props;

  const lineClampMap = new Map([
    [0, ""],
    [1, "line-clamp-1"],
    [2, "line-clamp-2"],
    [3, "line-clamp-3"],
    [4, "line-clamp-4"],
    [5, "line-clamp-5"],
    [6, "line-clamp-6"],
  ]);

  const {
    actions: { setProp },
  } = useNode((node) => ({
    name: node.data.name,
    hasSelectedNode: node.events.selected,
    hasDraggedNode: node.events.dragged,
  }));

  return (
    <UserComponent
      style={{
        padding: padding.join("px ") + "px",
        margin: margin.join("px ") + "px",
      }}
      className="!w-full"
    >
      <ContentEditable
        html={text}
        tagName="p"
        className={clsx("outline-none", lineClampMap.get(lineLimit) ?? "")}
        style={{ fontSize, color, fontWeight }}
        onChange={(e) => {
          setProp((props: TextProps) => {
            return (props.text = e.target.value.replace(TEXTRGX, ""));
          });
        }}
      />
    </UserComponent>
  );
};

export default Text;

//- 组件编辑样式
export const TextSettings = () => {
  const {
    actions: { setProp },
    color,
    margin,
    padding,
    lineLimit,
  } = useNode<TextProps>((node) => ({
    text: node.data.props.text,
    margin: node.data.props.margin,
    fontSize: node.data.props.fontSize,
    color: node.data.props.color,
    fontWeight: node.data.props.fontWeight,
    padding: node.data.props.padding,
    lineLimit: node.data.props.lineLimit,
  }));

  return (
    <div className="flex flex-col gap-2">
      {/** 公共属性 */}
      <Accordion label="布局">
        <LayoutSettingsPanel
          margin={margin}
          padding={padding}
          onMarginChange={(v) => {
            setProp((props: TextProps) => (props.margin = v));
          }}
          onPaddingChange={(v) => {
            setProp((props: TextProps) => (props.padding = v));
          }}
        />
      </Accordion>
      {/*  */}
      <Accordion label="基本样式" className="gap-2">
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
        <Input
          value={(lineLimit ?? 0).toString()}
          label="行数限制"
          type="number"
          min={0}
          max={6}
          onChange={(v) => {
            setProp((props: TextProps) => (props.lineLimit = Number(v)));
          }}
        />
      </Accordion>
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
