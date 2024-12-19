"use client";

import { createContext, useContext, useState } from "react";
import { Database } from "@/types/supabase";
import React from "react";

type Team = Database["public"]["Tables"]["teams"]["Row"];

export interface TeamsData {
  teams: Team[];
  defaultTeamId: string;
}

interface TeamsContextType {
  data: TeamsData | null;
  setData: React.Dispatch<React.SetStateAction<TeamsData | null>>;
}

const TeamsContext = createContext<TeamsContextType>({
  data: null,
  setData: () => {},
});

interface TeamsProviderProps {
  children: React.ReactNode;
  initialTeamsData?: TeamsData | null;
}

export function TeamsProvider({
  children,
  initialTeamsData,
}: TeamsProviderProps) {
  const [teamsData, setTeamsData] = useState<TeamsData | null>(
    initialTeamsData || null,
  );

  return (
    <TeamsContext.Provider value={{ data: teamsData, setData: setTeamsData }}>
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
