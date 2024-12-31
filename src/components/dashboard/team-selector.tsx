"use client";

import { useMetadata } from "@/components/providers/metadata-provider";
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
import { PROTECTED_URLS } from "@/configs/urls";
import { useTeams } from "@/hooks/use-teams";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Loader } from "../ui/loader";

export default function TeamSelector() {
  const { teams: loadedTeams, isLoading: teamsLoading } = useTeams();
  const { selectedTeamId } = useMetadata();
  const router = useRouter();

  const defaultTeam = useMemo(
    () => loadedTeams.find((team) => team.is_default),
    [loadedTeams],
  );

  const teams = useMemo(
    () => loadedTeams.filter((team) => team.id !== defaultTeam?.id) ?? [],
    [loadedTeams, defaultTeam],
  );

  return (
    <div>
      <span className="font-mono text-xs text-fg-500">
        <span className="text-fg-300">{">>"}</span> selected team
      </span>
      {teamsLoading ? (
        <div className="flex h-8 items-center">
          <Loader interval={80} variant="progress" />
        </div>
      ) : (
        <Select
          value={selectedTeamId}
          onValueChange={(value) =>
            router.push(PROTECTED_URLS.SANDBOXES(value))
          }
        >
          <SelectTrigger className="h-8 w-auto border-none bg-transparent p-0 normal-case">
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
            <Button variant="muted" size="sm" className="mt-4 w-full">
              <Plus className="h-4 w-4" />
              Create
            </Button>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
