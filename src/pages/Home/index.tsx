import { Editor, Frame, Element } from "@craftjs/core";

import Text from "../../components/Elements/Text";
import Container from "../../components/Sections/Container";
import Button from "../../components/Elements/Button";
import { RenderNode } from "../../components/RenderNode";
import { Viewport } from "../../components/Viewport";
import Image from "../../components/Elements/Image";
import Header from "../../components/Sections/Header";

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
              <Element canvas is={Header}>
                <Text text="Title" />
              </Element>
              <Element
                canvas
                is={Container}
                background="#FFFFFF"
                padding={[12, 16, 12, 16]}
                custom={{ displayName: "Summary" }}
              >
                <Text text="Title" />
              </Element>

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
