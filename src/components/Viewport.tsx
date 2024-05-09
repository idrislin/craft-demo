import { useEditor } from "@craftjs/core";
import React, { useEffect } from "react";
import { Layers } from "@craftjs/layers";

import SettingsPanel from "./SettingsPanel";
import Toolbox from "./Toolbox";
import clsx from "clsx";

export const Viewport: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const {
    enabled,
    connectors,
    actions: { setOptions },
  } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  useEffect(() => {
    if (!window) {
      return;
    }

    window.requestAnimationFrame(() => {
      // Notify doc site
      window.parent.postMessage(
        {
          LANDING_PAGE_LOADED: true,
        },
        "*"
      );

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
        <div className="flex flex-col flex-1 h-full page-container">
          <div
            className={clsx([
              "craftjs-renderer flex-1 h-full w-full transition pb-8 overflow-auto",
              { "bg-[#f2f2f2]": enabled },
            ])}
            ref={(ref) =>
              ref && connectors.select(connectors.hover(ref, ""), "")
            }
          >
            <div className="relative flex flex-col pt-8 mx-4">{children}</div>
          </div>
        </div>
        <div className="flex flex-col w-72">
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
