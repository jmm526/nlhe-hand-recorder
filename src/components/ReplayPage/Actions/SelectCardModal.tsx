import { ECardValue, ESuit, ICard } from "@/server/models";
import { Button, Col, Modal, Row, Select, Space } from "antd";
import { useEffect, useState } from "react";

interface Props {
  card: ICard | null;
  onSave: (card: ICard) => void;
  onClose: () => void;
}

const SelectCardModal = ({ card, onSave, onClose }: Props) => {
  const [stateCard, setStateCard] = useState<ICard | null>(card);

  useEffect(() => {
    setStateCard(card);
  }, [card]);

  const handleSave = () => {
    if (stateCard) {
      onSave(stateCard as ICard);
    }
    setStateCard(null);
    onClose();
  };

  return (
    <>
      <Modal
        open={!!stateCard}
        title="Select Card"
        onCancel={onClose}
        footer={null}
        style={{ width: "fit-content" }}
      >
        <Row style={{ marginBottom: "10px", display: "flex", justifyContent: "flex-end" }}>
        <Space direction="horizontal">
          <Col>
            <Select
              options={Object.values(ECardValue).map((value) => ({
                label: value,
                value: value,
              }))}
              value={stateCard?.value}
              onChange={(value) =>
                setStateCard({ ...stateCard, value: value as ECardValue })
              }
            />
          </Col>
          <Col>
            <Select
              options={Object.values(ESuit).map((suit) => ({
                label: suit,
                value: suit,
              }))}
              value={stateCard?.suit}
              onChange={(value) =>
                setStateCard({ ...stateCard, suit: value as ESuit })
              }
            />
            </Col>
          </Space>
        </Row>
        <Row style={{ display: "flex", justifyContent: "flex-end" }}>
          <Space direction="horizontal">
            <Col>
              <Button style={{ fontWeight: "bold" }} onClick={onClose}>
                Cancel
              </Button>
            </Col>
            <Col>
              <Button style={{ fontWeight: "bold" }} onClick={handleSave}>
                Save
              </Button>
            </Col>
          </Space>
        </Row>
      </Modal>
    </>
  );
};

export default SelectCardModal;
