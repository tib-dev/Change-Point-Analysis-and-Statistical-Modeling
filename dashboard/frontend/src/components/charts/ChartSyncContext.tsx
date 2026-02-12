import React, { createContext, useContext, useState, useMemo } from "react";

type SyncContextType = {
  activeIndex: number | null;
  setActiveIndex: (i: number | null) => void;
};

const ChartSyncContext = createContext<SyncContextType | null>(null);

export const ChartSyncProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Wrap value in useMemo to prevent children from re-rendering
  // unless activeIndex actually changes.
  const value = useMemo(
    () => ({
      activeIndex,
      setActiveIndex,
    }),
    [activeIndex],
  );

  return (
    <ChartSyncContext.Provider value={value}>
      {children}
    </ChartSyncContext.Provider>
  );
};

export const useChartSync = () => {
  const ctx = useContext(ChartSyncContext);
  if (!ctx) throw new Error("useChartSync must be inside ChartSyncProvider");
  return ctx;
};
