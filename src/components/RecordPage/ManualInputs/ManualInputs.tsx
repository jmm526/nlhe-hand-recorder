import { RecordPageContextProps } from "@/context/RecordPageContext";
import { Col, InputNumber, Row, Select, Typography } from "antd";
import StackSizesContainer, { IStackSizeState } from "./StackSizesContainer";

interface Props {
  smallBlind?: number;
  bigBlind?: number;
  playerCount?: number;
  stackSizes?: IStackSizeState[];
  handleInfoChange: (key: keyof RecordPageContextProps, value: any) => void;
}

const ManualInputs = ({
  smallBlind,
  bigBlind,
  playerCount,
  stackSizes,
  handleInfoChange,
}: Props) => {
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
            <InputNumber
              value={smallBlind}
              onChange={(value) => handleInfoChange("smallBlind", value ?? 0)}
            />
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
            <InputNumber
              value={bigBlind}
              onChange={(value) => handleInfoChange("bigBlind", value ?? 0)}
            />
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
              style={{ minWidth: "30vw" }}
              value={playerCount}
              onChange={(value) => handleInfoChange("playerCount", value ?? 9)}
              options={[
                {
                  label: "9-Max",
                  value: 9,
                },
                {
                  label: "6-Max",
                  value: 6,
                },
              ]}
            />
          </Row>
        </Col>
      </Row>
      <StackSizesContainer
        playerCount={playerCount as number}
        stackSizes={stackSizes as IStackSizeState[]}
        handleStackSizesChange={(newStackSizes) =>
          handleInfoChange("stackSizes", newStackSizes)
        }
      />
    </>
  );
};

export default ManualInputs;
