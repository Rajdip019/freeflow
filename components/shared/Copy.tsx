import { LinkOutlined } from "@ant-design/icons";
import copy from "copy-to-clipboard";
import { message, Tooltip } from "antd";

interface Props {
  align?: "right" | "left";
  value: string;
}

const Copy : React.FC<Props>= ({align, value}) => {
  return (
    <Tooltip title={"Copy to clipboard"}>
        <LinkOutlined onClick={() => {
          copy(value);
          message.info('Copied to clipboard');
        }} />
    </Tooltip>
  );
};

export default Copy;
