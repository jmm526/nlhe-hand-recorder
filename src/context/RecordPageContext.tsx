import { IStackSizeState } from "@/components/RecordPage/ManualInputs/StackSizesContainer";
import { EPosition } from "@/server/models";
import { createContext, useState } from "react";

export interface RecordPageContextProps {
  smallBlind?: number;
  bigBlind?: number;
  playerCount?: number;
  stackSizes?: IStackSizeState[];
  rawHistory?: string;
}

export const RecordPageContext = createContext<{
  recordPageInfo: RecordPageContextProps | null;
  setRecordPageInfo: (recordPageInfo: RecordPageContextProps | null) => void;
}>({
  recordPageInfo: null,
  setRecordPageInfo: () => {},
});

export const RecordPageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [recordPageInfo, setRecordPageInfo] =
    useState<RecordPageContextProps | null>({
      smallBlind: 2,
      bigBlind: 5,
      playerCount: 9,
      stackSizes: [{ name: "Hero", position: EPosition.BTN, stackSize: 1000 }],
      rawHistory: "",
    });
  return (
    <RecordPageContext.Provider value={{ recordPageInfo, setRecordPageInfo }}>
      {children}
    </RecordPageContext.Provider>
  );
};
