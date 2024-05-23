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
  const { actions, query, isActive, children } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id),
    children: query.getNodes(),
  }));

  useEffect(() => {
    console.log(children);
  }, [children]);

  const {
    dom,
    name,
    parent,
    isHover,
    moveable,
    connectors: { drag },
  } = useNode((node) => {
    return {
      isHover: node.events.hovered,
      dom: node.dom,
      name: node.data.custom.displayName || node.data.displayName,
      moveable: query.node(node.id).isDraggable(),
      deletable: query.node(node.id).isDeletable(),
      parent: node.data.parent,
      props: node.data.props,
    };
  });

  const currentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!dom) return;
    if (isActive || isHover) dom.classList.add("component-selected");
    else dom.classList.remove("component-selected");
  }, [dom, isActive, isHover]);

  const getPos = useCallback((dom: HTMLElement | null) => {
    const { top, left, bottom } = dom
      ? dom.getBoundingClientRect()
      : { top: 0, left: 0, bottom: 0 };
    return {
      top: `${top > 0 ? top : bottom}px`,
      left: `${left}px`,
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
              className="fixed h-[30px] -mt-[29px] text-xs flex items-center px-2 gap-1 text-white bg-blue-500"
              style={{
                left: getPos(dom).left,
                top: getPos(dom).top,
                zIndex: 9999,
              }}
            >
              {moveable && (
                <button className="cursor-grab" ref={(ref) => ref && drag(ref)}>
                  <DragIndicatorOutlined className="max-h-5 max-w-5" />
                </button>
              )}
              <p className="mt-0.5">{name}</p>
              {id !== ROOT_NODE && (
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    if (!parent) return;
                    actions.selectNode(parent);
                  }}
                >
                  <ArrowUpwardOutlined className="max-h-5 max-w-5" />
                </button>
              )}
              {
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    if (!parent) return;
                    actions.selectNode(parent);
                  }}
                >
                  <DeleteOutlineOutlined className="max-h-5 max-w-5" />
                </button>
              }
            </div>,
            document.querySelector(".page-container") ?? document.body
          )
        : null}
      {render}
    </>
  );
};
