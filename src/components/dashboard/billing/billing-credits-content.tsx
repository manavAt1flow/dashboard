"use client";

import { getUsageAction } from "@/actions/usage-actions";
import { QUERY_KEYS } from "@/configs/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function BillingCreditsContent() {
  const { teamId } = useParams();

  const { data: usageData, isLoading } = useQuery({
    queryKey: QUERY_KEYS.TEAM_USAGE(teamId as string),
    queryFn: () => getUsageAction({ teamId: teamId as string }),
  });

  if (isLoading) return <div>Loading...</div>;

  return <div>{usageData?.credits}</div>;
}
