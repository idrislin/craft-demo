import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TreeView } from '@lexical/react/LexicalTreeView';

export default function TreeViewPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  return (
    <TreeView
      viewClassName="block bg-[#222] text-white font-xs mt-px mb-2.5 px-auto relative overflow-hidden rounded-b-lg"
      treeTypeButtonClassName="text-xs top-2.5 right-24 absolute bg-none text-white hover:underline"
      timeTravelPanelClassName="pb-2.5 m-auto flex"
      timeTravelButtonClassName="text-xs top-2.5 right-4 absolute bg-none text-white hover:underline"
      timeTravelPanelSliderClassName="flex-[8]"
      timeTravelPanelButtonClassName="flex-1 text-white font-xs"
      editor={editor}
    />
  );
}
