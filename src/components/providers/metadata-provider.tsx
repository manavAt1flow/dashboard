"use client";

import { STORAGE_KEYS } from "@/configs/storage-keys";
import { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "usehooks-ts";

type MetadataContextType = {
  lastTeamId: string | undefined;
  setLastTeamId: (teamId: string) => void;
};

const MetadataContext = createContext<MetadataContextType | undefined>(
  undefined,
);

export function useMetadata() {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error("useMetadata must be used within a MetadataProvider");
  }
  return context;
}

type MetadataProviderProps = {
  children: ReactNode;
  initialTeamId?: string;
};

export function MetadataProvider({
  children,
  initialTeamId,
}: MetadataProviderProps) {
  const [lastTeamId, setLastTeamId] = useLocalStorage(
    STORAGE_KEYS.LAST_TEAM_ID,
    initialTeamId,
  );

  return (
    <MetadataContext.Provider value={{ lastTeamId, setLastTeamId }}>
      {children}
    </MetadataContext.Provider>
  );
}
