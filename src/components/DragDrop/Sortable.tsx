import React from "react";
import {
  DndContext,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Draggable from "./Draggable";

interface DragDropProps {
  id: string;
  items: string[];
  handle?: boolean;
  onDragEnd?: (value1: number, value2: number) => void;
  renderItem: (value: string, index: number) => React.ReactNode;
}

const DragDrop: React.FC<DragDropProps> = (props) => {
  const { id, items, handle = true, onDragEnd, renderItem } = props;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 10, tolerance: 0 },
    })
  );
  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis]}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={() => {
        // if (onDragStart) onDragStart();
        // if (!active.data.current) return;
        // setActiveItem(active.data.current as Record<string, any>);
      }}
      onDragEnd={({ active, over }) => {
        // - 判空 & 去除原地拖拽判断
        if (!over?.data.current || !active.data.current) return;
        if (over.id == active.id) return;
        const activeI = active.data.current.sortable.index;
        const overI = over.data.current.sortable.index;
        if (onDragEnd) onDragEnd(activeI, overI);
      }}
    >
      <SortableContext
        id={id}
        items={items}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item, i) => (
          <Draggable id={item} key={item} handle={handle}>
            {renderItem(item, i)}
          </Draggable>
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default DragDrop;
