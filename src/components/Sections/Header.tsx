import React, { ChangeEvent, useRef, useState } from "react";
import { UserComponent as CUserComponent, useNode } from "@craftjs/core";
import { motion } from "framer-motion";
import {
  CloudUploadOutlined,
  HideImageOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";
import clsx from "clsx";
import { first } from "lodash";

import { Resizer } from "../Resizer";
import { BaseElementsProps } from "../LayoutSettingsPanel";
import Toggles from "../Form/Toggles";
import Text from "../Elements/TextV2";

interface Field {
  value: string;
  label: string;
  show: boolean;
}

interface HeaderProps extends BaseElementsProps {
  children?: React.ReactNode;
  alignItems?: string;
  justifyContent?: string;
  image?: Field;
  title?: Field;
  subtitle?: Field;
  fields?: Field[];
  imageType?: "square" | "round";
}

const Header: CUserComponent<HeaderProps> = (props) => {
  const {
    margin = [0, 0, 0, 0],
    padding = [0, 0, 0, 0],
    alignItems,
    justifyContent = "center",
    title,
    image,
    fields,
    imageType,
  } = props;

  const {
    actions: { setProp },
  } = useNode<HeaderProps>();

  const uploaderRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [bg, setBG] = useState("none");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = first(event.target?.files);
    if (!file) {
      event.target.value = "";
      return;
    }
    if (file?.type.startsWith("image") && file?.size > 1024 * 1024 * 20) {
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setBG(`url(${e.target?.result})`);
    };
    reader.readAsDataURL(file);
    setFile(file as File);
  };

  const splitComponent = () => {
    return <div className="w-1 h-1 rounded-[50%] bg-dark align-middle" />;
  };

  return (
    <Resizer
      style={{
        alignItems,
        justifyContent,
        margin: margin.join("px ") + "px",
        padding: padding.join("px ") + "px",
      }}
      className="!w-full flex flex-col justify-center items-center"
      enable={{
        top: false,
        right: false,
        bottom: true,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
    >
      {image && image.show && (
        <motion.div
          style={{
            backgroundImage: bg,
          }}
          animate={{ borderRadius: imageType === "square" ? "4px" : "100%" }}
          className={clsx(
            "w-[100px] box-content mb-3 h-[100px] relative bg-cover transition-radius bg-[50%] bg-no-repeat",
            !file && "border border-dashed border-gray-300"
          )}
        >
          {(bg == "none" || !file) && (
            <PersonOutlineOutlined className="absolute inset-x-0 !w-20 !h-20 mx-auto bottom-0 text-gray-400" />
          )}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 z-10 flex w-full h-full bg-black rounded cursor-pointer bg-opacity-60"
          >
            <div className="flex items-center justify-center w-full gap-2 p-2 text-white">
              <button
                onClick={() => uploaderRef.current?.click()}
                className="flex-1 rounded bg-primary hover:bg-green-hover aspect-square"
              >
                <CloudUploadOutlined />
              </button>
              <button
                onClick={() => {
                  setProp((props: HeaderProps) => {
                    if (!image) return;
                    props.image = { ...image, show: !image.show };
                  });
                }}
                className="flex-1 rounded hover:bg-red-hover bg-red aspect-square"
              >
                <HideImageOutlined />
              </button>
            </div>
          </motion.div>
          <input
            accept="image/*"
            className="hidden"
            id="image-file"
            type="file"
            ref={uploaderRef}
            onChange={(event) => handleFileChange(event)}
          />
        </motion.div>
      )}
      {title && title.show && (
        <Text
          value={title.value}
          className="text-xl font-bold whitespace-pre-wrap text-secondary"
        />
      )}
      <Text
        value="The role you are applying for?"
        className="text-base font-medium whitespace-pre-wrap text-sub"
      />
      <div className="flex items-center justify-center gap-2 text-sm text-dark">
        {fields
          ?.filter((field) => field.show)
          .map((field, index) => (
            <React.Fragment key={field.label}>
              {index > 0 && splitComponent()}
              <Text value={field.value} />
            </React.Fragment>
          ))}
      </div>
    </Resizer>
  );
};

export default Header;

const HeaderSettings = () => {
  const {
    actions: { setProp },
    title,
    imageType,
    image,
    fields = [],
  } = useNode<HeaderProps>((node) => ({ ...node.data.props }));

  const empty: Field = { label: "", show: false, value: "" };

  return (
    <div className="flex flex-col gap-2 p-5 text-sm">
      <div className="flex items-center justify-between">
        <p>Show Title</p>
        <Toggles
          enabled={title?.show ?? true}
          onChange={() =>
            setProp((props: HeaderProps) => {
              props.title = {
                ...(title ?? empty),
                show: !(title?.show ?? true),
              };
            }, 500)
          }
        />
      </div>
      {fields.map((field, index) => (
        <div key={field.label} className="flex items-center justify-between">
          <p>{`Show ${field.label}`}</p>
          <Toggles
            enabled={field.show}
            onChange={() =>
              setProp((props: HeaderProps) => {
                const res = [...fields];
                res.splice(index, 1, { ...field, show: !field.show });
                props.fields = res;
              }, 500)
            }
          />
        </div>
      ))}
      <div className="flex items-center justify-between">
        <p>Show Photo</p>
        <Toggles
          enabled={image?.show ?? false}
          onChange={() =>
            setProp((props: HeaderProps) => {
              props.image = {
                ...(image ?? empty),
                show: !(image?.show ?? false),
              };
            }, 500)
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <p>Photo Style</p>
        <div className="flex gap-1">
          <button
            onClick={() => {
              setProp((props: HeaderProps) => {
                props.imageType = "round";
              });
            }}
            className={clsx(
              "w-4 h-4 rounded-full",
              imageType === "round"
                ? "bg-primary"
                : "bg-gray hover:bg-gray-hover"
            )}
          />
          <button
            onClick={() => {
              setProp((props: HeaderProps) => {
                props.imageType = "square";
              });
            }}
            className={clsx(
              "w-4 h-4 rounded-full",
              imageType === "square"
                ? "bg-primary"
                : "bg-gray hover:bg-gray-hover"
            )}
          />
        </div>
        <motion.div
          className="flex items-end justify-center w-8 h-8 bg-gray-200"
          animate={{ borderRadius: imageType === "square" ? "4px" : "100%" }}
        >
          <PersonOutlineOutlined className="!w-7 !h-7 text-gray-400" />
        </motion.div>
      </div>
    </div>
  );
};

Header.craft = {
  displayName: "Header",
  defaultProps: {
    padding: [6, 12, 6, 12],
    margin: [0, 0, 6, 0],
    alignItems: "center",
    justifyContent: "center",
    title: { value: "Title", label: "Title", show: true },
    subtitle: { value: "subtitle", label: "SubTitle", show: true },
    fields: [{ value: "field", label: "field", show: true }],
  },
  related: { settings: HeaderSettings },
};
