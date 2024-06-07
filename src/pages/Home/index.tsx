import { Editor, Frame, Element } from "@craftjs/core";

import Text from "../../components/UserComponent/Text";
import Container from "../../components/Sections/Container";
import Button from "../../components/UserComponent/Button";
import { RenderNode } from "../../components/RenderNode";
import { Viewport } from "../../components/Viewport";
import Image from "../../components/UserComponent/Image";
import Header from "../../components/Sections/Header";
import Summary from "../../components/Sections/Summary";

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
          Text,
          Container,
          Button,
          Image,
          Header,
          Summary,
        }}
        onRender={RenderNode}
      >
        <Viewport>
          <Frame>
            <Element
              canvas
              is={Container}
              background="#FFFFFF"
              height="100%"
              shadow="md"
              padding={[44, 44, 44, 44]}
              custom={{ displayName: "Root" }}
            >
              <Element
                canvas
                is={Header}
                title={{ value: "YOUR NAME", label: "Title", show: true }}
                subtitle={{
                  value: "The role you are applying for?",
                  label: "SubTitle",
                  show: true,
                }}
                imageType="square"
                image={{ value: "Image", label: "Image", show: false }}
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
                content="What's the one thing that makes you the best candidate for this job?"
              />

              <Element
                canvas
                is={Container}
                background="#FFFFFF"
                padding={[12, 16, 12, 16]}
                custom={{ displayName: "Experience" }}
              >
                <Text text="Title" />
              </Element>

              <Element
                canvas
                is={Container}
                background="#FFFFFF"
                padding={[12, 16, 12, 16]}
                custom={{ displayName: "Education" }}
              >
                <Text text="Title" />
              </Element>
            </Element>
          </Frame>
        </Viewport>
      </Editor>
    </div>
  );
};

export default HomePage;
