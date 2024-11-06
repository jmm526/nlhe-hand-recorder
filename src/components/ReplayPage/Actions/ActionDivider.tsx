import PlayingCard from "@/components/general/PlayingCard/PlayingCard";
import { ICard } from "@/server/models";
import { Col, Row, Space, Typography } from "antd";

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
}

const ActionDivider = ({ label, cards }: Props) => {
  return (
    <Col span={24}>
      <Row>
        <Col span={12}>
          <Typography.Text strong className="action-card-text">
            {label}
          </Typography.Text>
        </Col>
        <Col span={12} style={{ display: "flex", justifyContent: "flex-end" }}>
          <Space>
            {cards?.map((card) => (
              <PlayingCard card={card} />
            ))}
          </Space>
        </Col>
      </Row>
    </Col>
  );
};

export default ActionDivider;
