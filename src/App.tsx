import { Editor, Frame, Element } from "@craftjs/core";
import Text from "./components/Elements/Text";
import Container from "./components/Layouts/Container";
import Card from "./components/Layouts/Card";
import Button from "./components/Elements/Button";
import { RenderNode } from "./components/RenderNode";
import { Viewport } from "./components/Viewport";

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
          Card,
          Button,
        }}
        onRender={RenderNode}
      >
        <Viewport>
          <Frame>
            <Element
              is={Container}
              background="#FFFFFF"
              padding={[12, 16, 12, 16]}
              canvas
              custom={{ displayName: "Root" }}
            >
              <Card>
                <Text text="Title" />
              </Card>
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
