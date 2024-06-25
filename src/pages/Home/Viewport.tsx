import { useEditor } from '@craftjs/core';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useClickAway, useEventListener, useLocalStorageState } from 'ahooks';
import clsx from 'clsx';
import {
  AddBoxOutlined,
  DescriptionOutlined,
  FileDownloadOutlined,
  FormatAlignCenterOutlined,
  FormatAlignLeftOutlined,
  FormatAlignRightOutlined,
  FormatColorTextOutlined,
  ImportExportOutlined,
} from '@mui/icons-material';
import {
  FormatBoldOutlined,
  FormatItalicOutlined,
  FormatUnderlined,
} from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import { isEmpty } from 'lodash';
import { useSetAtom } from 'jotai';

import { rearrangeSectionModalAtom, sectionModalAtom } from '~/state';
import { LSKEY } from '~/lib/const';

interface ViewportProps {
  children?: React.ReactNode;
}

export const Viewport: React.FC<ViewportProps> = ({ children }) => {
  const { connectors, selected, nodes, actions } = useEditor((node) => ({
    selected: node.events.selected,
    nodes: node.nodes,
  }));
  const [showMenu, setShowMenu] = useState<
    { top: string; left: string } | undefined
  >();
  const [color, setColor] = useState<string | undefined>('#333333');
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const colorPickerRef = useRef<HTMLDivElement | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const openSectionsModal = useSetAtom(sectionModalAtom);
  const openRearrangeModal = useSetAtom(rearrangeSectionModalAtom);
  const [lsData] = useLocalStorageState<string | undefined>(LSKEY, {
    defaultValue: '',
  });

  useEffect(() => {
    if (lsData && lsData !== '') {
      actions.deserialize(lsData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lsData]);

  const contextMenu = [
    {
      label: 'Add New Section',
      icon: <AddBoxOutlined className="icon-xs" />,
      onAction: () => {
        setShowMenu(undefined);
        openSectionsModal(true);
      },
    },
    {
      label: 'Rearrange Sections',
      icon: <ImportExportOutlined className="icon-xs" />,
      onAction: () => {
        setShowMenu(undefined);
        openRearrangeModal(true);
      },
    },
    {
      label: 'Change Template',
      icon: <DescriptionOutlined className="icon-xs" />,
      onAction: () => {},
    },
    {
      label: 'Download',
      icon: <FileDownloadOutlined className="icon-xs" />,
      onAction: () => {},
    },
  ];
  const textEditor = [
    {
      id: 'bold',
      content: <FormatBoldOutlined />,
      onAction: () => handleCommandClick('bold'),
    },
    {
      id: 'underline',
      content: <FormatUnderlined />,
      onAction: () => handleCommandClick('underline'),
    },
    {
      id: 'italic',
      content: <FormatItalicOutlined />,
      onAction: () => handleCommandClick('italic'),
    },
    {
      id: 'justifyCenter',
      content: <FormatAlignCenterOutlined />,
      onAction: () => handleCommandClick('justifyCenter'),
    },
    {
      id: 'justifyLeft',
      content: <FormatAlignLeftOutlined />,
      onAction: () => handleCommandClick('justifyLeft'),
    },
    {
      id: 'justifyRight',
      content: <FormatAlignRightOutlined />,
      onAction: () => handleCommandClick('justifyRight'),
    },
  ];

  //- 点击 context menu 外部
  useClickAway(() => {
    setShowMenu(undefined);
  }, contextMenuRef);

  //- 自定义 context menu
  useEventListener(
    'contextmenu',
    (ev) => {
      ev.preventDefault();
      let left = ev.clientX;
      let top = ev.clientY;
      if (ev.clientX + 185 > document.body.clientWidth) {
        left -= 185;
      }
      if (ev.clientY + contextMenu.length * 36 > document.body.clientHeight) {
        top -= contextMenu.length * 36;
      }
      setShowMenu({ top: `${top}px`, left: `${left}px` });
    },
    { target: rootRef }
  );

  const handleCommandClick = (command: string) => {
    document.execCommand(command, false);
  };

  useEffect(() => {
    document.execCommand('foreColor', false, color);
  }, [color]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      colorPickerRef.current &&
      !colorPickerRef.current.contains(event.target as Node)
    ) {
      setActive(false);
    }
  };

  useEffect(() => {
    const elements = document.getElementsByClassName('ROOT');
    if (!elements || isEmpty(elements)) return;
    if (
      nodes[selected.values().next().value]?.data?.custom?.displayName ===
      'PAGE'
    ) {
      for (const element of elements) {
        (element as HTMLElement).style.setProperty('background', 'white');
      }
      return;
    }
    if (
      selected.size == 0 ||
      (selected.size === 1 && (selected.has('ROOT') || selected.has('')))
    ) {
      for (const element of elements) {
        (element as HTMLElement).style.setProperty('background', 'white');
      }
      return;
    } else if (selected.size > 0) {
      for (const element of elements) {
        (element as HTMLElement).style.setProperty(
          'background',
          'rgb(80 77 98 / 20%)'
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEventListener('click', handleClickOutside);

  //- Text Editor Tools
  const textTool = () => {
    // if (selected.size === 0) return <div className="h-8" />;
    return (
      <div className="sticky top-0 z-[999] flex items-center shadow-lg self-center justify-center h-8 mx-auto bg-white divide-x rounded-full w-min">
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
            className={clsx('iconButton', active && '!text-primary')}
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
    <div id="viewport" className="viewport" ref={rootRef}>
      <div className="flex h-[calc(100vh-56px)] max-h-[calc(100vh-56px)]">
        <div className="flex flex-col flex-1 h-full page-container">
          <div
            className="flex-1 w-full h-full pt-4 pb-8 overflow-auto transition bg-gray-100 craftjs-renderer"
            ref={(ref) => {
              if (!ref) return;
              connectors.select(connectors.hover(ref, ''), '');
            }}
          >
            {textTool()}
            {children}
          </div>
        </div>
      </div>
      {createPortal(
        <div
          id="context-menu"
          ref={contextMenuRef}
          style={{
            position: 'fixed',
            top: showMenu?.top ?? '0px',
            left: showMenu?.left ?? '0px',
          }}
          className={clsx(
            'overflow-hidden transition-opacity flex flex-col divide-y bg-white rounded-md shadow-popover z-popover opacity-1',
            !showMenu && 'hidden'
          )}
        >
          {contextMenu.map((menu) => (
            <div
              key={menu.label}
              onClick={menu.onAction}
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
