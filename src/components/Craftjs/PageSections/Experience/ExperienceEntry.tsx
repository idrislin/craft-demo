import { UserComponent as CUserComponent, useNode } from "@craftjs/core";
import { useEffect, useState } from "react";

import DateRangePicker from "./DateRangePicker";

import { Toggles, Text } from "~/components/Forms";

export interface ExperienceEntryParams {
  id: string;
  datePeriod: string;
  companyName: string;
  location: string;
  title: string;
  companyDesc: string;
  value: string;
  hiddenField: string[];
}

export const EmptyExperienceEntry = {
  id: "Entry 1",
  value: "",
  companyDesc: "",
  companyName: "",
  datePeriod: "",
  location: "",
  title: "",
  hiddenField: [],
};

interface ExperienceEntryProps {
  entry: ExperienceEntryParams;
}

const ExperienceEntry: CUserComponent<ExperienceEntryProps> = (props) => {
  const { entry } = props;
  const [calendar, setCalendar] = useState({ from: "", to: "" });
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    actions: { setProp },
    connectors: { connect, drag },
  } = useNode((node) => ({ name: node.data.name }));

  useEffect(() => {
    console.log(calendar);
  }, [calendar]);

  return (
    <div
      key={entry.id}
      className="w-full"
      ref={(ref: HTMLDivElement) => ref && connect(drag(ref))}
    >
      <div className="flex items-center justify-between">
        {entry.hiddenField.includes("companyName") ? (
          <div />
        ) : (
          <Text
            value={entry.companyName}
            placeholder="Company Name"
            className="w-full text-lg font-normal text-black break-all whitespace-pre-wrap text-start"
            onChange={(v) => {
              setProp((props: ExperienceEntryProps) => {
                props.entry = { ...entry, companyName: v };
              });
            }}
          />
        )}
        {entry.hiddenField.includes("location") ? (
          <div />
        ) : (
          <Text
            value={entry.location}
            placeholder="Location"
            className="text-base font-normal text-black whitespace-nowrap w-min text-end"
            onChange={(v) => {
              setProp((props: ExperienceEntryProps) => {
                props.entry = { ...entry, location: v };
              });
            }}
          />
        )}
      </div>
      <div className="flex items-center justify-between">
        {entry.hiddenField.includes("title") ? (
          <div />
        ) : (
          <Text
            value={entry.title}
            placeholder="Title"
            className="w-full text-base font-normal text-black break-all whitespace-pre-wrap text-start"
            onChange={(v) => {
              setProp((props: ExperienceEntryProps) => {
                props.entry = { ...entry, title: v };
              });
            }}
          />
        )}
        {entry.hiddenField.includes("datePeriod") ? (
          <div />
        ) : (
          <>
            <Text
              value={entry.datePeriod}
              placeholder="Date period"
              onFocus={() => {
                console.log("12");
                setCalendarOpen(true);
              }}
              className="text-base font-normal text-black whitespace-nowrap w-min text-end"
              onChange={(v) => {
                setProp((props: ExperienceEntryProps) => {
                  props.entry = { ...entry, datePeriod: v };
                });
              }}
            />
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
      {entry.hiddenField.includes("companyDesc") ? null : (
        <Text
          value={entry.companyDesc}
          placeholder="Company Description"
          className="w-full text-sm font-normal text-black break-all whitespace-pre-wrap text-start"
          onChange={(v) => {
            setProp((props: ExperienceEntryProps) => {
              props.entry = { ...entry, companyDesc: v };
            });
          }}
        />
      )}
      {entry.hiddenField.includes("value") ? null : (
        <Text
          value={entry.value}
          placeholder="Which of your achievements match the job your're applying to?"
          className="w-full text-sm font-normal text-black break-all whitespace-pre-wrap text-start"
          onChange={(v) => {
            setProp((props: ExperienceEntryProps) => {
              props.entry = { ...entry, value: v };
            });
          }}
        />
      )}
    </div>
  );
};

export default ExperienceEntry;

const ExperienceEntrySettings = () => {
  const {
    actions: { setProp },
    entry,
  } = useNode<ExperienceEntryProps>((node) => ({
    entry: node.data.props.entry,
  }));

  const fieldKeys = [
    { label: "Compony Name", value: "companyName" },
    { label: "Location", value: "location" },
    { label: "Title", value: "title" },
    { label: "Date Period", value: "datePeriod" },
    { label: "Company Description", value: "companyDesc" },
    { label: "Content", value: "value" },
  ];

  return (
    <div className="flex flex-col gap-2 p-5 text-sm">
      {fieldKeys.map((field) => (
        <div className="flex items-center justify-between" key={field.value}>
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
              setProp((props: ExperienceEntryProps) => {
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

ExperienceEntry.craft = {
  displayName: "Experience Entry",
  defaultProps: { entry: EmptyExperienceEntry },
  related: { settings: ExperienceEntrySettings },
};
