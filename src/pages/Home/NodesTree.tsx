import React from 'react';
import {
  Frame,
  Element,
  Node,
  useEditor,
  SerializedNode,
  SerializedNodes,
} from '@craftjs/core';
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

  const nodeTree2serialized = (
    target: Node,
    parentId: string
  ): SerializedNode => {
    const res: SerializedNode = {
      nodes: [],
      hidden: false,
      isCanvas: true,
      linkedNodes: {},
      parent: parentId,
      props: target.data.props,
      custom: target.data.custom,
      type: { resolvedName: 'Container' },
      displayName: target.data.displayName,
    };
    return res;
  };

  const moveNodes = (
    target: SerializedNodes,
    nodeIds: string[],
    parentId: string,
    index: number
  ) => {
    for (let i = 0; i < nodeIds.length; i++) {
      console.log(nodeIds);
      //- 移除旧 parent
      const oldParentId = target[nodeIds[i]].parent ?? '';
      target[oldParentId].nodes = target[oldParentId].nodes.filter(
        (v) => v !== nodeIds[i]
      );
      //- 添加新 parent
      target[nodeIds[i]].parent = parentId;
    }
    const res = [...(target[parentId].nodes ?? [])];
    res.splice(index, 0, ...nodeIds);
    target[parentId].nodes = res;
  };

  // const addNodes = (
  //   target: SerializedNodes,
  //   nodeId: string,
  //   node: SerializedNode,
  //   parentId: string
  // ) => {
  //   node.parent = parentId;
  //   target[nodeId] = node;
  //   target[parentId].nodes = [...target[parentId].nodes, nodeId];
  // };

  const reorderNodes = () => {
    const resSerialize: SerializedNodes = query.getSerializedNodes();
    console.log('resSerialize', resSerialize);

    //* step 1: 遍历 nodes 找出 ROOT 之下的所有节点
    const allNodes = query.getNodes();
    const pageNodes: Node[] = [];
    const pageChildren = new Map<string, Node[]>();
    Object.keys(allNodes).forEach((key) => {
      if (allNodes[key].data.parent !== 'ROOT') return;
      pageNodes.push(allNodes[key]);
      const c =
        allNodes[key]?.data?.nodes?.map((nodeKey) => ({
          ...allNodes[nodeKey],
          data: {
            ...allNodes[nodeKey].data,
            custom: allNodes[nodeKey].dom?.getBoundingClientRect(),
          },
        })) ?? [];
      pageChildren.set(key, c);
    });

    //- 二维数组： i 对应 page-index，填充需要添加的元素
    const overflowNodes: Node[][] = Array.from(
      { length: pageNodes.length + 1 },
      () => []
    );
    //* step 2: 遍历 page 比对高度，找出超出当前 page 的节点
    pageNodesLoop: for (let i = 0; i < pageNodes.length; i++) {
      if (
        !pageNodes[i] ||
        (pageNodes[i].dom?.clientHeight == pageNodes[i].dom?.scrollHeight &&
          overflowNodes[i].length == 0)
      ) {
        //- 当前 page 没有溢出并且不需要添加上一页的元素
        continue;
      }
      let contentHeight = 40 + 40; //- paddingY
      const children = [
        ...overflowNodes[i],
        ...(pageChildren.get(pageNodes[i].id) ?? []),
      ];
      //- 遍历对应 page 的 children
      childrenLoop: for (let j = 0; j < children.length; j++) {
        if (
          children[j].data.custom.height + contentHeight <
          (pageNodes[i].dom?.clientHeight ?? 0)
        ) {
          contentHeight += children[j].data.custom.height;
          continue childrenLoop;
        } else {
          //- 高度超过，如果拥有子节点，则找出极限

          const child2 = children[j].data.nodes;
          let rect: DOMRect | undefined = undefined;
          for (let k = 0; k < child2.length; k++) {
            const kChild = allNodes[child2[k]]?.dom?.getBoundingClientRect();
            if (k == 0) rect = kChild;
            else if (rect) rect.height = rect.height + (kChild?.height ?? 0);
            if (k == 0 && kChild?.top !== children[j].data?.custom.top) {
              //- 有上边距
              contentHeight +=
                (kChild?.top ?? 0) - children[j].data?.custom.top;
            }
            if (
              (kChild?.height ?? 0) + contentHeight >
              (pageNodes[i].dom?.clientHeight ?? 0)
            ) {
              const { nodes, rootNodeId } = query
                .parseReactElement(
                  <Element
                    canvas
                    padding={[2]}
                    is={Container}
                    resizeable={false}
                    custom={{ displayName: 'Container' }}
                  ></Element>
                )
                .toNodeTree();
              console.log(rootNodeId);

              resSerialize[rootNodeId] = nodeTree2serialized(
                {
                  ...nodes[rootNodeId],
                  data: { ...nodes[rootNodeId].data, custom: rect },
                },
                pageNodes[i + 1].id
              );
              // pageChildren.set(pageNodes[i].id);
            }
          }
          overflowNodes[i + 1] = children.slice(j);

          continue pageNodesLoop;
        }
      }
    }

    for (let i = 1; i < overflowNodes.length; i++) {
      if (overflowNodes[i].length == 0) continue;

      moveNodes(
        resSerialize,
        overflowNodes[i].map((n) => n.id),
        pageNodes[i].id,
        0
      );
    }

    actions.deserialize(resSerialize);
    return;
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
