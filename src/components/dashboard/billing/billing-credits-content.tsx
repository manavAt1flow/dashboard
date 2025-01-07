"use client";

import { getUsageAction } from "@/actions/usage-actions";
import { QUERY_KEYS } from "@/configs/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function BillingCreditsContent() {
  const { teamId } = useParams();

  const { data: usageData, isLoading } = useQuery({
    queryKey: QUERY_KEYS.TEAM_USAGE(teamId as string),
    queryFn: async () => {
      const res = await getUsageAction({ teamId: teamId as string });

      if (res.type === "error") {
        throw new Error(res.message);
      }

      return res.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return <div>{usageData?.credits}</div>;
}
