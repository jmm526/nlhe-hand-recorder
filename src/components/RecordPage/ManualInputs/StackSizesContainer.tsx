import { Col, Row, Typography } from "antd";
import StackSize from "./StackSize";
import { EPosition } from "@/server/models";
import { useState } from "react";

interface Props {
  playerCount: number;
}

export interface IStackSizeState {
  name?: string;
  position?: EPosition;
  stackSize?: number;
}

const StackSizesContainer = ({ playerCount }: Props) => {
  const [stackSizes, setStackSizes] = useState<IStackSizeState[]>([
    { name: "Hero" },
  ]);

  const handleStackSizeChange = (
    index: number,
    newStackSize: IStackSizeState
  ) => {
    const newStackSizes = [...stackSizes];
    newStackSizes[index] = newStackSize;
    setStackSizes(newStackSizes);
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
      {stackSizes.map((stackSize, index) => (
        <StackSize
          key={index}
          index={index}
          playerCount={playerCount}
          stackSize={stackSize}
          handleStackSizeChange={handleStackSizeChange}
        />
      ))}
    </>
  );
};

export default StackSizesContainer;
