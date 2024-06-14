import { useEventListener } from "ahooks";
import { first } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Tippy from "@tippyjs/react";

interface SliderProps {
  label: string;
  labelHidden?: boolean;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

const Slider: React.FC<SliderProps> = (props) => {
  const {
    label,
    value = 0,
    labelHidden = false,
    onChange,
    ...leftProps
  } = props;
  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [show, setShow] = useState(false);
  const [left, setLeft] = useState(value);

  const leftValue = useMemo(() => {
    return (
      leftProps.min + Math.floor((leftProps.max - leftProps.min) * (left / 100))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  useEffect(() => {
    onChange(leftValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftValue]);

  useEventListener("mouseup", () => {
    setActive(false);
  });

  return (
    <div className="w-full">
      {!labelHidden && (
        <label className="block text-sm font-medium text-gray-900">
          {label}
        </label>
      )}

      <div className="px-2.5">
        <span
          ref={constraintsRef}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          onMouseDown={() => setActive(true)}
          className="box-content relative inline-block w-full h-2 py-3 rounded-full cursor-pointer text-primary touch-none"
          onMouseMove={(e) => {
            if (!active) return;
            const clientRects = first(constraintsRef.current?.getClientRects());
            if (!clientRects) return;
            const offsetX = e.clientX - clientRects.left;
            const res = Math.floor((offsetX / clientRects.width) * 100);
            setLeft(Math.max(0, Math.min(100, res)));
          }}
        >
          <span className="block absolute rounded-[inherit] bg-current opacity-35 w-full h-[inherit] top-1/2 -translate-y-1/2" />
          <span
            style={{ width: left + "%" }}
            className="block absolute rounded-[inherit] h-[inherit] border border-solid border-current bg-current top-1/2 -translate-y-1/2"
          />
          <Tippy
            arrow
            visible={show}
            theme="material"
            appendTo={document.body}
            content={
              <div className="p-0 min-w-[20px] flex items-center justify-center">
                {leftValue}
              </div>
            }
          >
            <span
              style={{ left: left + "%" }}
              className="box-border absolute flex items-center justify-center w-5 h-5 overflow-hidden -translate-x-1/2 -translate-y-1/2 bg-current rounded-full top-1/2 outline-0"
            >
              <input
                type="range"
                value={value}
                {...leftProps}
                style={{ clip: "rect(0 0 0 0)", direction: "ltr" }}
                className="absolute w-full p-0 -m-px overflow-hidden border-none whitespace-nowrap bg-gray-50"
                onChange={(e) =>
                  onChange(Math.ceil(parseFloat(e.target.value)))
                }
              />
            </span>
          </Tippy>
        </span>
      </div>
    </div>
  );
};

export default Slider;
