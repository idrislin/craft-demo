import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import React from 'react';

interface LexicalContentEditableProps {
  placeholder: string;
}

const LexicalContentEditable: React.FC<LexicalContentEditableProps> = ({
  placeholder,
}) => {
  return (
    <ContentEditable
      aria-placeholder={placeholder}
      className="min-h-[150px] resize-none caret-[rgb(5,5,5)] relative outline-none py-4 px-6"
      placeholder={
        <div className="text-gray-400 overflow-hidden absolute truncate top-4 left-2.5 select-none pointer-events-none">
          {placeholder}
        </div>
      }
    />
  );
};

export default LexicalContentEditable;
