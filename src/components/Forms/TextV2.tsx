import clsx from "clsx";
import { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";

interface TextProps {
  value: string;
  className?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const Text: React.FC<TextProps> = ({
  value,
  onChange,
  className,
  placeholder,
}) => {
  const [isPlaceholderVisible, setPlaceholderVisible] = useState(true);

  useEffect(() => {
    setPlaceholderVisible(value.length === 0);
  }, [value]);

  return (
    <ContentEditable
      html={value}
      tagName="p"
      aria-placeholder={placeholder}
      className={clsx(
        `outline-none after:opacity-40`,
        className,
        placeholder &&
          isPlaceholderVisible &&
          `after:content-[attr(aria-placeholder)] focus:after:opacity-20`
      )}
      onChange={(e) => {
        setPlaceholderVisible(e.target.value.length === 0);
        if (!onChange) return;
        onChange(e.target.value.replace(/<\/?[^>]+(>|$)/g, ""));
      }}
    />
  );
};

export default Text;
