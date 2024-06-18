import { UserComponent as CUserComponent, useNode } from "@craftjs/core";
import { useEffect, useState } from "react";

import { Toggles, Text, DateRangePicker } from "~/components/Forms";
import { BaseElementsProps } from "~/components/LayoutSettingsPanel";

export interface EducationEntryParams {
  id: string;
  datePeriod: string;
  schoolTitle: string;
  location: string;
  gpa: string;
  bullets: string;
  value: string;
  hiddenField: string[];
}

export const EmptyEducationEntry = {
  id: "Entry 1",
  value: "",
  location: "",
  schoolTitle: "",
  datePeriod: "",
  bullets: "",
  gpa: "--",
  hiddenField: ["gpa", "location", "bullets"],
};

const GPAComponent: React.FC<{
  value: string[];
  onChange: (v: string[]) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-black whitespace-nowrap w-min">
      <Text
        value={value[0]}
        placeholder="GPA"
        className="text-base font-normal text-black whitespace-nowrap w-min text-end"
        onChange={(v) => {
          const res = [...value];
          res[0] = v;
          onChange(res);
        }}
      />
      <Text
        value={value[1]}
        placeholder="4.0"
        className="text-base font-normal text-black whitespace-nowrap w-min text-end"
        onChange={(v) => {
          const res = [...value];
          res[1] = v;
          onChange(res);
        }}
      />
      <p> / </p>
      <Text
        value={value[2]}
        placeholder="4.0"
        className="text-base font-normal text-black whitespace-nowrap w-min text-end"
        onChange={(v) => {
          const res = [...value];
          res[2] = v;
          onChange(res);
        }}
      />
    </div>
  );
};

interface EducationEntryProps extends BaseElementsProps {
  entry: EducationEntryParams;
  deletable?: boolean;
}

const EducationEntry: CUserComponent<EducationEntryProps> = (props) => {
  const { entry, padding = [0, 0] } = props;
  const [calendar, setCalendar] = useState({ from: "", to: "" });
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    actions: { setProp },
    connectors: { connect, drag },
  } = useNode((node) => ({ name: node.data.name }));

  useEffect(() => {
    const res = { ...entry };
    if (!calendar.from && !calendar.to) res.datePeriod = "";
    else res.datePeriod = `${calendar.from} - ${calendar.to}`;
    setProp((props: EducationEntryProps) => {
      props.entry = res;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendar]);

  return (
    <div
      key={entry.id}
      style={{ padding: padding.join("px ") + "px" }}
      className="w-full"
      ref={(ref: HTMLDivElement) => ref && connect(drag(ref))}
    >
      <div className="flex items-center justify-between">
        <Text
          value={entry.schoolTitle}
          placeholder="School or University"
          className="w-full text-lg font-normal text-black break-all whitespace-pre-wrap text-start"
          onChange={(v) => {
            setProp((props: EducationEntryProps) => {
              props.entry = { ...entry, schoolTitle: v };
            });
          }}
        />
        {entry.hiddenField.includes("location") ? (
          <div />
        ) : (
          <Text
            value={entry.location}
            placeholder="Location"
            className="text-base font-normal text-black whitespace-nowrap w-min text-end"
            onChange={(v) => {
              setProp((props: EducationEntryProps) => {
                props.entry = { ...entry, location: v };
              });
            }}
          />
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Text
            value={entry.value}
            placeholder="Degree and Field of Study"
            className="w-full text-sm font-normal text-black break-all whitespace-pre-wrap text-start"
            onChange={(v) => {
              setProp((props: EducationEntryProps) => {
                props.entry = { ...entry, value: v };
              });
            }}
          />
          {entry.hiddenField.includes("gpa") ? null : (
            <div className="h-6 min-w-[2px] mx-2 bg-gray-500" />
          )}
          {entry.hiddenField.includes("gpa") ? (
            <div />
          ) : (
            <GPAComponent
              value={entry.gpa.split("-")}
              onChange={(v) => {
                setProp((props: EducationEntryProps) => {
                  props.entry = { ...entry, gpa: v.join("-") };
                });
              }}
            />
          )}
        </div>
        {entry.hiddenField.includes("datePeriod") ? (
          <div />
        ) : (
          <>
            <div
              onClick={(event) => {
                event.stopPropagation();
                setCalendarOpen(true);
              }}
              className="text-sm font-normal text-black whitespace-nowrap w-min text-end"
            >
              <p>{entry.datePeriod}</p>
              {entry.datePeriod && entry.datePeriod !== "" ? null : (
                <p className="opacity-40">Date period</p>
              )}
            </div>
            {calendarOpen ? (
              <div className="absolute inset-x-0 top-0 z-50 flex justify-center mx-auto rounded">
                <DateRangePicker
                  open={calendarOpen}
                  selected={calendar}
                  onClose={() => setCalendarOpen(false)}
                  onChange={(value) => setCalendar(value)}
                />
              </div>
            ) : null}
          </>
        )}
      </div>
      {entry.hiddenField.includes("bullets") ? null : (
        <Text
          value={entry.bullets}
          placeholder="What knowledge or experience did you acquire during your studies there?(e.g. Delivered a comprehensive marketing strategy)"
          className="w-full text-sm font-normal text-black break-all whitespace-pre-wrap text-start"
          onChange={(v) => {
            setProp((props: EducationEntryProps) => {
              props.entry = { ...entry, bullets: v };
            });
          }}
        />
      )}
    </div>
  );
};

export default EducationEntry;

const EducationEntrySettings = () => {
  const {
    actions: { setProp },
    entry,
  } = useNode<EducationEntryProps>((node) => ({
    entry: node.data.props.entry,
  }));

  const fieldKeys = [
    { label: "GPA", value: "gpa" },
    { label: "Location", value: "location" },
    { label: "Period", value: "datePeriod" },
    { label: "Bullets", value: "bullets" },
  ];

  return (
    <div className="flex flex-col gap-2 p-2 text-sm">
      {fieldKeys.map((field) => (
        <div
          className="flex items-center min-w-[200px] justify-between"
          key={field.value}
        >
          <p>{`Show ${field.label}`}</p>
          <Toggles
            enabled={!entry.hiddenField.includes(field.value)}
            onChange={() => {
              let res = [...entry.hiddenField];
              if (res.includes(field.value)) {
                res = entry.hiddenField.filter((k) => k !== field.value);
              } else {
                res.push(field.value);
              }
              setProp((props: EducationEntryProps) => {
                props.entry = {
                  ...entry,
                  hiddenField: res,
                };
              }, 500);
            }}
          />
        </div>
      ))}
    </div>
  );
};

EducationEntry.craft = {
  displayName: "Education Entry",
  defaultProps: { entry: EmptyEducationEntry },
  related: { settings: EducationEntrySettings },
  custom: { toolbar: ["move", "delete", "setting"] },
};
