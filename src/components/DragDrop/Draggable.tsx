import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { useEffect } from "react";
import DragHandleIcon from "@mui/icons-material/DragHandle";

interface DraggableProps {
  id: string;
  handle?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  warpClass?: string;
  onDragging?: (isDragging: boolean) => void;
}

const Draggable: React.FC<DraggableProps> = (props) => {
  const { id, onClick, onDragging, warpClass } = props;
  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useSortable({ id });

  useEffect(() => {
    if (onDragging) onDragging(isDragging);
    if (isDragging) {
      document.body.style.setProperty("cursor", "grabbing", "important");
    } else {
      document.body.style.cursor = "";
    }
    return () => {
      document.body.style.cursor = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      className={clsx(
        warpClass,
        "flex items-center py-1.5 px-3 gap-2 rounded-lg bg-white",
        isDragging && "outline-dotted outline-primary z-[9999]"
      )}
      onClick={onClick}
      style={{ transform: CSS.Transform.toString(transform) }}
    >
      <div
        {...listeners}
        data-cypress="draggable-handle"
        className={clsx(isDragging ? "cursor-grabbing" : "cursor-grab")}
      >
        <DragHandleIcon />
      </div>
      {props.children}
    </div>
  );
};

export default Draggable;
