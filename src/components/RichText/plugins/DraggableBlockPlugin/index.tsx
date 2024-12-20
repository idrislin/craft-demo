import { DraggableBlockPlugin_EXPERIMENTAL } from '@lexical/react/LexicalDraggableBlockPlugin';
import { useRef } from 'react';

import { IconDraggableBlockMenu } from '../../icons';

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(
    'w-[16px] h-[16px] opacity-30 active:cursor-grabbing hover:bg-[#efefef]'
  );
}

const DraggableBlockPlugin: React.FC<{
  anchorElem?: HTMLElement;
}> = ({ anchorElem = document.body }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      menuRef={menuRef}
      anchorElem={anchorElem}
      targetLineRef={targetLineRef}
      menuComponent={
        <div
          ref={menuRef}
          className="rounded px-px py-0.5 cursor-grab opacity-0 absolute left-0 top-0 will-change-transform"
        >
          <div className="w-[16px] h-[16px] opacity-30 active:cursor-grabbing hover:bg-[#efefef]">
            <IconDraggableBlockMenu />
          </div>
        </div>
      }
      targetLineComponent={
        <div
          ref={targetLineRef}
          className="pointer-events-none bg-[deepskyblue] h-1 absolute left-0 top-0 opacity-0 will-change-transform"
        />
      }
      isOnMenu={isOnMenu}
    />
  );
};

export default DraggableBlockPlugin;
