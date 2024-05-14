import clsx from "clsx";
import { useNode, UserComponent as CUserComponent } from "@craftjs/core";

import Color2Picker from "../Form/Color2Picker";
import SelectMenus from "../Form/SelectMenus";
import Input from "../Form/Input";
import UserComponent from "../UserComponent";
import Accordion from "../Animation/Accordion";

type SIZE = "xs" | "sm" | "md" | "lg" | "xl";

interface ButtonProps {
  text: string;
  size?: SIZE;
  background?: string;
  color?: string;
  variants?: "primary" | "secondary";
}

const Button: CUserComponent<ButtonProps> = (props) => {
  const { size = "md", text, background, color, variants = "primary" } = props;

  const sizeClassMap = new Map([
    ["xs", "rounded px-2 py-1 text-xs"],
    ["sm", "rounded px-2 py-1 text-sm"],
    ["md", "rounded-md px-2.5 py-1.5 text-sm"],
    ["lg", "rounded-md px-3 py-2 text-sm"],
    ["xl", "rounded-md px-3.5 py-2.5 text-sm"],
  ]);

  const variantsClassMap = new Map([
    [
      "primary",
      "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
    ],
    [
      "secondary",
      "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
    ],
    ["soft", "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"],
  ]);

  return (
    <UserComponent
      as="button"
      className={clsx(
        "font-semibold shadow-sm w-max whitespace-nowrap",
        variantsClassMap.get(variants),
        sizeClassMap.get(size)
      )}
      style={{ color, background }}
    >
      {text}
    </UserComponent>
  );
};

export default Button;

export const ButtonSettings = () => {
  const {
    actions: { setProp },
    color,
    background,
    text,
    size,
  } = useNode<ButtonProps>((node) => ({
    size: node.data.props.size,
    color: node.data.props.color,
    background: node.data.props.background,
    text: node.data.props.text,
  }));

  return (
    <div className="flex flex-col gap-2">
      <Accordion label="颜色">
        <Color2Picker
          label="背景颜色"
          value={background ?? ""}
          onChange={(color) => {
            setProp((props: ButtonProps) => (props.background = color), 500);
          }}
        />
        <Color2Picker
          label="字体颜色"
          value={color?.match(/#[A-Fa-f0-9]{6}/)?.[0] ?? ""}
          onChange={(color) => {
            setProp((props: ButtonProps) => (props.color = color), 500);
          }}
        />
      </Accordion>
      <Accordion label="基本样式" className="gap-2">
        <Input
          value={text}
          label="文本"
          onChange={(v) => {
            setProp((props: ButtonProps) => (props.text = v), 500);
          }}
        />
        <SelectMenus
          onChange={(v) => {
            setProp((props: ButtonProps) => {
              return (props.size = v as SIZE);
            });
          }}
          label="按钮尺寸"
          defaultSelected={size}
          options={[
            { name: "xs", value: "xs" },
            { name: "sm", value: "sm" },
            { name: "md", value: "md" },
            { name: "lg", value: "lg" },
            { name: "xl", value: "xl" },
          ]}
        />
      </Accordion>
    </div>
  );
};

Button.craft = {
  props: {
    text: "Click me",
    background: "#4F46E5",
    color: "#FFFFFF",
  },
  related: {
    settings: ButtonSettings,
  },
};
