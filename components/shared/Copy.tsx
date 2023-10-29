import { LinkOutlined } from "@ant-design/icons";
import copy from "copy-to-clipboard";
import { message, Tooltip } from "antd";

interface Props {
  align?: "right" | "left";
  value: string;
  type?: "text" | "icon" | "both";
}

const Copy: React.FC<Props> = ({ align, value, type = "icon" }) => {
  return (
    <>
      {type === "icon" && (
        <Tooltip title={"Copy to clipboard"}>
          <LinkOutlined
            onClick={() => {
              copy(value);
              message.info("Copied to clipboard");
            }}
          />
        </Tooltip>
      )}
      {type === "text" && (
        <div
          onClick={() => {
            copy(value);
            message.info("Copied to clipboard");
          }}
        >
          Copy Link
        </div>
      )}
      {type === "both" && (
        <div
          onClick={() => {
            copy(value);
            message.info("Copied to clipboard");
          }}
          className="flex gap-2"
        >
          <LinkOutlined />
          Copy Link
        </div>
      )}
    </>
  );
};

export default Copy;
