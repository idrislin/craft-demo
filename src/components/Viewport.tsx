import { useEditor } from "@craftjs/core";
import React, { useEffect } from "react";
import clsx from "clsx";
import { Layers } from "@craftjs/layers";

import SettingsPanel from "./SettingsPanel";
import Toolbox from "./Toolbox";

export const Viewport: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const {
    enabled,
    connectors,
    actions: { setOptions },
  } = useEditor((state) => ({ enabled: state.options.enabled }));

  useEffect(() => {
    if (!window) return;

    window.requestAnimationFrame(() => {
      window.parent.postMessage({ LANDING_PAGE_LOADED: true }, "*");

      setTimeout(() => {
        setOptions((options) => {
          options.enabled = true;
        });
      }, 200);
    });
  }, [setOptions]);

  return (
    <div className="viewport">
      <div className="flex h-[calc(100vh-56px)] max-h-[calc(100vh-56px)]">
        <Toolbox />
        <div className="flex flex-col flex-1 h-full page-container max-w-[calc(100vw-576px)]">
          <div
            className={clsx([
              "craftjs-renderer flex-1 h-full w-full transition pb-8 overflow-auto",
              enabled && "bg-[#f2f2f2]",
            ])}
            ref={(ref) => {
              if (!ref) return;
              connectors.select(connectors.hover(ref, ""), "");
            }}
          >
            <div className="relative flex flex-col pt-8 mx-4">{children}</div>
          </div>
        </div>
        <div className="flex flex-col min-w-72 max-w-72">
          <div className="flex-1">
            <SettingsPanel />
          </div>
          <div className="flex-1">
            <Layers />
          </div>
        </div>
      </div>
    </div>
  );
};
