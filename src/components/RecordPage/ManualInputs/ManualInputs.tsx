import { Col, InputNumber, Row, Select, Typography } from "antd";
import { useState } from "react";
import StackSizesContainer from "./StackSizesContainer";

const ManualInputs = () => {
  const [sb, setSb] = useState(0);
  const [bb, setBb] = useState(0);
  const [tableSize, setTableSize] = useState("9-Max");

  return (
    <>
      <Row justify="start" style={{ width: "100%", marginBottom: "3vh" }}>
        <Col span={8}>
          <Row>
            <Typography.Text
              style={{
                color: "var(--foreground)",
                fontWeight: "bold",
                fontSize: "0.8rem",
              }}
            >
              SB
            </Typography.Text>
          </Row>
          <Row>
            <InputNumber value={sb} onChange={(value) => setSb(value ?? 0)} />
          </Row>
        </Col>
        <Col span={8}>
          <Row>
            <Typography.Text
              style={{
                color: "var(--foreground)",
                fontWeight: "bold",
                fontSize: "0.8rem",
              }}
            >
              BB
            </Typography.Text>
          </Row>
          <Row>
            <InputNumber value={bb} onChange={(value) => setBb(value ?? 0)} />
          </Row>
        </Col>
        <Col span={8}>
          <Row>
            <Typography.Text
              style={{
                color: "var(--foreground)",
                fontWeight: "bold",
                fontSize: "0.8rem",
              }}
            >
              Table Size
            </Typography.Text>
          </Row>
          <Row>
            <Select
              style={{ minWidth: "25vw" }}
              value={tableSize}
              onChange={(value) => setTableSize(value ?? "9-Max")}
              options={[
                {
                  label: "9-Max",
                  value: "9-Max",
                },
                {
                  label: "6-Max",
                  value: "6-Max",
                },
              ]}
            />
          </Row>
        </Col>
      </Row>
      <StackSizesContainer playerCount={tableSize === "9-Max" ? 9 : 6} />
    </>
  );
};

export default ManualInputs;
