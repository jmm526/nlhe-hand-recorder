import { CopyOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";

const CopyToClipboardButton = ({ text }: Props) => {
  return (
    <CopyToClipboard text={text}>
      <Button icon={<CopyOutlined />} />
    </CopyToClipboard>
  );
};

export default CopyToClipboardButton;
