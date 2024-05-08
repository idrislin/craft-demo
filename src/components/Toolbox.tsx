import React, { useState } from "react";
import { Element, useEditor } from "@craftjs/core";
import Button from "./Elements/Button";
import clsx from "clsx";
import ViewComfyOutlinedIcon from "@mui/icons-material/ViewComfyOutlined";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import Text from "./Elements/Text";
import Card from "./Layouts/Card";
import Container from "./Layouts/Container";

const Toolbox: React.FC = () => {
  const { connectors } = useEditor();
  const [tabSelected, setTabSelected] = useState(0);

  const tabs = [
    { name: "组件", icon: <AppsOutlinedIcon /> },
    { name: "布局", icon: <ViewComfyOutlinedIcon /> },
  ];

  const components = [
    { name: "按钮", defaultComponent: <Button text="Click me" /> },
    { name: "文本", defaultComponent: <Text text="文本内容..." /> },
  ];

  const layouts = [
    {
      name: "Card",
      defaultComponent: (
        <Element is={Card} canvas>
          <Text text="文本内容..." />
        </Element>
      ),
    },
    {
      name: "Container",
      defaultComponent: (
        <Element is={Container} canvas>
          <Text text="文本内容..." />
        </Element>
      ),
    },
  ];

  return (
    <div className="flex h-full divide-y">
      <nav
        className="flex flex-col items-center justify-start shadow w-min isolate"
        aria-label="Tabs"
      >
        {tabs.map((tab, tabIndex) => (
          <div
            key={tab.name}
            className={clsx(
              tabSelected === tabIndex
                ? "text-indigo-500 bg-indigo-50"
                : "text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-50",
              "group h-min gap-1 flex items-center justify-center flex-col relative cursor-pointer py-2 px-4 text-center text-sm font-medium"
            )}
            onClick={() => setTabSelected(tabIndex)}
          >
            {tab.icon}
            <span className="whitespace-nowrap">{tab.name}</span>
          </div>
        ))}
      </nav>
      {tabSelected === 0 && (
        <ul className="flex flex-col w-full gap-3 px-4 py-2">
          {components.map((component) => (
            <li
              key={component.name}
              className="flex items-center justify-start w-full gap-1 px-4 text-sm text-blue-500 bg-blue-100 rounded h-9 hover:bg-blue-200"
              ref={(ref) => {
                if (!ref) return;
                connectors.create(ref, component.defaultComponent);
              }}
            >
              {component.name}
            </li>
          ))}
        </ul>
      )}
      {tabSelected === 1 && (
        <ul className="flex flex-col w-full gap-3 px-4 py-2">
          {layouts.map((component) => (
            <li
              key={component.name}
              className="flex items-center justify-start w-full gap-1 px-4 text-sm text-blue-500 bg-blue-100 rounded h-9 hover:bg-blue-200"
              ref={(ref) => {
                if (!ref) return;
                connectors.create(ref, component.defaultComponent);
              }}
            >
              {component.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Toolbox;
