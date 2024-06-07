import { useEditor } from "@craftjs/core";
import React, { useRef, useState } from "react";
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
  ImportExportOutlined,
} from "@mui/icons-material";
import {
  FormatBoldOutlined,
  FormatItalicOutlined,
  FormatUnderlined,
} from "@mui/icons-material";

import SettingsPanel from "./SettingsPanel";

interface ViewportProps {
  children?: React.ReactNode;
}

export const Viewport: React.FC<ViewportProps> = ({ children }) => {
  const { connectors } = useEditor();
  const [showMenu, setShowMenu] = useState<
    { top: string; left: string } | undefined
  >();
  const rootRef = useRef<HTMLDivElement | null>(null);
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
            className={clsx([
              "craftjs-renderer flex-1 h-full w-full transition pt-4 pb-8 overflow-auto bg-gray-100",
            ])}
            ref={(ref) => {
              if (!ref) return;
              connectors.select(connectors.hover(ref, ""), "");
            }}
          >
            {/* Text Editor Tools */}
            <div className="flex items-center self-center justify-center h-8 mx-auto bg-white divide-x rounded-full w-min">
              <button
                onClick={() => handleCommandClick("bold")}
                className="iconButton"
              >
                <FormatBoldOutlined />
              </button>
              <button
                onClick={() => handleCommandClick("underline")}
                className="iconButton"
              >
                <FormatUnderlined />
              </button>
              <button
                onClick={() => handleCommandClick("italic")}
                className="iconButton"
              >
                <FormatItalicOutlined />
              </button>

              <button
                onClick={() => handleCommandClick("justifyCenter")}
                className="iconButton"
              >
                <FormatAlignCenterOutlined />
              </button>

              <button
                onClick={() => handleCommandClick("justifyLeft")}
                className="iconButton"
              >
                <FormatAlignLeftOutlined />
              </button>

              <button
                onClick={() => handleCommandClick("justifyRight")}
                className="iconButton"
              >
                <FormatAlignRightOutlined />
              </button>
            </div>
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
