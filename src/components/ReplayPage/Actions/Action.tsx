import { formatActionText } from "@/server/helpers";
import { EAction, IAction } from "@/server/models";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";
import "./actions.css";

interface Props {
  action: IAction;
  onActionEdit: (action: IAction) => void;
  onActionDelete: () => void;
}

const Action = ({ action, onActionEdit, onActionDelete }: Props) => {
  return (
    <Row className="action-card">
      <Col span={24}>
        <Row>
          <Col span={8} style={{ display: "flex", alignItems: "center" }}>
            <Typography.Text strong className="action-card-text">
              {action.position} ({action.stack_size})
            </Typography.Text>
          </Col>
          <Col span={8} style={{ display: "flex", alignItems: "center" }}>
            <Typography.Text strong className="action-card-text">
              {formatActionText(action.action)}
            </Typography.Text>
          </Col>
          <Col span={4} style={{ display: "flex", alignItems: "center" }}>
            {action.action !== EAction.FOLD &&
              action.action !== EAction.CHECK && (
                <Typography.Text strong className="action-card-text">
                  {action.amount}
                </Typography.Text>
              )}
          </Col>
          <Col span={4} style={{ display: "flex", alignItems: "center" }}>
            <Button
              icon={<EditOutlined />}
              style={{
                color: "var(--foreground)",
                backgroundColor: "transparent",
                borderWidth: "0px",
              }}
              onClick={() => onActionEdit(action)}
            />
            <Button
              icon={<DeleteOutlined />}
              style={{
                color: "var(--action-delete)",
                backgroundColor: "transparent",
                borderWidth: "0px",
              }}
              onClick={() => onActionEdit(action)}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Action;
