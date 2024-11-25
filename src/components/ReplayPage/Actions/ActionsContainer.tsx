import ActionDivider, { IAction, EActionDividerType } from "./ActionDivider";
import { useContext, useEffect, useState } from "react";
import { HandHistoryContext } from "@/context/HandHistoryContext";
import { EAction, EPosition, ICard, IHandHistory } from "@/server/models";
import Action from "./Action";
import { positionOrder6max, positionOrder9max } from "@/server/helpers";
import { Row } from "antd";

enum EStreet {
  PREFLOP = "Preflop",
  FLOP = "Flop",
  TURN = "Turn",
  RIVER = "River",
  SHOWDOWN = "Showdown",
}

interface IStreetData {
  actions: IAction[];
  potSize: number;
  players: EPosition[];
  error: string[] | null;
  cards?: ICard[];
}

interface IState {
  [EStreet.PREFLOP]: IStreetData;
  [EStreet.FLOP]: IStreetData;
  [EStreet.TURN]: IStreetData;
  [EStreet.RIVER]: IStreetData;
  [EStreet.SHOWDOWN]: IStreetData;
}

interface IComponents {
  [EStreet.PREFLOP]: {
    divider: React.ReactNode | null;
    actions: React.ReactNode[];
  };
  [EStreet.FLOP]: {
    divider: React.ReactNode | null;
    actions: React.ReactNode[];
  };
  [EStreet.TURN]: {
    divider: React.ReactNode | null;
    actions: React.ReactNode[];
  };
  [EStreet.RIVER]: {
    divider: React.ReactNode | null;
    actions: React.ReactNode[];
  };
  [EStreet.SHOWDOWN]: {
    divider: React.ReactNode | null;
    actions: React.ReactNode[];
  };
}

const handHistory: IHandHistory = {
  player_count: 9,
  blinds: {
    small_blind: 2,
    big_blind: 5,
    straddle: {
      value: 10,
      position: "UTG",
    },
  },
  player: {
    hand: [
      {
        suit: "SPADE",
        value: "A",
      },
      {
        suit: "HEART",
        value: "K",
      },
    ],
    stack_size: 500,
    position: "UTG",
  },
  preflop: [
    {
      position: "SB",
      action: "POST",
      amount: 2,
      stack_size: 498,
    },
    {
      position: "BB",
      action: "POST",
      amount: 5,
      stack_size: 495,
    },
    {
      position: "UTG",
      action: "STRADDLE",
      amount: 10,
      stack_size: 990,
    },
    {
      position: "UTG1",
      action: "FOLD",
      amount: 0,
      stack_size: 500,
    },
    {
      position: "UTG2",
      action: "FOLD",
      amount: 0,
      stack_size: 500,
    },
    {
      position: "LJ",
      action: "FOLD",
      amount: 0,
      stack_size: 500,
    },
    {
      position: "HJ",
      action: "FOLD",
      amount: 0,
      stack_size: 500,
    },
    {
      position: "CO",
      action: "FOLD",
      amount: 0,
      stack_size: 500,
    },
    {
      position: "BTN",
      action: "FOLD",
      amount: 0,
      stack_size: 500,
    },
    {
      position: "SB",
      action: "FOLD",
      amount: 0,
      stack_size: 500,
    },
    {
      position: "BB",
      action: "CALL",
      amount: 10,
      stack_size: 490,
    },
    {
      position: "UTG",
      action: "RAISE",
      amount: 45,
      stack_size: 955,
    },
    {
      position: "BB",
      action: "CALL",
      amount: 45,
      stack_size: 455,
    },
  ],
  flop: {
    actions: [
      {
        position: "BB",
        action: "CHECK",
        amount: 0,
        stack_size: 455,
      },
      {
        position: "UTG",
        action: "BET",
        amount: 35,
        stack_size: 920,
      },
      {
        position: "BB",
        action: "CALL",
        amount: 35,
        stack_size: 420,
      },
    ],
    flop: [
      {
        suit: "SPADE",
        value: "8",
      },
      {
        suit: "HEART",
        value: "3",
      },
      {
        suit: "DIAMOND",
        value: "3",
      },
    ],
  },
  turn: {
    actions: [
      {
        position: "BB",
        action: "CHECK",
        amount: 0,
        stack_size: 420,
      },
      {
        position: "UTG",
        action: "CHECK",
        amount: 0,
        stack_size: 920,
      },
    ],
    card: {
      suit: "DIAMOND",
      value: "2",
    },
  },
  river: {
    actions: [
      {
        position: "BB",
        action: "BET",
        amount: 35,
        stack_size: 385,
      },
      {
        position: "UTG",
        action: "RAISE",
        amount: 145,
        stack_size: 775,
      },
      {
        position: "BB",
        action: "FOLD",
        amount: 0,
        stack_size: 420,
      },
    ],
    card: {
      suit: "HEART",
      value: "J",
    },
  },
  showdown: [
    {
      position: "BB",
      hand: [
        {
          suit: "HEART",
          value: "K",
        },
        {
          suit: "HEART",
          value: "2",
        },
      ],
    },
  ],
};

const ActionsContainer = () => {
  // const handHistoryContext = useContext(HandHistoryContext);
  // const { handHistory } = handHistoryContext;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [state, setState] = useState<IState>({
    [EStreet.PREFLOP]: {
      actions: [],
      potSize: 0,
      players:
        handHistory.player_count === 9 ? positionOrder9max : positionOrder6max,
      error: null,
    },
    [EStreet.FLOP]: {
      actions: [],
      potSize: 0,
      players: [],
      error: null,
    },
    [EStreet.TURN]: {
      actions: [],
      potSize: 0,
      players: [],
      error: null,
    },
    [EStreet.RIVER]: {
      actions: [],
      potSize: 0,
      players: [],
      error: null,
    },
    [EStreet.SHOWDOWN]: {
      actions: [],
      potSize: 0,
      players: [],
      error: null,
    },
  });

  console.log("state: ", state);

  // Todo: useReducer
  const [components, setComponents] = useState<IComponents>({
    [EStreet.PREFLOP]: {
      divider: null,
      actions: [],
    },
    [EStreet.FLOP]: {
      divider: null,
      actions: [],
    },
    [EStreet.TURN]: {
      divider: null,
      actions: [],
    },
    [EStreet.RIVER]: {
      divider: null,
      actions: [],
    },
    [EStreet.SHOWDOWN]: {
      divider: null,
      actions: [],
    },
  });

  const getNextStreetData = (
    actions: IAction[],
    players: EPosition[],
    currentPotSize: number
  ): { potSize: number; players: EPosition[] } => {
    const playerMap = new Map<EPosition, number>();
    let activePlayers = [...players];

    actions.forEach((action: IAction) => {
      if (action.action !== EAction.FOLD && action.action !== EAction.CHECK) {
        playerMap.set(action.position, action.amount);
      } else if (action.action === EAction.FOLD) {
        activePlayers = activePlayers.filter(
          (player: EPosition) => player !== action.position
        );
      }
    });
    const potSize = Array.from(playerMap.values()).reduce((a, b) => a + b, 0);

    return {
      potSize: potSize + currentPotSize,
      players: activePlayers,
    };
  };

  const getStreetErrors = (streetData: IStreetData): string[] | null => {
    return null;
  };

  // Set State Data on handhistory change (in context)
  useEffect(() => {
    setIsLoading(true);
    if (handHistory) {
      const { preflop, flop, turn, river } = handHistory;

      // Preflop
      const preflopStreetData: IStreetData = {
        actions: preflop,
        potSize: 0,
        players:
          handHistory.player_count === 9
            ? positionOrder9max
            : positionOrder6max,
        error: null,
      };
      const preflopErrors = getStreetErrors(preflopStreetData);
      const { potSize: flopPotSize, players: flopPlayers } = getNextStreetData(
        preflop,
        preflopStreetData.players,
        0
      );

      // Flop
      const flopStreetData: IStreetData = {
        actions: flop.actions,
        potSize: flopPotSize,
        players: flopPlayers,
        cards: flop.flop,
        error: null,
      };
      const flopErrors = getStreetErrors(flopStreetData);
      const { potSize: turnPotSize, players: turnPlayers } = getNextStreetData(
        flop.actions,
        flopStreetData.players,
        flopStreetData.potSize
      );

      // Turn
      const turnStreetData: IStreetData = {
        actions: turn?.actions || [],
        potSize: turnPotSize,
        players: turnPlayers,
        cards: turn?.card ? [turn.card] : [],
        error: null,
      };
      const turnErrors = getStreetErrors(turnStreetData);
      const { potSize: riverPotSize, players: riverPlayers } =
        getNextStreetData(
          turn?.actions || [],
          turnStreetData.players,
          turnStreetData.potSize
        );

      // River
      const riverStreetData: IStreetData = {
        actions: river?.actions || [],
        potSize: riverPotSize,
        players: riverPlayers,
        cards: river?.card ? [river.card] : [],
        error: null,
      };
      const riverErrors = getStreetErrors(riverStreetData);
      const { potSize: showdownPotSize, players: showdownPlayers } =
        getNextStreetData(
          river?.actions || [],
          riverStreetData.players,
          riverStreetData.potSize
        );

      setState({
        [EStreet.PREFLOP]: {
          ...preflopStreetData,
          error: preflopErrors,
        },
        [EStreet.FLOP]: {
          ...flopStreetData,
          error: flopErrors,
        },
        [EStreet.TURN]: {
          ...turnStreetData,
          error: turnErrors,
        },
        [EStreet.RIVER]: {
          ...riverStreetData,
          error: riverErrors,
        },
        [EStreet.SHOWDOWN]: {
          actions: [], // TODO: FIX
          potSize: showdownPotSize,
          players: showdownPlayers,
          error: null,
        },
      });
    }
    setIsLoading(false);
  }, [handHistory]);

  // Set Components
  useEffect(() => {
    const {
      [EStreet.PREFLOP]: preflop,
      [EStreet.FLOP]: flop,
      [EStreet.TURN]: turn,
      [EStreet.RIVER]: river,
      [EStreet.SHOWDOWN]: showdown,
    } = state;

    console.log("preflop: ", preflop);

    // Preflop
    setComponents({
      [EStreet.PREFLOP]: {
        divider: <ActionDivider label={EActionDividerType.PREFLOP} />,
        actions: preflop.actions.map((action: IAction) => (
          <Action
            key={`pf-${action.position}-${action.action}-${action.amount}`}
            action={action}
            onActionEdit={() => {}}
            onActionDelete={() => {}}
          />
        )),
      },
      [EStreet.FLOP]: {
        divider: (
          <ActionDivider
            label={EActionDividerType.FLOP}
            cards={flop?.cards ? flop.cards : []}
            potSize={flop.potSize}
            players={flop.players}
          />
        ),
        actions: flop.actions.map((action: IAction) => (
          <Action
            key={`flop-${action.position}-${action.action}-${action.amount}`}
            action={action}
            onActionEdit={() => {}}
            onActionDelete={() => {}}
          />
        )),
      },
      [EStreet.TURN]: {
        divider: (
          <ActionDivider
            label={EActionDividerType.TURN}
            cards={turn?.cards ? turn.cards : []}
            potSize={turn.potSize}
            players={turn.players}
          />
        ),
        actions: turn.actions.map((action: IAction) => (
          <Action
            key={`turn-${action.position}-${action.action}-${action.amount}`}
            action={action}
            onActionEdit={() => {}}
            onActionDelete={() => {}}
          />
        )),
      },
      [EStreet.RIVER]: {
        divider: (
          <ActionDivider
            label={EActionDividerType.RIVER}
            cards={river?.cards ? river.cards : []}
            potSize={river.potSize}
            players={river.players}
          />
        ),
        actions: river.actions.map((action: IAction) => (
          <Action
            key={`river-${action.position}-${action.action}-${action.amount}`}
            action={action}
            onActionEdit={() => {}}
            onActionDelete={() => {}}
          />
        )),
      },
      [EStreet.SHOWDOWN]: {
        divider: (
          <ActionDivider
            label={EActionDividerType.SHOWDOWN}
            potSize={showdown.potSize}
            players={showdown.players}
          />
        ),
        actions: showdown.actions.map((action: IAction) => (
          <Action
            key={`showdown-${action.position}-${action.action}-${action.amount}`}
            action={action}
            onActionEdit={() => {}}
            onActionDelete={() => {}}
          />
        )),
      },
    });
  }, [state]);

  return (
    <>
      {components[EStreet.PREFLOP].divider}
      {components[EStreet.PREFLOP].actions}
      {components[EStreet.FLOP].divider}
      {components[EStreet.FLOP].actions}
      {components[EStreet.TURN].divider}
      {components[EStreet.TURN].actions}
      {components[EStreet.RIVER].divider}
      {components[EStreet.RIVER].actions}
      {components[EStreet.SHOWDOWN].divider}
      {components[EStreet.SHOWDOWN].actions}
    </>
  );
};

export default ActionsContainer;
