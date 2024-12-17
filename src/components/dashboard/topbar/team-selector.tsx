"use client";

import { useTeams } from "@/components/providers/teams-provider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function TeamSelector() {
  const { data } = useTeams();
  const [selectedTeam, setSelectedTeam] = useState(data?.defaultTeamId);

  if (!data) return null;

  const defaultTeam = data.teams.find((team) => team.id === data.defaultTeamId);

  const teams = data.teams.filter((team) => team.id !== defaultTeam?.id);

  return (
    <Select value={selectedTeam} onValueChange={setSelectedTeam}>
      <SelectTrigger className="border-none p-0 w-auto">
        <SelectValue placeholder="Select organization" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Personal</SelectLabel>
          {defaultTeam && (
            <SelectItem key={defaultTeam.id} value={defaultTeam.id}>
              {defaultTeam.name}
            </SelectItem>
          )}
        </SelectGroup>
        <SelectGroup className="mt-2">
          <SelectLabel>Organizations</SelectLabel>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
