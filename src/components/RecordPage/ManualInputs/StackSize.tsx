import { positionOrder6max } from "@/server/helpers";
import { positionOrder9max } from "@/server/helpers";
import { Button, Col, InputNumber, Row, Select, Typography } from "antd";
import { IStackSizeState } from "./StackSizesContainer";
import { EPosition } from "@/server/models";
import { DeleteOutlined } from "@ant-design/icons";

interface Props {
  index: number;
  playerCount: number;
  stackSize: IStackSizeState;
  handleStackSizeChange: (index: number, newStackSize: IStackSizeState) => void;
  handleRemoveStackSize: (index: number) => void;
}

const StackSize = ({
  index,
  playerCount,
  stackSize,
  handleStackSizeChange,
  handleRemoveStackSize,
}: Props) => {
  const positionChoices =
    playerCount === 9 ? positionOrder9max : positionOrder6max;
  const isHero = stackSize.name === "Hero";

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
        <Col span={6}>
          <Select
            value={stackSize.position}
            onChange={(value) =>
              handleChange("position", value ?? EPosition.UTG)
            }
            style={{ minWidth: "20vw" }}
            options={positionChoices.map((position) => ({
              label: position,
              value: position,
            }))}
          />
        </Col>
          <Col span={2}>
            <Button
            onClick={() => handleRemoveStackSize(index)}
            disabled={isHero}
            style={{
              backgroundColor: isHero ? "#D3D3D3" : "#e74d4d",
                color: "var(--button-primary-foreground)",
                border: "none",
                fontWeight: "bold",
                padding: "10px",
              }}
            >
              <DeleteOutlined />
            </Button>
          </Col>
      </Row>
    </>
  );
};

export default StackSize;
