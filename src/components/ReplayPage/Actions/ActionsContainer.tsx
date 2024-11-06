import { EActionDividerType } from "./ActionDivider";
import { useContext, useEffect, useState } from "react";
import { EActionWrapperType } from "./ActionWrapper";
import ActionWrapper from "./ActionWrapper";
import { HandHistoryContext } from "@/context/HandHistoryContext";

const ActionsContainer = () => {
  const { handHistory } = useContext(HandHistoryContext);
  const [componentArray, setComponentArray] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (handHistory) {
      console.log(handHistory);
      const { preflop, flop, turn, river } = handHistory;
      const compArray: React.ReactNode[] = [];
      compArray.push(
        <ActionWrapper
          type={EActionWrapperType.DIVIDER}
          label={EActionDividerType.PREFLOP}
        />
      );
      compArray.push(
        <ActionWrapper
          type={EActionWrapperType.DIVIDER}
          label={EActionDividerType.FLOP}
          cards={flop.flop}
        />
      );
      compArray.push(
        <ActionWrapper
          type={EActionWrapperType.DIVIDER}
          label={EActionDividerType.TURN}
          cards={turn?.card ? [turn.card] : []}
        />
      );
      compArray.push(
        <ActionWrapper
          type={EActionWrapperType.DIVIDER}
          label={EActionDividerType.RIVER}
          cards={river?.card ? [river.card] : []}
        />
      );
      setComponentArray(compArray);
    } else {
      setComponentArray([
        <ActionWrapper
          type={EActionWrapperType.DIVIDER}
          label={EActionDividerType.PREFLOP}
        />,
        // <ActionWrapper
        //   type={EActionWrapperType.DIVIDER}
        //   label={EActionDividerType.FLOP}
        // />,
        // <ActionWrapper
        //   type={EActionWrapperType.DIVIDER}
        //   label={EActionDividerType.TURN}
        // />,
        // <ActionWrapper
        //   type={EActionWrapperType.DIVIDER}
        //   label={EActionDividerType.RIVER}
        // />,
        // <ActionWrapper
        //   type={EActionWrapperType.DIVIDER}
        //   label={EActionDividerType.SHOWDOWN}
        // />,
      ]);
    }
  }, []);

  return (
    <>
      {componentArray.map((component) => (
        <>{component}</>
      ))}
    </>
  );
};

export default ActionsContainer;
