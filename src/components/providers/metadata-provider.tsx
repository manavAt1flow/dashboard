"use client";

import { useTeams } from "@/hooks/use-teams";
import { useParams } from "next/navigation";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useLayoutEffect,
} from "react";
import { useLocalStorage } from "usehooks-ts";

type MetadataContextType = {
  selectedTeamId: string | undefined;
  setSelectedTeamId: (teamId?: string) => void;
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
  const { teams } = useTeams();

  const [selectedTeamId, setSelectedTeamId] = useLocalStorage(
    "selectedTeamId",
    initialTeamId,
  );

  const params = useParams();

  const selectTeamId = async (teamId?: string) => {
    if (teamId && !teams.find((team) => team.id === teamId)) {
      return;
    }

    setSelectedTeamId(teamId);
  };

  useLayoutEffect(() => {
    if (!params.teamId || !teams.find((team) => team.id === params.teamId))
      return;

    selectTeamId(params.teamId as string);
  }, [params, teams]);

  return (
    <MetadataContext.Provider
      value={{ selectedTeamId, setSelectedTeamId: selectTeamId }}
    >
      {children}
    </MetadataContext.Provider>
  );
}
