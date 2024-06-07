import { UserComponent as CUserComponent, useNode } from "@craftjs/core";

import SelectMenus from "../Form/SelectMenus";
import Color2Picker from "../Form/Color2Picker";
import LayoutSettingsPanel, { BaseElementsProps } from "../LayoutSettingsPanel";
import Input from "../Form/Input";
import UserComponent from "../UserComponent";
import Accordion from "../Animation/Accordion";

type ObjectFit = "cover" | "contain" | "fill" | "none" | "scale-down";

interface ImageProps extends BaseElementsProps {
  objectFit?: ObjectFit;
  background?: string;
  source: string;
}

const Image: CUserComponent<ImageProps> = (props) => {
  const {
    source,
    objectFit,
    background,
    margin = [0, 0, 0, 0],
    padding = [0, 0, 0, 0],
  } = props;
  return (
    <UserComponent
      style={{
        padding: padding.join("px ") + "px",
        margin: margin.join("px ") + "px",
      }}
      className="!w-full h-full"
    >
      <img
        style={{ objectFit: objectFit, background }}
        className="!w-full h-full"
        src={source}
      />
    </UserComponent>
  );
};

export default Image;

export const ImageSettings = () => {
  const {
    actions: { setProp },
    margin,
    padding,
    background,
    source,
  } = useNode<ImageProps>((node) => ({
    source: node.data.props.source,
    background: node.data.props.background,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
  }));

  return (
    <div className="flex flex-col gap-2">
      <div className="p-4 border-b border-gray-200 border-solid">
        <Input
          label="图片地址"
          value={source}
          onChange={(v) => {
            setProp((props: ImageProps) => {
              props.source = v;
            });
          }}
        />
      </div>
      {/** 公共属性 */}
      <Accordion label="布局">
        <LayoutSettingsPanel
          margin={margin}
          padding={padding}
          onMarginChange={(v) => {
            setProp((props: ImageProps) => {
              props.margin = v;
            });
          }}
          onPaddingChange={(v) => {
            setProp((props: ImageProps) => {
              props.padding = v;
            });
          }}
        />
      </Accordion>
      {/*  */}
      <Accordion label="基本样式" className="gap-2">
        <SelectMenus
          onChange={(v) => {
            setProp((props: ImageProps) => {
              props.objectFit = v as ObjectFit;
            });
          }}
          label="自适应"
          defaultSelected="none"
          options={[
            { name: "none", value: "none" },
            { name: "contain", value: "contain" },
            { name: "conver", value: "cover" },
            { name: "fill", value: "fill" },
          ]}
        />
        <Color2Picker
          label="字体颜色"
          value={background ?? "#ffffff"}
          onChange={(color) => {
            setProp((props: ImageProps) => {
              props.background = color;
            }, 500);
          }}
        />
      </Accordion>
    </div>
  );
};

Image.craft = {
  name: "Image",
  displayName: "Image",
  props: {
    background: "#ffffff",
    objectFit: "fill",
    source: "",
  },
  related: {
    settings: ImageSettings,
  },
};
