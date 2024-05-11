import { Editor, Frame, Element } from "@craftjs/core";
import Text from "./components/Elements/Text";
import Container from "./components/Layouts/Container";
import Button from "./components/Elements/Button";
import { RenderNode } from "./components/RenderNode";
import { Viewport } from "./components/Viewport";
import Image from "./components/Elements/Image";

function App() {
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
        }}
        onRender={RenderNode}
      >
        <Viewport>
          <Frame>
            <Element
              canvas
              is={Container}
              background="#FFFFFF"
              padding={[12, 16, 12, 16]}
              custom={{ displayName: "Root" }}
            >
              <Element
                canvas
                is={Container}
                background="#FFFFFF"
                padding={[12, 16, 12, 16]}
                custom={{ displayName: "Container" }}
              >
                <Text text="Title" />
              </Element>
              <Text text="文本内容..." />
              <Button text="Click me" size="md" />
            </Element>
          </Frame>
        </Viewport>
      </Editor>
    </div>
  );
}

export default App;
