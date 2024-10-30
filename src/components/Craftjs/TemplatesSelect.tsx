import { DoneOutlined } from '@mui/icons-material';
import clsx from 'clsx';
import React, { useState } from 'react';

const TemplateSelect: React.FC = () => {
  const [selected, setSelected] = useState(-1);

  const templates = [
    {
      title: 'Double column',
      preview:
        'https://app.enhancv.com/images/layoutDouble-8b53dedeaf7aeaf0a523.jpg',
    },
  ];

  return (
    <div className="my-10 ml-5 bg-white rounded shadow-card w-96">
      <div className="mt-6 text-[14px] text-center">Select a template</div>
      <div className="grid grid-cols-2 gap-3 px-6 py-4">
        {templates.map((template, index) => (
          <TemplateCard
            {...template}
            key={template.title}
            selected={selected === index}
            onSelected={() => setSelected(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateSelect;

interface TemplateCardProps {
  title: string;
  preview?: string;
  selected: boolean;
  onSelected: VoidFunction;
}

const TemplateCard: React.FC<TemplateCardProps> = (props) => {
  const { title, preview, selected, onSelected } = props;
  return (
    <div className="cursor-pointer group/template" onClick={onSelected}>
      <div
        className={clsx(
          'relative mt-1 mb-2 shadow group-hover/template:outline-primary outline-1 outline',
          selected ? 'outline-primary' : 'outline-transparent'
        )}
      >
        <img src={preview} />
        {selected ? (
          <span className="absolute bottom-0 right-0 triangleBorder">
            <i className="absolute text-white right-1 top-3">
              <DoneOutlined className="!text-[14px]" />
            </i>
          </span>
        ) : null}
      </div>
      <div
        className={clsx(
          'flex items-center justify-center text-[14px] font-medium group-hover/template:text-primary',
          selected ? 'text-primary' : 'text-black'
        )}
      >
        {title}
      </div>
    </div>
  );
};
