import { Space, message } from "antd";
import Dictaphone from "./Dictaphone";
import ManualInputs from "./ManualInputs/ManualInputs";
import { IStackSizeState } from "./ManualInputs/StackSizesContainer";
import { useContext, useState } from "react";
import axios from "axios";
import { IHandHistory } from "@/server/models";
import HandHistoryModal from "./HandHistoryModal";
import { HandHistoryContext } from "@/context/HandHistoryContext";

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

  const { setHandHistory } = useContext(HandHistoryContext);

  const [responseData, setResponseData] = useState<IHandHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleInfoChange = (key: keyof GenerateHandInfoState, value: any) => {
    setHandInfo({ ...handInfo, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/ai/generate-hand-history", {
        ...handInfo,
      });
      setIsLoading(false);
      setHandHistory(response.data.handHistory);
      setResponseData(response.data.handHistory);
    } catch (error) {
      setIsLoading(false);
      messageApi.error("Error generating hand history.");
      console.error(error);
    }
  };

  const handleCloseHandHistoryModal = () => {
    setResponseData(null);
  };

  return (
    <>
      {contextHolder}
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
          isLoading={isLoading}
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
