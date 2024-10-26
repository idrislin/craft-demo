import * as React from 'react';

interface FileInputProps {
  label: string;
  accept?: string;
  'data-test-id'?: string;
  onChange: (files: FileList | null) => void;
}
const FileInput: React.FC<FileInputProps> = (props) => {
  const { accept, label, onChange, 'data-test-id': dataTestId } = props;

  return (
    <div className="flex items-center mb-2.5">
      <label className="flex flex-1 text-[#666]">{label}</label>
      <input
        type="file"
        accept={accept}
        data-test-id={dataTestId}
        onChange={(e) => onChange(e.target.files)}
        className="flex flex-[2] border border-solid border-[#999] py-2 px-2.5 rounded min-w-0"
      />
    </div>
  );
};

export default FileInput;
