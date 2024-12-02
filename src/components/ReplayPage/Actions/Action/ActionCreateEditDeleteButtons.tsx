import { useSpring, useTransition, animated } from "react-spring";
import "../actions.css";
import { Button, Col } from "antd";
import { Row } from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";

interface Props {
  isOpen: boolean;
  toggleOpen: (value: boolean) => void;
  toggleEditMode: (value: boolean) => void;
  actionCardHeight: number;
  buttonsWidth: number;
  onActionCreateUp: () => void;
  onActionCreateDown: () => void;
  onActionDelete: () => void;
}

const ActionCreateEditDeleteButtons = ({
  isOpen,
  toggleOpen,
  toggleEditMode,
  actionCardHeight,
  buttonsWidth,
  onActionCreateUp,
  onActionCreateDown,
  onActionDelete,
}: Props) => {
  const buttonsProps = useSpring({
    width: isOpen ? buttonsWidth : 0,
  });
  const buttonIconTransition = useTransition(isOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });
  return (
    <animated.div
      className="action-options-fill"
      style={{ ...buttonsProps, height: actionCardHeight }}
    >
      <Row style={{ height: "100%" }}>
        <Col
          span={8}
          style={{
            backgroundColor: "var(--card-club)",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {buttonIconTransition(
            (style, item) =>
              item && (
                <animated.div style={{ ...style, width: "100%" }}>
                  <Row
                    style={{
                      borderBottom: "1px solid var(--foreground)",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      icon={
                        <>
                          <PlusOutlined />
                          <ArrowUpOutlined />
                        </>
                      }
                      className="action-card-button"
                      onClick={() => {
                        toggleOpen(false);
                        onActionCreateUp();
                      }}
                    />
                  </Row>
                  <Row
                    style={{
                      borderTop: "1px solid var(--foreground)",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      icon={
                        <>
                          <PlusOutlined />
                          <ArrowDownOutlined />
                        </>
                      }
                      className="action-card-button"
                      onClick={() => {
                        toggleOpen(false);
                        onActionCreateDown();
                      }}
                    />
                  </Row>
                </animated.div>
              )
          )}
        </Col>
        <Col
          span={8}
          style={{
            backgroundColor: "var(--card-diamond)",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {buttonIconTransition(
            (style, item) =>
              item && (
                <animated.div style={style}>
                  <Button
                    icon={<EditOutlined />}
                    className="action-card-button"
                    onClick={() => {
                      toggleOpen(false);
                      toggleEditMode(true);
                    }}
                  />
                </animated.div>
              )
          )}
        </Col>
        <Col
          span={8}
          style={{
            backgroundColor: "var(--card-heart)",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {buttonIconTransition(
            (style, item) =>
              item && (
                <animated.div style={style}>
                  <Button
                    icon={<DeleteOutlined />}
                    className="action-card-button"
                    onClick={() => {
                      toggleOpen(false);
                      onActionDelete();
                    }}
                  />
                </animated.div>
              )
          )}
        </Col>
      </Row>
    </animated.div>
  );
};

export default ActionCreateEditDeleteButtons;
