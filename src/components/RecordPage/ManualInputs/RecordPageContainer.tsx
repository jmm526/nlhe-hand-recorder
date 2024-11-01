import { Space } from "antd";
import Dictaphone from "../Dictaphone";
import ManualInputs from "./ManualInputs";

const RecordPageContainer = () => {
  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <ManualInputs />
        <Dictaphone onSubmit={() => {}} />
      </Space>
    </>
  );
};

export default RecordPageContainer;
