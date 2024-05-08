import { Editor, Frame, Element } from "@craftjs/core";
import Text from "./components/Elements/Text";
import Toolbox from "./components/Toolbox";
import SettingsPanel from "./components/SettingsPanel";
import Container, { ContainerContent } from "./components/Layouts/Container";
import Card from "./components/Layouts/Card";
import Button from "./components/Elements/Button";
import { Layers } from "@craftjs/layers";
import { RenderNode } from "./components/RenderNode";

function App() {
  const Layer = () => {
    return <div>123</div>;
  };
  return (
    <div className="min-h-screen">
      <div className="relative z-10 flex-shrink-0 w-full px-5 shadow h-14">
        <div>Header</div>
      </div>
      <Editor
        resolver={{
          Text,
          Container,
          Card,
          ContainerContent,
          Button,
        }}
        enabled={false}
        onRender={RenderNode}
      >
        <div className="flex-1 h-[calc(100vh-56px)] max-h-[calc(100vh-56px)] grid grid-cols-[284px,1fr,284px]">
          <Toolbox />
          <div className="page-container px-5 py-7 overflow-y-auto border-x border-gray-200 bg-[#f8f9fd] custom-scrollbar">
            <Frame>
              <Element is={Container} canvas custom={{ displayName: "Root" }}>
                <Card>
                  <Element is="div" canvas>
                    <Text text="Title" />
                  </Element>
                </Card>
                <Text text="It's me again!" />
                <Button text="Click me" size="md" />
              </Element>
            </Frame>
          </div>
          <div className="flex flex-col px-4 py-5">
            <div className="flex-1">
              <SettingsPanel />
            </div>
            <div className="flex-1">
              <Layers renderLayer={Layer} />
            </div>
          </div>
        </div>
      </Editor>
    </div>
  );
}

export default App;
