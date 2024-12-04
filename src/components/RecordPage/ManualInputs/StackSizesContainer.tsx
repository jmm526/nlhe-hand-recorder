import { EPosition } from "@/server/models";
import { Button, Col, Row, Space, Typography } from "antd";
import StackSize from "./StackSize";

interface Props {
  playerCount: number;
  stackSizes: IStackSizeState[];
  handleStackSizesChange: (newStackSizes: IStackSizeState[]) => void;
}

export interface IStackSizeState {
  name?: string;
  position?: EPosition;
  stackSize?: number;
}

const StackSizesContainer = ({
  playerCount,
  stackSizes,
  handleStackSizesChange,
}: Props) => {
  const handleStackSizeChange = (
    index: number,
    newStackSize: IStackSizeState
  ) => {
    const newStackSizes = [...stackSizes];
    newStackSizes[index] = newStackSize;
    handleStackSizesChange(newStackSizes);
  };

  const handleNewStackSize = () => {
    handleStackSizesChange([...stackSizes, { name: `V${stackSizes.length}` }]);
  };

  const handleRemoveStackSize = (index: number) => {
    const newStackSizes = [...stackSizes];
    newStackSizes.splice(index, 1);
    const renamedStackSizes = newStackSizes.map((stackSize, index) => {
      if (stackSize.name !== "Hero") {
        return { ...stackSize, name: `V${index}` };
      }
      return stackSize;
    });
    handleStackSizesChange(renamedStackSizes);
  };

  return (
    <>
      <Row justify="start" style={{ width: "100%", marginBottom: "1vh" }}>
        <Col span={8}>
          <Typography.Text
            style={{
              color: "var(--foreground)",
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
          >
            Player
          </Typography.Text>
        </Col>
        <Col span={8}>
          <Typography.Text
            style={{
              color: "var(--foreground)",
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
          >
            Stack Size
          </Typography.Text>
        </Col>
        <Col span={8}>
          <Typography.Text
            style={{
              color: "var(--foreground)",
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
          >
            Position
          </Typography.Text>
        </Col>
      </Row>
      <Row style={{ marginBottom: "1vh" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          {stackSizes.map((stackSize, index) => (
            <StackSize
              key={index}
              index={index}
              playerCount={playerCount}
              stackSize={stackSize}
              handleStackSizeChange={handleStackSizeChange}
              handleRemoveStackSize={handleRemoveStackSize}
            />
          ))}
        </Space>
      </Row>
      <Button
        style={{
          width: "100%",
          marginBottom: "1vh",
          backgroundColor: "var(--button-primary)",
          color: "var(--button-primary-foreground)",
          fontWeight: "bold",
        }}
        onClick={handleNewStackSize}
      >
        +
      </Button>
    </>
  );
};

export default StackSizesContainer;
