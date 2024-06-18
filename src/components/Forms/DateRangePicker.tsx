import {
  ChevronLeftOutlined,
  ChevronRightOutlined,
  ClearOutlined,
  EditOutlined,
} from "@mui/icons-material";
import { useDebounceEffect, useEventListener } from "ahooks";
import clsx from "clsx";
import { motion } from "framer-motion";
import { reverse, range } from "lodash";
import React, { useEffect, useRef, useState } from "react";

import { Toggles } from "~/components/Forms";
import Tabs from "~/components/Tabs";

interface DateRangePickerProps {
  open: boolean;
  onClose: () => void;
  selected: { from: string; to: string };
  onChange: (value: { from: string; to: string }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = (props) => {
  const { open, onClose, selected, onChange } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [yCurrent1, setYCurrent1] = useState(0);
  const [yCurrent2, setYCurrent2] = useState(0);
  const [custom, setCustom] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const getYear = (limit: number) => {
    const current = currentIndex == 0 ? yCurrent1 : yCurrent2;
    const y = new Date().getFullYear() - current * limit;
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

  useDebounceEffect(() => {
    onChange({ from: selected.from, to: inputValue });
  }, [inputValue]);

  const handleClickOutside = (event: MouseEvent) => {
    if (!open) return;
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  useEventListener("click", handleClickOutside);

  const fromPannel = () => {
    if (currentIndex !== 0) return null;
    const [month = "--", year = "----"] = selected.from.split("/");
    return (
      <>
        <div className="relative z-10 grid grid-cols-4 px-5 py-4">
          <div className="flex items-center justify-center gap-2">
            <button
              className="hover:text-primary"
              onClick={() => setYCurrent1((p) => p + 1)}
            >
              <ChevronLeftOutlined />
            </button>
            <button
              disabled={yCurrent1 === 0}
              className="hover:text-primary disabled:cursor-not-allowed disabled:text-gray-300"
              onClick={() => setYCurrent1((p) => p - 1)}
            >
              <ChevronRightOutlined />
            </button>
          </div>
          {getYear(11).map((v) => (
            <Item
              key={v}
              value={v.toString()}
              selected={year === v.toString()}
              onClick={() => {
                if (year === v.toString()) {
                  onChange({ from: `${month}/----`, to: selected.to });
                } else {
                  onChange({ from: `${month}/${v}`, to: selected.to });
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
              selected={month === v}
              onClick={() => {
                if (month === v) {
                  onChange({ from: `--/${year}`, to: selected.to });
                } else {
                  onChange({ from: `${v}/${year}`, to: selected.to });
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
    const [month = "--", year = "----"] = selected.to.split("/");
    return (
      <div className="relative">
        <div className="relative z-10 grid grid-cols-4 px-5 py-4">
          <div className="col-span-4 rounded bg-gray-200 p-2.5 flex items-center justify-between">
            <EditOutlined className="!w-4 !h-4" />
            <input
              ref={inputRef}
              value={inputValue}
              disabled={!custom}
              className="text-sm bg-transparent ring-0 !outline-none !border-none !shadow-none"
              onChange={(event) => {
                setInputValue(event?.target.value);
              }}
              placeholder="Present"
            />
            <Toggles
              enabled={custom}
              onChange={() => {
                if (!custom) {
                  onChange({
                    from: selected.from,
                    to: inputValue || "Present",
                  });
                } else {
                  onChange({ from: selected.from, to: "--/----" });
                  setInputValue("");
                }
                setCustom((prev) => !prev);
              }}
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              className="hover:text-primary"
              onClick={() => setYCurrent2((p) => p + 1)}
            >
              <ChevronLeftOutlined />
            </button>
            <button
              disabled={yCurrent2 === 0}
              className="hover:text-primary disabled:cursor-not-allowed disabled:text-gray-300"
              onClick={() => setYCurrent2((p) => p - 1)}
            >
              <ChevronRightOutlined />
            </button>
          </div>
          {getYear(7).map((v) => (
            <Item
              key={v}
              value={v.toString()}
              selected={year === v.toString()}
              onClick={() => {
                if (year === v.toString()) {
                  onChange({ to: `${month}/----`, from: selected.from });
                } else {
                  onChange({ to: `${month}/${v}`, from: selected.from });
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
              selected={month === v}
              onClick={() => {
                if (month === v) {
                  onChange({ to: `--/${year}`, from: selected.from });
                } else {
                  onChange({ to: `${v}/${year}`, from: selected.from });
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

  if (!open) return null;

  return (
    <div ref={wrapperRef} className="bg-white shadow-xl w-[300px] rounded">
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
