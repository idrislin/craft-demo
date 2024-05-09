import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

interface CollapseProps {
  visible?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Collapse: React.FC<CollapseProps> = (props) => {
  return (
    <AnimatePresence initial={false}>
      {props.visible && (
        <motion.div
          layout="position"
          exit={{ height: 0 }}
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          className={clsx("overflow-hidden", props.className)}
        >
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Collapse;
