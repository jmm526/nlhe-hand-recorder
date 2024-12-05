import { HandHistoryContext } from "@/context/HandHistoryContext";
import { Space, message } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Dictaphone from "./Dictaphone";
import ManualInputs from "./ManualInputs/ManualInputs";
import { RecordPageContext, RecordPageContextProps } from "@/context/RecordPageContext";

// const handHistory: IHandHistory = {
//   player_count: 9,
//   blinds: {
//     small_blind: 2,
//     big_blind: 5,
//     straddle: {
//       value: 10,
//       position: "UTG",
//     },
//   },
//   player: {
//     hand: [
//       {
//         suit: "SPADE",
//         value: "A",
//       },
//       {
//         suit: "HEART",
//         value: "K",
//       },
//     ],
//     stack_size: 500,
//     position: "UTG",
//   },
//   Preflop: [
//     {
//       position: "SB",
//       action: "POST",
//       amount: 2,
//       stack_size: 498,
//     },
//     {
//       position: "BB",
//       action: "POST",
//       amount: 5,
//       stack_size: 495,
//     },
//     {
//       position: "UTG",
//       action: "STRADDLE",
//       amount: 10,
//       stack_size: 990,
//     },
//     {
//       position: "UTG1",
//       action: "FOLD",
//       amount: 0,
//       stack_size: 500,
//     },
//     {
//       position: "UTG2",
//       action: "FOLD",
//       amount: 0,
//       stack_size: 500,
//     },
//     {
//       position: "LJ",
//       action: "FOLD",
//       amount: 0,
//       stack_size: 500,
//     },
//     {
//       position: "HJ",
//       action: "FOLD",
//       amount: 0,
//       stack_size: 500,
//     },
//     {
//       position: "CO",
//       action: "FOLD",
//       amount: 0,
//       stack_size: 500,
//     },
//     {
//       position: "BTN",
//       action: "FOLD",
//       amount: 0,
//       stack_size: 500,
//     },
//     {
//       position: "SB",
//       action: "FOLD",
//       amount: 0,
//       stack_size: 500,
//     },
//     {
//       position: "BB",
//       action: "CALL",
//       amount: 10,
//       stack_size: 490,
//     },
//     {
//       position: "UTG",
//       action: "RAISE",
//       amount: 45,
//       stack_size: 955,
//     },
//     {
//       position: "BB",
//       action: "CALL",
//       amount: 45,
//       stack_size: 455,
//     },
//   ],
//   Flop: {
//     actions: [
//       {
//         position: "BB",
//         action: "CHECK",
//         amount: 0,
//         stack_size: 455,
//       },
//       {
//         position: "UTG",
//         action: "BET",
//         amount: 35,
//         stack_size: 920,
//       },
//       {
//         position: "BB",
//         action: "CALL",
//         amount: 35,
//         stack_size: 420,
//       },
//     ],
//     flop: [
//       {
//         suit: "SPADE",
//         value: "8",
//       },
//       {
//         suit: "HEART",
//         value: "3",
//       },
//       {
//         suit: "DIAMOND",
//         value: "3",
//       },
//     ],
//   },
//   Turn: {
//     actions: [
//       {
//         position: "BB",
//         action: "CHECK",
//         amount: 0,
//         stack_size: 420,
//       },
//       {
//         position: "UTG",
//         action: "CHECK",
//         amount: 0,
//         stack_size: 920,
//       },
//     ],
//     card: {
//       suit: "DIAMOND",
//       value: "2",
//     },
//   },
//   River: {
//     actions: [
//       {
//         position: "BB",
//         action: "BET",
//         amount: 35,
//         stack_size: 385,
//       },
//       {
//         position: "UTG",
//         action: "RAISE",
//         amount: 145,
//         stack_size: 775,
//       },
//       {
//         position: "BB",
//         action: "FOLD",
//         amount: 0,
//         stack_size: 420,
//       },
//     ],
//     card: {
//       suit: "HEART",
//       value: "J",
//     },
//   },
//   Showdown: [
//     {
//       position: "BB",
//       hand: [
//         {
//           suit: "HEART",
//           value: "K",
//         },
//         {
//           suit: "HEART",
//           value: "2",
//         },
//       ],
//     },
//   ],
// };

const RecordPageContainer = () => {
  const { recordPageInfo, setRecordPageInfo } = useContext(RecordPageContext);

  const router = useRouter();

  const { setHandHistory } = useContext(HandHistoryContext);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleInfoChange = (key: keyof RecordPageContextProps, value: any) => {
    setRecordPageInfo({ ...recordPageInfo, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/ai/generate-hand-history", {
        ...recordPageInfo,
      });
      setIsLoading(false);
      setHandHistory(response.data.handHistory);
      router.push("/replay");
    } catch (error) {
      setIsLoading(false);
      messageApi.error("Error generating hand history.");
      console.error(error);
    }
  };

  return (
    <div style={{ position: "absolute", width: "100%" }}>
      {contextHolder}
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <ManualInputs
          smallBlind={recordPageInfo?.smallBlind}
          bigBlind={recordPageInfo?.bigBlind}
          playerCount={recordPageInfo?.playerCount}
          stackSizes={recordPageInfo?.stackSizes}
          handleInfoChange={handleInfoChange}
        />
        <Dictaphone
          text={recordPageInfo?.rawHistory as string}
          handleTextChange={(text: string) => {
            handleInfoChange("rawHistory", text);
          }}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Space>
    </div>
  );
};

export default RecordPageContainer;
