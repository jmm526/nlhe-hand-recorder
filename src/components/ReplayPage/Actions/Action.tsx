import { IAction } from "@/server/models";

interface Props {
  action: IAction;
  onActionEdit: (action: IAction) => void;
  onActionDelete: () => void;
}

const Action = ({ action, onActionEdit, onActionDelete }: Props) => {
  return <>Action</>;
};

export default Action;
