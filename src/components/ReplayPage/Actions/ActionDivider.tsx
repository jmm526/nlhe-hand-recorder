import PlayingCard from "@/components/general/PlayingCard/PlayingCard";
import { EPosition, ICard, IHandHistory } from "@/server/models";
import { Col, Row, Space, Tag, Typography } from "antd";
import "./actions.css";
import SelectCardModal from "./SelectCardModal";
import { useContext, useState } from "react";
import { HandHistoryContext } from "@/context/HandHistoryContext";

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

interface ISelectedCard {
  card: ICard;
  street: EActionDividerType;
  index: number;
}

const ActionDivider = ({ label, cards, potSize, players }: Props) => {
  const [selectedCard, setSelectedCard] = useState<ISelectedCard | null>(null);
  const { handHistory, setHandHistory } = useContext(HandHistoryContext);

  const handleSave = (selectedCardInfo: ISelectedCard) => {
    return (newCard: ICard) => {
      const newHandHistory = { ...handHistory };
      if (selectedCardInfo.street === EActionDividerType.FLOP) {
        newHandHistory.Flop.flop[selectedCardInfo.index] = newCard;
      } else {
        newHandHistory[selectedCardInfo.street].card = newCard;
      }
      setHandHistory(newHandHistory);
    };
  };

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
                {cards?.map((card, index) => (
                  <div
                    onClick={() =>
                      setSelectedCard({
                        card: card as ICard,
                        street: label,
                        index,
                      })
                    }
                  >
                    <PlayingCard
                      key={`${card.value}${card.suit}`}
                      card={card}
                    />
                  </div>
                ))}
              </Space>
            </Col>
          )}
        </Row>
      </Col>
      <SelectCardModal
        card={selectedCard?.card || null}
        onSave={handleSave(selectedCard)}
        onClose={() => setSelectedCard(null)}
      />
    </Row>
  );
};

export default ActionDivider;
