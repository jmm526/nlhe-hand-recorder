import { useContext } from "react";
import TableContainer from "./Table/TableContainer";
import { HandHistoryContext } from "@/context/HandHistoryContext";
import ActionsContainer from "./Actions/ActionsContainer";

const ReplayPageContainer = () => {
  return (
    <>
      <TableContainer />
      <ActionsContainer />
    </>
  );
};

export default ReplayPageContainer;
