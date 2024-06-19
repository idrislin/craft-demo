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

Experience.craft = {
  displayName: 'Experience',
  defaultProps: {
    padding: [0],
    margin: [0, 0, 6, 0],
    gap: '0px',
  },
  related: { settings: ExperienceSettings },
  custom: { toolbar: ['add', 'delete', 'setting'] },
  rules: {
    canMoveIn: (nodes) =>
      nodes.every((node) => node.data.type == ExperienceEntry),
  },
};
