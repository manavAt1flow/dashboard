import { QUERY_KEYS } from "@/configs/query-keys";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useUser = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: QUERY_KEYS.USER(),
    queryFn: async () => {
      return (await supabase.auth.getUser()).data.user;
    },
  });

  return {
    ...query,
    user: query.data,
    setUser: (updater: (old: User | null) => User | null) => {
      queryClient.setQueryData(QUERY_KEYS.USER(), updater);
    },
  };
};
