import { positionOrder6max } from "@/server/helpers";
import { positionOrder9max } from "@/server/helpers";
import { Col, InputNumber, Row, Select, Typography } from "antd";
import { IStackSizeState } from "./StackSizesContainer";
import { EPosition } from "@/server/models";

interface Props {
  index: number;
  playerCount: number;
  stackSize: IStackSizeState;
  handleStackSizeChange: (index: number, newStackSize: IStackSizeState) => void;
}

const StackSize = ({
  index,
  playerCount,
  stackSize,
  handleStackSizeChange,
}: Props) => {
  const positionChoices =
    playerCount === 9 ? positionOrder9max : positionOrder6max;

  const handleChange = (
    key: "name" | "position" | "stackSize",
    value: EPosition | number
  ) => {
    handleStackSizeChange(index, { ...stackSize, [key]: value });
  };

  return (
    <>
      <Row justify="start" style={{ width: "100%" }}>
        <Col span={8}>
          <Typography.Text
            style={{
              color: "var(--foreground)",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            {stackSize.name}
          </Typography.Text>
        </Col>
        <Col span={8}>
          <Row>
            <InputNumber
              value={stackSize.stackSize}
              onChange={(value) => handleChange("stackSize", value ?? 0)}
            />
          </Row>
        </Col>
        <Col span={8}>
          <Select
            value={stackSize.position}
            onChange={(value) => handleChange("position", value ?? EPosition.UTG)}
            style={{ minWidth: "25vw" }}
            options={positionChoices.map((position) => ({
              label: position,
              value: position,
            }))}
          />
        </Col>
      </Row>
    </>
  );
};

export default StackSize;
