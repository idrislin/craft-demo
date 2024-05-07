import { Editor, Frame, Element } from "@craftjs/core";
import Text from "./components/Elements/Text";
import Toolbox from "./components/Toolbox";
import SettingsPanel from "./components/SettingsPanel";
import Container from "./components/Layouts/Container";
import Card, { CardBottom, CardTop } from "./components/Layouts/Card";
import Button from "./components/Elements/Button";

function App() {
  return (
    <div className="min-h-screen">
      <div className="relative z-10 flex-shrink-0 w-full px-5 shadow h-14">
        <div>Header</div>
      </div>
      <Editor resolver={{ Text, Container, Card, CardBottom, CardTop, Button }}>
        <div className="flex-1 h-[calc(100vh-56px)] max-h-[calc(100vh-56px)] grid grid-cols-[284px,1fr,284px]">
          <Toolbox />
          <div className="px-5 py-7 overflow-y-auto border-x border-gray-200 bg-[#f8f9fd] custom-scrollbar">
            <Frame>
              <Element is="div" canvas>
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
          <div className="px-4 py-5">
            <SettingsPanel />
          </div>
        </div>
      </Editor>
    </div>
  );
}

export default App;
