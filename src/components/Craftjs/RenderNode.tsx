import { useNode, useEditor, Element } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';
import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {
  AddBoxOutlined,
  DeleteOutlineOutlined,
  DragIndicatorOutlined,
  ExpandLessOutlined,
  ExpandMoreOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import Tippy from '@tippyjs/react';

import EducationEntry, {
  EmptyEducationEntry,
} from './PageSections/Education/EducationEntry';
import ExperienceEntry, {
  EmptyExperienceEntry,
} from './PageSections/Experience/ExperienceEntry';

export const RenderNode: React.FC<{ render: JSX.Element }> = ({ render }) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent('selected').contains(id),
  }));

  const {
    dom,
    name,
    parent,
    isHover,
    nodeType,
    moveable,
    connectors: { drag },
  } = useNode((node) => {
    return {
      dom: node.dom,
      props: node.data.props,
      parent: node.data.parent,
      nodeType: node.data.type,
      isHover: node.events.hovered,
      moveable: query.node(node.id).isDraggable(),
      deletable: query.node(node.id).isDeletable(),
      name: node.data.custom.displayName || node.data.displayName,
      nodes: node.data.nodes,
    };
  });

  const currentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!dom || nodeType === 'div') return;
    if (isActive || isHover) {
      dom.classList.add('component-selected');
    } else {
      dom.classList.remove('component-selected');
    }
  }, [dom, isActive, isHover, id, nodeType]);

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
      ?.querySelector('.craftjs-renderer')
      ?.addEventListener('scroll', scroll);

    return () => {
      document
        ?.querySelector('.craftjs-renderer')
        ?.removeEventListener('scroll', scroll);
    };
  }, [scroll]);

  const toolbarComponent = (type: string) => {
    switch (type) {
      case 'move': {
        if (!parent) return null;
        const parentNodes = query.getNodes()[parent].data.nodes;
        if (parentNodes.length == 1) return null;
        const index = parentNodes.findIndex((v) => v == id);
        const buttonClass =
          'px-1.5 text-gray-400 disabled:cursor-not-allowed cursor-pointer hover:text-primary disabled:text-gray-200';
        return (
          <React.Fragment key={type}>
            <button
              disabled={index === 0}
              className={buttonClass}
              onClick={() => {
                if (index === 0) return;
                actions.move(id, parent, index - 1);
              }}
            >
              <ExpandLessOutlined className="max-h-5 max-w-5" />
            </button>
            <button
              className={buttonClass}
              disabled={index === parentNodes.length - 1}
              onClick={() => {
                if (index === parentNodes.length - 1) return;
                actions.move(id, parent, index + 2);
              }}
            >
              <ExpandMoreOutlined className="max-h-5 max-w-5" />
            </button>
          </React.Fragment>
        );
      }

      case 'add': {
        return (
          <button
            key={type}
            className="px-1.5 text-gray-400 cursor-pointer hover:text-primary"
            onClick={() => {
              if (!parent) return;
              const elementConfig: {
                is: React.ElementType;
                entry: Record<string, unknown>;
              } = {
                is: EducationEntry,
                entry: EmptyEducationEntry,
              };
              switch (query.getNodes()[id].data.name) {
                case 'Education': {
                  elementConfig.is = EducationEntry;
                  elementConfig.entry = EmptyEducationEntry;
                  break;
                }

                case 'Experience': {
                  elementConfig.is = ExperienceEntry;
                  elementConfig.entry = EmptyExperienceEntry;
                  break;
                }
              }
              // if(query.getNodes()[id].)
              const nodeTree = query
                .parseReactElement(
                  <Element
                    deletable={true}
                    padding={[0, 12, 6, 12]}
                    {...elementConfig}
                  />
                )
                .toNodeTree();
              actions.addNodeTree(nodeTree, id);
            }}
          >
            <AddBoxOutlined className="max-h-5 max-w-5" />
          </button>
        );
      }

      case 'delete': {
        return (
          <button
            key={type}
            className="px-1.5 text-gray-400 cursor-pointer hover:text-red-500"
            onClick={() => {
              if (!parent) return;
              actions.delete(id);
            }}
          >
            <DeleteOutlineOutlined className="max-h-5 max-w-5" />
          </button>
        );
      }

      case 'setting': {
        return (
          <Tippy
            key={type}
            interactive
            theme="light"
            arrow={false}
            trigger="click"
            placement="bottom"
            appendTo={document.body}
            content={
              query.getNodes()[id].related &&
              query.getNodes()[id].related.settings ? (
                React.createElement(query.getNodes()[id].related.settings)
              ) : (
                <div>unset</div>
              )
            }
          >
            <button
              key={type}
              className="px-1.5 text-gray-400 cursor-pointer hover:text-primary"
              onClick={() => {
                console.log(query.getNodes()[id]);
              }}
            >
              <SettingsOutlined className="max-h-5 max-w-5" />
            </button>
          </Tippy>
        );
      }
      default:
        return null;
    }
  };

  return (
    <>
      {isActive && nodeType !== 'div'
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
              {id !== ROOT_NODE && isActive && (
                <div className="flex items-center h-full bg-white rounded-r-lg">
                  {query
                    .getNodes()
                    [id].data?.custom?.toolbar?.map(toolbarComponent)}
                </div>
              )}
            </div>,
            document.querySelector('.page-container') ?? document.body
          )
        : null}
      {render}
    </>
  );
};
