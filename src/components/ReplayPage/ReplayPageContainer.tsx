import TableContainer from "./Table/TableContainer";
import ActionsContainer from "./Actions/ActionsContainer";
import useWindowDimensions from "../general/useWindowDimensions";

const ReplayPageContainer = () => {
  const { height } = useWindowDimensions();
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "fit-content",
        maxHeight: `${height * 0.85}px`,
        overflow: "auto",
      }}
    >
      {/* <TableContainer /> */}
      <ActionsContainer />
    </div>
  );
};

export default ReplayPageContainer;
