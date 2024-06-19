import { Editor } from '@craftjs/core';

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
import AddSectionModal from '~/components/Craftjs/AddSectionModal';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="relative z-10 flex-shrink-0 w-full px-5 shadow h-14">
        <div className="flex items-center h-full text-2xl font-bold">
          LINNIL
        </div>
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
        onNodesChange={() => {
          console.log('nodes change callback');
        }}
        onRender={RenderNode}
      >
        <Viewport>
          <NodesTree />
          <AddSectionModal />
        </Viewport>
      </Editor>
    </div>
  );
};

export default HomePage;
