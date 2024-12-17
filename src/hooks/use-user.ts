import { getUser } from "@/actions/user-actions";
import { QUERY_KEYS } from "@/configs/query-keys";
import { Database } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

// NOTE: Not in use at the moment in favor of @/components/providers/user-provider.tsx

interface UseUserResponse {
  user: User;
  accessToken: Database["public"]["Tables"]["access_tokens"]["Row"] | null;
}

export const useUser = () => {
  return useQuery<UseUserResponse | null>({
    queryKey: QUERY_KEYS.USER(),
    queryFn: async () => {
      const response = await getUser();

      if (response.type === "error") {
        console.error("use-user:", response.data.message);
        return null;
      }

      return response.data;
    },
  });
};
