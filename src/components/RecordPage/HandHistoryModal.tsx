import { convertSuitToShorthand } from "@/server/helpers";
import {
  EAction,
  EPosition,
  IAction,
  ICard,
  IHandHistory,
} from "@/server/models";
import { Modal } from "antd";
import CopyToClipboardButton from "../general/CopyToClipboardButton";

interface Props {
  responseData: IHandHistory | null;
  onClose: () => void;
}

const convertActionToText = (action: IAction) => {
  let retString = `${action.position} (${action.stack_size}): ${action.action}`;
  if (action.action !== EAction.FOLD && action.action !== EAction.CHECK) {
    retString += ` ${!!action.amount && `(${action.amount})`}`;
  }
  return `${retString}\n`;
};

const generateStreetText = (
  street: "Preflop" | "Flop" | "Turn" | "River",
  potSize: number,
  actions: IAction[],
  cards?: ICard[]
) => {
  const playerMap = new Map<EPosition, number>();
  let retString = `\n${street}${
    cards
      ? ` (${cards
          .map((card) => `${card.value}${convertSuitToShorthand(card.suit)}`)
          .join(", ")})`
      : ""
  } (Potsize: ${potSize})\n`;
  actions.forEach((action) => {
    if (action.action !== EAction.FOLD && action.action !== EAction.CHECK) {
      playerMap.set(action.position, action.amount);
    }
    retString += convertActionToText(action);
  });
  const finalPotSize =
    Array.from(playerMap.values()).reduce((a, b) => a + b, 0) + potSize;
  return { retString, finalPotSize };
};

const convertHandHistoryToText = (handHistory: IHandHistory | null) => {
  if (!handHistory) {
    return "";
  }
  const { blinds, player, preflop, flop, turn, river } = handHistory;
  let retString = "";

  retString += `Blinds: ${blinds.small_blind} / ${blinds.big_blind}\n`;
  retString += `Hero: [${player.hand[0].value}${convertSuitToShorthand(
    player.hand[0].suit
  )}, ${player.hand[1].value}${convertSuitToShorthand(player.hand[1].suit)}]\n`;

  const { retString: preflopString, finalPotSize: flopPotSize } =
    generateStreetText("Preflop", 0, preflop);
  retString += preflopString;

  const { retString: flopString, finalPotSize: turnPotSize } =
    generateStreetText("Flop", flopPotSize, flop.actions, flop.flop);
  retString += flopString;

  const { retString: turnString, finalPotSize: riverPotSize } =
    generateStreetText("Turn", turnPotSize, turn.actions, [turn.card]);
  retString += turnString;

  const { retString: riverString } = generateStreetText(
    "River",
    riverPotSize,
    river.actions,
    [river.card]
  );
  retString += riverString;

  return retString;
};

const HandHistoryModal = ({ responseData, onClose }: Props) => {
  const handHistoryText = convertHandHistoryToText(responseData);
  return (
    <>
      <Modal
        open={!!responseData}
        title="Hand History"
        footer={<CopyToClipboardButton text={handHistoryText} />}
        onCancel={onClose}
      >
        <pre>{handHistoryText}</pre>
      </Modal>
    </>
  );
};

export default HandHistoryModal;
