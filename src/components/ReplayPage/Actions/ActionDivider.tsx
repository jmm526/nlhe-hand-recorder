import PlayingCard from "@/components/general/PlayingCard/PlayingCard";
import { EPosition, ICard } from "@/server/models";
import { Col, Row, Space, Tag, Typography } from "antd";
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
  return (
    <Row className="action-divider">
      <Col span={24}>
        <Row>
          <Col span={cards ? 12 : 24}>
            <Row style={{ width: "100%" }}>
              <Typography.Text strong className="action-divider-title-text">
                {label} {potSize ? `(${potSize})` : ""}
              </Typography.Text>
            </Row>
            <Row style={{ width: "100%" }}>
              {players?.map((player) => (
                <Tag key={player} className="action-divider-player-tag">
                  {player}
                </Tag>
              ))}
            </Row>
          </Col>
          {cards && (
            <Col
              span={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Space>
                {cards?.map((card) => (
                  <PlayingCard key={`${card.value}${card.suit}`} card={card} />
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
