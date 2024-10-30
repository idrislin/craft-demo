import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
  UNDO_COMMAND,
} from 'lexical';
import { $isLinkNode } from '@lexical/link';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import clsx from 'clsx';

import DropDownFontSize from '~/components/RichText/components/DropDownFontSize';
import {
  IconUndo,
  IconRedo,
  IconTypeBold,
  IconTypeItalic,
  IconTypeUnderline,
  IconTypeStrikethrough,
  IconCode,
  IconTextLeft,
  IconTextCenter,
  IconIndent,
  IconOutdent,
  IconJustify,
  IconTextRight,
} from '~/components/RichText/icons';
import { getSelectedNode } from '~/components/RichText/utils/getSelectedNode';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const theme = {
    paragraph: 'paragraphClassName',
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
      strikethrough: 'line-through',
    },
  };

  const initialConfig = {
    namespace: 'Lexical Demo',
    onError(error: Error) {
      throw error;
    },
    // 主题
    theme,
  };

  return (
    <div className="p-5">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="rounded-lg border-[#e2e2e2] border-solid border w-full text-black relative text-left">
          {/* 在合适的位置放置工具栏 */}
          <ToolbarPlugin />
          <RichTextPlugin
            ErrorBoundary={LexicalErrorBoundary}
            contentEditable={
              <div className="min-h-[150px] border-none flex relative outline-none z-0 overflow-auto resize-y">
                <ContentEditable
                  aria-placeholder="Enter some rich text..."
                  className="min-h-[150px] w-full resize-none caret-[rgb(5,5,5)] relative outline-none py-4 px-6 editor-cell"
                  placeholder={
                    <div className="absolute overflow-hidden text-gray-400 truncate pointer-events-none select-none top-4 left-6">
                      Enter some rich text...
                    </div>
                  }
                />
              </div>
            }
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
};

export default Dashboard;

interface ToolbarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = (props) => {
  const { children, className, active, ...rest } = props;
  return (
    <button
      type="button"
      className={clsx(
        'min-h-[36px] min-w-[36px] flex items-center justify-center border-none cursor-pointer text-gray-700 rounded hover:bg-[#0000000d]',
        'disabled:text-gray-300 disabled:cursor-default disabled:hover:bg-transparent',
        active ? 'bg-[#0000000d]' : 'bg-transparent',
        className,
        '[&svg]:w-4 [&svg]:h-4'
      )}
      {...rest}
    >
      {props.children}
    </button>
  );
};

const Divider: React.FC = () => {
  return (
    <div className="h-8 mx-2 w-px float-left block shadow-[inset_-1px_0_#0000001a]" />
  );
};

const ToolbarPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const toolbarRef = useRef(null);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [fontSize, setFontSize] = useState<string>('16px');

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const [isCode, setIsCode] = useState(false);

  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');

  //- 更新工具栏状态
  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const node = getSelectedNode(selection);
      const parent = node.getParent();

      let matchingParent;
      if ($isLinkNode(parent)) {
        //- 如果节点是 link ，我们需要获取父节点来设置格式
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        );
      }

      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType() || 'left'
      );
    }
    if ($isRangeSelection(selection)) {
      //- 更新状态
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      setIsCode(selection.hasFormat('code'));

      setFontSize(
        $getSelectionStyleValueForProperty(selection, 'font-size', '16px')
      );
    }
  }, []);

  //- 注册编辑器
  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  //- 注册更新监听器
  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updateToolbar, activeEditor]);

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };
  <ToolbarButton
    disabled={!canUndo}
    onClick={() => {
      editor.dispatchCommand(UNDO_COMMAND, undefined);
    }}
  >
    <IconUndo />
  </ToolbarButton>;
  return (
    <div
      ref={toolbarRef}
      className="flex items-center flex-wrap rounded-t-lg p-1 gap-0.5 border-b border-t-0 border-x-0 border-gray-300 border-solid bg-white"
    >
      {/* Undo/Redo */}
      <ToolbarButton
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        <IconUndo />
      </ToolbarButton>
      <ToolbarButton
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        <IconRedo />
      </ToolbarButton>
      <Divider />
      {/* font size */}
      <DropDownFontSize selectionFontSize={fontSize} editor={activeEditor} />
      <Divider />
      {/* font style */}
      <ToolbarButton active={isBold} onClick={() => formatText('bold')}>
        <IconTypeBold />
      </ToolbarButton>
      <ToolbarButton active={isItalic} onClick={() => formatText('italic')}>
        <IconTypeItalic />
      </ToolbarButton>
      <ToolbarButton
        active={isUnderline}
        onClick={() => formatText('underline')}
      >
        <IconTypeUnderline />
      </ToolbarButton>
      <ToolbarButton
        active={isStrikethrough}
        onClick={() => formatText('strikethrough')}
      >
        <IconTypeStrikethrough />
      </ToolbarButton>
      <ToolbarButton active={isCode} onClick={() => formatText('code')}>
        <IconCode />
      </ToolbarButton>

      {/* alignment */}
      <ToolbarButton
        active={elementFormat === 'left'}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
      >
        <IconTextLeft />
      </ToolbarButton>
      <ToolbarButton
        active={elementFormat === 'center'}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
      >
        <IconTextCenter />
      </ToolbarButton>
      <ToolbarButton
        active={elementFormat === 'right'}
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
      >
        <IconTextRight />
      </ToolbarButton>
      <ToolbarButton
        active={elementFormat === 'justify'}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
      >
        <IconJustify />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        }}
      >
        <IconOutdent />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        }}
      >
        <IconIndent />
      </ToolbarButton>
    </div>
  );
};
