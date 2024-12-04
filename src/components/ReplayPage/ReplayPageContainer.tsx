import { HandHistoryContext } from "@/context/HandHistoryContext";
import { useContext, useState } from "react";
import useWindowDimensions from "../general/useWindowDimensions";
import ActionsContainer from "./Actions/ActionsContainer";
import HandHistoryModal from "./HandHistoryModal";
import ReplayButtonsContainer from "./ReplayButtonsContainer";

const ReplayPageContainer = () => {
  const { height } = useWindowDimensions();
  const handHistoryContext = useContext(HandHistoryContext);
  const { handHistory } = handHistoryContext;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [handHistoryText, setHandHistoryText] = useState("");

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxHeight: `${height * 0.85}px`,
      }}
    >
      {/* <TableContainer /> */}
      <div style={{ overflow: "auto", marginBottom: "10px" }}>
        <ActionsContainer />
      </div>
      <ReplayButtonsContainer
        openModal={() => setIsModalOpen(true)}
        handHistoryText={handHistoryText}
      />
      <HandHistoryModal
        isOpen={isModalOpen}
        responseData={handHistory}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ReplayPageContainer;
