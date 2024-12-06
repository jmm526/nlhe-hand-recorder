import { HandHistoryContext } from "@/context/HandHistoryContext";
import { positionOrder6max, positionOrder9max } from "@/server/helpers";
import { EAction, EPosition, EStreet, IAction, ICard } from "@/server/models";
import { useContext, useEffect, useState } from "react";
import Action from "./Action/Action";
import NewActionButton from "./Action/NewActionButton";
import ActionDivider, { EActionDividerType } from "./ActionDivider";

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

const ActionsContainer = () => {
  const handHistoryContext = useContext(HandHistoryContext);
  const { handHistory, setHandHistory } = handHistoryContext;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [state, setState] = useState<IState>({
    [EStreet.PREFLOP]: {
      actions: [],
      potSize: 0,
      players:
        handHistory?.player_count === 9 ? positionOrder9max : positionOrder6max,
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

  // TODO: useReducer
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

  // TODO: getStreetErrors
  const getStreetErrors = (streetData: IStreetData): string[] | null => {
    return null;
  };

  const handleActionCreateUp = (street: EStreet, index: number) => {
    const { actions } = state[street];
    const newActions = [...actions];
    newActions.splice(index, 0, {
      position: actions[index]?.position || EPosition.BTN,
      action: EAction.FOLD,
      amount: 0,
    });
    return () => {
      setHandHistory({
        ...handHistory,
        [street]:
          street === EStreet.PREFLOP
            ? newActions
            : { ...state[street], actions: newActions },
      });
    };
  };

  const handleActionCreateDown = (street: EStreet, index: number) => {
    const { actions } = state[street];
    const newActions = [...actions];
    newActions.splice(index + 1, 0, {
      position: actions[index].position,
      action: EAction.FOLD,
      amount: 0,
    });
    return () => {
      setHandHistory({
        ...handHistory,
        [street]:
          street === EStreet.PREFLOP
            ? newActions
            : { ...state[street], actions: newActions },
      });
    };
  };

  const handleActionEdit = (street: EStreet, index: number) => {
    const newActions = [...state[street].actions];
    return (action: IAction) => {
      const oldAction = newActions[index];
      action.stack_size = oldAction.stack_size + (oldAction.amount || 0) - (action.amount || 0)
      newActions[index] = action;
      setHandHistory({
        ...handHistory,
        [street]:
          street === EStreet.PREFLOP
            ? newActions
            : { ...state[street], actions: newActions },
      });
    };
  };

  const handleActionDelete = (street: EStreet, index: number) => {
    const newActions = [...state[street].actions];
    newActions.splice(index, 1);
    return () => {
      setHandHistory({
        ...handHistory,
        [street]:
          street === EStreet.PREFLOP
            ? newActions
            : { ...state[street], actions: newActions },
      });
    };
  };

  // Set State Data on handhistory change (in context)
  useEffect(() => {
    setIsLoading(true);
    if (handHistory) {
      // Preflop
      const preflopStreetData: IStreetData = {
        actions: handHistory.Preflop,
        potSize: 0,
        players:
          handHistory.player_count === 9
            ? positionOrder9max
            : positionOrder6max,
        error: null,
      };
      const preflopErrors = getStreetErrors(preflopStreetData);
      const { potSize: flopPotSize, players: flopPlayers } = getNextStreetData(
        handHistory.Preflop,
        preflopStreetData.players,
        0
      );

      // Flop
      const flopStreetData: IStreetData = {
        actions: handHistory.Flop.actions,
        potSize: flopPotSize,
        players: flopPlayers,
        cards: handHistory.Flop.flop,
        error: null,
      };
      const flopErrors = getStreetErrors(flopStreetData);
      const { potSize: turnPotSize, players: turnPlayers } = getNextStreetData(
        handHistory.Flop.actions,
        flopStreetData.players,
        flopStreetData.potSize
      );

      // Turn
      const turnStreetData: IStreetData = {
        actions: handHistory?.Turn?.actions || [],
        potSize: turnPotSize,
        players: turnPlayers,
        cards: handHistory?.Turn?.card ? [handHistory.Turn.card] : [],
        error: null,
      };
      const turnErrors = getStreetErrors(turnStreetData);
      const { potSize: riverPotSize, players: riverPlayers } =
        getNextStreetData(
          handHistory?.Turn?.actions || [],
          turnStreetData.players,
          turnStreetData.potSize
        );

      // River
      const riverStreetData: IStreetData = {
        actions: handHistory?.River?.actions || [],
        potSize: riverPotSize,
        players: riverPlayers,
        cards: handHistory?.River?.card ? [handHistory.River.card] : [],
        error: null,
      };
      const riverErrors = getStreetErrors(riverStreetData);
      const { potSize: showdownPotSize, players: showdownPlayers } =
        getNextStreetData(
          handHistory?.River?.actions || [],
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

    // Preflop
    setComponents({
      [EStreet.PREFLOP]: {
        divider: <ActionDivider label={EActionDividerType.PREFLOP} />,
        actions: preflop.actions.length
          ? preflop.actions.map((action: IAction, index: number) => (
              <Action
                key={`pf-${action.position}-${action.action}-${action.amount}`}
                action={action}
                players={preflop.players}
                isInEditMode={false}
                onActionCreateUp={handleActionCreateUp(EStreet.PREFLOP, index)}
                onActionCreateDown={handleActionCreateDown(
                  EStreet.PREFLOP,
                  index
                )}
                onActionEdit={handleActionEdit(EStreet.PREFLOP, index)}
                onActionDelete={handleActionDelete(EStreet.PREFLOP, index)}
              />
            ))
          : [
              <NewActionButton
                key="new-action-button-pf"
                onActionCreate={handleActionCreateUp(EStreet.PREFLOP, 0)}
              />,
            ],
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
        actions: flop.actions.length
          ? flop.actions.map((action: IAction, index: number) => (
              <Action
                key={`flop-${action.position}-${action.action}-${action.amount}`}
                action={action}
                players={flop.players}
                isInEditMode={false}
                onActionCreateUp={handleActionCreateUp(EStreet.FLOP, index)}
                onActionCreateDown={handleActionCreateDown(EStreet.FLOP, index)}
                onActionEdit={handleActionEdit(EStreet.FLOP, index)}
                onActionDelete={handleActionDelete(EStreet.FLOP, index)}
              />
            ))
          : [
              <NewActionButton
                key="new-action-button-flop"
                onActionCreate={handleActionCreateUp(EStreet.FLOP, 0)}
              />,
            ],
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
        actions: turn.actions.length
          ? turn.actions.map((action: IAction, index: number) => (
              <Action
                key={`turn-${action.position}-${action.action}-${action.amount}`}
                action={action}
                players={turn.players}
                isInEditMode={false}
                onActionCreateUp={handleActionCreateUp(EStreet.TURN, index)}
                onActionCreateDown={handleActionCreateDown(EStreet.TURN, index)}
                onActionEdit={handleActionEdit(EStreet.TURN, index)}
                onActionDelete={handleActionDelete(EStreet.TURN, index)}
              />
            ))
          : [
              <NewActionButton
                key="new-action-button-turn"
                onActionCreate={handleActionCreateUp(EStreet.TURN, 0)}
              />,
            ],
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
        actions: river.actions.length
          ? river.actions.map((action: IAction, index: number) => (
              <Action
                key={`river-${action.position}-${action.action}-${action.amount}`}
                action={action}
                players={river.players}
                isInEditMode={false}
                onActionCreateUp={handleActionCreateUp(EStreet.RIVER, index)}
                onActionCreateDown={handleActionCreateDown(
                  EStreet.RIVER,
                  index
                )}
                onActionEdit={handleActionEdit(EStreet.RIVER, index)}
                onActionDelete={handleActionDelete(EStreet.RIVER, index)}
              />
            ))
          : [
              <NewActionButton
                key="new-action-button-river"
                onActionCreate={handleActionCreateUp(EStreet.RIVER, 0)}
              />,
            ],
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
      {/* {components[EStreet.SHOWDOWN].divider}
      {components[EStreet.SHOWDOWN].actions} */}
    </>
  );
};

export default ActionsContainer;
