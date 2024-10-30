import { EAction, EPosition, IAction, IStraddle } from "./models";

const positionOrder9max = [
  EPosition.SB,
  EPosition.BB,
  EPosition.UTG,
  EPosition.UTG1,
  EPosition.UTG2,
  EPosition.LJ,
  EPosition.HJ,
  EPosition.CO,
  EPosition.BTN,
];

const positionOrder6max = [
  EPosition.SB,
  EPosition.BB,
  EPosition.UTG,
  EPosition.LJ,
  EPosition.HJ,
  EPosition.CO,
  EPosition.BTN,
];

export const generateHandHistoryPrompt = (
  smallBlind: number,
  bigBlind: number,
  playerCount: number,
  rawHistory: string,
  stackSizes?: { name: string; position: EPosition; stackSize: number }[],
  straddle?: IStraddle
) => {
  let retString = "";
  retString += `${smallBlind}$ small blind, ${bigBlind}$ big blind.\n`;
  if (straddle) {
    retString += `${straddle.position} straddle to ${straddle.value}$.\n`;
  }
  retString += `${playerCount}-max game.\n`;
  if (stackSizes) {
    stackSizes?.forEach((stackSize) => {
      retString += `${stackSize.position} has ${stackSize.stackSize}$ stack.\n`;
    });
  }
  retString += rawHistory;
  console.log(retString);
  return retString;
};

export const generateStackSizes = (
  bigBlind: number,
  numPlayers: number,
  stackSizes?: { name: string; position: EPosition; stackSize: number }[]
) => {
  if (numPlayers !== 9 && numPlayers !== 6) {
    throw new Error("Invalid number of players");
  }
  const positionOrder =
    numPlayers === 9 ? positionOrder9max : positionOrder6max;
  const myStackSizes = stackSizes || [];

  const retStackSizes: {
    name: string;
    position: EPosition;
    stackSize: number;
  }[] = [];

  positionOrder.forEach((pos) => {
    const myStackSize =
      myStackSizes.find((stackSize) => stackSize.position === pos)?.stackSize ||
      bigBlind * 100;
    retStackSizes.push({
      name: pos,
      position: pos,
      stackSize: myStackSize,
    });
  });
  return retStackSizes;
};

export const fixActions = (
  smallBlind: number,
  bigBlind: number,
  numPlayers: number,
  actions: IAction[],
  isPreflop: boolean,
  stackSizes: { position: EPosition; stackSize: number }[],
  straddle?: IStraddle
) => {
  if (numPlayers !== 9 && numPlayers !== 6) {
    throw new Error("Invalid number of players");
  }

  const getPosition = (posIndex: number) => posIndex % numPlayers;

  const retActions: IAction[] = [];
  const positionOrder =
    numPlayers === 9 ? positionOrder9max : positionOrder6max;
  let posIndex = 0;

  if (isPreflop) {
    retActions.push({
      position: EPosition.SB,
      action: EAction.BET,
      amount: smallBlind,
      stack_size:
        stackSizes.find(
          (ss: { position: EPosition; stackSize: number }) =>
            ss.position === EPosition.SB
        )?.stackSize || bigBlind * 100,
    });
    retActions.push({
      position: EPosition.BB,
      action: EAction.RAISE,
      amount: smallBlind,
      stack_size:
        stackSizes.find(
          (ss: { position: EPosition; stackSize: number }) =>
            ss.position === EPosition.BB
        )?.stackSize || bigBlind * 100,
    });
    if (straddle) {
      retActions.push({
        position: straddle.position,
        action: EAction.RAISE,
        amount: straddle.value,
        stack_size:
          stackSizes.find(
            (ss: { position: EPosition; stackSize: number }) =>
              ss.position === straddle.position
          )?.stackSize || bigBlind * 100,
      });
      posIndex = getPosition(positionOrder.indexOf(straddle.position) + 1);
    } else {
      posIndex = getPosition(positionOrder.indexOf(EPosition.UTG));
    }

    console.log(posIndex);
  }

  while (positionOrder.length > 1) {}
};
