import { EAction, EPosition, ESuit, IAction, IStraddle } from "./models";

export const positionOrder9max = [
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

export const positionOrder6max = [
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
  currentPlayers: EPosition[], // TODO: get rid of this - we can just use stacksizes and sort based on order arrays at top.
  actions: IAction[],
  stackSizes: { position: EPosition; stackSize: number }[],
  isPreflop: boolean,
  straddle?: IStraddle
): {
  actions: IAction[];
  stackSizes: { position: EPosition; stackSize: number }[];
} => {
  let posIndex = 0;
  let currentBetSize = 0;
  let players = [...currentPlayers];
  let playersActed: EPosition[] = [];
  const gptActions: IAction[] = [...actions].filter(
    (a) => a.action !== EAction.STRADDLE && players.includes(a.position)
  );
  let currentAggressor: EPosition | null = null;
  const stackSizeMap = new Map<EPosition, number>();
  stackSizes.forEach((ss) => {
    stackSizeMap.set(ss.position, ss.stackSize);
  });
  const retActions: IAction[] = [];

  const incrementPosIndex = () => {
    posIndex = (posIndex + 1) % players.length;
  };
  const addAction = (position: EPosition, action: EAction, amount?: number) => {
    switch (action) {
      case EAction.CALL:
      case EAction.CHECK:
        playersActed.push(position);
        incrementPosIndex();
        break;
      case EAction.POST:
      case EAction.STRADDLE:
        if (!amount) {
          throw new Error("Amount is required for post or straddle");
        }
        if (amount <= currentBetSize) {
          throw new Error("Invalid bet size");
        }
        currentAggressor = position;
        currentBetSize = amount;
        playersActed = [];
        incrementPosIndex();
        break;
      case EAction.BET:
      case EAction.RAISE:
        if (!amount) {
          throw new Error("Amount is required for bet or raise");
        }
        if (amount <= currentBetSize) {
          throw new Error("Invalid bet size");
        }
        currentAggressor = position;
        currentBetSize = amount;
        playersActed = [position];
        incrementPosIndex();
        break;
      case EAction.FOLD:
        players = players.filter((p) => p !== position);
        posIndex = posIndex % players.length;
        break;
    }

    stackSizeMap.set(
      position,
      (stackSizes.find((ss) => ss.position === position)?.stackSize as number) -
        (amount || 0)
    );
    retActions.push({
      position,
      action,
      amount: amount || 0,
      stack_size: stackSizeMap.get(position) as number,
    });
  };

  // Post blinds + straddle
  if (isPreflop) {
    addAction(EPosition.SB, EAction.POST, smallBlind);
    addAction(EPosition.BB, EAction.POST, bigBlind);
    if (straddle) {
      addAction(straddle.position, EAction.STRADDLE, straddle.value);
      posIndex = players.indexOf(straddle.position);
      incrementPosIndex();
    } else {
      posIndex = players.indexOf(EPosition.UTG);
    }
  }

  while (playersActed.length < players.length) {
    // Prune out fake actions for already folded players
    while (
      gptActions.length &&
      !players.find((p) => p === gptActions[0].position)
    ) {
      gptActions.shift();
    }
    const currentPlayer = players[posIndex];
    const nextGptAction = gptActions[0];
    if (currentAggressor && currentPlayer == currentAggressor) {
      // Account for straddle case
      if (
        straddle &&
        currentPlayer == straddle.position &&
        currentBetSize == straddle.value
      ) {
        if (
          !nextGptAction ||
          nextGptAction.action == EAction.FOLD ||
          nextGptAction.action == EAction.CHECK
        ) {
          addAction(currentPlayer, nextGptAction.action);
          break;
        } else if (nextGptAction.position == currentPlayer) {
          addAction(currentPlayer, nextGptAction.action, nextGptAction.amount);
          gptActions.shift();
        } else {
          throw new Error("Invalid action");
        }
      } else {
        // End of round - we have made it back to the aggressor and everyone has either called or folded
        break;
      }
    } else {
      if (nextGptAction && nextGptAction.position == currentPlayer) {
        addAction(currentPlayer, nextGptAction.action, nextGptAction.amount);
        gptActions.shift();
      } else if (currentBetSize) {
        addAction(currentPlayer, EAction.FOLD);
      } else {
        addAction(currentPlayer, EAction.CHECK);
      }
    }
  }

  return {
    actions: retActions,
    stackSizes: players.map((p) => ({
      position: p,
      stackSize: stackSizeMap.get(p) as number,
    })),
  };
};

export const convertSuitToShorthand = (suit: ESuit) => {
  switch (suit) {
    case ESuit.CLUB:
      return "c";
    case ESuit.DIAMOND:
      return "d";
    case ESuit.HEART:
      return "h";
    case ESuit.SPADE:
      return "s";
    default:
      throw new Error("Invalid suit");
  }
};

export const formatActionText = (action: EAction) => {
  switch (action) {
    case EAction.FOLD:
      return "Fold";
    case EAction.CHECK:
      return "Check";
    case EAction.CALL:
      return "Call";
    case EAction.BET:
      return "Bet";
    case EAction.RAISE:
      return "Raise";
    case EAction.POST:
      return "Post";
    case EAction.STRADDLE:
      return "Straddle";
    default:
      return action;
  }
};
