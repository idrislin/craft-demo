import { useAtom } from 'jotai';
import { Editor } from '@craftjs/core';
import { useEventListener, useInterval, useLocalStorageState } from 'ahooks';

import { Viewport } from './Viewport';
import NodesTree from './NodesTree';

import Container from '~/components/Craftjs/Container';
import { RenderNode } from '~/components/Craftjs/RenderNode';
import Header from '~/components/Craftjs/PageSections/Header';
import Summary from '~/components/Craftjs/PageSections/Summary';
import Experience from '~/components/Craftjs/PageSections/Experience';
import ExperienceEntry from '~/components/Craftjs/PageSections/Experience/ExperienceEntry';
import Education from '~/components/Craftjs/PageSections/Education';
import EducationEntry from '~/components/Craftjs/PageSections/Education/EducationEntry';
import AddSectionModal from '~/components/Craftjs/Modal/AddSectionModal';
import { LSKEY } from '~/lib/const';
import { serializedAtom } from '~/state';
// import RearrangeSectionModal from '~/components/Craftjs/Modal/RearrangeSectionModal';

const HomePage: React.FC = () => {
  const [serializedNodes, setSerializedNodes] = useAtom(serializedAtom);

  const [, setMessage] = useLocalStorageState<string | undefined>(LSKEY, {
    defaultValue: '',
  });

  useEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      setMessage(serializedNodes);
    }
  });

  useInterval(() => {
    setMessage(serializedNodes);
    if (import.meta.env.DEV) {
      console.log(
        'stash nodes at ',
        new Date().toLocaleString(),
        serializedNodes
      );
    }
  }, 300000);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 flex-shrink-0 w-full px-5 shadow h-14">
        <div className="flex items-center h-full text-2xl font-bold"></div>
      </div>
      <Editor
        resolver={{
          Container,
          Header,
          Summary,
          Experience,
          ExperienceEntry,
          Education,
          EducationEntry,
        }}
        onNodesChange={(query) => {
          console.log('nodes change callback', query.history);
          setSerializedNodes(query.serialize());
        }}
        onRender={RenderNode}
        indicator={{ error: 'transparent', success: '#2dc08d' }}
      >
        <Viewport>
          <NodesTree />
          <AddSectionModal />
          {/* <RearrangeSectionModal /> */}
        </Viewport>
      </Editor>
    </div>
  );
};

export default HomePage;
