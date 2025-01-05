import { getUserTeamsAction } from "@/actions/team-actions";
import { useMetadata } from "@/components/providers/metadata-provider";
import { QUERY_KEYS } from "@/configs/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useTeams = () => {
  const query = useQuery({
    queryKey: QUERY_KEYS.TEAMS(),
    queryFn: async () => {
      const response = await getUserTeamsAction();

      if (response.type === "error") {
        throw new Error(response.message);
      }

      return response.data;
    },
  });

  return {
    ...query,
    teams: query.data ?? [],
  };
};

export const useSelectedTeam = () => {
  const { teams } = useTeams();
  const { selectedTeamId } = useMetadata();

  const team = useMemo(
    () => teams?.find((team) => team.id === selectedTeamId),
    [teams, selectedTeamId],
  );

  return team;
};
