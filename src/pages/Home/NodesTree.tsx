import React from 'react';
import { Frame, Element, Node, useEditor } from '@craftjs/core';
import { first, isEmpty } from 'lodash';
import { FeedOutlined } from '@mui/icons-material';

import Container from '~/components/Craftjs/Container';
import Header from '~/components/Craftjs/PageSections/Header';
import Summary from '~/components/Craftjs/PageSections/Summary';
import Experience from '~/components/Craftjs/PageSections/Experience';
import Education from '~/components/Craftjs/PageSections/Education';
import EducationEntry, {
  EmptyEducationEntry,
} from '~/components/Craftjs/PageSections/Education/EducationEntry';
import ExperienceEntry, {
  EmptyExperienceEntry,
} from '~/components/Craftjs/PageSections/Experience/ExperienceEntry';

interface NodesTreeProps {}

const NodesTree: React.FC<NodesTreeProps> = () => {
  const { actions, query } = useEditor((state) => ({
    hoveredNodeId: state.events.hovered,
  }));

  const reorderNodes = () => {
    //* step 1: 遍历 nodes 找出 ROOT 之下的所有节点，按照 [parentNode, childrenNode] 格式存储
    const nodes = query.getNodes();
    const pageNodes: Node[][] = [];
    Object.keys(nodes).forEach((key) => {
      if (nodes[key].data.parent !== 'ROOT') return;
      pageNodes.push([
        nodes[key],
        ...(nodes[key]?.data?.nodes?.map((nodeKey) => nodes[nodeKey]) ?? []),
      ]);
    });
    //* step 2: 比对高度，找出超出当前 page 的节点
    let overflowNodes: Node[] = [];
    let nextPageId = '';
    for (let i = 0; i < pageNodes.length; i++) {
      const p = first(pageNodes[i])?.dom;
      if (!p || p.clientHeight == p.scrollHeight) continue;
      for (let j = 1; j < pageNodes[i].length; j++) {
        const cb =
          (pageNodes[i][j].dom?.getBoundingClientRect().bottom ?? 0) + 40; //- 40 = paddingBottom

        if (p.getBoundingClientRect().bottom < cb) {
          overflowNodes = pageNodes[i].slice(j);
          if (i !== pageNodes.length - 1) {
            nextPageId = first(pageNodes[i + 1])?.id ?? '';
          }
          break;
        }
      }
    }
    console.log(overflowNodes);
    if (isEmpty(overflowNodes)) return; //- 没有节点超出
    //* step 3：移动元素
    const nodeTree = query
      .parseReactElement(
        <Element
          canvas
          shadow="md"
          is={Container}
          resizeable={false}
          background="#FFFFFF"
          padding={[44, 38, 44, 38]}
          custom={{ displayName: 'PAGE' }}
          className="relative overflow-hidden ROOT !w-[210mm] mx-auto !h-[297mm]"
        ></Element>
      )
      .toNodeTree();
    if (nextPageId === '') {
      //- 有下一页，不需要新开页面
      actions.addNodeTree(nodeTree, 'ROOT');
      return;
    }
    for (let i = 0; i < overflowNodes.length; i++) {
      actions.move(overflowNodes[i].id, nextPageId || nodeTree.rootNodeId, i);
    }
  };

  return (
    <div className="pt-5">
      <button
        onClick={reorderNodes}
        className="fixed z-50 flex items-center justify-center text-black transition-all bg-white rounded cursor-pointer shadow-button top-20 right-10 w-9 h-9 hover:bg-purple hover:bg-opacity-20 hover:text-purple"
      >
        <FeedOutlined />
      </button>
      <Frame>
        <div className="flex flex-col items-center gap-10">
          <Element
            canvas
            shadow="md"
            is={Container}
            background="#FFFFFF"
            resizeable={false}
            padding={[44, 38, 44, 38]}
            custom={{ displayName: 'PAGE' }}
            className="relative overflow-hidden ROOT !w-[210mm] mx-auto !h-[297mm]"
          >
            <Element is={Header} />
            <Element
              canvas
              is={Summary}
              title="Summary"
              entries={[{ id: 'Entry 1', value: '' }]}
              placeholder="What's the one thing that makes you the best candidate for this job?"
            />
            <Element canvas is={Experience} title="Experience">
              <Element
                is={ExperienceEntry}
                padding={[0, 12, 6, 12]}
                entry={EmptyExperienceEntry}
              />
            </Element>
            <Element canvas is={Education} title="Education">
              <Element
                deletable={true}
                is={EducationEntry}
                padding={[0, 12, 6, 12]}
                entry={EmptyEducationEntry}
              />
            </Element>
          </Element>
        </div>
      </Frame>
    </div>
  );
};

export default NodesTree;
