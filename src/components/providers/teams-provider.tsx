"use client";

import { createContext, useContext, useState } from "react";
import { Database } from "@/types/supabase";

type Team = Database["public"]["Tables"]["teams"]["Row"];

export interface TeamsData {
  teams: Team[];
  defaultTeamId: string;
}

interface TeamsContextType {
  data: TeamsData | null;
  setTeams: (teams: TeamsData | null) => void;
}

const TeamsContext = createContext<TeamsContextType>({
  data: null,
  setTeams: () => {},
});

interface TeamsProviderProps {
  children: React.ReactNode;
  initialTeamsData?: TeamsData | null;
}

export function TeamsProvider({
  children,
  initialTeamsData,
}: TeamsProviderProps) {
  const [teams, setTeams] = useState<TeamsData | null>(
    initialTeamsData || null
  );

  return (
    <TeamsContext.Provider value={{ data: teams, setTeams }}>
      {children}
    </TeamsContext.Provider>
  );
}

export const useTeams = () => {
  const context = useContext(TeamsContext);
  if (context === undefined) {
    throw new Error("useTeams must be used within a TeamsProvider");
  }
  return context;
};
