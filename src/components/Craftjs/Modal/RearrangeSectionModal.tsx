import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Node, useEditor } from '@craftjs/core';
import { CloseOutlined, DragHandleOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useImmer } from 'use-immer';
import { enableMapSet } from 'immer';
import clsx from 'clsx';

import { rearrangeSectionModalAtom, serializedAtom } from '~/state';

enableMapSet();

//TODO:
const RearrangeSectionModal: React.FC = () => {
  const [open, setOpen] = useAtom(rearrangeSectionModalAtom);
  const serializedString = useAtomValue(serializedAtom);
  const { query } = useEditor();
  const [pageNodes, setPageNodes] = useImmer<Node[]>([]);
  const [pageChildren, setPageChildren] = useImmer<Map<string, Node[]>>(
    new Map()
  );
  const [active, setActive] = useState<string>();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 10, tolerance: 0 },
    })
  );

  const mashalData = (nd: Node): Node => {
    const res: Node = {
      ...nd,
      data: {
        ...nd.data,
        custom: nd.dom?.getBoundingClientRect(),
      },
    };
    return res;
  };

  useEffect(() => {
    const allNodes = query.getNodes();
    const res: Node[] = [];
    const res2 = new Map<string, Node[]>();
    Object.keys(allNodes).forEach((key) => {
      if (allNodes[key].data.parent !== 'ROOT') return;
      res.push(mashalData(allNodes[key]));
      const c =
        allNodes[key]?.data?.nodes?.map((nodeKey) =>
          mashalData(allNodes[nodeKey])
        ) ?? [];
      res2.set(key, c);
    });
    setPageNodes(res);
    setPageChildren(res2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedString]);

  return (
    <>
      {open
        ? createPortal(
            <div className="inset-0 fixed overflow-y-auto p-4 bg-[#47445a] bg-opacity-90 z-[9999] flex justify-center">
              <div className="bg-white my-auto p-8 w-full max-w-[940px] rounded-lg relative">
                <motion.div
                  onClick={() => setOpen(false)}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.25 }}
                  className="absolute top-0 right-0 p-4 cursor-pointer"
                >
                  <CloseOutlined />
                </motion.div>
                <div className="flex flex-wrap justify-center">
                  <div className="basis-full">
                    <h4 className="mb-2 text-3xl text-[#2d3639] text-center">
                      Drag the boxes to rearrange the sections
                    </h4>
                  </div>
                  <DndContext
                    sensors={sensors}
                    modifiers={[restrictToVerticalAxis]}
                    measuring={{
                      droppable: { strategy: MeasuringStrategy.Always },
                    }}
                    onDragStart={({ active }) => {
                      if (!active.data.current) return;
                      const currentPage = pageNodes.find(
                        (v) =>
                          v.id === active.data.current?.sortable.containerId
                      );
                      if (!currentPage) return;
                      setActive(
                        pageChildren.get(currentPage.id)?.[
                          active.data.current?.sortable.index ?? 0
                        ].data.displayName
                      );
                    }}
                    onDragEnd={({ active, over }) => {
                      // - 判空 & 去除原地拖拽判断
                      if (!over?.data.current || !active.data.current) return;
                      if (over.id == active.id) return;
                      console.log(over.data.current.sortable);
                    }}
                  >
                    <div className="flex flex-col gap-5 mt-10">
                      {pageNodes.map((page) => (
                        <SortableContext
                          id={page.id}
                          key={page.id}
                          strategy={verticalListSortingStrategy}
                          items={page.data.nodes.map((node) => ({ id: node }))}
                        >
                          <div
                            style={{ width: 320, height: 452 }}
                            className="bg-white p-4 h-min border border-solid border-[#e0e0e0]"
                          >
                            <div className="flex flex-col w-full h-full gap-2">
                              {pageChildren.get(page.id)?.map((child) => (
                                <Draggable
                                  key={child.id}
                                  id={child.id}
                                  style={{
                                    height:
                                      (child.data.custom.height /
                                        ((page.dom?.clientHeight ?? 81) - 80)) *
                                        100 +
                                      '%',
                                  }}
                                  className="flex border border-gray-400"
                                >
                                  {child.data.displayName}
                                  {JSON.stringify(child.data.custom.height)}
                                </Draggable>
                              ))}
                            </div>
                          </div>
                        </SortableContext>
                      ))}
                    </div>
                    <DragOverlay>
                      <div>{active}</div>
                    </DragOverlay>
                  </DndContext>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
};

export default RearrangeSectionModal;

interface DraggableProps {
  id: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Draggable: React.FC<DraggableProps> = (props) => {
  const { id, style, className } = props;
  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useSortable({ id });

  useEffect(() => {
    if (isDragging) {
      document.body.style.setProperty('cursor', 'grabbing', 'important');
    } else {
      document.body.style.cursor = '';
    }
    return () => {
      document.body.style.cursor = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      //   className={clsx(
      //     'flex items-center py-1.5 px-3 gap-2 rounded-lg bg-white',
      //     isDragging && 'outline-dotted outline-primary z-[9999]'
      //   )}
      className={className}
      style={{ ...style, transform: CSS.Transform.toString(transform) }}
    >
      <div
        {...listeners}
        data-cypress="draggable-handle"
        className={clsx(isDragging ? 'cursor-grabbing' : 'cursor-grab')}
      >
        <DragHandleOutlined />
      </div>
      {props.children}
    </div>
  );
};
