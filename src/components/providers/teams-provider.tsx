"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Database } from "@/types/supabase";
import React from "react";
import { TeamWithDefault } from "@/types/dashboard";

interface TeamsContextType {
  teams: TeamWithDefault[] | null;
  setTeams: React.Dispatch<React.SetStateAction<TeamWithDefault[] | null>>;
}

const TeamsContext = createContext<TeamsContextType>({
  teams: null,
  setTeams: () => {},
});

interface TeamsProviderProps {
  children: React.ReactNode;
  initialTeams?: TeamWithDefault[] | null;
}

export function TeamsProvider({ children, initialTeams }: TeamsProviderProps) {
  const [teams, setTeams] = useState<TeamWithDefault[] | null>(
    initialTeams || null,
  );

  useEffect(() => {
    setTeams(initialTeams || null);
  }, [initialTeams]);

  return (
    <TeamsContext.Provider value={{ teams, setTeams }}>
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
