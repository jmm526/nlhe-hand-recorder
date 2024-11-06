import { IAction, ICard } from "@/server/models";
import ActionDivider, { EActionDividerType } from "./ActionDivider";
import Action from "./Action";
import { Row } from "antd";
import "./actions.css";
export enum EActionWrapperType {
  DIVIDER = "divider",
  ACTION = "action",
}

interface Props {
  type: EActionWrapperType;
  label?: EActionDividerType;
  cards?: ICard[];
  action?: IAction;
}

const ActionWrapper = ({ type, label, cards, action }: Props) => {
  return (
    <Row className="action-card">
      {type === EActionWrapperType.DIVIDER && (
        <ActionDivider
          label={label || EActionDividerType.PREFLOP}
          cards={cards || []}
        />
      )}
      {type === EActionWrapperType.ACTION && (
        <Action
          action={action as IAction}
          onActionEdit={() => {}}
          onActionDelete={() => {}}
        />
      )}
    </Row>
  );
};

export default ActionWrapper;
