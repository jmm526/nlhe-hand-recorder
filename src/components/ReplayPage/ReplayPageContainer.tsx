import { HandHistoryContext } from "@/context/HandHistoryContext";
import { useContext, useEffect, useState } from "react";
import useWindowDimensions from "../general/useWindowDimensions";
import ActionsContainer from "./Actions/ActionsContainer";
import HandHistoryModal from "./HandHistoryModal";
import ReplayButtonsContainer from "./ReplayButtonsContainer";
import { EAction, IHandHistory } from "@/server/models";
import { EPosition, ICard } from "@/server/models";
import { IAction } from "@/server/models";
import { convertSuitToShorthand } from "@/server/helpers";

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
  const { blinds, player, Preflop: preflop, Flop: flop, Turn: turn, River: river } = handHistory;
  let retString = "";

  retString += `Blinds: ${blinds.small_blind} / ${blinds.big_blind}\n`;
  retString += `Hero (${player.position}): [${player.hand[0].value}${convertSuitToShorthand(
    player.hand[0].suit
  )}, ${player.hand[1].value}${convertSuitToShorthand(player.hand[1].suit)}]\n`;

  const { retString: preflopString, finalPotSize: flopPotSize } =
    generateStreetText("Preflop", 0, preflop);
  retString += preflopString;

  const { retString: flopString, finalPotSize: turnPotSize } =
    generateStreetText("Flop", flopPotSize, flop.actions, flop.flop);
  retString += flopString;

  if (turn.card) {
    const { retString: turnString, finalPotSize: riverPotSize } =
      generateStreetText("Turn", turnPotSize, turn.actions, [turn.card]);
    retString += turnString;

    if (river.card) {
      const { retString: riverString } = generateStreetText(
        "River",
        riverPotSize,
        river.actions,
        [river.card]
      );
      retString += riverString;
    }
  }

  return retString;
};

const ReplayPageContainer = () => {
  const { height } = useWindowDimensions();
  const handHistoryContext = useContext(HandHistoryContext);
  const { handHistory } = handHistoryContext;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [handHistoryText, setHandHistoryText] = useState("");

  useEffect(() => {
    setHandHistoryText(convertHandHistoryToText(handHistory));
  }, [handHistory]);

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxHeight: `${height * 0.85}px`,
      }}
    >
      {/* <TableContainer /> */}
      <div style={{ overflow: "auto", marginBottom: "10px" }}>
        <ActionsContainer />
      </div>
      <ReplayButtonsContainer
        openModal={() => setIsModalOpen(true)}
        handHistoryText={handHistoryText}
      />
      <HandHistoryModal
        isOpen={isModalOpen}
        handHistoryText={handHistoryText}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ReplayPageContainer;
