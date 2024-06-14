import { useEditor } from "@craftjs/core";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useClickAway, useEventListener } from "ahooks";
import clsx from "clsx";
import {
  AddBoxOutlined,
  DescriptionOutlined,
  FileDownloadOutlined,
  FormatAlignCenterOutlined,
  FormatAlignLeftOutlined,
  FormatAlignRightOutlined,
  FormatColorTextOutlined,
  ImportExportOutlined,
} from "@mui/icons-material";
import {
  FormatBoldOutlined,
  FormatItalicOutlined,
  FormatUnderlined,
} from "@mui/icons-material";
import { ChromePicker } from "react-color";

import SettingsPanel from "@/components/Craftjs/SettingsPanel";

interface ViewportProps {
  children?: React.ReactNode;
}

export const Viewport: React.FC<ViewportProps> = ({ children }) => {
  const { connectors, selected } = useEditor((node) => ({
    selected: node.events.selected,
  }));
  const [showMenu, setShowMenu] = useState<
    { top: string; left: string } | undefined
  >();
  const [color, setColor] = useState<string | undefined>("#333333");
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const colorPickerRef = useRef<HTMLDivElement | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const contextMenu = [
    {
      label: "Add New Section",
      icon: <AddBoxOutlined className="icon-xs" />,
      onAction: () => {},
    },
    {
      label: "Rearrange Sections",
      icon: <ImportExportOutlined className="icon-xs" />,
      onAction: () => {},
    },
    {
      label: "Change Template",
      icon: <DescriptionOutlined className="icon-xs" />,
      onAction: () => {},
    },
    {
      label: "Download",
      icon: <FileDownloadOutlined className="icon-xs" />,
      onAction: () => {},
    },
  ];
  const textEditor = [
    {
      id: "bold",
      content: <FormatBoldOutlined />,
      onAction: () => handleCommandClick("bold"),
    },
    {
      id: "underline",
      content: <FormatUnderlined />,
      onAction: () => handleCommandClick("underline"),
    },
    {
      id: "italic",
      content: <FormatItalicOutlined />,
      onAction: () => handleCommandClick("italic"),
    },
    {
      id: "justifyCenter",
      content: <FormatAlignCenterOutlined />,
      onAction: () => handleCommandClick("justifyCenter"),
    },
    {
      id: "justifyLeft",
      content: <FormatAlignLeftOutlined />,
      onAction: () => handleCommandClick("justifyLeft"),
    },
    {
      id: "justifyRight",
      content: <FormatAlignRightOutlined />,
      onAction: () => handleCommandClick("justifyRight"),
    },
  ];

  //- 点击 context menu 外部
  useClickAway(() => {
    setShowMenu(undefined);
  }, contextMenuRef);

  //- 自定义 context menu
  useEventListener(
    "contextmenu",
    (ev) => {
      ev.preventDefault();
      setShowMenu({ top: `${ev.clientY}px`, left: `${ev.clientX}px` });
    },
    { target: rootRef }
  );

  const handleCommandClick = (command: string) => {
    document.execCommand(command, false);
  };

  useEffect(() => {
    document.execCommand("foreColor", false, color);
  }, [color]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      colorPickerRef.current &&
      !colorPickerRef.current.contains(event.target as Node)
    ) {
      setActive(false);
    }
  };

  // useEffect(() => {
  //   console.log(selected);
  //   if(selected.size == 0 || (selected.size === 1 && selected.has('ROOT'))) {

  //   }else{

  //   }
  // }, [selected]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //- Text Editor Tools
  const textTool = () => {
    // if (selected.size === 0) return <div className="h-8" />;
    return (
      <div className="relative flex items-center self-center justify-center h-8 mx-auto bg-white divide-x rounded-full w-min">
        {textEditor.map((value) => (
          <button
            key={value.id}
            className="iconButton"
            onClick={value.onAction}
          >
            {value.content}
          </button>
        ))}
        <div ref={colorPickerRef}>
          <button
            className={clsx("iconButton", active && "!text-primary")}
            onClick={() => setActive((prev) => !prev)}
          >
            <FormatColorTextOutlined />
          </button>
          {active && (
            <ChromePicker
              color={color}
              disableAlpha
              className="!shadow-xl top-8 absolute z-[999] select-none"
              onChange={(color) => {
                setColor(color.hex);
              }}
            />
          )}
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  return (
    <div className="viewport" ref={rootRef}>
      <div className="flex h-[calc(100vh-56px)] max-h-[calc(100vh-56px)]">
        <div className="flex flex-col min-w-72 max-w-72">
          <div className="flex-1">
            <SettingsPanel />
          </div>
        </div>
        <div className="flex flex-col flex-1 h-full page-container">
          <div
            className="flex-1 w-full h-full pt-4 pb-8 overflow-auto transition bg-gray-100 craftjs-renderer"
            ref={(ref) => {
              if (!ref) return;
              connectors.select(connectors.hover(ref, ""), "");
            }}
          >
            {textTool()}
            <div className="relative flex flex-col pt-4 w-[210mm] mx-auto h-[297mm]">
              {children}
            </div>
          </div>
        </div>
      </div>
      {createPortal(
        <div
          id="context-menu"
          ref={contextMenuRef}
          style={{
            position: "fixed",
            left: showMenu?.left ?? "0px",
            top: showMenu?.top ?? "0px",
          }}
          className={clsx(
            "overflow-hidden transition-opacity flex flex-col divide-y bg-white rounded-md shadow-popover z-popover opacity-1",
            !showMenu && "hidden"
          )}
        >
          {contextMenu.map((menu) => (
            <div
              key={menu.label}
              className="cursor-default flex items-center gap-2 text-sm min-w-[160px] py-2 px-4 hover:bg-dark hover:text-white"
            >
              {menu.icon}
              {menu.label}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};
