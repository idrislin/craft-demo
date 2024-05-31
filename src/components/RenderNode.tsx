import { useNode, useEditor } from "@craftjs/core";
import { ROOT_NODE } from "@craftjs/utils";
import React, { useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  ArrowUpwardOutlined,
  DeleteOutlineOutlined,
  DragIndicatorOutlined,
} from "@mui/icons-material";

export const RenderNode: React.FC<{ render: JSX.Element }> = ({ render }) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id),
  }));

  const {
    dom,
    name,
    parent,
    isHover,
    moveable,
    connectors: { drag },
  } = useNode((node) => {
    return {
      dom: node.dom,
      props: node.data.props,
      parent: node.data.parent,
      isHover: node.events.hovered,
      moveable: query.node(node.id).isDraggable(),
      deletable: query.node(node.id).isDeletable(),
      name: node.data.custom.displayName || node.data.displayName,
    };
  });

  const currentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!dom) return;
    if (isActive || isHover) {
      dom.classList.add("component-selected");
    } else {
      dom.classList.remove("component-selected");
    }
  }, [dom, isActive, isHover, id]);

  const getPos = useCallback((dom: HTMLElement | null) => {
    const { top, left, bottom, width } = dom
      ? dom.getBoundingClientRect()
      : { top: 0, left: 0, bottom: 0, width: 0 };
    return {
      left: `${left}px`,
      middleX: `${left + width / 2}px`,
      top: `${top > 0 ? top : bottom}px`,
    };
  }, []);

  const scroll = useCallback(() => {
    const { current: currentDOM } = currentRef;

    if (!currentDOM) return;
    const { top, left } = getPos(dom);
    currentDOM.style.top = top;
    currentDOM.style.left = left;
  }, [dom, getPos]);

  useEffect(() => {
    document
      ?.querySelector(".craftjs-renderer")
      ?.addEventListener("scroll", scroll);

    return () => {
      document
        ?.querySelector(".craftjs-renderer")
        ?.removeEventListener("scroll", scroll);
    };
  }, [scroll]);

  return (
    <>
      {isHover || isActive
        ? ReactDOM.createPortal(
            <div
              ref={currentRef}
              className="fixed h-[30px] shadow-[0_2px_10px_rgba(0,0,0,.15)] -translate-x-1/2 rounded-lg -mt-[29px] text-xs flex items-center gap-1 text-white bg-primary"
              style={{
                left: getPos(dom).middleX,
                top: getPos(dom).top,
                zIndex: 9999,
              }}
            >
              <div className="flex px-2">
                {moveable && (
                  <button
                    className="cursor-grab"
                    ref={(ref) => ref && drag(ref)}
                  >
                    <DragIndicatorOutlined className="max-h-5 max-w-5" />
                  </button>
                )}
                <p className="mt-0.5">{name}</p>
              </div>
              <div className="flex items-center h-full bg-white rounded-r-lg">
                {id !== ROOT_NODE && (
                  <button
                    className="px-1.5 text-gray-400 cursor-pointer hover:text-primary"
                    onClick={() => {
                      if (!parent) return;
                      actions.selectNode(parent);
                    }}
                  >
                    <ArrowUpwardOutlined className="max-h-5 max-w-5" />
                  </button>
                )}
                {id !== ROOT_NODE && (
                  <>
                    <div className="w-px h-full bg-gray-200" />
                    <button
                      className="px-1.5 text-gray-400 cursor-pointer hover:text-red-500"
                      onClick={() => {
                        if (!parent) return;
                        actions.delete(id);
                      }}
                    >
                      <DeleteOutlineOutlined className="max-h-5 max-w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>,
            document.querySelector(".page-container") ?? document.body
          )
        : null}
      {render}
    </>
  );
};
