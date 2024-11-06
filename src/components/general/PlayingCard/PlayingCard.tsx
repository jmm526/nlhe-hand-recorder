import { ESuit, ICard } from "@/server/models";
import { Col, Row, Typography } from "antd";
import { BsFillSuitSpadeFill, BsSuitClubFill } from "react-icons/bs";
import { FaDiamond, FaHeart } from "react-icons/fa6";

interface Props {
  card: ICard;
}

const getColor = (suit: ESuit) => {
  switch (suit) {
    case ESuit.HEART:
      return "var(--card-heart)";
    case ESuit.DIAMOND:
      return "var(--card-diamond)";
    case ESuit.CLUB:
      return "var(--card-club)";
    case ESuit.SPADE:
      return "var(--card-spade)";
  }
};

const getSuitIcon = (suit: ESuit) => {
  switch (suit) {
    case ESuit.DIAMOND:
      return <FaDiamond />;
    case ESuit.CLUB:
      return <BsSuitClubFill />;
    case ESuit.HEART:
      return <FaHeart />;
    case ESuit.SPADE:
      return <BsFillSuitSpadeFill />;
  }
};

const PlayingCard = ({ card }: Props) => {
  const color = getColor(card.suit);
  return (
    <div
      style={{
        border: `1px solid var(--foreground)`,
        borderRadius: "4px",
        padding: "5px",
        backgroundColor: getColor(card.suit),
        color: "var(--foreground)",
      }}
    >
      <Row>
        <Col style={{ display: "flex", alignItems: "center" }}>
          <Typography.Text
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "var(--foreground)",
              marginRight: "3px",
            }}
          >
            {card.value}
          </Typography.Text>
        </Col>
        <Col style={{ display: "flex", alignItems: "center" }}>
          {getSuitIcon(card.suit)}
        </Col>
      </Row>
    </div>
  );
};

export default PlayingCard;
