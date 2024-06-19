import React, { useEffect, useState } from 'react';
import { atom, useAtom } from 'jotai';
import { UserComponent, useEditor } from '@craftjs/core';

import Header from './PageSections/Header';
import { CloseOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

export const sectionModalAtom = atom(true);

const AddSectionModal: React.FC = () => {
  const [open, setOpen] = useAtom(sectionModalAtom);
  const [modalContainer, setModalContainer] = useState<HTMLElement | null>(
    null
  );
  const { actions } = useEditor();

  useEffect(() => {
    const container = document.getElementById('viewport');
    if (container) {
      setModalContainer(container);
    }
  }, []);

  return (
    <div className="inset-0 fixed p-4 bg-[#47445a] bg-opacity-90 z-[9999] flex items-center justify-center">
      <div className="bg-white p-8 w-min base:min-w-[940px] min-w-full rounded-lg relative">
        <motion.div
          onClick={() => setOpen(false)}
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.25 }}
          className="absolute top-0 right-0 p-4 cursor-pointer"
        >
          <CloseOutlined />
        </motion.div>
        <div className="flex flex-wrap">
          <div className="basis-full">
            <h4 className="mb-2 text-3xl text-[#2d3639] text-center">
              Add a new section
            </h4>
            <p className="mb-4 text-base text-center text-black">
              Click on a section to add it to your page.
            </p>
          </div>
          {Sections.map((section) => (
            <div
              className="min-[992px]:basis-1/3 shadow-card min-[992px]:max-w-[33.33%] md:max-w-[50%] md:basis-1/2"
              key={section.title}
            >
              <div className="scale-50">
                {React.createElement(section.related.craft?.related?.display!)}
              </div>
              {section.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddSectionModal;

interface Section {
  title: string;
  related: UserComponent;
  previewImg?: string;
  tags?: string[];
  subscript?: string[];
}

export const Sections: Section[] = [{ title: 'Header', related: Header }];
