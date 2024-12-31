import { getUserTeamsAction } from "@/actions/team-actions";
import { QUERY_KEYS } from "@/configs/query-keys";
import { useQuery } from "@tanstack/react-query";

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
