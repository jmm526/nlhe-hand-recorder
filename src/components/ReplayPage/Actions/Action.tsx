import { formatActionText } from "@/server/helpers";
import { EAction, IAction } from "@/server/models";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";
import "./actions.css";
import { useState } from "react";
import useMeasure from "react-use-measure";
import { useSpring, animated, useTransition } from "react-spring";

interface Props {
  action: IAction;
  onActionEdit: (action: IAction) => void;
  onActionDelete: (action: IAction) => void;
  onActionCreateUp: () => void;
  onActionCreateDown: () => void;
}

const Action = ({
  action,
  onActionEdit,
  onActionDelete,
  onActionCreateUp,
  onActionCreateDown,
}: Props) => {
  const [open, toggleOpen] = useState(false);
  const [buttonsContainerRef, { width: buttonsWidth }] = useMeasure();
  const [actionCardRef, { height: actionCardHeight }] = useMeasure();
  const buttonsProps = useSpring({
    width: open ? buttonsWidth : 0,
  });
  const buttonIconTransition = useTransition(open, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return (
    <Row className="action-card" ref={actionCardRef}>
      <animated.div
        className="action-options-fill"
        style={{ ...buttonsProps, height: actionCardHeight }}
      >
        <Row style={{ height: "100%" }}>
          <Col
            span={8}
            style={{ backgroundColor: "var(--card-club)", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {buttonIconTransition(
              (style, item) =>
                item && (
                  <animated.div style={{...style, width: "100%"}}>
                    <Row style={{ borderBottom: "1px solid var(--foreground)", display: "flex", justifyContent: "center" }}>
                      <Button
                        icon={<><PlusOutlined /><ArrowUpOutlined /></>}
                      className="action-card-button"
                      onClick={() => onActionCreateUp()}
                    />
                    </Row>
                    <Row style={{ borderTop: "1px solid var(--foreground)", display: "flex", justifyContent: "center" }}>
                      <Button
                        icon={<><PlusOutlined /><ArrowDownOutlined /></>}
                        className="action-card-button"
                        onClick={() => onActionCreateDown()}
                      />
                    </Row>
                  </animated.div>
                )
            )}
          </Col>
          <Col
            span={8}
            style={{ backgroundColor: "var(--card-diamond)", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {buttonIconTransition(
              (style, item) =>
                item && (
                  <animated.div style={style}>
                    <Button
                      icon={<EditOutlined />}
                      className="action-card-button"
                      onClick={() => onActionEdit(action)}
                    />
                  </animated.div>
                )
            )}
          </Col>
          <Col
            span={8}
            style={{ backgroundColor: "var(--card-heart)", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {buttonIconTransition(
              (style, item) =>
                item && (
                  <animated.div style={style}>
                    <Button
                      icon={<DeleteOutlined />}
                      className="action-card-button"
                      onClick={() => onActionDelete(action)}
                    />
                  </animated.div>
                )
            )}
          </Col>
        </Row>
      </animated.div>
      <Col
        span={23}
        ref={buttonsContainerRef}
        className="action-options-not-filled"
      >
        <Row style={{ height: "100%" }}>
          <Col span={10} style={{ display: "flex", alignItems: "center" }}>
            <Typography.Text strong className="action-card-text">
              {action.position} ({action.stack_size})
            </Typography.Text>
          </Col>
          <Col span={8} style={{ display: "flex", alignItems: "center" }}>
            <Typography.Text strong className="action-card-text">
              {formatActionText(action.action)}
            </Typography.Text>
          </Col>
          <Col span={6} style={{ display: "flex", alignItems: "center" }}>
            {action.action !== EAction.FOLD &&
              action.action !== EAction.CHECK && (
                <Typography.Text strong className="action-card-text">
                  {action.amount}
                </Typography.Text>
              )}
          </Col>
        </Row>
      </Col>
      <Col
        span={1}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          className="action-card-button"
          onClick={() => toggleOpen(!open)}
          style={{
            backgroundColor: "transparent",
            justifyItems: "center",
            display: "flex",
            height: "100%",
          }}
        >
          <MoreOutlined style={{ color: "var(--foreground)" }} />
        </Button>
      </Col>
    </Row>
  );
};

export default Action;
