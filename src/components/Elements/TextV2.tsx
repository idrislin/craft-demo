import clsx from "clsx";
import ContentEditable from "react-contenteditable";

interface TextProps {
  value: string;
  className?: string;
  onChange?: (value: string) => void;
}

const Text: React.FC<TextProps> = ({ value, onChange, className }) => {
  return (
    <ContentEditable
      html={value}
      tagName="p"
      className={clsx("outline-none", className)}
      onChange={(e) => {
        if (!onChange) return;
        onChange(e.target.value.replace(/<\/?[^>]+(>|$)/g, ""));
      }}
    />
  );
};

export default Text;
