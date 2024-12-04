import { formatActionText } from "@/server/helpers";
import { EAction, EPosition, IAction } from "@/server/models";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Col, InputNumber, Row, Select, Typography } from "antd";
import "../actions.css";
import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import ActionCreateEditDeleteButtons from "./ActionCreateEditDeleteButtons";
import ActionEditAcceptTrashButtons from "./ActionEditAcceptTrashButtons";

interface Props {
  action: IAction;
  players: EPosition[];
  isInEditMode: boolean;
  onActionEdit: (action: IAction) => void;
  onActionDelete: () => void;
  onActionCreateUp: () => void;
  onActionCreateDown: () => void;
}

const Action = ({
  action,
  players,
  isInEditMode,
  onActionEdit,
  onActionDelete,
  onActionCreateUp,
  onActionCreateDown,
}: Props) => {
  const [open, toggleOpen] = useState(false);
  const [stateAction, setStateAction] = useState<IAction>(action);
  const [editMode, toggleEditMode] = useState(isInEditMode || false);
  
  const [buttonsContainerRef, { width: buttonsWidth }] = useMeasure();
  const [actionCardRef, { height: actionCardHeight }] = useMeasure();

  return (
    <Row className="action-card" ref={actionCardRef}>
      <ActionCreateEditDeleteButtons
        isOpen={open}
        toggleOpen={toggleOpen}
        toggleEditMode={toggleEditMode}
        actionCardHeight={actionCardHeight}
        buttonsWidth={buttonsWidth}
        onActionCreateUp={onActionCreateUp}
        onActionCreateDown={onActionCreateDown}
        onActionDelete={onActionDelete}
      />
      <Col
        span={editMode ? 24 : 23}
        ref={buttonsContainerRef}
        className="action-options-not-filled"
      >
        <Row style={{ height: "100%" }}>
          {editMode ? (
            <Col span={8}>
              <Row>
                <Typography.Text
                  style={{
                    color: "var(--foreground)",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                  }}
                >
                  Position
                </Typography.Text>
              </Row>
              <Row>
                <Select
                  options={players.map((player) => ({
                    label: player,
                    value: player,
                  }))}
                  value={stateAction.position}
                  onChange={(value) =>
                    setStateAction({
                      ...stateAction,
                      position: value as EPosition,
                    })
                  }
                  popupMatchSelectWidth={false}
                />
              </Row>
            </Col>
          ) : (
            <Col span={10} style={{ display: "flex", alignItems: "center" }}>
              <Typography.Text strong className="action-card-text">
                {action.position} ({action.stack_size})
              </Typography.Text>
            </Col>
          )}

          {editMode ? (
            <Col span={8}>
              <Row>
                <Typography.Text
                  style={{
                    color: "var(--foreground)",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                  }}
                >
                  Action
                </Typography.Text>
              </Row>
              <Row>
                <Select
                  options={Object.values(EAction).map((action) => ({
                    label: action,
                    value: action,
                  }))}
                  value={stateAction.action}
                  onChange={(value) =>
                    setStateAction({ ...stateAction, action: value as EAction })
                  }
                  popupMatchSelectWidth={false}
                />
              </Row>
            </Col>
          ) : (
            <Col span={8} style={{ display: "flex", alignItems: "center" }}>
              <Typography.Text strong className="action-card-text">
                {formatActionText(action.action)}
              </Typography.Text>
            </Col>
          )}
          {editMode ? (
            <Col span={8}>
              <Row>
                <Typography.Text
                  style={{
                    color: "var(--foreground)",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                  }}
                >
                  Amount
                </Typography.Text>
              </Row>
              {stateAction.action !== EAction.CHECK &&
                stateAction.action !== EAction.FOLD && (
                  <InputNumber
                    value={stateAction.amount}
                    onChange={(value) =>
                      setStateAction({ ...stateAction, amount: value ?? 0 })
                    }
                  />
                )}
            </Col>
          ) : (
            <Col span={6} style={{ display: "flex", alignItems: "center" }}>
              <Typography.Text strong className="action-card-text">
                {action.amount}
              </Typography.Text>
            </Col>
          )}
        </Row>
        {editMode && (
          <ActionEditAcceptTrashButtons
            isEditMode={editMode}
            height={actionCardHeight}
            toggleEditMode={toggleEditMode}
            onAccept={() => onActionEdit(stateAction)}
          />
        )}
      </Col>
      {!editMode && (
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
      )}
    </Row>
  );
};

export default Action;
