import { PlusOutlined } from "@ant-design/icons";

import { Col, Row } from "antd";

interface Props {
  onActionCreate: () => void;
}

const NewActionButton = ({ onActionCreate }: Props) => {
  return (
    <Row className="action-card-new">
      <Col
        span={24}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "var(--background)",
          height: "100%",
          cursor: "pointer",
        }}
        onClick={onActionCreate}
      >
        <PlusOutlined />
      </Col>
    </Row>
  );
};

export default NewActionButton;
