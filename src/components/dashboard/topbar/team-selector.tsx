"use client";

import { useTeams } from "@/components/providers/teams-provider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
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
      <SelectContent className="min-w-[16rem]">
        {defaultTeam && (
          <SelectGroup>
            <SelectLabel>Personal</SelectLabel>
            <SelectItem key={defaultTeam.id} value={defaultTeam.id}>
              {defaultTeam.name}
            </SelectItem>
          </SelectGroup>
        )}
        {teams.length > 0 && (
          <SelectGroup className="mt-2">
            <SelectLabel>Organizations</SelectLabel>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        <Button size="sm" className="w-full mt-4">
          <Plus className="w-4 h-4" />
          New Organization
        </Button>
      </SelectContent>
    </Select>
  );
}
