import { Button, Col, Row } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useTransition } from "react-spring";

import { animated, useSpring } from "react-spring";

interface Props {
  isEditMode: boolean;
  height: number;
  toggleEditMode: (value: boolean) => void;
  onAccept: () => void;
}

const ActionEditAcceptTrashButtons = ({
  isEditMode,
  height,
  toggleEditMode,
  onAccept,
}: Props) => {
  const buttonProps = useSpring({
    // height: isEditMode ? height : 0,
    maxHeight: isEditMode ? height : 0,
  });
  const buttonIconTransition = useTransition(isEditMode, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <animated.div
      style={{
        ...buttonProps,
        marginTop: "10px",
        width: "100%",
      }}
    >
      {buttonIconTransition(
        (style, item) =>
          item && (
            <animated.div style={{ ...style, width: "100%" }}>
              <Row style={{ width: "100%" }}>
                <Col
                  span={12}
                  style={{
                    backgroundColor: "var(--card-club)",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => {
                    onAccept();
                    toggleEditMode(false);
                  }}
                >
                  <Button
                    icon={<CheckCircleOutlined />}
                    className="action-card-button"
                  />
                </Col>
                <Col
                  span={12}
                  style={{
                    backgroundColor: "var(--card-heart)",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => {
                    toggleEditMode(false);
                  }}
                >
                  <Button
                    icon={<CloseCircleOutlined />}
                    className="action-card-button"
                  />
                </Col>
              </Row>
            </animated.div>
          )
      )}
    </animated.div>
  );
};

export default ActionEditAcceptTrashButtons;
