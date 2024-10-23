import React, { useState } from 'react';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';

import SerializationPlugin from './plugin/SerializationPlugin';
import ToolbarPlugin from './plugin/ToolbarPlugin';
import TreeViewPlugin from './plugin/TreeViewPlugin';
import theme from './themes/CommentEditorTheme';
import { useSharedHistoryContext } from './context/SharedHistoryContext';
import { useSettings } from './context/SettingsContext';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import PageBreakPlugin from './plugin/PageDividerPlugin';

interface RichTextV3Props {}

const RichTextV3: React.FC<RichTextV3Props> = (props) => {
  const { historyState } = useSharedHistoryContext();
  const {
    settings: {
      isCollab,
      isAutocomplete,
      isMaxLength,
      isCharLimit,
      isCharLimitUtf8,
      isRichText,
      showTreeView,
      showTableOfContents,
      shouldUseLexicalContextMenu,
      shouldPreserveNewLinesInMarkdown,
      tableCellMerge,
      tableCellBackgroundColor,
    },
  } = useSettings();

  const initialConfig = {
    namespace: 'Lexical Demo',
    nodes: [...PlaygroundNodes],
    // Handling of errors during update
    onError(error: Error) {
      throw error;
    },
    // The editor theme
    theme: theme,
  };

  const [value, setValue] = useState<string>('');

  return (
    <div className="">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="my-5 rounded-lg border-[#e2e2e2] border-solid border w-full text-black relative text-left ">
          <ToolbarPlugin />
          {/* {isMaxLength && <MaxLengthPlugin maxLength={30} />} */}
          <AutoFocusPlugin />
          <ClearEditorPlugin />

          <HashtagPlugin />

          <div className="relative bg-white">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="min-h-[150px] resize-none caret-[rgb(5,5,5)] relative outline-none py-4 px-2.5"
                  aria-placeholder="Enter some rich text..."
                  placeholder={
                    <div className="text-gray-400 overflow-hidden absolute truncate top-4 left-2.5 select-none pointer-events-none">
                      Enter some rich text...
                    </div>
                  }
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            {/* {isCollab ? (
              <CollaborationPlugin
                id="main"
                providerFactory={createWebsocketProvider}
                shouldBootstrap={!skipCollaborationInit}
              />
            ) : (
            )} */}
            <HistoryPlugin externalHistoryState={historyState} />

            <ListPlugin />
            <CheckListPlugin />
            <ClickableLinkPlugin />
            <HorizontalRulePlugin />

            <TreeViewPlugin />
            <SerializationPlugin
              onChange={(value) => {
                setValue(value);
                console.log(value);
              }}
            />

            <PageBreakPlugin />

            {(isCharLimit || isCharLimitUtf8) && (
              <CharacterLimitPlugin
                charset={isCharLimit ? 'UTF-16' : 'UTF-8'}
                maxLength={5}
              />
            )}
          </div>
        </div>
      </LexicalComposer>
      <div dangerouslySetInnerHTML={{ __html: value }}></div>
    </div>
  );
};

export default RichTextV3;
