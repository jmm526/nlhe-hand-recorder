import PlayingCard from "@/components/general/PlayingCard/PlayingCard";
import { EPosition, ICard } from "@/server/models";
import { Col, Row, Space, Typography } from "antd";
import "./actions.css";

export enum EActionDividerType {
  PREFLOP = "Preflop",
  FLOP = "Flop",
  TURN = "Turn",
  RIVER = "River",
  SHOWDOWN = "Showdown",
}

interface Props {
  label: EActionDividerType;
  cards?: ICard[];
  potSize?: number;
  players?: EPosition[];
}

const ActionDivider = ({ label, cards, potSize, players }: Props) => {
  console.log("players: ", players);
  return (
    <Row className="action-divider">
      <Col span={24}>
        <Row>
          <Col span={cards ? 12 : 24} style={{ display: "flex", alignItems: "center" }}>
            <Typography.Text strong className="action-divider-text">
              {label} {potSize ? `(${potSize})` : ""}
            </Typography.Text>
          </Col>
          {cards && (
            <Col
              span={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Space>
                {cards?.map((card) => (
                  <PlayingCard card={card} />
                ))}
              </Space>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};

export default ActionDivider;
