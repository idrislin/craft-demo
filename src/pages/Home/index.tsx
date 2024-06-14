import { Editor, Frame, Element } from "@craftjs/core";

import { Viewport } from "./Viewport";

import Container from "~/components/Craftjs/Container";
import { RenderNode } from "~/components/Craftjs/RenderNode";
import Header from "~/components/Craftjs/PageSections/Header";
import Summary from "~/components/Craftjs/PageSections/Summary";
import Experience from "~/components/Craftjs/PageSections/Experience";
import ExperienceEntry from "~/components/Craftjs/PageSections/Experience/ExperienceEntry";

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
        }}
        onRender={RenderNode}
      >
        <Viewport>
          <Frame>
            <Element
              canvas
              shadow="md"
              height="100%"
              is={Container}
              background="#FFFFFF"
              padding={[44, 44, 44, 44]}
              custom={{ displayName: "Root" }}
            >
              <Element
                canvas
                is={Header}
                imageType="square"
                image={{ value: "Image", label: "Image", show: true }}
                title={{ value: "YOUR NAME", label: "Title", show: true }}
                subtitle={{
                  value: "The role you are applying for?",
                  label: "SubTitle",
                  show: true,
                }}
                fields={[
                  { value: "Phone", label: "Phone", show: true },
                  { value: "Email", label: "Email", show: true },
                  { value: "LinkedIn/Portfolio", label: "Link", show: true },
                  { value: "Extra Link", label: "Extra Link", show: false },
                  { value: "Location", label: "Location", show: true },
                  { value: "Extra Field", label: "Extra Field", show: false },
                ]}
              />
              <Element
                canvas
                is={Summary}
                title="Summary"
                entries={[{ id: "Entry 1", value: "" }]}
                placeholder="What's the one thing that makes you the best candidate for this job?"
              />
              <Element canvas is={Experience} title="Experience" />
              <Element
                canvas
                is={Container}
                background="#FFFFFF"
                padding={[12, 16, 12, 16]}
                custom={{ displayName: "Education" }}
              ></Element>
            </Element>
          </Frame>
        </Viewport>
      </Editor>
    </div>
  );
};

export default HomePage;
