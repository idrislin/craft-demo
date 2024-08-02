import React from 'react';
import { useAtom } from 'jotai';
import { Element, UserComponent, useEditor } from '@craftjs/core';
import { CloseOutlined, DoneOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { last } from 'lodash';

import Header from '../PageSections/Header';
import Summary from '../PageSections/Summary';
import Education from '../PageSections/Education';
import Experience from '../PageSections/Experience';

import { sectionModalAtom } from '~/state';

interface Section {
  title: string;
  tags?: string[];
  subscript?: string[];
  previewImg?: string;
  related: UserComponent;
}

export const Sections: Section[] = [
  { title: 'Header', related: Header, tags: ['Recommended'] },
  { title: 'Summary', related: Summary, tags: ['Recommended'] },
  { title: 'Experience', related: Experience, tags: ['Recommended'] },
  { title: 'Education', related: Education, tags: ['Recommended'] },
];

const AddSectionModal: React.FC = () => {
  const [open, setOpen] = useAtom(sectionModalAtom);
  const { actions, query } = useEditor();

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
                      key={section.title}
                      className="relative group/preview min-[992px]:basis-1/3 min-[992px]:max-w-[33.33%] md:max-w-[50%] md:basis-1/2"
                    >
                      <div className="box-border relative px-2 py-4 mx-2 shadow-card max-h-[172px] overflow-hidden">
                        <div>
                          {/* Preview Dom */}
                          {section.related.craft?.related &&
                          section.related.craft.related.display ? (
                            <div className="origin-top-left scale-[0.6]">
                              {React.createElement(
                                section.related.craft.related.display
                              )}
                            </div>
                          ) : (
                            <p>Preview</p>
                          )}
                          {/* Action Button */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute items-center bg-[#545166] bg-opacity-90 flex rounded-sm justify-center h-full left-0 top-0 w-full"
                          >
                            <button
                              onClick={() => {
                                const nodeTree = query
                                  .parseReactElement(
                                    <Element is={section.related} />
                                  )
                                  .toNodeTree();
                                const nodes = query.getNodes();
                                const pageNodes =
                                  last(nodes.ROOT.data?.nodes ?? []) ?? '';
                                actions.addNodeTree(nodeTree, pageNodes);
                                actions.selectNode(nodeTree.rootNodeId);
                              }}
                              className="px-6 py-2 text-lg font-medium text-white bg-purple-400 border-none rounded"
                            >
                              Add to page
                            </button>
                          </motion.div>
                          {/* subscript */}
                          {section.subscript ? (
                            <span className="absolute bottom-0 right-0 w-0 h-0 triangleBorder">
                              <i className="absolute text-white right-1 top-3">
                                <DoneOutlined className="!text-sm" />
                              </i>
                            </span>
                          ) : (
                            []
                          )}
                        </div>
                      </div>
                      {/* Tags */}
                      {section.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="absolute px-2 py-1 text-xs text-white rounded-full select-none right-3 top-2 bg-green"
                        >
                          {tag}
                        </span>
                      ))}
                      <p className="pb-6 mt-2 text-center text-black group-hover/preview:text-purple-500">
                        {section.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
};

export default AddSectionModal;
