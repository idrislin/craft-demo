import { useNode, useEditor } from "@craftjs/core";
import { Resizable, ResizableProps } from "re-resizable";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { useDebounce } from "ahooks";
import clsx from "clsx";

import {
  getElementDimensions,
  isPercentage,
  percentToPx,
  pxToPercent,
} from "~/hooks/numToMeasurement";

interface ResizerProps extends ResizableProps {
  children: React.ReactNode;
}

export const Resizer: React.FC<ResizerProps> = ({ children, ...props }) => {
  const {
    id,
    actions: { setProp },
    connectors: { connect },
    // fillSpace,
    nodeWidth,
    nodeHeight,
    parent,
    active,
    inNodeContext,
    displayName,
  } = useNode((node) => ({
    parent: node.data.parent,
    active: node.events.selected,
    nodeWidth: node.data.props.width,
    nodeHeight: node.data.props.height,
    fillSpace: node.data.props.fillSpace,
    displayName: node.data.custom.displayName,
  }));

  const { isRootNode } = useEditor((state, query) => {
    return {
      parentDirection:
        parent &&
        state.nodes[parent] &&
        state.nodes[parent].data.props.flexDirection,
      isRootNode: query?.node(id)?.isRoot() ?? false,
    };
  });

  const resizable = useRef<Resizable | null>(null);
  const isResizing = useRef(false);
  const editingDimensions = useRef<{ width: number; height: number } | null>(
    null
  );
  const nodeDimensions = useRef<{ width: number; height: number } | null>(null);
  nodeDimensions.current = {
    width: nodeWidth,
    height: nodeHeight,
  };

  const [internalDimensions, setInternalDimensions] = useState({
    width: nodeWidth,
    height: nodeHeight,
  });

  const updateInternalDimensionsInPx = useCallback(() => {
    if (!nodeDimensions.current || !resizable.current?.resizable?.parentElement)
      return;
    const { width: nodeWidth, height: nodeHeight } = nodeDimensions.current;

    const width = percentToPx(
      nodeWidth?.toString(),
      resizable.current &&
        getElementDimensions(resizable.current.resizable.parentElement).width
    );
    const height = percentToPx(
      nodeHeight?.toString(),
      resizable.current &&
        getElementDimensions(resizable.current.resizable.parentElement).height
    );

    setInternalDimensions({ width, height });
  }, []);

  const updateInternalDimensionsWithOriginal = useCallback(() => {
    if (!nodeDimensions.current) return;
    const { width: nodeWidth, height: nodeHeight } = nodeDimensions.current;
    setInternalDimensions({ width: nodeWidth, height: nodeHeight });
  }, []);

  const getUpdatedDimensions = (width: number, height: number) => {
    const dom = resizable.current?.resizable;
    if (!dom || !editingDimensions.current) return;

    const currentWidth = Number(editingDimensions.current.width),
      currentHeight = Number(editingDimensions.current.height);

    return {
      width: currentWidth + Number(width),
      height: currentHeight + Number(height),
    };
  };

  useEffect(() => {
    if (!isResizing.current) updateInternalDimensionsWithOriginal();
  }, [nodeWidth, nodeHeight, updateInternalDimensionsWithOriginal]);

  const debouncedResizeHandle = useDebounce(
    updateInternalDimensionsWithOriginal,
    { wait: 250 }
  );

  useEffect(() => {
    window.addEventListener("resize", debouncedResizeHandle);

    return () => {
      window.removeEventListener("resize", debouncedResizeHandle);
    };
  }, [debouncedResizeHandle]);

  return (
    <Resizable
      enable={
        displayName === "Root"
          ? false
          : [
              "top",
              "left",
              "bottom",
              "right",
              "topLeft",
              "topRight",
              "bottomLeft",
              "bottomRight",
            ].reduce((acc: Record<string, boolean>, key) => {
              acc[key] = active && inNodeContext; // 只有可编辑 & 当前激活状态的元素可以 Resize
              return acc;
            }, {})
      }
      ref={(ref) => {
        if (ref) {
          resizable.current = ref;
          if (!resizable.current.resizable) return;
          connect(resizable.current.resizable);
        }
      }}
      className={clsx([{ "m-auto": isRootNode, flex: true }])}
      size={internalDimensions}
      onResizeStart={(e) => {
        updateInternalDimensionsInPx();
        e.preventDefault();
        e.stopPropagation();
        if (!resizable.current?.resizable) return;
        const dom = resizable.current.resizable;
        if (!dom) return;
        editingDimensions.current = {
          width: dom.getBoundingClientRect().width,
          height: dom.getBoundingClientRect().height,
        };
        isResizing.current = true;
      }}
      onResize={(_, __, ___, d) => {
        if (!resizable.current?.resizable || !editingDimensions.current) return;
        const dom = resizable.current.resizable;
        if (!dom?.parentElement) return;
        const dimensions = getUpdatedDimensions(d.width, d.height);
        let width = dimensions?.width.toString() ?? "";
        let height = dimensions?.height.toString() ?? "";
        if (isPercentage(nodeWidth)) {
          width =
            pxToPercent(
              parseInt(width),
              getElementDimensions(dom.parentElement).width
            ) + "%";
          height =
            pxToPercent(
              parseInt(height),
              getElementDimensions(dom.parentElement).height
            ) + "%";
        } else {
          height = `${height}px`;
          width = `${width}px`;
        }

        if (isPercentage(width) && dom.parentElement?.style.width === "auto") {
          width = editingDimensions.current.width + d.width + "px";
        }

        if (
          isPercentage(height) &&
          dom.parentElement?.style.height === "auto"
        ) {
          height = editingDimensions.current.height + d.height + "px";
        }

        setProp((prop: Record<string, unknown>) => {
          prop.width = width;
          prop.height = height;
        }, 250);
      }}
      onResizeStop={() => {
        isResizing.current = false;
        updateInternalDimensionsWithOriginal();
      }}
      {...props}
    >
      {children}
      {active && displayName !== "Root" && props.enable !== false && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <span className="resizeableThumb left-0 -top-[5px] -translate-x-1/2"></span>
          <span className="resizeableThumb -right-[5px] -top-[5px]"></span>
          <span className="resizeableThumb left-0 -bottom-[5px] -translate-x-1/2"></span>
          <span className="resizeableThumb -right-[5px] -bottom-[5px]"></span>
        </div>
      )}
    </Resizable>
  );
};
