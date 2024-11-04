import { Space } from "antd";
import Dictaphone from "../Dictaphone";
import ManualInputs from "./ManualInputs";
import { IStackSizeState } from "./StackSizesContainer";
import { useState } from "react";
import axios from "axios";
import { IHandHistory } from "@/server/models";
import HandHistoryModal from "../HandHistoryModal";

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

  const [responseData, setResponseData] = useState<IHandHistory | null>(null);

  const handleInfoChange = (key: keyof GenerateHandInfoState, value: any) => {
    setHandInfo({ ...handInfo, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      console.log("SUBMITTING>>>", handInfo);
      const response = await axios.post("/api/ai/generate-hand-history", {
        ...handInfo,
      });
      setResponseData(response.data.handHistory);
    } catch (error) {
      // TODO: Alert user when there is an error.
      console.error(error);
    }
  };

  const handleCloseHandHistoryModal = () => {
    setResponseData(null);
  };

  return (
    <>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
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
      <HandHistoryModal
        responseData={responseData}
        onClose={handleCloseHandHistoryModal}
      />
    </>
  );
};

export default RecordPageContainer;
