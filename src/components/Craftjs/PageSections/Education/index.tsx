import { UserComponent as CUserComponent, useNode } from '@craftjs/core';

import EducationEntry from './EducationEntry';

import { BaseElementsProps } from '~/components/LayoutSettingsPanel';
import { Resizer } from '~/components/Craftjs/Resizer';
import { Text, Slider } from '~/components/Forms';

interface EducationProps extends BaseElementsProps {
  gap?: string;
  title?: string;
  dividerColor?: string;
  deletable?: boolean;
  children?: React.ReactNode;
}

const Education: CUserComponent<EducationProps> = (props) => {
  const { margin = [0], padding = [0], title, gap = '0px' } = props;

  return (
    <Resizer
      className="!w-full flex flex-col justify-start min-h-[80px]"
      style={{
        margin: margin.join('px ') + 'px',
        padding: padding.join('px ') + 'px',
      }}
      enable={false}
    >
      <div className="pt-1.5 mx-3 mb-1 border-b-[1.5px] border-solid border-[#030303]">
        <Text
          value={title ?? ''}
          className="w-full text-lg font-medium text-center text-black whitespace-pre-wrap"
        />
      </div>
      <div className="flex flex-col w-full" style={{ gap }}>
        {props.children}
      </div>
    </Resizer>
  );
};

export default Education;

const EducationSettings = () => {
  const {
    actions: { setProp },
    gap,
  } = useNode<EducationProps>((node) => ({
    gap: node.data.props.gap,
  }));

  return (
    <div className="flex p-2 w-[200px] text-sm">
      <Slider
        min={0}
        max={100}
        label="Gap(px)"
        value={Number(gap?.replace('px', ''))}
        onChange={(v) => {
          setProp((props: EducationProps) => {
            props.gap = v + 'px';
          });
        }}
      />
    </div>
  );
};

const EducationDisplay = () => {
  return (
    <div className="flex flex-col justify-start preview-renderer">
      <div className="pt-1.5 mx-3 mb-1 border-b-[1.5px] border-solid border-[#030303]">
        <p className="w-full text-lg font-medium text-center text-black whitespace-pre-wrap">
          Education
        </p>
      </div>
      <div className="w-full">
        <div className="flex items-center justify-between">
          <p className="w-full text-lg font-normal text-black break-all whitespace-pre-wrap text-start">
            School or University
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="w-full text-sm font-normal text-black break-all whitespace-pre-wrap text-start">
            Degree and Field of Study
          </p>
          <div className="text-sm font-normal text-black whitespace-nowrap w-min text-end">
            period
          </div>
        </div>
        <p className="w-full text-sm font-normal text-black break-all whitespace-pre-wrap text-start">
          What knowledge or experience did you acquire during your studies
          there?(e.g. Delivered a comprehensive marketing strategy)
        </p>
      </div>
    </div>
  );
};

Education.craft = {
  displayName: 'Education',
  defaultProps: {
    padding: [0],
    margin: [0, 0, 6, 0],
    gap: '0px',
    deletable: true,
    title: 'Education',
  },
  related: { settings: EducationSettings, display: EducationDisplay },
  custom: { toolbar: ['add', 'delete', 'setting'] },
  rules: {
    canMoveIn: (nodes) =>
      nodes.every((node) => node.data.type == EducationEntry),
  },
};
