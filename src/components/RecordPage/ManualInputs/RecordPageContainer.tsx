import { Space } from "antd";
import Dictaphone from "../Dictaphone";
import ManualInputs from "./ManualInputs";
import { IStackSizeState } from "./StackSizesContainer";
import { useState } from "react";
import { EPosition } from "@/server/models";

export interface GenerateHandInfoState {
  smallBlind?: number;
  bigBlind?: number;
  playerCount?: number;
  stackSizes?: IStackSizeState[];
  rawHistory?: string;
}

const RecordPageContainer = () => {
  const [handInfo, setHandInfo] = useState<GenerateHandInfoState>({
    smallBlind: 2,
    bigBlind: 5,
    playerCount: 9,
    stackSizes: [{ name: "Hero", stackSize: 1000 }],
    rawHistory: "",
  });

  const handleInfoChange = (key: keyof GenerateHandInfoState, value: any) => {
    setHandInfo({ ...handInfo, [key]: value });
  };

  const handleSubmit = () => {
    console.log(handInfo);
  };

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <ManualInputs
          smallBlind={handInfo.smallBlind}
          bigBlind={handInfo.bigBlind}
          playerCount={handInfo.playerCount}
          stackSizes={handInfo.stackSizes}
          handleInfoChange={handleInfoChange}
        />
        <Dictaphone
          text={handInfo.rawHistory as string}
          handleTextChange={(text: string) => {
            handleInfoChange("rawHistory", text);
          }}
          handleSubmit={handleSubmit}
        />
      </Space>
    </>
  );
};

export default RecordPageContainer;
