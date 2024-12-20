"use client";

import { useParams } from "next/navigation";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";

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

/*
 * This provider serves misc. metadata that is used throughout the app.
 * lastTeamId is used to recover to the last team the user was one, if its not reflected in the url anymore.
 */
export function MetadataProvider({
  children,
  initialTeamId,
}: MetadataProviderProps) {
  const params = useParams();

  const [lastTeamId, setLastTeamId] = useState(initialTeamId);

  useEffect(() => {
    if (params.teamId) {
      setLastTeamId(params.teamId as string);
    }
  }, [params.teamId]);

  return (
    <MetadataContext.Provider value={{ lastTeamId, setLastTeamId }}>
      {children}
    </MetadataContext.Provider>
  );
}
