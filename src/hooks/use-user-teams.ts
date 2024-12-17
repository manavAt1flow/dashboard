import { getUserTeams } from "@/actions/team-actions";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./use-user";

// NOTE: Not in use at the moment in favor of @/components/providers/teams-provider.tsx

export const useUserTeams = () => {
  const { data: userData } = useUser();

  return useQuery({
    queryKey: ["user-teams", userData?.user.id],
    enabled: !!userData,
    queryFn: async () => {
      const response = await getUserTeams();

      if (response.type === "error") {
        console.error("use-user-teams:", response.data.message);
        throw new Error(response.data.message);
      }

      return response.data;
    },
  });
};
