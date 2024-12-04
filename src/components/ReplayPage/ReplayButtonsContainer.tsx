import { Button, Col, Row } from "antd";
import CopyToClipboardButton from "../general/CopyToClipboardButton";

interface Props {
  openModal: () => void;
  handHistoryText: string;
}

const ReplayButtonsContainer = ({ openModal, handHistoryText }: Props) => {

  return (
    <Row>
      <Col span={21}>
        <Button
          onClick={openModal}
          style={{
            fontWeight: "bold",
            width: "100%",
          }}
        >
          View HH Text
        </Button>
      </Col>
      <Col span={3} style={{ display: "flex", justifyContent: "end" }}>
        <CopyToClipboardButton text={handHistoryText} />
      </Col>
    </Row>
  );
};

export default ReplayButtonsContainer;
