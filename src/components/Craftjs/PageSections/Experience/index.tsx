import { UserComponent as CUserComponent, useNode } from '@craftjs/core';

import ExperienceEntry from './ExperienceEntry';

import { BaseElementsProps } from '~/components/LayoutSettingsPanel';
import { Resizer } from '~/components/Craftjs/Resizer';
import { Slider, Text } from '~/components/Forms';

interface ExperienceProps extends BaseElementsProps {
  title?: string;
  dividerColor?: string;
  gap?: string;
  children?: React.ReactNode;
}

const Experience: CUserComponent<ExperienceProps> = (props) => {
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

export default Experience;

const ExperienceSettings = () => {
  const {
    actions: { setProp },
    gap,
  } = useNode<ExperienceProps>((node) => ({
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
          setProp((props: ExperienceProps) => {
            props.gap = v + 'px';
          });
        }}
      />
    </div>
  );
};

const ExperienceDisplay = () => {
  return (
    <div className="flex flex-col justify-start preview-renderer">
      <div className="pt-1.5 mx-3 mb-1 border-b-[1.5px] border-solid border-[#030303]">
        <p className="w-full text-lg font-medium text-center text-black whitespace-pre-wrap">
          Experience
        </p>
      </div>
      <div className="w-full">
        <div className="flex items-center justify-between">
          <p className="w-full text-lg font-normal text-black break-all whitespace-pre-wrap text-start">
            Company Name
          </p>
          <p className="text-base font-normal text-black whitespace-nowrap w-min text-end">
            Location
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="w-full text-base font-normal text-black break-all whitespace-pre-wrap text-start">
            Title
          </p>
          <p className="text-sm font-normal text-black whitespace-nowrap w-min text-end">
            Date period
          </p>
        </div>
        <p className="w-full text-sm font-normal text-black break-all whitespace-pre-wrap text-start">
          Company Description
        </p>
        <p className="w-full text-sm font-normal text-black break-all whitespace-pre-wrap text-start">
          Which of your achievements match the job your're applying to?
        </p>
      </div>
    </div>
  );
};

Experience.craft = {
  displayName: 'Experience',
  defaultProps: {
    padding: [0],
    margin: [0, 0, 6, 0],
    gap: '0px',
    title: 'Experience',
  },
  related: { settings: ExperienceSettings, display: ExperienceDisplay },
  custom: { toolbar: ['add', 'delete', 'setting'] },
  rules: {
    canMoveIn: (nodes) =>
      nodes.every((node) => node.data.type == ExperienceEntry),
  },
};
