import { CloseOutlined } from '@mui/icons-material';
import React from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = (props) => {
  const { open, onClose } = props;
  return (
    <>
      {open
        ? createPortal(
            <div className="inset-0 fixed p-4 bg-[#47445a] bg-opacity-90 z-[9999] flex items-center justify-center">
              <div className="bg-white p-8 w-min base:min-w-[940px] min-w-full rounded-lg relative">
                <motion.div
                  onClick={onClose}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.25 }}
                  className="absolute top-0 right-0 p-4 cursor-pointer"
                >
                  <CloseOutlined />
                </motion.div>
                {props.children}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
};

export default Modal;
