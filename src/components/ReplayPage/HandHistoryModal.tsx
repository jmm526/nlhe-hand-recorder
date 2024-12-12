import { Modal } from "antd";
import CopyToClipboardButton from "../general/CopyToClipboardButton";

interface Props {
  isOpen: boolean;
  handHistoryText: string;
  onClose: () => void;
}

const HandHistoryModal = ({ isOpen, handHistoryText, onClose }: Props) => {
  return (
    <>
      <Modal
        open={isOpen}
        title="Hand History"
        footer={<CopyToClipboardButton text={handHistoryText} />}
        onCancel={onClose}
      >
        <pre>{handHistoryText}</pre>
      </Modal>
    </>
  );
};

export default HandHistoryModal;
