import { $patchStyleText } from '@lexical/selection';
import { $getSelection, LexicalEditor } from 'lexical';
import DropDown, { DropDownItem } from './DropDown';
import { useCallback } from 'react';

interface DropDownDropDownLineHeightProps {
  selectionLineHeight?: string;
  editor: LexicalEditor;
  disabled?: boolean;
}

const DropDownLineHeight: React.FC<DropDownDropDownLineHeightProps> = ({
  editor,
  selectionLineHeight,
  disabled = false,
}) => {
  const lineHeightOptions = ['1', '1.2', '1.5', '1.75', '2', '2.5', '3', '4'];

  const updateLineHeightInSelection = useCallback(
    (newValue: string) => {
      editor.update(() => {
        if (editor.isEditable()) {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, {
              'line-height': newValue,
            });
          }
        }
      });
    },
    [editor],
  );

  return (
    <DropDown disabled={disabled} buttonLabel="Line Height">
      {lineHeightOptions.map((lineHeight) => (
        <DropDownItem
          key={lineHeight}
          active={selectionLineHeight === lineHeight}
          onClick={() => updateLineHeightInSelection(lineHeight)}
        >
          <span className="text">{lineHeight}</span>
        </DropDownItem>
      ))}
    </DropDown>
  );
};

export default DropDownLineHeight;
