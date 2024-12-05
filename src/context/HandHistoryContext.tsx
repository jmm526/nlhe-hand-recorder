import { createContext, useState } from "react";
import { IHandHistory } from "@/server/models";

export const HandHistoryContext = createContext<{
  handHistory: IHandHistory | null;
  setHandHistory: (handHistory: IHandHistory | null) => void;
}>({
  handHistory: null,
  setHandHistory: () => {},
});

export const HandHistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [handHistory, setHandHistory] = useState<IHandHistory | null>(null);
  return (
    <HandHistoryContext.Provider value={{ handHistory, setHandHistory }}>
      {children}
    </HandHistoryContext.Provider>
  );
};
