import React, { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Element, useEditor } from '@craftjs/core';
import { CloseOutlined, DoneOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { last } from 'lodash';

import { rearrangeSectionModalAtom, serializedAtom } from '~/state';

const RearrangeSectionModal: React.FC = () => {
  const [open, setOpen] = useAtom(rearrangeSectionModalAtom);
  const serializedString = useAtomValue(serializedAtom);
  const { actions, query } = useEditor();

  const nodes = useMemo(() => {
    if (!serializedString || serializedString === '') return [];
    const rootNode = JSON.parse(serializedString).ROOT;
    console.log(JSON.parse(serializedString));
    return [];
  }, [serializedString]);

  return (
    <>
      {open
        ? createPortal(
            <div className="inset-0 fixed p-4 bg-[#47445a] bg-opacity-90 z-[9999] flex items-center justify-center">
              <div className="bg-white p-8 w-full max-w-[940px] rounded-lg relative">
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
                  <div className="bg-white flex flex-col h-min p-2.5 w-80 border mt-10 border-solid border-[#e0e0e0]">
                    {nodes.map(() => (
                      <div></div>
                    ))}
                  </div>
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
