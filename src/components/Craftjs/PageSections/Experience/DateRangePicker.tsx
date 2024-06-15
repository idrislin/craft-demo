import {
  ChevronLeftOutlined,
  ChevronRightOutlined,
  ClearOutlined,
  EditOutlined,
} from "@mui/icons-material";
import clsx from "clsx";
import { motion } from "framer-motion";
import { reverse, range } from "lodash";
import React, { useEffect, useRef, useState } from "react";

import { Toggles } from "~/components/Forms";
import Tabs from "~/components/Tabs";

interface DateRangePickerProps {
  selected: { year?: number; month?: string };
  onChange: (value: { year?: number; month?: string }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  selected,
  onChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [yCurrent, setYCurrent] = useState(0);
  const [custom, setCustom] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const getYear = (limit: number) => {
    const y = new Date().getFullYear() - yCurrent * limit;
    return reverse(range(y, y - limit, -1));
  };

  useEffect(() => {
    if (!inputRef.current) return;
    if (custom) inputRef.current.focus();
  }, [custom]);

  const monthList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const fromPannel = () => {
    if (currentIndex !== 0) return null;
    return (
      <>
        <div className="relative z-10 grid grid-cols-4 px-5 py-4">
          <div className="flex items-center justify-center gap-2">
            <button
              className="hover:text-primary"
              onClick={() => setYCurrent((p) => p + 1)}
            >
              <ChevronLeftOutlined />
            </button>
            <button
              disabled={yCurrent === 0}
              className="hover:text-primary disabled:cursor-not-allowed disabled:text-gray-300"
              onClick={() => setYCurrent((p) => p - 1)}
            >
              <ChevronRightOutlined />
            </button>
          </div>
          {getYear(11).map((v) => (
            <Item
              key={v}
              value={v.toString()}
              selected={selected.year === v}
              onClick={() => {
                if (selected.year === v) {
                  onChange({ month: selected.month, year: undefined });
                } else {
                  onChange({ month: selected.month, year: v });
                }
              }}
            />
          ))}
        </div>
        <div className="w-full h-px bg-gray-300" />
        <div className="relative z-10 grid grid-cols-4 px-5 py-4">
          {monthList.map((v) => (
            <Item
              key={v}
              value={v}
              selected={selected.month === v}
              onClick={() => {
                if (selected.month === v) {
                  onChange({ year: selected.year, month: undefined });
                } else {
                  onChange({ year: selected.year, month: v });
                }
              }}
            />
          ))}
        </div>
      </>
    );
  };

  const toPannel = () => {
    if (currentIndex !== 1) return null;
    return (
      <div className="relative">
        <div className="relative z-10 grid grid-cols-4 px-5 py-4">
          <div className="col-span-4 rounded bg-gray-200 p-2.5 flex items-center justify-between">
            <EditOutlined className="!w-4 !h-4" />
            <input
              className="text-sm bg-transparent ring-0 !outline-none !border-none !shadow-none"
              disabled={!custom}
              value={inputValue}
              ref={inputRef}
              onChange={(event) => {
                setInputValue(event?.target.value);
              }}
              placeholder="Present"
            />
            <Toggles enabled={custom} onChange={() => setCustom((p) => !p)} />
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              className="hover:text-primary"
              onClick={() => setYCurrent((p) => p + 1)}
            >
              <ChevronLeftOutlined />
            </button>
            <button
              disabled={yCurrent === 0}
              className="hover:text-primary disabled:cursor-not-allowed disabled:text-gray-300"
              onClick={() => setYCurrent((p) => p - 1)}
            >
              <ChevronRightOutlined />
            </button>
          </div>
          {getYear(7).map((v) => (
            <Item
              key={v}
              value={v.toString()}
              selected={selected.year === v}
              onClick={() => {
                if (selected.year === v) {
                  onChange({ month: selected.month, year: undefined });
                } else {
                  onChange({ month: selected.month, year: v });
                }
              }}
            />
          ))}
        </div>
        <div className="w-full h-px bg-gray-300" />
        <div className="relative z-10 grid grid-cols-4 px-5 py-4">
          {monthList.map((v) => (
            <Item
              key={v}
              value={v}
              selected={selected.month === v}
              onClick={() => {
                if (selected.month === v) {
                  onChange({ year: selected.year, month: undefined });
                } else {
                  onChange({ year: selected.year, month: v });
                }
              }}
            />
          ))}
        </div>
        {custom && (
          <div className="absolute top-[60px] z-50 inset-x-0 bottom-0 cursor-not-allowed" />
        )}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-xl w-[300px] rounded">
      <Tabs
        tabs={[
          { name: "From", value: "from" },
          { name: "To", value: "to" },
        ]}
        currentIndex={currentIndex}
        onTabChange={(i) => setCurrentIndex(i)}
      />
      {fromPannel()}
      {toPannel()}
    </div>
  );
};

export default DateRangePicker;

const Item: React.FC<{
  value: string;
  selected: boolean;
  onClick: () => void;
}> = ({ value, selected, onClick }) => {
  return (
    <div
      key={value}
      onClick={onClick}
      className={clsx(
        "w-full py-2 text-xs relative text-center border border-solid rounded-full cursor-pointer group/item hover:border-primary hover:text-primary my-1",
        selected
          ? "border-primary text-primary"
          : "text-[#384347] border-transparent"
      )}
    >
      {value}
      {selected ? (
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center w-full h-full text-white rounded-full bg-primary"
        >
          <ClearOutlined />
        </motion.div>
      ) : null}
    </div>
  );
};
